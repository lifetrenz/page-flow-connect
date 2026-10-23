import { Injectable, InjectionToken, inject } from '@angular/core';
import { PageFlowClient } from '../sdk';
import { PageFlowSettingsStore } from './page-flow-settings.store';
import * as i0 from "@angular/core";
/** The transport the SDK sends through. The app uses the browser's fetch; tests replace it. */
export const PAGE_FLOW_FETCH = new InjectionToken('PAGE_FLOW_FETCH', {
    providedIn: 'root',
    factory: () => (url, init) => fetch(url, init),
});
/**
 * The one Page Flow client the app uses. Its settings are read on every call, so a port or token
 * saved in Agent Settings applies to the next call without a reload.
 */
export class PageFlowService {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZS1mbG93LnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wYWdlLWZsb3cvc3JjL2FuZ3VsYXIvcGFnZS1mbG93LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ25FLE9BQU8sRUFBRSxjQUFjLEVBQWlCLE1BQU0sUUFBUSxDQUFDO0FBQ3ZELE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDRCQUE0QixDQUFDOztBQUVuRSwrRkFBK0Y7QUFDL0YsTUFBTSxDQUFDLE1BQU0sZUFBZSxHQUFHLElBQUksY0FBYyxDQUFnQixpQkFBaUIsRUFBRTtJQUNoRixVQUFVLEVBQUUsTUFBTTtJQUNsQixPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQztDQUNqRCxDQUFDLENBQUM7QUFFSDs7O0dBR0c7QUFFSCxNQUFNLE9BQU8sZUFBZTtJQUQ1QjtRQUVxQixhQUFRLEdBQUcsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFFakQsV0FBTSxHQUFHLElBQUksY0FBYyxDQUFDO1lBQ2pDLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRTtZQUNuQyxLQUFLLEVBQUUsTUFBTSxDQUFDLGVBQWUsQ0FBQztTQUNqQyxDQUFDLENBQUM7S0FDTjsrR0FQWSxlQUFlO21IQUFmLGVBQWUsY0FERixNQUFNOzs0RkFDbkIsZUFBZTtrQkFEM0IsVUFBVTttQkFBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3Rpb25Ub2tlbiwgaW5qZWN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFBhZ2VGbG93Q2xpZW50LCBQYWdlRmxvd0ZldGNoIH0gZnJvbSAnLi4vc2RrJztcclxuaW1wb3J0IHsgUGFnZUZsb3dTZXR0aW5nc1N0b3JlIH0gZnJvbSAnLi9wYWdlLWZsb3ctc2V0dGluZ3Muc3RvcmUnO1xyXG5cclxuLyoqIFRoZSB0cmFuc3BvcnQgdGhlIFNESyBzZW5kcyB0aHJvdWdoLiBUaGUgYXBwIHVzZXMgdGhlIGJyb3dzZXIncyBmZXRjaDsgdGVzdHMgcmVwbGFjZSBpdC4gKi9cclxuZXhwb3J0IGNvbnN0IFBBR0VfRkxPV19GRVRDSCA9IG5ldyBJbmplY3Rpb25Ub2tlbjxQYWdlRmxvd0ZldGNoPignUEFHRV9GTE9XX0ZFVENIJywge1xyXG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxyXG4gICAgZmFjdG9yeTogKCkgPT4gKHVybCwgaW5pdCkgPT4gZmV0Y2godXJsLCBpbml0KSxcclxufSk7XHJcblxyXG4vKipcclxuICogVGhlIG9uZSBQYWdlIEZsb3cgY2xpZW50IHRoZSBhcHAgdXNlcy4gSXRzIHNldHRpbmdzIGFyZSByZWFkIG9uIGV2ZXJ5IGNhbGwsIHNvIGEgcG9ydCBvciB0b2tlblxyXG4gKiBzYXZlZCBpbiBBZ2VudCBTZXR0aW5ncyBhcHBsaWVzIHRvIHRoZSBuZXh0IGNhbGwgd2l0aG91dCBhIHJlbG9hZC5cclxuICovXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXHJcbmV4cG9ydCBjbGFzcyBQYWdlRmxvd1NlcnZpY2Uge1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBzZXR0aW5ncyA9IGluamVjdChQYWdlRmxvd1NldHRpbmdzU3RvcmUpO1xyXG5cclxuICAgIHJlYWRvbmx5IGNsaWVudCA9IG5ldyBQYWdlRmxvd0NsaWVudCh7XHJcbiAgICAgICAgc2V0dGluZ3M6ICgpID0+IHRoaXMuc2V0dGluZ3MuZ2V0KCksXHJcbiAgICAgICAgZmV0Y2g6IGluamVjdChQQUdFX0ZMT1dfRkVUQ0gpLFxyXG4gICAgfSk7XHJcbn1cclxuIl19