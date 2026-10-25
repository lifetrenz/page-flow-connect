import type { PageFlowScanColour } from "../../sdk/models";
/** Scans are taken at 300 dpi, as the scan-and-upload ticket (Redmine 47227) requires. */
export declare const SCAN_DPI = 300;
export type ScanMode = "single" | "multi";
export type ScanOutput = "pdf" | "jpeg" | "png" | "bmp";
/** How the browser changes the agent's JPEG page before it is saved. */
export type ScanConversion = "none" | "bmp" | "png";
export interface ScanPlan {
    /** Format asked of the agent. A multi-page scan uses JPEG pages, and the agent joins them into a PDF. */
    agentFormat: "pdf" | "jpeg";
    preset: "photo" | "document";
    colour: PageFlowScanColour;
    /** What the browser does to a single JPEG page: nothing, or convert it to BMP or PNG. */
    convertTo: ScanConversion;
    /** True when a single JPEG page must be converted to BMP in the browser. */
    convertToBmp: boolean;
}
/** A BMP, JPEG or PNG holds one page, so a multi-page scan is always a PDF. */
export declare function effectiveOutput(mode: ScanMode, output: ScanOutput): ScanOutput;
/** The file extension and MIME type of a saved scan. */
export declare function outputFileType(output: ScanOutput): {
    extension: string;
    mimeType: string;
};
export declare function planScan(mode: ScanMode, colour: PageFlowScanColour, output: ScanOutput): ScanPlan;
//# sourceMappingURL=scan-plan.d.ts.map