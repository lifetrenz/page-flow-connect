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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZS1mbG93LnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wYWdlLWZsb3cvc3JjL2FuZ3VsYXIvcGFnZS1mbG93LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ25FLE9BQU8sRUFBRSxjQUFjLEVBQWlCLE1BQU0sUUFBUSxDQUFDO0FBQ3ZELE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDRCQUE0QixDQUFDOztBQUVuRSwrRkFBK0Y7QUFDL0YsTUFBTSxDQUFDLE1BQU0sZUFBZSxHQUFHLElBQUksY0FBYyxDQUFnQixpQkFBaUIsRUFBRTtJQUNoRixVQUFVLEVBQUUsTUFBTTtJQUNsQixPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQztDQUNqRCxDQUFDLENBQUM7QUFFSDs7O0dBR0c7QUFFSCxNQUFNLE9BQU8sZUFBZTtJQUQ1QjtRQUVxQixhQUFRLEdBQUcsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFFakQsV0FBTSxHQUFHLElBQUksY0FBYyxDQUFDO1lBQ2pDLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRTtZQUNuQyxLQUFLLEVBQUUsTUFBTSxDQUFDLGVBQWUsQ0FBQztTQUNqQyxDQUFDLENBQUM7S0FDTjsrR0FQWSxlQUFlO21IQUFmLGVBQWUsY0FERixNQUFNOzs0RkFDbkIsZUFBZTtrQkFEM0IsVUFBVTttQkFBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3Rpb25Ub2tlbiwgaW5qZWN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBQYWdlRmxvd0NsaWVudCwgUGFnZUZsb3dGZXRjaCB9IGZyb20gJy4uL3Nkayc7XG5pbXBvcnQgeyBQYWdlRmxvd1NldHRpbmdzU3RvcmUgfSBmcm9tICcuL3BhZ2UtZmxvdy1zZXR0aW5ncy5zdG9yZSc7XG5cbi8qKiBUaGUgdHJhbnNwb3J0IHRoZSBTREsgc2VuZHMgdGhyb3VnaC4gVGhlIGFwcCB1c2VzIHRoZSBicm93c2VyJ3MgZmV0Y2g7IHRlc3RzIHJlcGxhY2UgaXQuICovXG5leHBvcnQgY29uc3QgUEFHRV9GTE9XX0ZFVENIID0gbmV3IEluamVjdGlvblRva2VuPFBhZ2VGbG93RmV0Y2g+KCdQQUdFX0ZMT1dfRkVUQ0gnLCB7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxuICAgIGZhY3Rvcnk6ICgpID0+ICh1cmwsIGluaXQpID0+IGZldGNoKHVybCwgaW5pdCksXG59KTtcblxuLyoqXG4gKiBUaGUgb25lIFBhZ2UgRmxvdyBjbGllbnQgdGhlIGFwcCB1c2VzLiBJdHMgc2V0dGluZ3MgYXJlIHJlYWQgb24gZXZlcnkgY2FsbCwgc28gYSBwb3J0IG9yIHRva2VuXG4gKiBzYXZlZCBpbiBBZ2VudCBTZXR0aW5ncyBhcHBsaWVzIHRvIHRoZSBuZXh0IGNhbGwgd2l0aG91dCBhIHJlbG9hZC5cbiAqL1xuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcbmV4cG9ydCBjbGFzcyBQYWdlRmxvd1NlcnZpY2Uge1xuICAgIHByaXZhdGUgcmVhZG9ubHkgc2V0dGluZ3MgPSBpbmplY3QoUGFnZUZsb3dTZXR0aW5nc1N0b3JlKTtcblxuICAgIHJlYWRvbmx5IGNsaWVudCA9IG5ldyBQYWdlRmxvd0NsaWVudCh7XG4gICAgICAgIHNldHRpbmdzOiAoKSA9PiB0aGlzLnNldHRpbmdzLmdldCgpLFxuICAgICAgICBmZXRjaDogaW5qZWN0KFBBR0VfRkxPV19GRVRDSCksXG4gICAgfSk7XG59XG4iXX0=