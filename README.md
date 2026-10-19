# @lifetrenz/page-flow

Client for the Page-Flow scan and print agent. The agent runs on each workstation and serves a
local API on `127.0.0.1`. This package has two layers:

- **SDK** (`PageFlowClient`, models, errors, settings helpers). It has no framework dependency and
  can be used from any TypeScript project.
- **Angular binding** (`PageFlowService`, `PageFlowSettingsStore`, `ScanUtilityService`,
  `ScanDocument`). Angular screens inject these.

The agent's HTTP contract is in the Page-Flow repository at `docs/api/page-flow-api.md`.

## Install

```bash
npm install @lifetrenz/page-flow
```

Angular 17 or later is a peer dependency. Inside WAPP, the package is also available from source
through the `@lifetrenz/page-flow` path alias in `tsconfig.json`, so no install step is needed.

## Set up the app

The agent needs a port and a pairing token. Users enter both on the Agent Settings screen. The
token is shown in the agent's admin console. Settings are stored in the browser's localStorage under
`PAGE_FLOW_AGENT_SETTINGS`. Nothing is sent anywhere except to `http://127.0.0.1:<port>`.

The Angular services are `providedIn: 'root'`, so there is no module to import:

```ts
import { inject } from '@angular/core';
import { ScanUtilityService, PageFlowService, PageFlowSettingsStore } from '@lifetrenz/page-flow';
```

Outside Angular, use the SDK on its own:

```ts
import { PageFlowClient, parsePageFlowSettings } from '@lifetrenz/page-flow';

const client = new PageFlowClient({
    settings: () => parsePageFlowSettings(localStorage.getItem('PAGE_FLOW_AGENT_SETTINGS')),
});
const devices = await client.scanners();
```

## Scan from a component

### Load the scanners

```ts
import { Component, OnInit, inject } from '@angular/core';
import { PageFlowDevice, PageFlowError, ScanUtilityService } from '@lifetrenz/page-flow';

@Component({ /* selector, template */ })
export class PatientDocumentsComponent implements OnInit {
    private readonly scanUtility = inject(ScanUtilityService);

    scanners: PageFlowDevice[] = [];
    selectedScannerId: string | null = null;
    isLoadingScanners = false;
    scannerError: string | null = null;

    async ngOnInit(): Promise<void> {
        this.isLoadingScanners = true;
        try {
            this.scanners = (await this.scanUtility.scanners()).filter((s) => s.available);
            this.selectedScannerId = this.scanners[0]?.id ?? null;
        } catch (error) {
            this.scannerError = error instanceof PageFlowError ? error.message : 'Scanning is not available right now.';
        } finally {
            this.isLoadingScanners = false;
        }
    }
}
```

```html
<p-dropdown
    [options]="scanners"
    optionLabel="name"
    optionValue="id"
    [(ngModel)]="selectedScannerId"
    placeholder="Choose a scanner"
    [disabled]="isLoadingScanners || !scanners.length"
></p-dropdown>
<p class="text-red-600" *ngIf="scannerError">{{ scannerError }}</p>
```

If the list is empty, say so and link to Agent Settings. The usual causes are a missing pairing
token or an agent that is not running.

### Scan one page

`scanPage` returns the page as a `Blob`. Its `contentType` is `image/jpeg` or `application/pdf`.

```ts
async scanOnePage(): Promise<void> {
    if (!this.selectedScannerId) {
        return;
    }
    this.isScanning = true;
    try {
        const { blob, contentType } = await this.scanUtility.scanPage(this.selectedScannerId, {
            preset: 'document',
            dpi: 300,
            format: 'jpeg',
        });
        this.attachFile(blob, contentType);
    } catch (error) {
        this.showError(error);
    } finally {
        this.isScanning = false;
    }
}
```

The agent refuses a second scan of the same scanner while one is running (`scanner_busy`).
Show its message and let the user try again.

### Scan a multi-page document

Keep the `ScanDocument` in a field, add one page per click, and finish when the user is done.

```ts
import { ScanDocument } from '@lifetrenz/page-flow';

pageCount = 0;
private document: ScanDocument | null = null;

async startDocument(): Promise<void> {
    if (!this.selectedScannerId) {
        return;
    }
    try {
        this.document = await this.scanUtility.startDocument(this.selectedScannerId, { format: 'jpeg' });
        this.pageCount = 0;
    } catch (error) {
        this.showError(error);
    }
}

async addPage(): Promise<void> {
    if (!this.document) {
        return;
    }
    this.isScanning = true;
    try {
        this.pageCount = await this.document.addPage();
    } catch (error) {
        this.showError(error); // the document stays open: add another page, or cancel
    } finally {
        this.isScanning = false;
    }
}

async finishDocument(): Promise<void> {
    if (!this.document || this.pageCount === 0) {
        return;
    }
    try {
        const pdf = await this.document.finish();
        this.attachFile(pdf, 'application/pdf');
        this.document = null;
    } catch (error) {
        this.showError(error); // still open: finish again, or cancel
    }
}

async cancelDocument(): Promise<void> {
    if (!this.document) {
        return;
    }
    try {
        await this.document.cancel();
    } catch {
        // The agent may already have dropped the session.
    } finally {
        this.document = null;
        this.pageCount = 0;
    }
}

ngOnDestroy(): void {
    if (this.document) {
        void this.document.cancel().catch(() => undefined);
    }
}
```

A session stays open on the agent. If the user is idle for more than 10 minutes, the session
expires, and the next call returns `session_not_found`. Treat that as "start the document again".

## Print

Scanning and printing are separate calls. Printing uses the client through `PageFlowService`:

```ts
import { PageFlowError, PageFlowService } from '@lifetrenz/page-flow';

private readonly pageFlow = inject(PageFlowService);

async print(pdf: Blob, printerId: string): Promise<void> {
    try {
        await this.pageFlow.client.print(pdf, { printer_id: printerId, paper: 'a4', quality: 'normal' });
    } catch (error) {
        if (error instanceof PageFlowError && error.printMayHaveHappened) {
            // The printer may already have the job. Ask the user to check the queue. No reprint button.
            return;
        }
        this.showError(error);
    }
}
```

## Errors

Every failure is a `PageFlowError`. Show `error.message`, which is written for people. Branch on
`error.code` only when a screen needs different behaviour.

| `code` | What the user should do |
|---|---|
| `not_paired` | Open Agent Settings and enter the pairing token. |
| `agent_unreachable` | Start the Page-Flow agent on this computer, then retry. |
| `agent_timeout` | The agent did not reply in 240 seconds. Retry. |
| `device_unavailable` | Check the scanner is switched on, then retry. |
| `scanner_busy` | Wait for the current scan to finish. |
| `session_not_found` | The document expired. Start it again. |
| `too_many_pages` | The document is full (50 pages). Finish it or start another. |
| `print_outcome_unknown` | Check the printer queue before printing again. |

## Rules the package keeps

- Nothing is retried. A failed scan or print is returned to the caller.
- A print whose outcome is unknown is reported as `print_outcome_unknown`. Never retry it
  automatically.
- The token is sent only to `127.0.0.1` at the saved port. Redirects are refused.
- Every call takes an optional `AbortSignal`. A caller's abort rejects with the browser's
  `AbortError`.
- Each request times out after 240 seconds.

## Develop

The SDK's source of truth is the Page-Flow repository, in its `sdk/src` folder. Change the SDK
there, then copy it into this library:

```bash
cd projects/page-flow
npm run sync:sdk     # copy the SDK source into src/sdk
npm run check:sdk    # fail if src/sdk differs from the source (use this in CI)
cd ../..
ng build page-flow   # builds dist/page-flow with ng-packagr
ng test page-flow    # Karma tests for the Angular services
```

Do not edit `src/sdk` directly: the next sync overwrites it. The SDK's own tests run in the
Page-Flow repository (`npm test` in its `sdk/` folder, on node:test).
