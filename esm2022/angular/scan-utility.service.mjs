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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nhbi11dGlsaXR5LnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wYWdlLWZsb3cvc3JjL2FuZ3VsYXIvc2Nhbi11dGlsaXR5LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFPbkQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHFCQUFxQixDQUFDOztBQUt0RDs7O0dBR0c7QUFDSCxNQUFNLE9BQU8sWUFBWTtJQUdyQixZQUNxQixNQUFzQixFQUM5QixTQUFpQixFQUNULFNBQWlCLEVBQ2pCLE9BQTJCO1FBSDNCLFdBQU0sR0FBTixNQUFNLENBQWdCO1FBQzlCLGNBQVMsR0FBVCxTQUFTLENBQVE7UUFDVCxjQUFTLEdBQVQsU0FBUyxDQUFRO1FBQ2pCLFlBQU8sR0FBUCxPQUFPLENBQW9CO1FBTnhDLGNBQVMsR0FBRyxDQUFDLENBQUM7SUFPbkIsQ0FBQztJQUVKLCtDQUErQztJQUMvQyxJQUFJLEtBQUs7UUFDTCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDMUIsQ0FBQztJQUVELGdGQUFnRjtJQUNoRixLQUFLLENBQUMsT0FBTyxDQUFDLE1BQW9CO1FBQzlCLElBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FDMUMsSUFBSSxDQUFDLFNBQVMsRUFDZCxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUMvQyxNQUFNLENBQ1QsQ0FBQztRQUNGLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUMxQixDQUFDO0lBRUQsNEdBQTRHO0lBQzVHLE1BQU0sQ0FBQyxNQUFvQjtRQUN2QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBRUQsTUFBTSxDQUFDLE1BQW9CO1FBQ3ZCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2pFLENBQUM7Q0FDSjtBQUVEOzs7R0FHRztBQUVILE1BQU0sT0FBTyxrQkFBa0I7SUFEL0I7UUFFcUIsYUFBUSxHQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQztLQW9CdkQ7SUFsQkcsUUFBUSxDQUFDLE1BQW9CO1FBQ3pCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFRCxRQUFRLENBQUMsU0FBaUIsRUFBRSxVQUE4QixFQUFFLEVBQUUsTUFBb0I7UUFDOUUsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLEdBQUcsT0FBTyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDcEYsQ0FBQztJQUVELHNGQUFzRjtJQUN0RixLQUFLLENBQUMsYUFBYSxDQUNmLFNBQWlCLEVBQ2pCLFVBQThCLEVBQUUsRUFDaEMsTUFBb0I7UUFFcEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFDcEMsTUFBTSxTQUFTLEdBQUcsTUFBTSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEQsT0FBTyxJQUFJLFlBQVksQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNuRSxDQUFDOytHQXBCUSxrQkFBa0I7bUhBQWxCLGtCQUFrQixjQURMLE1BQU07OzRGQUNuQixrQkFBa0I7a0JBRDlCLFVBQVU7bUJBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgaW5qZWN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7XHJcbiAgICBQYWdlRmxvd0NsaWVudCxcclxuICAgIFBhZ2VGbG93RGV2aWNlLFxyXG4gICAgUGFnZUZsb3dTY2FuT3B0aW9ucyxcclxuICAgIFBhZ2VGbG93U2NhblJlc3VsdCxcclxufSBmcm9tICcuLi9zZGsnO1xyXG5pbXBvcnQgeyBQYWdlRmxvd1NlcnZpY2UgfSBmcm9tICcuL3BhZ2UtZmxvdy5zZXJ2aWNlJztcclxuXHJcbi8qKiBTY2FuIHNldHRpbmdzIGNob3NlbiBieSB0aGUgdXNlci4gVGhlIHNjYW5uZXIgaXMgcGFzc2VkIHNlcGFyYXRlbHkuICovXHJcbmV4cG9ydCB0eXBlIFNjYW5VdGlsaXR5T3B0aW9ucyA9IE9taXQ8UGFnZUZsb3dTY2FuT3B0aW9ucywgJ3NjYW5uZXJfaWQnPjtcclxuXHJcbi8qKlxyXG4gKiBPbmUgbXVsdGktcGFnZSBkb2N1bWVudCBiZWluZyBzY2FubmVkIGludG8gYW4gYWdlbnQgc2Vzc2lvbi4gUGFnZXMgYXJlIGFkZGVkIG9uZSBhdCBhIHRpbWUsXHJcbiAqIHRoZW4gdGhlIHNlc3Npb24gaXMgZmluaXNoZWQgaW50byBhIHNpbmdsZSBQREYuIENhbmNlbCBpdCB0byBkcm9wIHRoZSBwYWdlcy5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBTY2FuRG9jdW1lbnQge1xyXG4gICAgcHJpdmF0ZSBwYWdlQ291bnQgPSAwO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgY2xpZW50OiBQYWdlRmxvd0NsaWVudCxcclxuICAgICAgICByZWFkb25seSBzZXNzaW9uSWQ6IHN0cmluZyxcclxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IHNjYW5uZXJJZDogc3RyaW5nLFxyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgb3B0aW9uczogU2NhblV0aWxpdHlPcHRpb25zLFxyXG4gICAgKSB7fVxyXG5cclxuICAgIC8qKiBQYWdlcyBzY2FubmVkIGludG8gdGhpcyBkb2N1bWVudCBzbyBmYXIuICovXHJcbiAgICBnZXQgcGFnZXMoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wYWdlQ291bnQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIFNjYW5zIG9uZSBtb3JlIHBhZ2UuIFJlc29sdmVzIHRvIHRoZSBudW1iZXIgb2YgcGFnZXMgbm93IGluIHRoZSBkb2N1bWVudC4gKi9cclxuICAgIGFzeW5jIGFkZFBhZ2Uoc2lnbmFsPzogQWJvcnRTaWduYWwpOiBQcm9taXNlPG51bWJlcj4ge1xyXG4gICAgICAgIHRoaXMucGFnZUNvdW50ID0gYXdhaXQgdGhpcy5jbGllbnQuYWRkU2NhblBhZ2UoXHJcbiAgICAgICAgICAgIHRoaXMuc2Vzc2lvbklkLFxyXG4gICAgICAgICAgICB7IHNjYW5uZXJfaWQ6IHRoaXMuc2Nhbm5lcklkLCAuLi50aGlzLm9wdGlvbnMgfSxcclxuICAgICAgICAgICAgc2lnbmFsLFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGFnZUNvdW50O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBCdWlsZHMgdGhlIFBERi4gSWYgdGhpcyBmYWlscywgdGhlIGRvY3VtZW50IHN0YXlzIG9wZW4gc28gYSBwYWdlIGNhbiBiZSBhZGRlZCBvciBpdCBjYW4gYmUgY2FuY2VsbGVkLiAqL1xyXG4gICAgZmluaXNoKHNpZ25hbD86IEFib3J0U2lnbmFsKTogUHJvbWlzZTxCbG9iPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xpZW50LmZpbmlzaFNjYW5TZXNzaW9uKHRoaXMuc2Vzc2lvbklkLCBzaWduYWwpO1xyXG4gICAgfVxyXG5cclxuICAgIGNhbmNlbChzaWduYWw/OiBBYm9ydFNpZ25hbCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsaWVudC5jYW5jZWxTY2FuU2Vzc2lvbih0aGlzLnNlc3Npb25JZCwgc2lnbmFsKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFNjYW5uaW5nIGZvciBXQVBQIHNjcmVlbnM6IGxpc3Qgc2Nhbm5lcnMsIHNjYW4gb25lIHBhZ2UsIG9yIHNjYW4gYSBtdWx0aS1wYWdlIGRvY3VtZW50LlxyXG4gKiBOb3RoaW5nIGlzIHJldHJpZWQuIEEgZmFpbGVkIHNjYW4gaXMgcmV0dXJuZWQgdG8gdGhlIGNhbGxlciBhcyBhIFBhZ2VGbG93RXJyb3IuXHJcbiAqL1xyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxyXG5leHBvcnQgY2xhc3MgU2NhblV0aWxpdHlTZXJ2aWNlIHtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgcGFnZUZsb3cgPSBpbmplY3QoUGFnZUZsb3dTZXJ2aWNlKTtcclxuXHJcbiAgICBzY2FubmVycyhzaWduYWw/OiBBYm9ydFNpZ25hbCk6IFByb21pc2U8UGFnZUZsb3dEZXZpY2VbXT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBhZ2VGbG93LmNsaWVudC5zY2FubmVycyhzaWduYWwpO1xyXG4gICAgfVxyXG5cclxuICAgIHNjYW5QYWdlKHNjYW5uZXJJZDogc3RyaW5nLCBvcHRpb25zOiBTY2FuVXRpbGl0eU9wdGlvbnMgPSB7fSwgc2lnbmFsPzogQWJvcnRTaWduYWwpOiBQcm9taXNlPFBhZ2VGbG93U2NhblJlc3VsdD4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBhZ2VGbG93LmNsaWVudC5zY2FuKHsgc2Nhbm5lcl9pZDogc2Nhbm5lcklkLCAuLi5vcHRpb25zIH0sIHNpZ25hbCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIE9wZW5zIGEgbXVsdGktcGFnZSBkb2N1bWVudC4gQ2FsbCBgYWRkUGFnZWAgb24gaXQgZm9yIGVhY2ggcGFnZSwgdGhlbiBgZmluaXNoYC4gKi9cclxuICAgIGFzeW5jIHN0YXJ0RG9jdW1lbnQoXHJcbiAgICAgICAgc2Nhbm5lcklkOiBzdHJpbmcsXHJcbiAgICAgICAgb3B0aW9uczogU2NhblV0aWxpdHlPcHRpb25zID0ge30sXHJcbiAgICAgICAgc2lnbmFsPzogQWJvcnRTaWduYWwsXHJcbiAgICApOiBQcm9taXNlPFNjYW5Eb2N1bWVudD4ge1xyXG4gICAgICAgIGNvbnN0IGNsaWVudCA9IHRoaXMucGFnZUZsb3cuY2xpZW50O1xyXG4gICAgICAgIGNvbnN0IHNlc3Npb25JZCA9IGF3YWl0IGNsaWVudC5zdGFydFNjYW5TZXNzaW9uKHNpZ25hbCk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBTY2FuRG9jdW1lbnQoY2xpZW50LCBzZXNzaW9uSWQsIHNjYW5uZXJJZCwgb3B0aW9ucyk7XHJcbiAgICB9XHJcbn1cclxuIl19