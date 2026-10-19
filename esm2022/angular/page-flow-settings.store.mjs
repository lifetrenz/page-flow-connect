import { Injectable } from '@angular/core';
import { DEFAULT_PAGE_FLOW_SETTINGS, parsePageFlowSettings, serializePageFlowSettings, } from '../sdk';
import * as i0 from "@angular/core";
const STORAGE_KEY = 'PAGE_FLOW_AGENT_SETTINGS';
/**
 * Keeps the Page Flow port and pairing token in this browser's localStorage. The SDK does the
 * parsing and validation; this class only reads and writes the stored text.
 */
export class PageFlowSettingsStore {
    get() {
        try {
            return parsePageFlowSettings(localStorage.getItem(STORAGE_KEY));
        }
        catch {
            return { ...DEFAULT_PAGE_FLOW_SETTINGS };
        }
    }
    /** Throws a RangeError for a port out of range, or the browser's error if storage refuses. */
    save(settings) {
        localStorage.setItem(STORAGE_KEY, serializePageFlowSettings(settings));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: PageFlowSettingsStore, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: PageFlowSettingsStore, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: PageFlowSettingsStore, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZS1mbG93LXNldHRpbmdzLnN0b3JlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvcGFnZS1mbG93L3NyYy9hbmd1bGFyL3BhZ2UtZmxvdy1zZXR0aW5ncy5zdG9yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFDSCwwQkFBMEIsRUFFMUIscUJBQXFCLEVBQ3JCLHlCQUF5QixHQUM1QixNQUFNLFFBQVEsQ0FBQzs7QUFFaEIsTUFBTSxXQUFXLEdBQUcsMEJBQTBCLENBQUM7QUFFL0M7OztHQUdHO0FBRUgsTUFBTSxPQUFPLHFCQUFxQjtJQUM5QixHQUFHO1FBQ0MsSUFBSSxDQUFDO1lBQ0QsT0FBTyxxQkFBcUIsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDcEUsQ0FBQztRQUFDLE1BQU0sQ0FBQztZQUNMLE9BQU8sRUFBRSxHQUFHLDBCQUEwQixFQUFFLENBQUM7UUFDN0MsQ0FBQztJQUNMLENBQUM7SUFFRCw4RkFBOEY7SUFDOUYsSUFBSSxDQUFDLFFBQTBCO1FBQzNCLFlBQVksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLHlCQUF5QixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDM0UsQ0FBQzsrR0FaUSxxQkFBcUI7bUhBQXJCLHFCQUFxQixjQURSLE1BQU07OzRGQUNuQixxQkFBcUI7a0JBRGpDLFVBQVU7bUJBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgICBERUZBVUxUX1BBR0VfRkxPV19TRVRUSU5HUyxcbiAgICBQYWdlRmxvd1NldHRpbmdzLFxuICAgIHBhcnNlUGFnZUZsb3dTZXR0aW5ncyxcbiAgICBzZXJpYWxpemVQYWdlRmxvd1NldHRpbmdzLFxufSBmcm9tICcuLi9zZGsnO1xuXG5jb25zdCBTVE9SQUdFX0tFWSA9ICdQQUdFX0ZMT1dfQUdFTlRfU0VUVElOR1MnO1xuXG4vKipcbiAqIEtlZXBzIHRoZSBQYWdlIEZsb3cgcG9ydCBhbmQgcGFpcmluZyB0b2tlbiBpbiB0aGlzIGJyb3dzZXIncyBsb2NhbFN0b3JhZ2UuIFRoZSBTREsgZG9lcyB0aGVcbiAqIHBhcnNpbmcgYW5kIHZhbGlkYXRpb247IHRoaXMgY2xhc3Mgb25seSByZWFkcyBhbmQgd3JpdGVzIHRoZSBzdG9yZWQgdGV4dC5cbiAqL1xuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcbmV4cG9ydCBjbGFzcyBQYWdlRmxvd1NldHRpbmdzU3RvcmUge1xuICAgIGdldCgpOiBQYWdlRmxvd1NldHRpbmdzIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBwYXJzZVBhZ2VGbG93U2V0dGluZ3MobG9jYWxTdG9yYWdlLmdldEl0ZW0oU1RPUkFHRV9LRVkpKTtcbiAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgICByZXR1cm4geyAuLi5ERUZBVUxUX1BBR0VfRkxPV19TRVRUSU5HUyB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqIFRocm93cyBhIFJhbmdlRXJyb3IgZm9yIGEgcG9ydCBvdXQgb2YgcmFuZ2UsIG9yIHRoZSBicm93c2VyJ3MgZXJyb3IgaWYgc3RvcmFnZSByZWZ1c2VzLiAqL1xuICAgIHNhdmUoc2V0dGluZ3M6IFBhZ2VGbG93U2V0dGluZ3MpOiB2b2lkIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oU1RPUkFHRV9LRVksIHNlcmlhbGl6ZVBhZ2VGbG93U2V0dGluZ3Moc2V0dGluZ3MpKTtcbiAgICB9XG59XG4iXX0=