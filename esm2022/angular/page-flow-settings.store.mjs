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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZS1mbG93LXNldHRpbmdzLnN0b3JlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvcGFnZS1mbG93L3NyYy9hbmd1bGFyL3BhZ2UtZmxvdy1zZXR0aW5ncy5zdG9yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFDSCwwQkFBMEIsRUFFMUIscUJBQXFCLEVBQ3JCLHlCQUF5QixHQUM1QixNQUFNLFFBQVEsQ0FBQzs7QUFFaEIsTUFBTSxXQUFXLEdBQUcsMEJBQTBCLENBQUM7QUFFL0M7OztHQUdHO0FBRUgsTUFBTSxPQUFPLHFCQUFxQjtJQUM5QixHQUFHO1FBQ0MsSUFBSSxDQUFDO1lBQ0QsT0FBTyxxQkFBcUIsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDcEUsQ0FBQztRQUFDLE1BQU0sQ0FBQztZQUNMLE9BQU8sRUFBRSxHQUFHLDBCQUEwQixFQUFFLENBQUM7UUFDN0MsQ0FBQztJQUNMLENBQUM7SUFFRCw4RkFBOEY7SUFDOUYsSUFBSSxDQUFDLFFBQTBCO1FBQzNCLFlBQVksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLHlCQUF5QixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDM0UsQ0FBQzsrR0FaUSxxQkFBcUI7bUhBQXJCLHFCQUFxQixjQURSLE1BQU07OzRGQUNuQixxQkFBcUI7a0JBRGpDLFVBQVU7bUJBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge1xyXG4gICAgREVGQVVMVF9QQUdFX0ZMT1dfU0VUVElOR1MsXHJcbiAgICBQYWdlRmxvd1NldHRpbmdzLFxyXG4gICAgcGFyc2VQYWdlRmxvd1NldHRpbmdzLFxyXG4gICAgc2VyaWFsaXplUGFnZUZsb3dTZXR0aW5ncyxcclxufSBmcm9tICcuLi9zZGsnO1xyXG5cclxuY29uc3QgU1RPUkFHRV9LRVkgPSAnUEFHRV9GTE9XX0FHRU5UX1NFVFRJTkdTJztcclxuXHJcbi8qKlxyXG4gKiBLZWVwcyB0aGUgUGFnZSBGbG93IHBvcnQgYW5kIHBhaXJpbmcgdG9rZW4gaW4gdGhpcyBicm93c2VyJ3MgbG9jYWxTdG9yYWdlLiBUaGUgU0RLIGRvZXMgdGhlXHJcbiAqIHBhcnNpbmcgYW5kIHZhbGlkYXRpb247IHRoaXMgY2xhc3Mgb25seSByZWFkcyBhbmQgd3JpdGVzIHRoZSBzdG9yZWQgdGV4dC5cclxuICovXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXHJcbmV4cG9ydCBjbGFzcyBQYWdlRmxvd1NldHRpbmdzU3RvcmUge1xyXG4gICAgZ2V0KCk6IFBhZ2VGbG93U2V0dGluZ3Mge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwYXJzZVBhZ2VGbG93U2V0dGluZ3MobG9jYWxTdG9yYWdlLmdldEl0ZW0oU1RPUkFHRV9LRVkpKTtcclxuICAgICAgICB9IGNhdGNoIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgLi4uREVGQVVMVF9QQUdFX0ZMT1dfU0VUVElOR1MgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIFRocm93cyBhIFJhbmdlRXJyb3IgZm9yIGEgcG9ydCBvdXQgb2YgcmFuZ2UsIG9yIHRoZSBicm93c2VyJ3MgZXJyb3IgaWYgc3RvcmFnZSByZWZ1c2VzLiAqL1xyXG4gICAgc2F2ZShzZXR0aW5nczogUGFnZUZsb3dTZXR0aW5ncyk6IHZvaWQge1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFNUT1JBR0VfS0VZLCBzZXJpYWxpemVQYWdlRmxvd1NldHRpbmdzKHNldHRpbmdzKSk7XHJcbiAgICB9XHJcbn1cclxuIl19