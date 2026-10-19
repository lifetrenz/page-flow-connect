/**
 * A failed call to the Page-Flow agent. Branch on `code`; `message` is for people and may change.
 *
 * `code` is either an agent code (see the error table in docs/api/page-flow-api.md) or one of the
 * client codes below, which the SDK raises before or instead of an agent reply:
 * - `not_paired`: no pairing token is saved.
 * - `agent_unreachable`: the request never got a reply (agent not running, or port blocked).
 * - `agent_timeout`: the agent did not reply within the client's timeout.
 * - `invalid_response`: the agent replied, but not in a form the API describes.
 * - `print_outcome_unknown`: a print was sent but its outcome is not known. Check the printer
 *   queue before printing again.
 */
export declare class PageFlowError extends Error {
    readonly code: string;
    readonly retryable: boolean;
    readonly status: number;
    readonly cause?: unknown;
    constructor(code: string, message: string, retryable: boolean, status: number, cause?: unknown);
    /** True when the printer may already have printed the page. */
    get printMayHaveHappened(): boolean;
}
//# sourceMappingURL=error.d.ts.map