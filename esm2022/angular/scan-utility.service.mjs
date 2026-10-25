import { Injectable, inject } from '@angular/core';
import { PageFlowService } from './page-flow.service';
import * as i0 from "@angular/core";
/**
 * One multi-page document being scanned into an agent session. Pages are added one at a time,
 * then the session is finished into a single PDF. Cancel it to drop the pages.
 */
export class ScanDocument {
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
export class ScanUtilityService {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nhbi11dGlsaXR5LnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYW5ndWxhci9zY2FuLXV0aWxpdHkuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQU9uRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0scUJBQXFCLENBQUM7O0FBS3REOzs7R0FHRztBQUNILE1BQU0sT0FBTyxZQUFZO0lBR3JCLFlBQ3FCLE1BQXNCLEVBQzlCLFNBQWlCLEVBQ1QsU0FBaUIsRUFDakIsT0FBMkI7UUFIM0IsV0FBTSxHQUFOLE1BQU0sQ0FBZ0I7UUFDOUIsY0FBUyxHQUFULFNBQVMsQ0FBUTtRQUNULGNBQVMsR0FBVCxTQUFTLENBQVE7UUFDakIsWUFBTyxHQUFQLE9BQU8sQ0FBb0I7UUFOeEMsY0FBUyxHQUFHLENBQUMsQ0FBQztJQU9uQixDQUFDO0lBRUosK0NBQStDO0lBQy9DLElBQUksS0FBSztRQUNMLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUMxQixDQUFDO0lBRUQsZ0ZBQWdGO0lBQ2hGLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBb0I7UUFDOUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUMxQyxJQUFJLENBQUMsU0FBUyxFQUNkLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQy9DLE1BQU0sQ0FDVCxDQUFDO1FBQ0YsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQzFCLENBQUM7SUFFRCw0R0FBNEc7SUFDNUcsTUFBTSxDQUFDLE1BQW9CO1FBQ3ZCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2pFLENBQUM7SUFFRCxNQUFNLENBQUMsTUFBb0I7UUFDdkIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDakUsQ0FBQztDQUNKO0FBRUQ7OztHQUdHO0FBRUgsTUFBTSxPQUFPLGtCQUFrQjtJQUQvQjtRQUVxQixhQUFRLEdBQUcsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0tBb0J2RDtJQWxCRyxRQUFRLENBQUMsTUFBb0I7UUFDekIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVELFFBQVEsQ0FBQyxTQUFpQixFQUFFLFVBQThCLEVBQUUsRUFBRSxNQUFvQjtRQUM5RSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsR0FBRyxPQUFPLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNwRixDQUFDO0lBRUQsc0ZBQXNGO0lBQ3RGLEtBQUssQ0FBQyxhQUFhLENBQ2YsU0FBaUIsRUFDakIsVUFBOEIsRUFBRSxFQUNoQyxNQUFvQjtRQUVwQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztRQUNwQyxNQUFNLFNBQVMsR0FBRyxNQUFNLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4RCxPQUFPLElBQUksWUFBWSxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ25FLENBQUM7K0dBcEJRLGtCQUFrQjttSEFBbEIsa0JBQWtCLGNBREwsTUFBTTs7NEZBQ25CLGtCQUFrQjtrQkFEOUIsVUFBVTttQkFBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBpbmplY3QgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtcclxuICAgIFBhZ2VGbG93Q2xpZW50LFxyXG4gICAgUGFnZUZsb3dEZXZpY2UsXHJcbiAgICBQYWdlRmxvd1NjYW5PcHRpb25zLFxyXG4gICAgUGFnZUZsb3dTY2FuUmVzdWx0LFxyXG59IGZyb20gJy4uL3Nkayc7XHJcbmltcG9ydCB7IFBhZ2VGbG93U2VydmljZSB9IGZyb20gJy4vcGFnZS1mbG93LnNlcnZpY2UnO1xyXG5cclxuLyoqIFNjYW4gc2V0dGluZ3MgY2hvc2VuIGJ5IHRoZSB1c2VyLiBUaGUgc2Nhbm5lciBpcyBwYXNzZWQgc2VwYXJhdGVseS4gKi9cclxuZXhwb3J0IHR5cGUgU2NhblV0aWxpdHlPcHRpb25zID0gT21pdDxQYWdlRmxvd1NjYW5PcHRpb25zLCAnc2Nhbm5lcl9pZCc+O1xyXG5cclxuLyoqXHJcbiAqIE9uZSBtdWx0aS1wYWdlIGRvY3VtZW50IGJlaW5nIHNjYW5uZWQgaW50byBhbiBhZ2VudCBzZXNzaW9uLiBQYWdlcyBhcmUgYWRkZWQgb25lIGF0IGEgdGltZSxcclxuICogdGhlbiB0aGUgc2Vzc2lvbiBpcyBmaW5pc2hlZCBpbnRvIGEgc2luZ2xlIFBERi4gQ2FuY2VsIGl0IHRvIGRyb3AgdGhlIHBhZ2VzLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFNjYW5Eb2N1bWVudCB7XHJcbiAgICBwcml2YXRlIHBhZ2VDb3VudCA9IDA7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBjbGllbnQ6IFBhZ2VGbG93Q2xpZW50LFxyXG4gICAgICAgIHJlYWRvbmx5IHNlc3Npb25JZDogc3RyaW5nLFxyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgc2Nhbm5lcklkOiBzdHJpbmcsXHJcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBvcHRpb25zOiBTY2FuVXRpbGl0eU9wdGlvbnMsXHJcbiAgICApIHt9XHJcblxyXG4gICAgLyoqIFBhZ2VzIHNjYW5uZWQgaW50byB0aGlzIGRvY3VtZW50IHNvIGZhci4gKi9cclxuICAgIGdldCBwYWdlcygpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBhZ2VDb3VudDtcclxuICAgIH1cclxuXHJcbiAgICAvKiogU2NhbnMgb25lIG1vcmUgcGFnZS4gUmVzb2x2ZXMgdG8gdGhlIG51bWJlciBvZiBwYWdlcyBub3cgaW4gdGhlIGRvY3VtZW50LiAqL1xyXG4gICAgYXN5bmMgYWRkUGFnZShzaWduYWw/OiBBYm9ydFNpZ25hbCk6IFByb21pc2U8bnVtYmVyPiB7XHJcbiAgICAgICAgdGhpcy5wYWdlQ291bnQgPSBhd2FpdCB0aGlzLmNsaWVudC5hZGRTY2FuUGFnZShcclxuICAgICAgICAgICAgdGhpcy5zZXNzaW9uSWQsXHJcbiAgICAgICAgICAgIHsgc2Nhbm5lcl9pZDogdGhpcy5zY2FubmVySWQsIC4uLnRoaXMub3B0aW9ucyB9LFxyXG4gICAgICAgICAgICBzaWduYWwsXHJcbiAgICAgICAgKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5wYWdlQ291bnQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEJ1aWxkcyB0aGUgUERGLiBJZiB0aGlzIGZhaWxzLCB0aGUgZG9jdW1lbnQgc3RheXMgb3BlbiBzbyBhIHBhZ2UgY2FuIGJlIGFkZGVkIG9yIGl0IGNhbiBiZSBjYW5jZWxsZWQuICovXHJcbiAgICBmaW5pc2goc2lnbmFsPzogQWJvcnRTaWduYWwpOiBQcm9taXNlPEJsb2I+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbGllbnQuZmluaXNoU2NhblNlc3Npb24odGhpcy5zZXNzaW9uSWQsIHNpZ25hbCk7XHJcbiAgICB9XHJcblxyXG4gICAgY2FuY2VsKHNpZ25hbD86IEFib3J0U2lnbmFsKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xpZW50LmNhbmNlbFNjYW5TZXNzaW9uKHRoaXMuc2Vzc2lvbklkLCBzaWduYWwpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogU2Nhbm5pbmcgZm9yIFdBUFAgc2NyZWVuczogbGlzdCBzY2FubmVycywgc2NhbiBvbmUgcGFnZSwgb3Igc2NhbiBhIG11bHRpLXBhZ2UgZG9jdW1lbnQuXHJcbiAqIE5vdGhpbmcgaXMgcmV0cmllZC4gQSBmYWlsZWQgc2NhbiBpcyByZXR1cm5lZCB0byB0aGUgY2FsbGVyIGFzIGEgUGFnZUZsb3dFcnJvci5cclxuICovXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXHJcbmV4cG9ydCBjbGFzcyBTY2FuVXRpbGl0eVNlcnZpY2Uge1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBwYWdlRmxvdyA9IGluamVjdChQYWdlRmxvd1NlcnZpY2UpO1xyXG5cclxuICAgIHNjYW5uZXJzKHNpZ25hbD86IEFib3J0U2lnbmFsKTogUHJvbWlzZTxQYWdlRmxvd0RldmljZVtdPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGFnZUZsb3cuY2xpZW50LnNjYW5uZXJzKHNpZ25hbCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2NhblBhZ2Uoc2Nhbm5lcklkOiBzdHJpbmcsIG9wdGlvbnM6IFNjYW5VdGlsaXR5T3B0aW9ucyA9IHt9LCBzaWduYWw/OiBBYm9ydFNpZ25hbCk6IFByb21pc2U8UGFnZUZsb3dTY2FuUmVzdWx0PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGFnZUZsb3cuY2xpZW50LnNjYW4oeyBzY2FubmVyX2lkOiBzY2FubmVySWQsIC4uLm9wdGlvbnMgfSwgc2lnbmFsKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogT3BlbnMgYSBtdWx0aS1wYWdlIGRvY3VtZW50LiBDYWxsIGBhZGRQYWdlYCBvbiBpdCBmb3IgZWFjaCBwYWdlLCB0aGVuIGBmaW5pc2hgLiAqL1xyXG4gICAgYXN5bmMgc3RhcnREb2N1bWVudChcclxuICAgICAgICBzY2FubmVySWQ6IHN0cmluZyxcclxuICAgICAgICBvcHRpb25zOiBTY2FuVXRpbGl0eU9wdGlvbnMgPSB7fSxcclxuICAgICAgICBzaWduYWw/OiBBYm9ydFNpZ25hbCxcclxuICAgICk6IFByb21pc2U8U2NhbkRvY3VtZW50PiB7XHJcbiAgICAgICAgY29uc3QgY2xpZW50ID0gdGhpcy5wYWdlRmxvdy5jbGllbnQ7XHJcbiAgICAgICAgY29uc3Qgc2Vzc2lvbklkID0gYXdhaXQgY2xpZW50LnN0YXJ0U2NhblNlc3Npb24oc2lnbmFsKTtcclxuICAgICAgICByZXR1cm4gbmV3IFNjYW5Eb2N1bWVudChjbGllbnQsIHNlc3Npb25JZCwgc2Nhbm5lcklkLCBvcHRpb25zKTtcclxuICAgIH1cclxufVxyXG4iXX0=