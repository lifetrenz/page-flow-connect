/** The desktop systems the Page-Flow installer exists for, or 'unknown' when none is recognised. */
export type ClientOs = 'windows' | 'macos' | 'linux' | 'unknown';
/** The parts of `navigator` that identify the system. */
export interface ClientPlatform {
    userAgentData?: {
        platform?: string;
    };
    userAgent?: string;
}
/** The newest Windows installer, published as a GitHub release asset under a fixed name. */
export declare const PAGE_FLOW_WINDOWS_INSTALLER_URL = "https://github.com/lifetrenz/page-flow/releases/latest/download/PageFlow-Setup.exe";
/**
 * Which system the person is on. The browser's platform name is preferred. The user agent is the
 * fallback, and phones and tablets are not desktop systems, so they are 'unknown'.
 */
export declare function detectClientOs(platform: ClientPlatform): ClientOs;
/**
 * The installer link for a system, or null when no installer exists for it. The override (the
 * PAGE_FLOW_DOWNLOAD_URL setting) replaces the default Windows link when it is set.
 */
export declare function installerUrl(os: ClientOs, override: string): string | null;
/** The name of a system in the "not yet available" text. */
export declare function osLabel(os: ClientOs): string;
//# sourceMappingURL=installer-link.d.ts.map