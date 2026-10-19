import { PageFlowSettings } from './settings';
import { PageFlowDevice, PageFlowHealth, PageFlowPrintJob, PageFlowPrintOptions, PageFlowRefreshResult, PageFlowScanOptions, PageFlowScanResult } from './models';
export type PageFlowFetch = (url: string, init: RequestInit) => Promise<Response>;
export interface PageFlowClientOptions {
    /** Read on every call, so a changed port or token applies without restarting the client. */
    settings: () => PageFlowSettings;
    /** Defaults to the global fetch. Replace it in tests or to add logging. */
    fetch?: PageFlowFetch;
    /** Longer than the agent's own scan timeout (180 s), so a slow scan is not cut off here first. */
    timeoutMs?: number;
}
export declare const DEFAULT_REQUEST_TIMEOUT_MS = 240000;
/**
 * Calls the Page-Flow agent on this computer. Every call is a `/v1` route, sent with the pairing
 * token from the settings. Nothing is retried: a failed scan or print is reported to the caller,
 * which decides what happens next.
 */
export declare class PageFlowClient {
    private readonly settings;
    private readonly fetcher;
    private readonly timeoutMs;
    constructor(options: PageFlowClientOptions);
    health(signal?: AbortSignal): Promise<PageFlowHealth>;
    scanners(signal?: AbortSignal): Promise<PageFlowDevice[]>;
    printers(signal?: AbortSignal): Promise<PageFlowDevice[]>;
    refresh(signal?: AbortSignal): Promise<PageFlowRefreshResult>;
    /** One scan of one page. The reply is the page itself, JPEG or PDF. */
    scan(options: PageFlowScanOptions, signal?: AbortSignal): Promise<PageFlowScanResult>;
    startScanSession(signal?: AbortSignal): Promise<string>;
    /** Scans one page into an open session. Resolves to the number of pages now in the session. */
    addScanPage(sessionId: string, options: PageFlowScanOptions, signal?: AbortSignal): Promise<number>;
    /** Builds one PDF from the session's pages. The session stays open if this fails. */
    finishScanSession(sessionId: string, signal?: AbortSignal): Promise<Blob>;
    cancelScanSession(sessionId: string, signal?: AbortSignal): Promise<void>;
    /**
     * Sends a PDF to a printer. Once the request is sent, any failure other than a refusal the
     * agent gave in a well-formed reply is reported as `print_outcome_unknown`: the printer may
     * already have the job, so the caller must check the queue rather than print again.
     */
    print(document: Blob | ArrayBuffer, options: PageFlowPrintOptions, signal?: AbortSignal): Promise<PageFlowPrintJob>;
    printJob(jobId: string, printerId: string, signal?: AbortSignal): Promise<PageFlowPrintJob>;
    cancelPrintJob(jobId: string, printerId: string, signal?: AbortSignal): Promise<PageFlowPrintJob>;
    private getJson;
    private postJson;
    private send;
    /**
     * Sends one request with a timeout. A caller's abort passes through as the caller's own error.
     * A timeout or a failed connection is reported as a Page-Flow error with status 0.
     */
    private dispatch;
    private connection;
    private readJson;
    private scanResult;
}
//# sourceMappingURL=client.d.ts.map