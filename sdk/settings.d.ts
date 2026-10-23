/** What a caller needs to reach the Page-Flow agent on this computer. */
export interface PageFlowSettings {
    /** The plain HTTP port. */
    port: number;
    /** The HTTPS port. The agent serves HTTPS with a certificate the installer trusts for this user. */
    httpsPort: number;
    /** True to call the agent over HTTPS. False calls the plain HTTP port. */
    useHttps: boolean;
    pairingToken: string;
}
export declare const PAGE_FLOW_DEFAULT_PORT = 52180;
export declare const PAGE_FLOW_DEFAULT_HTTPS_PORT = 52181;
/** The agent listens on loopback only, so the host is fixed. */
export declare const PAGE_FLOW_HOST = "127.0.0.1";
export declare const DEFAULT_PAGE_FLOW_SETTINGS: Readonly<PageFlowSettings>;
export declare function isValidPageFlowPort(value: unknown): value is number;
export declare function pageFlowBaseUrl(port: number): string;
export declare function pageFlowHttpsBaseUrl(port: number): string;
/** The base URL the client calls: HTTPS when chosen, otherwise plain HTTP. */
export declare function pageFlowConnectionUrl(settings: Pick<PageFlowSettings, 'port' | 'httpsPort' | 'useHttps'>): string;
/**
 * Reads settings saved as JSON. A missing, unreadable or invalid value falls back to the defaults,
 * so the client always has usable ports. The caller decides where the text comes from.
 */
export declare function parsePageFlowSettings(raw: string | null): PageFlowSettings;
/** Turns settings into the JSON text to store. Throws a RangeError for ports that are invalid or equal. */
export declare function serializePageFlowSettings(settings: PageFlowSettings): string;
//# sourceMappingURL=settings.d.ts.map