import type { PageFlowScanColour } from "../../sdk/models";
/** Scans are taken at 300 dpi, as the scan-and-upload ticket (Redmine 47227) requires. */
export declare const SCAN_DPI = 300;
export type ScanMode = "single" | "multi";
export type ScanOutput = "pdf" | "bmp";
export interface ScanPlan {
    /** Format asked of the agent. A multi-page scan uses JPEG pages, and the agent joins them into a PDF. */
    agentFormat: "pdf" | "jpeg";
    preset: "photo" | "document";
    colour: PageFlowScanColour;
    /** True when a single JPEG page must be converted to BMP in the browser. */
    convertToBmp: boolean;
}
/** A BMP holds one page, so a multi-page scan is always a PDF. */
export declare function effectiveOutput(mode: ScanMode, output: ScanOutput): ScanOutput;
export declare function planScan(mode: ScanMode, colour: PageFlowScanColour, output: ScanOutput): ScanPlan;
//# sourceMappingURL=scan-plan.d.ts.map