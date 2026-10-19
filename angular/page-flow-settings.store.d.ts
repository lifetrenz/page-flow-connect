import { PageFlowSettings } from '../sdk';
import * as i0 from "@angular/core";
/**
 * Keeps the Page Flow port and pairing token in this browser's localStorage. The SDK does the
 * parsing and validation; this class only reads and writes the stored text.
 */
export declare class PageFlowSettingsStore {
    get(): PageFlowSettings;
    /** Throws a RangeError for a port out of range, or the browser's error if storage refuses. */
    save(settings: PageFlowSettings): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PageFlowSettingsStore, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PageFlowSettingsStore>;
}
//# sourceMappingURL=page-flow-settings.store.d.ts.map