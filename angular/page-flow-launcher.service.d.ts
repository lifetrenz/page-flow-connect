import { InjectionToken } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * An override for the Windows installer link. Empty means the default GitHub release link, which
 * is used for Windows only; other systems get a "not yet available" message.
 */
export declare const PAGE_FLOW_DOWNLOAD_URL: InjectionToken<string>;
/** The link the installer registers. It starts the agent, and does nothing else. */
export declare const PAGE_FLOW_LAUNCH_LINK = "page-flow://launch";
export type LaunchOutcome = 'started' | 'not-installed';
/**
 * Starts the Page-Flow agent when it is installed but not running. A browser cannot ask whether
 * a program is installed, so this uses the usual check: hand the link to the system, then see
 * whether the page lost focus. If it did not, no program took the link.
 */
export declare class PageFlowLauncherService {
    private readonly pageFlow;
    readonly downloadUrl: string;
    requestLaunch(): Promise<LaunchOutcome>;
    /** Polls the agent until it answers, or gives up after the start timeout. */
    waitUntilReachable(): Promise<boolean>;
    private agentAnswers;
    static ɵfac: i0.ɵɵFactoryDeclaration<PageFlowLauncherService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PageFlowLauncherService>;
}
//# sourceMappingURL=page-flow-launcher.service.d.ts.map