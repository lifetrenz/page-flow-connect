import * as i0 from '@angular/core';
import { Injectable, InjectionToken, inject, EventEmitter, Output, Input, Component } from '@angular/core';
import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import * as i2 from '@angular/forms';
import { FormsModule } from '@angular/forms';
import * as i3 from 'primeng/button';
import { ButtonModule } from 'primeng/button';
import * as i5 from 'primeng/dialog';
import { DialogModule } from 'primeng/dialog';
import * as i6 from 'primeng/dropdown';
import { DropdownModule } from 'primeng/dropdown';
import * as i7 from 'primeng/radiobutton';
import { RadioButtonModule } from 'primeng/radiobutton';
import * as i4 from 'primeng/api';
import { SharedModule } from 'primeng/api';

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
    const query = new URLSearchParams();
    const optional = {
        printer_id: options.printer_id,
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

/**
 * Shapes of the Page-Flow agent's `/v1` API. Field names match the agent's JSON exactly
 * (snake_case), so replies can be used without mapping.
 * Reference: docs/api/page-flow-api.md in this repository.
 */

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
 * An override for the Windows installer link. Empty means the default GitHub release link, which
 * is used for Windows only; other systems get a "not yet available" message.
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

const FILE_HEADER_BYTES = 14;
const INFO_HEADER_BYTES = 40;
const PIXEL_OFFSET = FILE_HEADER_BYTES + INFO_HEADER_BYTES;
const BYTES_PER_PIXEL = 3;
const METRES_PER_INCH = 0.0254;
/** Pixels per metre for a resolution in dots per inch, as the BMP header stores it. */
function pixelsPerMetre(dpi) {
    return Math.round(dpi / METRES_PER_INCH);
}
/**
 * Encodes RGBA pixels as an uncompressed 24-bit BMP. Rows are stored bottom-up and padded to four
 * bytes, as the format requires. The alpha channel is dropped, because a scan is opaque.
 */
function encodeBmp(width, height, rgba, dpi) {
    if (rgba.length !== width * height * 4) {
        throw new Error("pixel data does not match the image size");
    }
    const rowBytes = Math.ceil((width * BYTES_PER_PIXEL) / 4) * 4;
    const pixelBytes = rowBytes * height;
    const out = new Uint8Array(PIXEL_OFFSET + pixelBytes);
    const view = new DataView(out.buffer);
    const metres = pixelsPerMetre(dpi);
    out[0] = 0x42; // "B"
    out[1] = 0x4d; // "M"
    view.setUint32(2, out.length, true);
    view.setUint32(10, PIXEL_OFFSET, true);
    view.setUint32(14, INFO_HEADER_BYTES, true);
    view.setInt32(18, width, true);
    view.setInt32(22, height, true);
    view.setUint16(26, 1, true);
    view.setUint16(28, 8 * BYTES_PER_PIXEL, true);
    view.setUint32(34, pixelBytes, true);
    view.setInt32(38, metres, true);
    view.setInt32(42, metres, true);
    for (let y = 0; y < height; y++) {
        let source = (height - 1 - y) * width * 4;
        let target = PIXEL_OFFSET + y * rowBytes;
        for (let x = 0; x < width; x++) {
            out[target] = rgba[source + 2];
            out[target + 1] = rgba[source + 1];
            out[target + 2] = rgba[source];
            source += 4;
            target += BYTES_PER_PIXEL;
        }
    }
    return out;
}

/** Scans are taken at 300 dpi, as the scan-and-upload ticket (Redmine 47227) requires. */
const SCAN_DPI = 300;
/** A BMP, JPEG or PNG holds one page, so a multi-page scan is always a PDF. */
function effectiveOutput(mode, output) {
    return mode === "multi" ? "pdf" : output;
}
/** The file extension and MIME type of a saved scan. */
function outputFileType(output) {
    switch (output) {
        case "pdf":
            return { extension: "pdf", mimeType: "application/pdf" };
        case "jpeg":
            return { extension: "jpg", mimeType: "image/jpeg" };
        case "png":
            return { extension: "png", mimeType: "image/png" };
        case "bmp":
            return { extension: "bmp", mimeType: "image/bmp" };
    }
}
function jpegPlan(preset, colour, convertTo) {
    return { agentFormat: "jpeg", preset, colour, convertTo, convertToBmp: convertTo === "bmp" };
}
function planScan(mode, colour, output) {
    const preset = colour === "colour" ? "photo" : "document";
    if (mode === "multi") {
        return jpegPlan(preset, colour, "none");
    }
    switch (effectiveOutput(mode, output)) {
        case "pdf":
            return { agentFormat: "pdf", preset, colour, convertTo: "none", convertToBmp: false };
        case "jpeg":
            return jpegPlan(preset, colour, "none");
        case "png":
            return jpegPlan(preset, colour, "png");
        case "bmp":
            return jpegPlan(preset, colour, "bmp");
    }
}

/** Decodes a scanned JPEG in the browser and returns it as a 300 dpi BMP. */
async function jpegToBmp(jpeg) {
    const bitmap = await createImageBitmap(jpeg);
    try {
        const canvas = document.createElement("canvas");
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const context = canvas.getContext("2d");
        if (!context) {
            throw new Error("the browser cannot draw the scan");
        }
        context.drawImage(bitmap, 0, 0);
        const pixels = context.getImageData(0, 0, bitmap.width, bitmap.height);
        const bytes = encodeBmp(bitmap.width, bitmap.height, pixels.data, SCAN_DPI);
        return new Blob([bytes], { type: "image/bmp" });
    }
    finally {
        bitmap.close();
    }
}

/** Decodes a scanned JPEG in the browser and returns it as a PNG of the same pixels. */
async function jpegToPng(jpeg) {
    const bitmap = await createImageBitmap(jpeg);
    try {
        const canvas = document.createElement("canvas");
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const context = canvas.getContext("2d");
        if (!context) {
            throw new Error("the browser cannot draw the scan");
        }
        context.drawImage(bitmap, 0, 0);
        const png = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
        if (!png) {
            throw new Error("the browser cannot encode the scan as PNG");
        }
        return png;
    }
    finally {
        bitmap.close();
    }
}

/** The newest Windows installer, published as a GitHub release asset under a fixed name. */
const PAGE_FLOW_WINDOWS_INSTALLER_URL = 'https://github.com/lifetrenz/page-flow/releases/latest/download/PageFlow-Setup.exe';
/**
 * Which system the person is on. The browser's platform name is preferred. The user agent is the
 * fallback, and phones and tablets are not desktop systems, so they are 'unknown'.
 */
function detectClientOs(platform) {
    const name = platform.userAgentData?.platform ?? '';
    if (name) {
        if (/windows/i.test(name))
            return 'windows';
        if (/macos|mac os/i.test(name))
            return 'macos';
        if (/linux/i.test(name))
            return 'linux';
        return 'unknown';
    }
    const agent = platform.userAgent ?? '';
    if (/iphone|ipad|ipod|android/i.test(agent))
        return 'unknown';
    if (/windows/i.test(agent))
        return 'windows';
    if (/macintosh|mac os x/i.test(agent))
        return 'macos';
    if (/linux/i.test(agent))
        return 'linux';
    return 'unknown';
}
/**
 * The installer link for a system, or null when no installer exists for it. The override (the
 * PAGE_FLOW_DOWNLOAD_URL setting) replaces the default Windows link when it is set.
 */
function installerUrl(os, override) {
    if (os !== 'windows')
        return null;
    return override || PAGE_FLOW_WINDOWS_INSTALLER_URL;
}
/** The name of a system in the "not yet available" text. */
function osLabel(os) {
    switch (os) {
        case 'windows':
            return 'Windows';
        case 'macos':
            return 'macOS';
        case 'linux':
            return 'Linux';
        case 'unknown':
            return 'this computer';
    }
}

const FALLBACK_ERROR = "The scan could not be completed. Check the scanner and try again.";
/**
 * Scan and Upload: pick the scanner and the scan options, scan one page or a document, check the
 * result, then hand the file to the attachment screen. The attachment screen does the upload, so
 * the same checks and the same save apply to a scan and to a file picked by hand.
 */
class ScanAndUploadDialogComponent {
    constructor() {
        this.visible = false;
        this.visibleChange = new EventEmitter();
        /** The finished scan, as a file. The parent uploads it. */
        this.scanned = new EventEmitter();
        this.scanUtility = inject(ScanUtilityService);
        this.sanitizer = inject(DomSanitizer);
        this.launcher = inject(PageFlowLauncherService);
        /** The system the person is on, which decides the installer link. */
        this.os = detectClientOs(typeof navigator === "undefined" ? {} : navigator);
        this.dpi = SCAN_DPI;
        this.scanners = [];
        this.scannerId = null;
        this.mode = "single";
        this.colour = "colour";
        this.output = "pdf";
        this.loadingScanners = false;
        /** The agent did not answer. The screen offers to start it, or to install it. */
        this.agentUnreachable = false;
        this.agentNotInstalled = false;
        this.startingAgent = false;
        this.busy = false;
        this.error = null;
        this.pageCount = 0;
        this.preview = null;
        this.fileSizeMb = null;
        this.openDocument = null;
        this.result = null;
        this.previewUrl = null;
    }
    ngOnChanges(changes) {
        if (changes["visible"]?.currentValue === true) {
            void this.loadScanners();
        }
    }
    get bmpAllowed() {
        return this.mode === "single";
    }
    get canUpload() {
        return this.result !== null && !this.busy;
    }
    setMode(mode) {
        if (this.openDocument) {
            return; // Finish or cancel the document before changing its type.
        }
        this.mode = mode;
        if (mode === "multi") {
            this.output = "pdf";
        }
    }
    /** The installer link for this system, or null when there is none. */
    get installerHref() {
        return installerUrl(this.os, this.launcher.downloadUrl);
    }
    get canDownload() {
        return this.installerHref !== null;
    }
    get osName() {
        return osLabel(this.os);
    }
    async loadScanners() {
        this.loadingScanners = true;
        this.error = null;
        this.agentNotInstalled = false;
        try {
            this.scanners = (await this.scanUtility.scanners()).filter((s) => s.available);
            this.scannerId = this.scanners[0]?.id ?? null;
            this.agentUnreachable = false;
        }
        catch (error) {
            this.agentUnreachable = error instanceof PageFlowError && error.code === "agent_unreachable";
            this.error = this.messageOf(error);
        }
        finally {
            this.loadingScanners = false;
        }
    }
    /**
     * Starts the agent if it is installed but not running. If no program takes the link, the agent
     * is not installed, and the screen offers the installer instead.
     */
    async startAgent() {
        this.startingAgent = true;
        this.error = null;
        try {
            const outcome = await this.launcher.requestLaunch();
            if (outcome === "not-installed") {
                this.agentNotInstalled = true;
                return;
            }
            if (await this.launcher.waitUntilReachable()) {
                await this.loadScanners();
            }
            else {
                this.error =
                    "Page-Flow was opened but did not respond. Start it from the Start menu, then try again.";
            }
        }
        finally {
            this.startingAgent = false;
        }
    }
    /** Single page: scans now. Multi-page: adds a page to the open document. */
    async scan() {
        if (!this.scannerId || this.busy) {
            return;
        }
        this.busy = true;
        this.error = null;
        try {
            if (this.mode === "single") {
                await this.scanSinglePage();
            }
            else {
                await this.addDocumentPage();
            }
        }
        catch (error) {
            this.error = this.messageOf(error);
        }
        finally {
            this.busy = false;
        }
    }
    /** Multi-page: builds the PDF from the pages scanned so far. */
    async finishDocument() {
        if (!this.openDocument || this.busy) {
            return;
        }
        this.busy = true;
        this.error = null;
        try {
            const pdf = await this.openDocument.finish();
            this.openDocument = null;
            this.showResult(new File([pdf], this.fileName("pdf"), { type: "application/pdf" }), true);
        }
        catch (error) {
            this.error = this.messageOf(error);
        }
        finally {
            this.busy = false;
        }
    }
    /** Drops the pages scanned so far, and the open document on the agent. */
    async cancelDocument() {
        const open = this.openDocument;
        this.resetResult();
        if (open) {
            await open.cancel().catch(() => undefined);
        }
    }
    upload() {
        if (!this.result || this.busy) {
            return;
        }
        this.scanned.emit(this.result);
        this.close();
    }
    async close() {
        const open = this.openDocument;
        this.resetResult();
        if (open) {
            await open.cancel().catch(() => undefined);
        }
        this.visible = false;
        this.visibleChange.emit(false);
    }
    async scanSinglePage() {
        const plan = planScan(this.mode, this.colour, this.output);
        const page = await this.scanUtility.scanPage(this.scannerId, {
            preset: plan.preset,
            colour: plan.colour,
            dpi: SCAN_DPI,
            format: plan.agentFormat,
        });
        const blob = await this.convertedPage(plan.convertTo, page.blob);
        const { extension, mimeType } = outputFileType(this.output);
        // A BMP cannot be shown in the browser, so its preview is the JPEG the agent sent.
        const previewBlob = this.output === "bmp" ? page.blob : undefined;
        this.showResult(new File([blob], this.fileName(extension), { type: mimeType }), this.output === "pdf", previewBlob);
    }
    async convertedPage(convertTo, pageBlob) {
        if (convertTo === "bmp") {
            return jpegToBmp(pageBlob);
        }
        if (convertTo === "png") {
            return jpegToPng(pageBlob);
        }
        return pageBlob;
    }
    async addDocumentPage() {
        if (!this.openDocument) {
            const plan = planScan("multi", this.colour, this.output);
            this.openDocument = await this.scanUtility.startDocument(this.scannerId, {
                preset: plan.preset,
                colour: plan.colour,
                dpi: SCAN_DPI,
                format: plan.agentFormat,
            });
        }
        this.pageCount = await this.openDocument.addPage();
    }
    /** Shows the scan and keeps it for upload. A PDF is previewed in a frame, a JPEG as an image. */
    showResult(file, isPdf, previewBlob) {
        this.revokePreview();
        const source = previewBlob ?? file;
        this.previewUrl = URL.createObjectURL(source);
        this.preview = {
            url: this.sanitizer.bypassSecurityTrustResourceUrl(this.previewUrl),
            isPdf,
        };
        this.result = file;
        this.fileSizeMb = Math.round((file.size / 1048576) * 10) / 10;
    }
    resetResult() {
        this.revokePreview();
        this.preview = null;
        this.result = null;
        this.fileSizeMb = null;
        this.pageCount = 0;
        this.openDocument = null;
        this.error = null;
    }
    revokePreview() {
        if (this.previewUrl) {
            URL.revokeObjectURL(this.previewUrl);
            this.previewUrl = null;
        }
    }
    fileName(extension) {
        const stamp = new Date().toISOString().replace(/[-:.]/g, "").slice(0, 15);
        return `scan-${stamp}.${extension}`;
    }
    messageOf(error) {
        return error instanceof PageFlowError ? error.message : FALLBACK_ERROR;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ScanAndUploadDialogComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.12", type: ScanAndUploadDialogComponent, isStandalone: true, selector: "app-scan-and-upload-dialog", inputs: { visible: "visible" }, outputs: { visibleChange: "visibleChange", scanned: "scanned" }, usesOnChanges: true, ngImport: i0, template: "<p-dialog\r\n  header=\"Scan and Upload\"\r\n  [(visible)]=\"visible\"\r\n  [modal]=\"true\"\r\n  [draggable]=\"false\"\r\n  [style]=\"{ width: '64rem', maxWidth: '96vw' }\"\r\n  [maximizable]=\"true\"\r\n  (onHide)=\"close()\"\r\n>\r\n  <div class=\"scan-dialog\">\r\n    <div class=\"field\">\r\n      <label for=\"scanner\">Scanner</label>\r\n      <p-dropdown\r\n        inputId=\"scanner\"\r\n        [options]=\"scanners\"\r\n        optionLabel=\"name\"\r\n        optionValue=\"id\"\r\n        [(ngModel)]=\"scannerId\"\r\n        [disabled]=\"loadingScanners || busy || !scanners.length\"\r\n        placeholder=\"{{ loadingScanners ? 'Looking for scanners...' : 'Choose a scanner' }}\"\r\n        styleClass=\"w-full\"\r\n      ></p-dropdown>\r\n      <p class=\"hint\" *ngIf=\"!loadingScanners && !scanners.length && !agentUnreachable\">\r\n        No scanner is available. Check that the scanner is on and the Page-Flow agent is running.\r\n      </p>\r\n    </div>\r\n\r\n    <div class=\"agent-panel\" *ngIf=\"agentUnreachable\">\r\n      <p class=\"error\" *ngIf=\"!agentNotInstalled\">Page-Flow is not running on this computer.</p>\r\n      <p class=\"error\" *ngIf=\"agentNotInstalled\">Page-Flow is not installed on this computer.</p>\r\n      <div class=\"actions\">\r\n        <button\r\n          pButton\r\n          type=\"button\"\r\n          *ngIf=\"!agentNotInstalled\"\r\n          label=\"Start Page-Flow\"\r\n          icon=\"pi pi-play\"\r\n          [loading]=\"startingAgent\"\r\n          (click)=\"startAgent()\"\r\n        ></button>\r\n        <a\r\n          *ngIf=\"agentNotInstalled && canDownload\"\r\n          class=\"p-button\"\r\n          [href]=\"installerHref\"\r\n          target=\"_blank\"\r\n          rel=\"noopener\"\r\n        >\r\n          <i class=\"pi pi-download\"></i> Download Page-Flow for Windows\r\n        </a>\r\n        <p class=\"hint\" *ngIf=\"agentNotInstalled && !canDownload && os === 'windows'\">\r\n          Ask your IT team to install Page-Flow on this computer.\r\n        </p>\r\n        <p class=\"hint\" *ngIf=\"agentNotInstalled && !canDownload && os !== 'windows'\">\r\n          Page-Flow is not yet available for {{ osName }}. Ask your IT team.\r\n        </p>\r\n        <button\r\n          pButton\r\n          type=\"button\"\r\n          label=\"Check again\"\r\n          class=\"p-button-text\"\r\n          [disabled]=\"loadingScanners || startingAgent\"\r\n          (click)=\"loadScanners()\"\r\n        ></button>\r\n      </div>\r\n    </div>\r\n\r\n    <fieldset class=\"field\" [disabled]=\"!!openDocument || busy\">\r\n      <legend>Scan type</legend>\r\n      <div class=\"choice\">\r\n        <p-radioButton name=\"mode\" value=\"single\" label=\"Single page\" [ngModel]=\"mode\" (ngModelChange)=\"setMode($event)\"></p-radioButton>\r\n        <p-radioButton name=\"mode\" value=\"multi\" label=\"Multi-page document\" [ngModel]=\"mode\" (ngModelChange)=\"setMode($event)\"></p-radioButton>\r\n      </div>\r\n    </fieldset>\r\n\r\n    <fieldset class=\"field\" [disabled]=\"busy\">\r\n      <legend>Colour</legend>\r\n      <div class=\"choice\">\r\n        <p-radioButton name=\"colour\" value=\"colour\" label=\"Colour\" [(ngModel)]=\"colour\"></p-radioButton>\r\n        <p-radioButton name=\"colour\" value=\"grayscale\" label=\"Black and white\" [(ngModel)]=\"colour\"></p-radioButton>\r\n      </div>\r\n    </fieldset>\r\n\r\n    <fieldset class=\"field\" [disabled]=\"busy || !bmpAllowed\">\r\n      <legend>File type</legend>\r\n      <div class=\"choice\">\r\n        <p-radioButton name=\"output\" value=\"pdf\" label=\"PDF\" [(ngModel)]=\"output\"></p-radioButton>\r\n        <p-radioButton name=\"output\" value=\"jpeg\" label=\"JPEG (single page only)\" [(ngModel)]=\"output\"></p-radioButton>\r\n        <p-radioButton name=\"output\" value=\"png\" label=\"PNG (single page only)\" [(ngModel)]=\"output\"></p-radioButton>\r\n        <p-radioButton name=\"output\" value=\"bmp\" label=\"BMP (single page only)\" [(ngModel)]=\"output\"></p-radioButton>\r\n      </div>\r\n      <p class=\"hint\">Resolution: {{ dpi }} dpi.</p>\r\n      <p class=\"hint\" *ngIf=\"output === 'bmp'\">\r\n        BMP files are large (about 25 MB for a colour A4 page). JPEG is recommended for images.\r\n      </p>\r\n    </fieldset>\r\n\r\n    <div class=\"actions\">\r\n      <button\r\n        pButton\r\n        type=\"button\"\r\n        [label]=\"mode === 'single' ? 'Scan page' : (openDocument ? 'Add page' : 'Start scanning')\"\r\n        icon=\"pi pi-print\"\r\n        [disabled]=\"!scannerId || busy\"\r\n        (click)=\"scan()\"\r\n      ></button>\r\n      <button\r\n        pButton\r\n        type=\"button\"\r\n        *ngIf=\"mode === 'multi' && openDocument\"\r\n        label=\"Finish document\"\r\n        class=\"p-button-secondary\"\r\n        [disabled]=\"busy || pageCount === 0\"\r\n        (click)=\"finishDocument()\"\r\n      ></button>\r\n      <button\r\n        pButton\r\n        type=\"button\"\r\n        *ngIf=\"mode === 'multi' && openDocument\"\r\n        label=\"Cancel document\"\r\n        class=\"p-button-text\"\r\n        [disabled]=\"busy\"\r\n        (click)=\"cancelDocument()\"\r\n      ></button>\r\n    </div>\r\n\r\n    <p class=\"status\" *ngIf=\"busy\">Scanning, please wait...</p>\r\n    <p class=\"status\" *ngIf=\"mode === 'multi' && pageCount > 0 && !busy\">\r\n      {{ pageCount }} page{{ pageCount === 1 ? \"\" : \"s\" }} scanned. Add more pages, or finish the document.\r\n    </p>\r\n    <p class=\"error\" *ngIf=\"error\">{{ error }}</p>\r\n\r\n    <div class=\"preview\" *ngIf=\"preview\">\r\n      <h4>Scan preview</h4>\r\n      <iframe *ngIf=\"preview.isPdf\" [src]=\"preview.url\" title=\"Scan preview\"></iframe>\r\n      <img *ngIf=\"!preview.isPdf\" [src]=\"preview.url\" alt=\"Scan preview\" />\r\n      <p class=\"hint\" *ngIf=\"fileSizeMb !== null\">File size: {{ fileSizeMb }} MB.</p>\r\n    </div>\r\n  </div>\r\n\r\n  <ng-template pTemplate=\"footer\">\r\n    <button pButton type=\"button\" label=\"Cancel\" class=\"p-button-text\" (click)=\"close()\"></button>\r\n    <button\r\n      pButton\r\n      type=\"button\"\r\n      label=\"Upload\"\r\n      icon=\"pi pi-upload\"\r\n      [disabled]=\"!canUpload\"\r\n      (click)=\"upload()\"\r\n    ></button>\r\n  </ng-template>\r\n</p-dialog>\r\n", styles: [".scan-dialog{display:flex;flex-direction:column;gap:1rem}.field{border:0;padding:0;margin:0;display:flex;flex-direction:column;gap:.4rem}.field label,.field legend{font-weight:600}.choice{display:flex;flex-wrap:wrap;gap:1rem}.actions{display:flex;flex-wrap:wrap;gap:.5rem}.hint{margin:0;color:var(--text-color-secondary, #6b7280);font-size:.875rem}.status{margin:0}.error{margin:0;color:var(--red-600, #dc2626)}.preview{display:flex;flex-direction:column;gap:.5rem}.preview h4{margin:0}.preview iframe,.preview img{width:100%;max-height:75vh;border:1px solid var(--surface-300, #d1d5db);border-radius:6px;object-fit:contain}.preview iframe{height:75vh}.agent-panel{display:flex;flex-direction:column;gap:.5rem;padding:.75rem;border:1px solid var(--surface-300, #d1d5db);border-radius:6px}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "ngmodule", type: ButtonModule }, { kind: "directive", type: i3.ButtonDirective, selector: "[pButton]", inputs: ["iconPos", "loadingIcon", "label", "icon", "loading", "severity", "raised", "rounded", "text", "outlined", "size", "plain"] }, { kind: "directive", type: i4.PrimeTemplate, selector: "[pTemplate]", inputs: ["type", "pTemplate"] }, { kind: "ngmodule", type: DialogModule }, { kind: "component", type: i5.Dialog, selector: "p-dialog", inputs: ["header", "draggable", "resizable", "positionLeft", "positionTop", "contentStyle", "contentStyleClass", "modal", "closeOnEscape", "dismissableMask", "rtl", "closable", "responsive", "appendTo", "breakpoints", "styleClass", "maskStyleClass", "maskStyle", "showHeader", "breakpoint", "blockScroll", "autoZIndex", "baseZIndex", "minX", "minY", "focusOnShow", "maximizable", "keepInViewport", "focusTrap", "transitionOptions", "closeIcon", "closeAriaLabel", "closeTabindex", "minimizeIcon", "maximizeIcon", "visible", "style", "position"], outputs: ["onShow", "onHide", "visibleChange", "onResizeInit", "onResizeEnd", "onDragEnd", "onMaximize"] }, { kind: "ngmodule", type: DropdownModule }, { kind: "component", type: i6.Dropdown, selector: "p-dropdown", inputs: ["id", "scrollHeight", "filter", "name", "style", "panelStyle", "styleClass", "panelStyleClass", "readonly", "required", "editable", "appendTo", "tabindex", "placeholder", "loadingIcon", "filterPlaceholder", "filterLocale", "variant", "inputId", "dataKey", "filterBy", "filterFields", "autofocus", "resetFilterOnHide", "checkmark", "dropdownIcon", "loading", "optionLabel", "optionValue", "optionDisabled", "optionGroupLabel", "optionGroupChildren", "autoDisplayFirst", "group", "showClear", "emptyFilterMessage", "emptyMessage", "lazy", "virtualScroll", "virtualScrollItemSize", "virtualScrollOptions", "overlayOptions", "ariaFilterLabel", "ariaLabel", "ariaLabelledBy", "filterMatchMode", "maxlength", "tooltip", "tooltipPosition", "tooltipPositionStyle", "tooltipStyleClass", "focusOnHover", "selectOnFocus", "autoOptionFocus", "autofocusFilter", "autoShowPanelOnPrintableCharacterKeyDown", "disabled", "itemSize", "autoZIndex", "baseZIndex", "showTransitionOptions", "hideTransitionOptions", "filterValue", "options"], outputs: ["onChange", "onFilter", "onFocus", "onBlur", "onClick", "onShow", "onHide", "onClear", "onLazyLoad"] }, { kind: "ngmodule", type: RadioButtonModule }, { kind: "component", type: i7.RadioButton, selector: "p-radioButton", inputs: ["value", "formControlName", "name", "disabled", "label", "variant", "tabindex", "inputId", "ariaLabelledBy", "ariaLabel", "style", "styleClass", "labelStyleClass", "autofocus"], outputs: ["onClick", "onFocus", "onBlur"] }, { kind: "ngmodule", type: SharedModule }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ScanAndUploadDialogComponent, decorators: [{
            type: Component,
            args: [{ selector: "app-scan-and-upload-dialog", standalone: true, imports: [
                        CommonModule,
                        FormsModule,
                        ButtonModule,
                        DialogModule,
                        DropdownModule,
                        RadioButtonModule,
                        SharedModule,
                    ], template: "<p-dialog\r\n  header=\"Scan and Upload\"\r\n  [(visible)]=\"visible\"\r\n  [modal]=\"true\"\r\n  [draggable]=\"false\"\r\n  [style]=\"{ width: '64rem', maxWidth: '96vw' }\"\r\n  [maximizable]=\"true\"\r\n  (onHide)=\"close()\"\r\n>\r\n  <div class=\"scan-dialog\">\r\n    <div class=\"field\">\r\n      <label for=\"scanner\">Scanner</label>\r\n      <p-dropdown\r\n        inputId=\"scanner\"\r\n        [options]=\"scanners\"\r\n        optionLabel=\"name\"\r\n        optionValue=\"id\"\r\n        [(ngModel)]=\"scannerId\"\r\n        [disabled]=\"loadingScanners || busy || !scanners.length\"\r\n        placeholder=\"{{ loadingScanners ? 'Looking for scanners...' : 'Choose a scanner' }}\"\r\n        styleClass=\"w-full\"\r\n      ></p-dropdown>\r\n      <p class=\"hint\" *ngIf=\"!loadingScanners && !scanners.length && !agentUnreachable\">\r\n        No scanner is available. Check that the scanner is on and the Page-Flow agent is running.\r\n      </p>\r\n    </div>\r\n\r\n    <div class=\"agent-panel\" *ngIf=\"agentUnreachable\">\r\n      <p class=\"error\" *ngIf=\"!agentNotInstalled\">Page-Flow is not running on this computer.</p>\r\n      <p class=\"error\" *ngIf=\"agentNotInstalled\">Page-Flow is not installed on this computer.</p>\r\n      <div class=\"actions\">\r\n        <button\r\n          pButton\r\n          type=\"button\"\r\n          *ngIf=\"!agentNotInstalled\"\r\n          label=\"Start Page-Flow\"\r\n          icon=\"pi pi-play\"\r\n          [loading]=\"startingAgent\"\r\n          (click)=\"startAgent()\"\r\n        ></button>\r\n        <a\r\n          *ngIf=\"agentNotInstalled && canDownload\"\r\n          class=\"p-button\"\r\n          [href]=\"installerHref\"\r\n          target=\"_blank\"\r\n          rel=\"noopener\"\r\n        >\r\n          <i class=\"pi pi-download\"></i> Download Page-Flow for Windows\r\n        </a>\r\n        <p class=\"hint\" *ngIf=\"agentNotInstalled && !canDownload && os === 'windows'\">\r\n          Ask your IT team to install Page-Flow on this computer.\r\n        </p>\r\n        <p class=\"hint\" *ngIf=\"agentNotInstalled && !canDownload && os !== 'windows'\">\r\n          Page-Flow is not yet available for {{ osName }}. Ask your IT team.\r\n        </p>\r\n        <button\r\n          pButton\r\n          type=\"button\"\r\n          label=\"Check again\"\r\n          class=\"p-button-text\"\r\n          [disabled]=\"loadingScanners || startingAgent\"\r\n          (click)=\"loadScanners()\"\r\n        ></button>\r\n      </div>\r\n    </div>\r\n\r\n    <fieldset class=\"field\" [disabled]=\"!!openDocument || busy\">\r\n      <legend>Scan type</legend>\r\n      <div class=\"choice\">\r\n        <p-radioButton name=\"mode\" value=\"single\" label=\"Single page\" [ngModel]=\"mode\" (ngModelChange)=\"setMode($event)\"></p-radioButton>\r\n        <p-radioButton name=\"mode\" value=\"multi\" label=\"Multi-page document\" [ngModel]=\"mode\" (ngModelChange)=\"setMode($event)\"></p-radioButton>\r\n      </div>\r\n    </fieldset>\r\n\r\n    <fieldset class=\"field\" [disabled]=\"busy\">\r\n      <legend>Colour</legend>\r\n      <div class=\"choice\">\r\n        <p-radioButton name=\"colour\" value=\"colour\" label=\"Colour\" [(ngModel)]=\"colour\"></p-radioButton>\r\n        <p-radioButton name=\"colour\" value=\"grayscale\" label=\"Black and white\" [(ngModel)]=\"colour\"></p-radioButton>\r\n      </div>\r\n    </fieldset>\r\n\r\n    <fieldset class=\"field\" [disabled]=\"busy || !bmpAllowed\">\r\n      <legend>File type</legend>\r\n      <div class=\"choice\">\r\n        <p-radioButton name=\"output\" value=\"pdf\" label=\"PDF\" [(ngModel)]=\"output\"></p-radioButton>\r\n        <p-radioButton name=\"output\" value=\"jpeg\" label=\"JPEG (single page only)\" [(ngModel)]=\"output\"></p-radioButton>\r\n        <p-radioButton name=\"output\" value=\"png\" label=\"PNG (single page only)\" [(ngModel)]=\"output\"></p-radioButton>\r\n        <p-radioButton name=\"output\" value=\"bmp\" label=\"BMP (single page only)\" [(ngModel)]=\"output\"></p-radioButton>\r\n      </div>\r\n      <p class=\"hint\">Resolution: {{ dpi }} dpi.</p>\r\n      <p class=\"hint\" *ngIf=\"output === 'bmp'\">\r\n        BMP files are large (about 25 MB for a colour A4 page). JPEG is recommended for images.\r\n      </p>\r\n    </fieldset>\r\n\r\n    <div class=\"actions\">\r\n      <button\r\n        pButton\r\n        type=\"button\"\r\n        [label]=\"mode === 'single' ? 'Scan page' : (openDocument ? 'Add page' : 'Start scanning')\"\r\n        icon=\"pi pi-print\"\r\n        [disabled]=\"!scannerId || busy\"\r\n        (click)=\"scan()\"\r\n      ></button>\r\n      <button\r\n        pButton\r\n        type=\"button\"\r\n        *ngIf=\"mode === 'multi' && openDocument\"\r\n        label=\"Finish document\"\r\n        class=\"p-button-secondary\"\r\n        [disabled]=\"busy || pageCount === 0\"\r\n        (click)=\"finishDocument()\"\r\n      ></button>\r\n      <button\r\n        pButton\r\n        type=\"button\"\r\n        *ngIf=\"mode === 'multi' && openDocument\"\r\n        label=\"Cancel document\"\r\n        class=\"p-button-text\"\r\n        [disabled]=\"busy\"\r\n        (click)=\"cancelDocument()\"\r\n      ></button>\r\n    </div>\r\n\r\n    <p class=\"status\" *ngIf=\"busy\">Scanning, please wait...</p>\r\n    <p class=\"status\" *ngIf=\"mode === 'multi' && pageCount > 0 && !busy\">\r\n      {{ pageCount }} page{{ pageCount === 1 ? \"\" : \"s\" }} scanned. Add more pages, or finish the document.\r\n    </p>\r\n    <p class=\"error\" *ngIf=\"error\">{{ error }}</p>\r\n\r\n    <div class=\"preview\" *ngIf=\"preview\">\r\n      <h4>Scan preview</h4>\r\n      <iframe *ngIf=\"preview.isPdf\" [src]=\"preview.url\" title=\"Scan preview\"></iframe>\r\n      <img *ngIf=\"!preview.isPdf\" [src]=\"preview.url\" alt=\"Scan preview\" />\r\n      <p class=\"hint\" *ngIf=\"fileSizeMb !== null\">File size: {{ fileSizeMb }} MB.</p>\r\n    </div>\r\n  </div>\r\n\r\n  <ng-template pTemplate=\"footer\">\r\n    <button pButton type=\"button\" label=\"Cancel\" class=\"p-button-text\" (click)=\"close()\"></button>\r\n    <button\r\n      pButton\r\n      type=\"button\"\r\n      label=\"Upload\"\r\n      icon=\"pi pi-upload\"\r\n      [disabled]=\"!canUpload\"\r\n      (click)=\"upload()\"\r\n    ></button>\r\n  </ng-template>\r\n</p-dialog>\r\n", styles: [".scan-dialog{display:flex;flex-direction:column;gap:1rem}.field{border:0;padding:0;margin:0;display:flex;flex-direction:column;gap:.4rem}.field label,.field legend{font-weight:600}.choice{display:flex;flex-wrap:wrap;gap:1rem}.actions{display:flex;flex-wrap:wrap;gap:.5rem}.hint{margin:0;color:var(--text-color-secondary, #6b7280);font-size:.875rem}.status{margin:0}.error{margin:0;color:var(--red-600, #dc2626)}.preview{display:flex;flex-direction:column;gap:.5rem}.preview h4{margin:0}.preview iframe,.preview img{width:100%;max-height:75vh;border:1px solid var(--surface-300, #d1d5db);border-radius:6px;object-fit:contain}.preview iframe{height:75vh}.agent-panel{display:flex;flex-direction:column;gap:.5rem;padding:.75rem;border:1px solid var(--surface-300, #d1d5db);border-radius:6px}\n"] }]
        }], propDecorators: { visible: [{
                type: Input
            }], visibleChange: [{
                type: Output
            }], scanned: [{
                type: Output
            }] } });

/*
 * Public API of @lifetrenz/page-flow.
 * The SDK (framework-neutral) and the Angular binding are both exported from here.
 */

/**
 * Generated bundle index. Do not edit.
 */

export { DEFAULT_PAGE_FLOW_SETTINGS, DEFAULT_REQUEST_TIMEOUT_MS, PAGE_FLOW_DEFAULT_HTTPS_PORT, PAGE_FLOW_DEFAULT_PORT, PAGE_FLOW_DOWNLOAD_URL, PAGE_FLOW_FETCH, PAGE_FLOW_HOST, PAGE_FLOW_LAUNCH_LINK, PageFlowClient, PageFlowError, PageFlowLauncherService, PageFlowService, PageFlowSettingsStore, SCAN_DPI, ScanAndUploadDialogComponent, ScanDocument, ScanUtilityService, effectiveOutput, isValidPageFlowPort, outputFileType, pageFlowBaseUrl, pageFlowConnectionUrl, pageFlowHttpsBaseUrl, parsePageFlowSettings, planScan, serializePageFlowSettings };
//# sourceMappingURL=lifetrenz-page-flow.mjs.map
