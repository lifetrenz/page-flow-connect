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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nhbi11dGlsaXR5LnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wYWdlLWZsb3cvc3JjL2FuZ3VsYXIvc2Nhbi11dGlsaXR5LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFPbkQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHFCQUFxQixDQUFDOztBQUt0RDs7O0dBR0c7QUFDSCxNQUFNLE9BQU8sWUFBWTtJQUdyQixZQUNxQixNQUFzQixFQUM5QixTQUFpQixFQUNULFNBQWlCLEVBQ2pCLE9BQTJCO1FBSDNCLFdBQU0sR0FBTixNQUFNLENBQWdCO1FBQzlCLGNBQVMsR0FBVCxTQUFTLENBQVE7UUFDVCxjQUFTLEdBQVQsU0FBUyxDQUFRO1FBQ2pCLFlBQU8sR0FBUCxPQUFPLENBQW9CO1FBTnhDLGNBQVMsR0FBRyxDQUFDLENBQUM7SUFPbkIsQ0FBQztJQUVKLCtDQUErQztJQUMvQyxJQUFJLEtBQUs7UUFDTCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDMUIsQ0FBQztJQUVELGdGQUFnRjtJQUNoRixLQUFLLENBQUMsT0FBTyxDQUFDLE1BQW9CO1FBQzlCLElBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FDMUMsSUFBSSxDQUFDLFNBQVMsRUFDZCxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUMvQyxNQUFNLENBQ1QsQ0FBQztRQUNGLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUMxQixDQUFDO0lBRUQsNEdBQTRHO0lBQzVHLE1BQU0sQ0FBQyxNQUFvQjtRQUN2QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBRUQsTUFBTSxDQUFDLE1BQW9CO1FBQ3ZCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2pFLENBQUM7Q0FDSjtBQUVEOzs7R0FHRztBQUVILE1BQU0sT0FBTyxrQkFBa0I7SUFEL0I7UUFFcUIsYUFBUSxHQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQztLQW9CdkQ7SUFsQkcsUUFBUSxDQUFDLE1BQW9CO1FBQ3pCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFRCxRQUFRLENBQUMsU0FBaUIsRUFBRSxVQUE4QixFQUFFLEVBQUUsTUFBb0I7UUFDOUUsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLEdBQUcsT0FBTyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDcEYsQ0FBQztJQUVELHNGQUFzRjtJQUN0RixLQUFLLENBQUMsYUFBYSxDQUNmLFNBQWlCLEVBQ2pCLFVBQThCLEVBQUUsRUFDaEMsTUFBb0I7UUFFcEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFDcEMsTUFBTSxTQUFTLEdBQUcsTUFBTSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEQsT0FBTyxJQUFJLFlBQVksQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNuRSxDQUFDOytHQXBCUSxrQkFBa0I7bUhBQWxCLGtCQUFrQixjQURMLE1BQU07OzRGQUNuQixrQkFBa0I7a0JBRDlCLFVBQVU7bUJBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgaW5qZWN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICAgIFBhZ2VGbG93Q2xpZW50LFxuICAgIFBhZ2VGbG93RGV2aWNlLFxuICAgIFBhZ2VGbG93U2Nhbk9wdGlvbnMsXG4gICAgUGFnZUZsb3dTY2FuUmVzdWx0LFxufSBmcm9tICcuLi9zZGsnO1xuaW1wb3J0IHsgUGFnZUZsb3dTZXJ2aWNlIH0gZnJvbSAnLi9wYWdlLWZsb3cuc2VydmljZSc7XG5cbi8qKiBTY2FuIHNldHRpbmdzIGNob3NlbiBieSB0aGUgdXNlci4gVGhlIHNjYW5uZXIgaXMgcGFzc2VkIHNlcGFyYXRlbHkuICovXG5leHBvcnQgdHlwZSBTY2FuVXRpbGl0eU9wdGlvbnMgPSBPbWl0PFBhZ2VGbG93U2Nhbk9wdGlvbnMsICdzY2FubmVyX2lkJz47XG5cbi8qKlxuICogT25lIG11bHRpLXBhZ2UgZG9jdW1lbnQgYmVpbmcgc2Nhbm5lZCBpbnRvIGFuIGFnZW50IHNlc3Npb24uIFBhZ2VzIGFyZSBhZGRlZCBvbmUgYXQgYSB0aW1lLFxuICogdGhlbiB0aGUgc2Vzc2lvbiBpcyBmaW5pc2hlZCBpbnRvIGEgc2luZ2xlIFBERi4gQ2FuY2VsIGl0IHRvIGRyb3AgdGhlIHBhZ2VzLlxuICovXG5leHBvcnQgY2xhc3MgU2NhbkRvY3VtZW50IHtcbiAgICBwcml2YXRlIHBhZ2VDb3VudCA9IDA7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBjbGllbnQ6IFBhZ2VGbG93Q2xpZW50LFxuICAgICAgICByZWFkb25seSBzZXNzaW9uSWQ6IHN0cmluZyxcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBzY2FubmVySWQ6IHN0cmluZyxcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBvcHRpb25zOiBTY2FuVXRpbGl0eU9wdGlvbnMsXG4gICAgKSB7fVxuXG4gICAgLyoqIFBhZ2VzIHNjYW5uZWQgaW50byB0aGlzIGRvY3VtZW50IHNvIGZhci4gKi9cbiAgICBnZXQgcGFnZXMoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFnZUNvdW50O1xuICAgIH1cblxuICAgIC8qKiBTY2FucyBvbmUgbW9yZSBwYWdlLiBSZXNvbHZlcyB0byB0aGUgbnVtYmVyIG9mIHBhZ2VzIG5vdyBpbiB0aGUgZG9jdW1lbnQuICovXG4gICAgYXN5bmMgYWRkUGFnZShzaWduYWw/OiBBYm9ydFNpZ25hbCk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIHRoaXMucGFnZUNvdW50ID0gYXdhaXQgdGhpcy5jbGllbnQuYWRkU2NhblBhZ2UoXG4gICAgICAgICAgICB0aGlzLnNlc3Npb25JZCxcbiAgICAgICAgICAgIHsgc2Nhbm5lcl9pZDogdGhpcy5zY2FubmVySWQsIC4uLnRoaXMub3B0aW9ucyB9LFxuICAgICAgICAgICAgc2lnbmFsLFxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gdGhpcy5wYWdlQ291bnQ7XG4gICAgfVxuXG4gICAgLyoqIEJ1aWxkcyB0aGUgUERGLiBJZiB0aGlzIGZhaWxzLCB0aGUgZG9jdW1lbnQgc3RheXMgb3BlbiBzbyBhIHBhZ2UgY2FuIGJlIGFkZGVkIG9yIGl0IGNhbiBiZSBjYW5jZWxsZWQuICovXG4gICAgZmluaXNoKHNpZ25hbD86IEFib3J0U2lnbmFsKTogUHJvbWlzZTxCbG9iPiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsaWVudC5maW5pc2hTY2FuU2Vzc2lvbih0aGlzLnNlc3Npb25JZCwgc2lnbmFsKTtcbiAgICB9XG5cbiAgICBjYW5jZWwoc2lnbmFsPzogQWJvcnRTaWduYWwpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xpZW50LmNhbmNlbFNjYW5TZXNzaW9uKHRoaXMuc2Vzc2lvbklkLCBzaWduYWwpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBTY2FubmluZyBmb3IgV0FQUCBzY3JlZW5zOiBsaXN0IHNjYW5uZXJzLCBzY2FuIG9uZSBwYWdlLCBvciBzY2FuIGEgbXVsdGktcGFnZSBkb2N1bWVudC5cbiAqIE5vdGhpbmcgaXMgcmV0cmllZC4gQSBmYWlsZWQgc2NhbiBpcyByZXR1cm5lZCB0byB0aGUgY2FsbGVyIGFzIGEgUGFnZUZsb3dFcnJvci5cbiAqL1xuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcbmV4cG9ydCBjbGFzcyBTY2FuVXRpbGl0eVNlcnZpY2Uge1xuICAgIHByaXZhdGUgcmVhZG9ubHkgcGFnZUZsb3cgPSBpbmplY3QoUGFnZUZsb3dTZXJ2aWNlKTtcblxuICAgIHNjYW5uZXJzKHNpZ25hbD86IEFib3J0U2lnbmFsKTogUHJvbWlzZTxQYWdlRmxvd0RldmljZVtdPiB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhZ2VGbG93LmNsaWVudC5zY2FubmVycyhzaWduYWwpO1xuICAgIH1cblxuICAgIHNjYW5QYWdlKHNjYW5uZXJJZDogc3RyaW5nLCBvcHRpb25zOiBTY2FuVXRpbGl0eU9wdGlvbnMgPSB7fSwgc2lnbmFsPzogQWJvcnRTaWduYWwpOiBQcm9taXNlPFBhZ2VGbG93U2NhblJlc3VsdD4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wYWdlRmxvdy5jbGllbnQuc2Nhbih7IHNjYW5uZXJfaWQ6IHNjYW5uZXJJZCwgLi4ub3B0aW9ucyB9LCBzaWduYWwpO1xuICAgIH1cblxuICAgIC8qKiBPcGVucyBhIG11bHRpLXBhZ2UgZG9jdW1lbnQuIENhbGwgYGFkZFBhZ2VgIG9uIGl0IGZvciBlYWNoIHBhZ2UsIHRoZW4gYGZpbmlzaGAuICovXG4gICAgYXN5bmMgc3RhcnREb2N1bWVudChcbiAgICAgICAgc2Nhbm5lcklkOiBzdHJpbmcsXG4gICAgICAgIG9wdGlvbnM6IFNjYW5VdGlsaXR5T3B0aW9ucyA9IHt9LFxuICAgICAgICBzaWduYWw/OiBBYm9ydFNpZ25hbCxcbiAgICApOiBQcm9taXNlPFNjYW5Eb2N1bWVudD4ge1xuICAgICAgICBjb25zdCBjbGllbnQgPSB0aGlzLnBhZ2VGbG93LmNsaWVudDtcbiAgICAgICAgY29uc3Qgc2Vzc2lvbklkID0gYXdhaXQgY2xpZW50LnN0YXJ0U2NhblNlc3Npb24oc2lnbmFsKTtcbiAgICAgICAgcmV0dXJuIG5ldyBTY2FuRG9jdW1lbnQoY2xpZW50LCBzZXNzaW9uSWQsIHNjYW5uZXJJZCwgb3B0aW9ucyk7XG4gICAgfVxufVxuIl19