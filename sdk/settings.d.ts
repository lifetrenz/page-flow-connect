/** What a caller needs to reach the Page-Flow agent on this computer. */
export interface PageFlowSettings {
    port: number;
    pairingToken: string;
}
export declare const PAGE_FLOW_DEFAULT_PORT = 52180;
/** The agent listens on loopback only, so the host is fixed. */
export declare const PAGE_FLOW_HOST = "127.0.0.1";
export declare const DEFAULT_PAGE_FLOW_SETTINGS: Readonly<PageFlowSettings>;
export declare function isValidPageFlowPort(value: unknown): value is number;
export declare function pageFlowBaseUrl(port: number): string;
/**
 * Reads settings saved as JSON. A missing, unreadable or invalid value falls back to the defaults,
 * so the client always has a usable port. The caller decides where the text comes from.
 */
export declare function parsePageFlowSettings(raw: string | null): PageFlowSettings;
/** Turns settings into the JSON text to store. Throws a RangeError for a port out of range. */
export declare function serializePageFlowSettings(settings: PageFlowSettings): string;
//# sourceMappingURL=settings.d.ts.map