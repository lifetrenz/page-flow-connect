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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZS1mbG93LXNldHRpbmdzLnN0b3JlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FuZ3VsYXIvcGFnZS1mbG93LXNldHRpbmdzLnN0b3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUNILDBCQUEwQixFQUUxQixxQkFBcUIsRUFDckIseUJBQXlCLEdBQzVCLE1BQU0sUUFBUSxDQUFDOztBQUVoQixNQUFNLFdBQVcsR0FBRywwQkFBMEIsQ0FBQztBQUUvQzs7O0dBR0c7QUFFSCxNQUFNLE9BQU8scUJBQXFCO0lBQzlCLEdBQUc7UUFDQyxJQUFJLENBQUM7WUFDRCxPQUFPLHFCQUFxQixDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUNwRSxDQUFDO1FBQUMsTUFBTSxDQUFDO1lBQ0wsT0FBTyxFQUFFLEdBQUcsMEJBQTBCLEVBQUUsQ0FBQztRQUM3QyxDQUFDO0lBQ0wsQ0FBQztJQUVELDhGQUE4RjtJQUM5RixJQUFJLENBQUMsUUFBMEI7UUFDM0IsWUFBWSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUseUJBQXlCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUMzRSxDQUFDOytHQVpRLHFCQUFxQjttSEFBckIscUJBQXFCLGNBRFIsTUFBTTs7NEZBQ25CLHFCQUFxQjtrQkFEakMsVUFBVTttQkFBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7XHJcbiAgICBERUZBVUxUX1BBR0VfRkxPV19TRVRUSU5HUyxcclxuICAgIFBhZ2VGbG93U2V0dGluZ3MsXHJcbiAgICBwYXJzZVBhZ2VGbG93U2V0dGluZ3MsXHJcbiAgICBzZXJpYWxpemVQYWdlRmxvd1NldHRpbmdzLFxyXG59IGZyb20gJy4uL3Nkayc7XHJcblxyXG5jb25zdCBTVE9SQUdFX0tFWSA9ICdQQUdFX0ZMT1dfQUdFTlRfU0VUVElOR1MnO1xyXG5cclxuLyoqXHJcbiAqIEtlZXBzIHRoZSBQYWdlIEZsb3cgcG9ydCBhbmQgcGFpcmluZyB0b2tlbiBpbiB0aGlzIGJyb3dzZXIncyBsb2NhbFN0b3JhZ2UuIFRoZSBTREsgZG9lcyB0aGVcclxuICogcGFyc2luZyBhbmQgdmFsaWRhdGlvbjsgdGhpcyBjbGFzcyBvbmx5IHJlYWRzIGFuZCB3cml0ZXMgdGhlIHN0b3JlZCB0ZXh0LlxyXG4gKi9cclxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcclxuZXhwb3J0IGNsYXNzIFBhZ2VGbG93U2V0dGluZ3NTdG9yZSB7XHJcbiAgICBnZXQoKTogUGFnZUZsb3dTZXR0aW5ncyB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlUGFnZUZsb3dTZXR0aW5ncyhsb2NhbFN0b3JhZ2UuZ2V0SXRlbShTVE9SQUdFX0tFWSkpO1xyXG4gICAgICAgIH0gY2F0Y2gge1xyXG4gICAgICAgICAgICByZXR1cm4geyAuLi5ERUZBVUxUX1BBR0VfRkxPV19TRVRUSU5HUyB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiogVGhyb3dzIGEgUmFuZ2VFcnJvciBmb3IgYSBwb3J0IG91dCBvZiByYW5nZSwgb3IgdGhlIGJyb3dzZXIncyBlcnJvciBpZiBzdG9yYWdlIHJlZnVzZXMuICovXHJcbiAgICBzYXZlKHNldHRpbmdzOiBQYWdlRmxvd1NldHRpbmdzKTogdm9pZCB7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oU1RPUkFHRV9LRVksIHNlcmlhbGl6ZVBhZ2VGbG93U2V0dGluZ3Moc2V0dGluZ3MpKTtcclxuICAgIH1cclxufVxyXG4iXX0=