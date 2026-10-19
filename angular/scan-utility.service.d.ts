import { PageFlowClient, PageFlowDevice, PageFlowScanOptions, PageFlowScanResult } from '../sdk';
import * as i0 from "@angular/core";
/** Scan settings chosen by the user. The scanner is passed separately. */
export type ScanUtilityOptions = Omit<PageFlowScanOptions, 'scanner_id'>;
/**
 * One multi-page document being scanned into an agent session. Pages are added one at a time,
 * then the session is finished into a single PDF. Cancel it to drop the pages.
 */
export declare class ScanDocument {
    private readonly client;
    readonly sessionId: string;
    private readonly scannerId;
    private readonly options;
    private pageCount;
    constructor(client: PageFlowClient, sessionId: string, scannerId: string, options: ScanUtilityOptions);
    /** Pages scanned into this document so far. */
    get pages(): number;
    /** Scans one more page. Resolves to the number of pages now in the document. */
    addPage(signal?: AbortSignal): Promise<number>;
    /** Builds the PDF. If this fails, the document stays open so a page can be added or it can be cancelled. */
    finish(signal?: AbortSignal): Promise<Blob>;
    cancel(signal?: AbortSignal): Promise<void>;
}
/**
 * Scanning for WAPP screens: list scanners, scan one page, or scan a multi-page document.
 * Nothing is retried. A failed scan is returned to the caller as a PageFlowError.
 */
export declare class ScanUtilityService {
    private readonly pageFlow;
    scanners(signal?: AbortSignal): Promise<PageFlowDevice[]>;
    scanPage(scannerId: string, options?: ScanUtilityOptions, signal?: AbortSignal): Promise<PageFlowScanResult>;
    /** Opens a multi-page document. Call `addPage` on it for each page, then `finish`. */
    startDocument(scannerId: string, options?: ScanUtilityOptions, signal?: AbortSignal): Promise<ScanDocument>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ScanUtilityService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ScanUtilityService>;
}
//# sourceMappingURL=scan-utility.service.d.ts.map