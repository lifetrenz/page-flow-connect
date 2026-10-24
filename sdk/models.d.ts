/**
 * Shapes of the Page-Flow agent's `/v1` API. Field names match the agent's JSON exactly
 * (snake_case), so replies can be used without mapping.
 * Reference: docs/api/page-flow-api.md in this repository.
 */
export interface PageFlowDeviceCapabilities {
    resolutions_dpi: number[];
    formats: string[];
}
export interface PageFlowDevice {
    id: string;
    name: string;
    model: string;
    available: boolean;
    capabilities: PageFlowDeviceCapabilities;
}
export type PageFlowScanPreset = 'photo' | 'document';
export type PageFlowScanArea = 'entire' | 'letter' | 'a4' | '4x6' | '5x7';
export type PageFlowScanColour = 'colour' | 'grayscale' | 'gray' | 'bw';
export type PageFlowScanFormat = 'pdf' | 'jpeg';
export interface PageFlowScanOptions {
    /** Absent, the agent uses its default scanner. */
    scanner_id?: string;
    preset?: PageFlowScanPreset;
    area?: PageFlowScanArea;
    colour?: PageFlowScanColour;
    dpi?: number;
    format?: PageFlowScanFormat;
}
export type PageFlowPrintColour = 'bw' | 'colour';
export type PageFlowOrientation = 'portrait' | 'landscape';
export type PageFlowQuality = 'best' | 'normal' | 'low';
export type PageFlowPaper = 'letter' | 'legal' | 'statement' | 'executive' | 'a4' | 'a5' | 'b5-jis' | 'envelope-10' | 'envelope-dl' | 'envelope-c6' | 'japanese-postcard' | 'a6' | 'chou-3' | 'chou-4' | '2l' | '89x127' | '4x6' | '5x7' | '8.5x13' | '8x10' | 'b5-iso';
export interface PageFlowPrintOptions {
    /** Absent, the agent uses its default printer. */
    printer_id?: string;
    copies?: number;
    colour?: PageFlowPrintColour;
    orientation?: PageFlowOrientation;
    paper?: PageFlowPaper;
    quality?: PageFlowQuality;
}
export type PageFlowJobStatus = 'queued' | 'printing' | 'stopped' | 'completed' | 'cancelled' | 'failed';
/** `submitted` and `cancel_requested` are the replies to the print and cancel routes. */
export interface PageFlowPrintJob {
    job_id: string;
    status: PageFlowJobStatus | 'submitted' | 'cancel_requested';
}
export interface PageFlowHealth {
    status: 'running';
}
export interface PageFlowDeviceList {
    devices: PageFlowDevice[];
}
export interface PageFlowRefreshResult {
    scanners: PageFlowDevice[];
    printers: PageFlowDevice[];
}
export type PageFlowScanContentType = 'image/jpeg' | 'application/pdf';
export interface PageFlowScanResult {
    blob: Blob;
    contentType: PageFlowScanContentType;
}
export interface PageFlowSessionPages {
    pages: number;
}
//# sourceMappingURL=models.d.ts.map