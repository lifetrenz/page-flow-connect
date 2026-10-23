import * as i0 from '@angular/core';
import { Injectable, InjectionToken, inject } from '@angular/core';

// Synced from the Page-Flow repository (sdk/src). Edit it there, then run npm run sync:sdk.
/**
 * A failed call to the Page-Flow agent. Branch on `code`; `message` is for people and may change.
 *
 * `code` is either an agent code (see the error table in docs/api/page-flow-api.md) or one of the
 * client codes below, which the SDK raises before or instead of an agent reply:
 * - `not_paired`: no pairing token is saved.
 * - `agent_unreachable`: the request never got a reply (agent not running, or port blocked).
 * - `agent_timeout`: the agent did not reply within the client's timeout.
 * - `invalid_response`: the agent replied, but not in a form the API describes.
 * - `print_outcome_unknown`: a print was sent but its outcome is not known. Check the printer
 *   queue before printing again.
 */
class PageFlowError extends Error {
    constructor(code, message, retryable, status, cause) {
        super(message);
        this.code = code;
        this.retryable = retryable;
        this.status = status;
        this.cause = cause;
        this.name = 'PageFlowError';
    }
    /** True when the printer may already have printed the page. */
    get printMayHaveHappened() {
        return this.code === 'print_outcome_unknown';
    }
}

const PAGE_FLOW_DEFAULT_PORT = 52180;
const PAGE_FLOW_DEFAULT_HTTPS_PORT = 52181;
/** The agent listens on loopback only, so the host is fixed. */
const PAGE_FLOW_HOST = '127.0.0.1';
const DEFAULT_PAGE_FLOW_SETTINGS = {
    port: PAGE_FLOW_DEFAULT_PORT,
    httpsPort: PAGE_FLOW_DEFAULT_HTTPS_PORT,
    useHttps: true,
    pairingToken: '',
};
function isValidPageFlowPort(value) {
    return Number.isInteger(value) && value >= 1 && value <= 65535;
}
function pageFlowBaseUrl(port) {
    return `http://${PAGE_FLOW_HOST}:${port}`;
}
function pageFlowHttpsBaseUrl(port) {
    return `https://${PAGE_FLOW_HOST}:${port}`;
}
/** The base URL the client calls: HTTPS when chosen, otherwise plain HTTP. */
function pageFlowConnectionUrl(settings) {
    return settings.useHttps ? pageFlowHttpsBaseUrl(settings.httpsPort) : pageFlowBaseUrl(settings.port);
}
/**
 * Reads settings saved as JSON. A missing, unreadable or invalid value falls back to the defaults,
 * so the client always has usable ports. The caller decides where the text comes from.
 */
function parsePageFlowSettings(raw) {
    if (!raw) {
        return { ...DEFAULT_PAGE_FLOW_SETTINGS };
    }
    let parsed;
    try {
        parsed = JSON.parse(raw);
    }
    catch {
        return { ...DEFAULT_PAGE_FLOW_SETTINGS };
    }
    const port = isValidPageFlowPort(parsed?.port) ? parsed?.port : DEFAULT_PAGE_FLOW_SETTINGS.port;
    const savedHttpsPort = isValidPageFlowPort(parsed?.httpsPort) ? parsed?.httpsPort : undefined;
    // The two ports must differ. A saved HTTPS port that matches the HTTP port falls back to a default that does not.
    const fallbackHttps = port === DEFAULT_PAGE_FLOW_SETTINGS.httpsPort ? DEFAULT_PAGE_FLOW_SETTINGS.port : DEFAULT_PAGE_FLOW_SETTINGS.httpsPort;
    const httpsPort = savedHttpsPort !== undefined && savedHttpsPort !== port ? savedHttpsPort : fallbackHttps;
    const useHttps = typeof parsed?.useHttps === 'boolean' ? parsed.useHttps : DEFAULT_PAGE_FLOW_SETTINGS.useHttps;
    const pairingToken = parsed?.pairingToken;
    return {
        port,
        httpsPort,
        useHttps,
        pairingToken: typeof pairingToken === 'string' ? pairingToken : '',
    };
}
/** Turns settings into the JSON text to store. Throws a RangeError for ports that are invalid or equal. */
function serializePageFlowSettings(settings) {
    if (!isValidPageFlowPort(settings.port) || !isValidPageFlowPort(settings.httpsPort)) {
        throw new RangeError('The ports must be whole numbers from 1 to 65535.');
    }
    if (settings.port === settings.httpsPort) {
        throw new RangeError('The HTTP and HTTPS ports must be different.');
    }
    return JSON.stringify({
        port: settings.port,
        httpsPort: settings.httpsPort,
        useHttps: settings.useHttps === true,
        pairingToken: settings.pairingToken.trim(),
    });
}

// Synced from the Page-Flow repository (sdk/src). Edit it there, then run npm run sync:sdk.
const DEFAULT_REQUEST_TIMEOUT_MS = 240_000;
const JSON_TYPE = 'application/json';
const PDF_TYPE = 'application/pdf';
const SCAN_TYPES = ['image/jpeg', 'application/pdf'];
/**
 * Calls the Page-Flow agent on this computer. Every call is a `/v1` route, sent with the pairing
 * token from the settings. Nothing is retried: a failed scan or print is reported to the caller,
 * which decides what happens next.
 */
class PageFlowClient {
    constructor(options) {
        this.settings = options.settings;
        this.fetcher = options.fetch ?? ((url, init) => fetch(url, init));
        this.timeoutMs = options.timeoutMs ?? DEFAULT_REQUEST_TIMEOUT_MS;
    }
    health(signal) {
        return this.getJson('/v1/health', signal);
    }
    async scanners(signal) {
        return devicesFrom(await this.getJson('/v1/scanners', signal));
    }
    async printers(signal) {
        return devicesFrom(await this.getJson('/v1/printers', signal));
    }
    refresh(signal) {
        return this.postJson('/v1/refresh', undefined, signal);
    }
    /** One scan of one page. The reply is the page itself, JPEG or PDF. */
    async scan(options, signal) {
        const response = await this.send('POST', '/v1/scan', { json: options, signal });
        return this.scanResult(response);
    }
    async startScanSession(signal) {
        const reply = await this.postJson('/v1/scan/sessions', undefined, signal);
        if (typeof reply?.session_id !== 'string') {
            throw invalidResponse(200);
        }
        return reply.session_id;
    }
    /** Scans one page into an open session. Resolves to the number of pages now in the session. */
    async addScanPage(sessionId, options, signal) {
        const reply = await this.postJson(sessionPath(sessionId, 'pages'), options, signal);
        if (typeof reply?.pages !== 'number') {
            throw invalidResponse(200);
        }
        return reply.pages;
    }
    /** Builds one PDF from the session's pages. The session stays open if this fails. */
    async finishScanSession(sessionId, signal) {
        const response = await this.send('POST', sessionPath(sessionId, 'finish'), { signal });
        if (mediaType(response.headers.get('Content-Type')) !== PDF_TYPE) {
            throw invalidResponse(response.status);
        }
        return response.blob();
    }
    async cancelScanSession(sessionId, signal) {
        await this.send('POST', sessionPath(sessionId, 'cancel'), { signal });
    }
    /**
     * Sends a PDF to a printer. Once the request is sent, any failure other than a refusal the
     * agent gave in a well-formed reply is reported as `print_outcome_unknown`: the printer may
     * already have the job, so the caller must check the queue rather than print again.
     */
    async print(document, options, signal) {
        try {
            const response = await this.send('POST', `/v1/print?${printQuery(options)}`, {
                body: document,
                contentType: PDF_TYPE,
                signal,
            });
            return await this.readJson(response);
        }
        catch (error) {
            throw printFailure(error);
        }
    }
    printJob(jobId, printerId, signal) {
        return this.getJson(jobPath(jobId, printerId), signal);
    }
    cancelPrintJob(jobId, printerId, signal) {
        return this.postJson(`${jobPath(jobId, printerId)}/cancel`, undefined, signal);
    }
    async getJson(path, signal) {
        return this.readJson(await this.send('GET', path, { signal }));
    }
    async postJson(path, json, signal) {
        return this.readJson(await this.send('POST', path, { json, signal }));
    }
    async send(method, path, options) {
        const { baseUrl, token } = this.connection();
        const headers = new Headers({ Authorization: `Bearer ${token}` });
        const body = options.json !== undefined ? JSON.stringify(options.json) : options.body;
        if (options.json !== undefined) {
            headers.set('Content-Type', JSON_TYPE);
        }
        if (options.contentType) {
            headers.set('Content-Type', options.contentType);
        }
        const response = await this.dispatch(`${baseUrl}${path}`, 
        // Redirects are refused, so the pairing token is never sent to another address.
        { method, headers, body, redirect: 'error' }, options.signal);
        if (!response.ok) {
            throw await failureFrom(response);
        }
        return response;
    }
    /**
     * Sends one request with a timeout. A caller's abort passes through as the caller's own error.
     * A timeout or a failed connection is reported as a Page-Flow error with status 0.
     */
    async dispatch(url, init, signal) {
        const controller = new AbortController();
        let timedOut = false;
        const timer = setTimeout(() => {
            timedOut = true;
            controller.abort();
        }, this.timeoutMs);
        const forwardAbort = () => controller.abort();
        signal?.addEventListener('abort', forwardAbort);
        try {
            return await this.fetcher(url, { ...init, signal: controller.signal });
        }
        catch (error) {
            if (signal?.aborted) {
                throw error;
            }
            if (timedOut) {
                throw new PageFlowError('agent_timeout', 'The Page-Flow agent took too long to answer.', true, 0, error);
            }
            throw new PageFlowError('agent_unreachable', 'The Page-Flow agent did not answer. Check that it is running on this computer.', true, 0, error);
        }
        finally {
            clearTimeout(timer);
            signal?.removeEventListener('abort', forwardAbort);
        }
    }
    connection() {
        const settings = this.settings();
        const token = settings.pairingToken.trim();
        if (!token) {
            throw new PageFlowError('not_paired', 'Add the Page-Flow pairing token in the settings.', false, 0);
        }
        return { baseUrl: pageFlowConnectionUrl(settings), token };
    }
    async readJson(response) {
        try {
            return (await response.json());
        }
        catch {
            throw invalidResponse(response.status);
        }
    }
    async scanResult(response) {
        const contentType = mediaType(response.headers.get('Content-Type'));
        if (!isScanContentType(contentType)) {
            throw invalidResponse(response.status);
        }
        return { blob: await response.blob(), contentType };
    }
}
function sessionPath(sessionId, action) {
    return `/v1/scan/sessions/${encodeURIComponent(sessionId)}/${action}`;
}
function jobPath(jobId, printerId) {
    const query = new URLSearchParams({ printer_id: printerId });
    return `/v1/print/${encodeURIComponent(jobId)}?${query.toString()}`;
}
function printQuery(options) {
    const query = new URLSearchParams({ printer_id: options.printer_id });
    const optional = {
        copies: options.copies,
        colour: options.colour,
        orientation: options.orientation,
        paper: options.paper,
        quality: options.quality,
    };
    for (const [name, value] of Object.entries(optional)) {
        if (value !== undefined) {
            query.set(name, String(value));
        }
    }
    return query.toString();
}
/**
 * Once the print request has been sent, the printer may have the job whatever the reply looks like.
 * Only the no-token error (raised before anything is sent) and a refusal the agent gave in a
 * well-formed reply are passed on as they are. Everything else is an unknown outcome.
 */
function printFailure(error) {
    if (error instanceof PageFlowError && (error.code === 'not_paired' || isAgentRefusal(error))) {
        return error;
    }
    return new PageFlowError('print_outcome_unknown', 'The Page-Flow agent did not confirm the print. Check the printer queue before printing again.', false, 0, error);
}
function isAgentRefusal(error) {
    return error.status > 0 && error.code !== 'invalid_response';
}
function devicesFrom(list) {
    if (!Array.isArray(list?.devices)) {
        throw invalidResponse(200);
    }
    return list.devices;
}
async function failureFrom(response) {
    const body = (await response.json().catch(() => null));
    if (!body || typeof body.code !== 'string') {
        return invalidResponse(response.status);
    }
    const message = typeof body.message === 'string' ? body.message : 'The agent refused the request.';
    return new PageFlowError(body.code, message, body.retryable === true, response.status);
}
function invalidResponse(status) {
    return new PageFlowError('invalid_response', 'The Page-Flow agent replied in a form the client does not understand.', false, status);
}
function mediaType(header) {
    return (header ?? '').split(';')[0].trim().toLowerCase();
}
function isScanContentType(value) {
    return SCAN_TYPES.includes(value);
}

// Synced from the Page-Flow repository (sdk/src). Edit it there, then run npm run sync:sdk.
/**
 * Shapes of the Page-Flow agent's `/v1` API. Field names match the agent's JSON exactly
 * (snake_case), so replies can be used without mapping.
 * Reference: docs/api/page-flow-api.md in this repository.
 */

// Synced from the Page-Flow repository (sdk/src). Edit it there, then run npm run sync:sdk.

const STORAGE_KEY = 'PAGE_FLOW_AGENT_SETTINGS';
/**
 * Keeps the Page Flow port and pairing token in this browser's localStorage. The SDK does the
 * parsing and validation; this class only reads and writes the stored text.
 */
class PageFlowSettingsStore {
    get() {
        try {
            return parsePageFlowSettings(localStorage.getItem(STORAGE_KEY));
        }
        catch {
            return { ...DEFAULT_PAGE_FLOW_SETTINGS };
        }
    }
    /** Throws a RangeError for a port out of range, or the browser's error if storage refuses. */
    save(settings) {
        localStorage.setItem(STORAGE_KEY, serializePageFlowSettings(settings));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: PageFlowSettingsStore, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: PageFlowSettingsStore, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: PageFlowSettingsStore, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });

/** The transport the SDK sends through. The app uses the browser's fetch; tests replace it. */
const PAGE_FLOW_FETCH = new InjectionToken('PAGE_FLOW_FETCH', {
    providedIn: 'root',
    factory: () => (url, init) => fetch(url, init),
});
/**
 * The one Page Flow client the app uses. Its settings are read on every call, so a port or token
 * saved in Agent Settings applies to the next call without a reload.
 */
class PageFlowService {
    constructor() {
        this.settings = inject(PageFlowSettingsStore);
        this.client = new PageFlowClient({
            settings: () => this.settings.get(),
            fetch: inject(PAGE_FLOW_FETCH),
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: PageFlowService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: PageFlowService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: PageFlowService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });

/**
 * One multi-page document being scanned into an agent session. Pages are added one at a time,
 * then the session is finished into a single PDF. Cancel it to drop the pages.
 */
class ScanDocument {
    constructor(client, sessionId, scannerId, options) {
        this.client = client;
        this.sessionId = sessionId;
        this.scannerId = scannerId;
        this.options = options;
        this.pageCount = 0;
    }
    /** Pages scanned into this document so far. */
    get pages() {
        return this.pageCount;
    }
    /** Scans one more page. Resolves to the number of pages now in the document. */
    async addPage(signal) {
        this.pageCount = await this.client.addScanPage(this.sessionId, { scanner_id: this.scannerId, ...this.options }, signal);
        return this.pageCount;
    }
    /** Builds the PDF. If this fails, the document stays open so a page can be added or it can be cancelled. */
    finish(signal) {
        return this.client.finishScanSession(this.sessionId, signal);
    }
    cancel(signal) {
        return this.client.cancelScanSession(this.sessionId, signal);
    }
}
/**
 * Scanning for WAPP screens: list scanners, scan one page, or scan a multi-page document.
 * Nothing is retried. A failed scan is returned to the caller as a PageFlowError.
 */
class ScanUtilityService {
    constructor() {
        this.pageFlow = inject(PageFlowService);
    }
    scanners(signal) {
        return this.pageFlow.client.scanners(signal);
    }
    scanPage(scannerId, options = {}, signal) {
        return this.pageFlow.client.scan({ scanner_id: scannerId, ...options }, signal);
    }
    /** Opens a multi-page document. Call `addPage` on it for each page, then `finish`. */
    async startDocument(scannerId, options = {}, signal) {
        const client = this.pageFlow.client;
        const sessionId = await client.startScanSession(signal);
        return new ScanDocument(client, sessionId, scannerId, options);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ScanUtilityService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ScanUtilityService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ScanUtilityService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });

/**
 * Where the Page-Flow installer is downloaded from. Empty until the release location is set; the
 * screen then tells the person to ask IT for the installer.
 */
const PAGE_FLOW_DOWNLOAD_URL = new InjectionToken('PAGE_FLOW_DOWNLOAD_URL', {
    providedIn: 'root',
    factory: () => '',
});
/** The link the installer registers. It starts the agent, and does nothing else. */
const PAGE_FLOW_LAUNCH_LINK = 'page-flow://launch';
/** How long to wait for the system to take the link before deciding no program is installed. */
const LAUNCH_WAIT_MS = 1500;
/** How long to wait for a started agent to answer. */
const START_TIMEOUT_MS = 20000;
const START_POLL_MS = 1000;
/**
 * Starts the Page-Flow agent when it is installed but not running. A browser cannot ask whether
 * a program is installed, so this uses the usual check: hand the link to the system, then see
 * whether the page lost focus. If it did not, no program took the link.
 */
class PageFlowLauncherService {
    constructor() {
        this.pageFlow = inject(PageFlowService);
        this.downloadUrl = inject(PAGE_FLOW_DOWNLOAD_URL);
    }
    requestLaunch() {
        return new Promise((resolve) => {
            let settled = false;
            const frame = document.createElement('iframe');
            frame.style.display = 'none';
            const finish = (outcome) => {
                if (settled)
                    return;
                settled = true;
                clearTimeout(timer);
                window.removeEventListener('blur', onAway);
                document.removeEventListener('visibilitychange', onVisibility);
                frame.remove();
                resolve(outcome);
            };
            // Focus moving into the hidden frame also fires blur. Only a program taking focus leaves the page without it.
            const onAway = () => setTimeout(() => {
                if (!document.hasFocus())
                    finish('started');
            }, 200);
            const onVisibility = () => {
                if (document.hidden)
                    finish('started');
            };
            const timer = setTimeout(() => finish('not-installed'), LAUNCH_WAIT_MS);
            window.addEventListener('blur', onAway);
            document.addEventListener('visibilitychange', onVisibility);
            document.body.appendChild(frame);
            frame.src = PAGE_FLOW_LAUNCH_LINK;
        });
    }
    /** Polls the agent until it answers, or gives up after the start timeout. */
    async waitUntilReachable() {
        const deadline = Date.now() + START_TIMEOUT_MS;
        while (Date.now() < deadline) {
            if (await this.agentAnswers())
                return true;
            await new Promise((resolve) => setTimeout(resolve, START_POLL_MS));
        }
        return false;
    }
    async agentAnswers() {
        try {
            await this.pageFlow.client.health();
            return true;
        }
        catch (error) {
            // An unreachable or slow agent is not up yet. Any other answer means it is running.
            const code = error?.code;
            return code !== 'agent_unreachable' && code !== 'agent_timeout';
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: PageFlowLauncherService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: PageFlowLauncherService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: PageFlowLauncherService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });

/*
 * Public API of @lifetrenz/page-flow.
 * The SDK (framework-neutral) and the Angular binding are both exported from here.
 */

/**
 * Generated bundle index. Do not edit.
 */

export { DEFAULT_PAGE_FLOW_SETTINGS, DEFAULT_REQUEST_TIMEOUT_MS, PAGE_FLOW_DEFAULT_HTTPS_PORT, PAGE_FLOW_DEFAULT_PORT, PAGE_FLOW_DOWNLOAD_URL, PAGE_FLOW_FETCH, PAGE_FLOW_HOST, PAGE_FLOW_LAUNCH_LINK, PageFlowClient, PageFlowError, PageFlowLauncherService, PageFlowService, PageFlowSettingsStore, ScanDocument, ScanUtilityService, isValidPageFlowPort, pageFlowBaseUrl, pageFlowConnectionUrl, pageFlowHttpsBaseUrl, parsePageFlowSettings, serializePageFlowSettings };
//# sourceMappingURL=lifetrenz-page-flow.mjs.map
