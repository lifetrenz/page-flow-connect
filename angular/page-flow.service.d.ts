import { InjectionToken } from '@angular/core';
import { PageFlowClient, PageFlowFetch } from '../sdk';
import * as i0 from "@angular/core";
/** The transport the SDK sends through. The app uses the browser's fetch; tests replace it. */
export declare const PAGE_FLOW_FETCH: InjectionToken<PageFlowFetch>;
/**
 * The one Page Flow client the app uses. Its settings are read on every call, so a port or token
 * saved in Agent Settings applies to the next call without a reload.
 */
export declare class PageFlowService {
    private readonly settings;
    readonly client: PageFlowClient;
    static ɵfac: i0.ɵɵFactoryDeclaration<PageFlowService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PageFlowService>;
}
//# sourceMappingURL=page-flow.service.d.ts.map