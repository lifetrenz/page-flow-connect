import { EventEmitter, OnChanges, SimpleChanges } from "@angular/core";
import { SafeResourceUrl } from "@angular/platform-browser";
import { PageFlowDevice, PageFlowScanColour } from "../../sdk/models";
import { PageFlowLauncherService } from "../page-flow-launcher.service";
import { ScanDocument } from "../scan-utility.service";
import { ScanMode, ScanOutput } from "./scan-plan";
import * as i0 from "@angular/core";
interface ScanPreview {
    url: SafeResourceUrl;
    isPdf: boolean;
}
/**
 * Scan and Upload: pick the scanner and the scan options, scan one page or a document, check the
 * result, then hand the file to the attachment screen. The attachment screen does the upload, so
 * the same checks and the same save apply to a scan and to a file picked by hand.
 */
export declare class ScanAndUploadDialogComponent implements OnChanges {
    visible: boolean;
    visibleChange: EventEmitter<boolean>;
    /** The finished scan, as a file. The parent uploads it. */
    scanned: EventEmitter<File>;
    private readonly scanUtility;
    private readonly sanitizer;
    readonly launcher: PageFlowLauncherService;
    readonly dpi = 300;
    scanners: PageFlowDevice[];
    scannerId: string | null;
    mode: ScanMode;
    colour: PageFlowScanColour;
    output: ScanOutput;
    loadingScanners: boolean;
    /** The agent did not answer. The screen offers to start it, or to install it. */
    agentUnreachable: boolean;
    agentNotInstalled: boolean;
    startingAgent: boolean;
    busy: boolean;
    error: string | null;
    pageCount: number;
    preview: ScanPreview | null;
    fileSizeMb: number | null;
    openDocument: ScanDocument | null;
    private result;
    private previewUrl;
    ngOnChanges(changes: SimpleChanges): void;
    get bmpAllowed(): boolean;
    get canUpload(): boolean;
    setMode(mode: ScanMode): void;
    get canDownload(): boolean;
    loadScanners(): Promise<void>;
    /**
     * Starts the agent if it is installed but not running. If no program takes the link, the agent
     * is not installed, and the screen offers the installer instead.
     */
    startAgent(): Promise<void>;
    /** Single page: scans now. Multi-page: adds a page to the open document. */
    scan(): Promise<void>;
    /** Multi-page: builds the PDF from the pages scanned so far. */
    finishDocument(): Promise<void>;
    /** Drops the pages scanned so far, and the open document on the agent. */
    cancelDocument(): Promise<void>;
    upload(): void;
    close(): Promise<void>;
    private scanSinglePage;
    private addDocumentPage;
    /** Shows the scan and keeps it for upload. A PDF is previewed in a frame, a JPEG as an image. */
    private showResult;
    private resetResult;
    private revokePreview;
    private fileName;
    private messageOf;
    static ɵfac: i0.ɵɵFactoryDeclaration<ScanAndUploadDialogComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ScanAndUploadDialogComponent, "app-scan-and-upload-dialog", never, { "visible": { "alias": "visible"; "required": false; }; }, { "visibleChange": "visibleChange"; "scanned": "scanned"; }, never, never, true, never>;
}
export {};
//# sourceMappingURL=scan-and-upload-dialog.component.d.ts.map