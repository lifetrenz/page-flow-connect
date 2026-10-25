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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZS1mbG93LnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYW5ndWxhci9wYWdlLWZsb3cuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbkUsT0FBTyxFQUFFLGNBQWMsRUFBaUIsTUFBTSxRQUFRLENBQUM7QUFDdkQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7O0FBRW5FLCtGQUErRjtBQUMvRixNQUFNLENBQUMsTUFBTSxlQUFlLEdBQUcsSUFBSSxjQUFjLENBQWdCLGlCQUFpQixFQUFFO0lBQ2hGLFVBQVUsRUFBRSxNQUFNO0lBQ2xCLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDO0NBQ2pELENBQUMsQ0FBQztBQUVIOzs7R0FHRztBQUVILE1BQU0sT0FBTyxlQUFlO0lBRDVCO1FBRXFCLGFBQVEsR0FBRyxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUVqRCxXQUFNLEdBQUcsSUFBSSxjQUFjLENBQUM7WUFDakMsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFO1lBQ25DLEtBQUssRUFBRSxNQUFNLENBQUMsZUFBZSxDQUFDO1NBQ2pDLENBQUMsQ0FBQztLQUNOOytHQVBZLGVBQWU7bUhBQWYsZUFBZSxjQURGLE1BQU07OzRGQUNuQixlQUFlO2tCQUQzQixVQUFVO21CQUFDLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIEluamVjdGlvblRva2VuLCBpbmplY3QgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUGFnZUZsb3dDbGllbnQsIFBhZ2VGbG93RmV0Y2ggfSBmcm9tICcuLi9zZGsnO1xyXG5pbXBvcnQgeyBQYWdlRmxvd1NldHRpbmdzU3RvcmUgfSBmcm9tICcuL3BhZ2UtZmxvdy1zZXR0aW5ncy5zdG9yZSc7XHJcblxyXG4vKiogVGhlIHRyYW5zcG9ydCB0aGUgU0RLIHNlbmRzIHRocm91Z2guIFRoZSBhcHAgdXNlcyB0aGUgYnJvd3NlcidzIGZldGNoOyB0ZXN0cyByZXBsYWNlIGl0LiAqL1xyXG5leHBvcnQgY29uc3QgUEFHRV9GTE9XX0ZFVENIID0gbmV3IEluamVjdGlvblRva2VuPFBhZ2VGbG93RmV0Y2g+KCdQQUdFX0ZMT1dfRkVUQ0gnLCB7XHJcbiAgICBwcm92aWRlZEluOiAncm9vdCcsXHJcbiAgICBmYWN0b3J5OiAoKSA9PiAodXJsLCBpbml0KSA9PiBmZXRjaCh1cmwsIGluaXQpLFxyXG59KTtcclxuXHJcbi8qKlxyXG4gKiBUaGUgb25lIFBhZ2UgRmxvdyBjbGllbnQgdGhlIGFwcCB1c2VzLiBJdHMgc2V0dGluZ3MgYXJlIHJlYWQgb24gZXZlcnkgY2FsbCwgc28gYSBwb3J0IG9yIHRva2VuXHJcbiAqIHNhdmVkIGluIEFnZW50IFNldHRpbmdzIGFwcGxpZXMgdG8gdGhlIG5leHQgY2FsbCB3aXRob3V0IGEgcmVsb2FkLlxyXG4gKi9cclxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcclxuZXhwb3J0IGNsYXNzIFBhZ2VGbG93U2VydmljZSB7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHNldHRpbmdzID0gaW5qZWN0KFBhZ2VGbG93U2V0dGluZ3NTdG9yZSk7XHJcblxyXG4gICAgcmVhZG9ubHkgY2xpZW50ID0gbmV3IFBhZ2VGbG93Q2xpZW50KHtcclxuICAgICAgICBzZXR0aW5nczogKCkgPT4gdGhpcy5zZXR0aW5ncy5nZXQoKSxcclxuICAgICAgICBmZXRjaDogaW5qZWN0KFBBR0VfRkxPV19GRVRDSCksXHJcbiAgICB9KTtcclxufVxyXG4iXX0=