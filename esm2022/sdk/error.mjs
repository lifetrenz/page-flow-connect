// Synced from the Page-Flow repository (sdk/src). Edit it there, then run npm run sync:sdk.
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
export class PageFlowError extends Error {
    constructor(code, message, retryable, status, cause) {
        super(message);
        this.code = code;
        this.retryable = retryable;
        this.status = status;
        this.cause = cause;
        this.name = 'PageFlowError';
    }
    /** True when the printer may already have printed the page. */
    get printMayHaveHappened() {
        return this.code === 'print_outcome_unknown';
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wYWdlLWZsb3cvc3JjL3Nkay9lcnJvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw0RkFBNEY7QUFDNUY7Ozs7Ozs7Ozs7O0dBV0c7QUFDSCxNQUFNLE9BQU8sYUFBYyxTQUFRLEtBQUs7SUFDcEMsWUFDYSxJQUFZLEVBQ3JCLE9BQWUsRUFDTixTQUFrQixFQUNsQixNQUFjLEVBQ2QsS0FBZTtRQUV4QixLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFOTixTQUFJLEdBQUosSUFBSSxDQUFRO1FBRVosY0FBUyxHQUFULFNBQVMsQ0FBUztRQUNsQixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QsVUFBSyxHQUFMLEtBQUssQ0FBVTtRQUd4QixJQUFJLENBQUMsSUFBSSxHQUFHLGVBQWUsQ0FBQztJQUNoQyxDQUFDO0lBRUQsK0RBQStEO0lBQy9ELElBQUksb0JBQW9CO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLElBQUksS0FBSyx1QkFBdUIsQ0FBQztJQUNqRCxDQUFDO0NBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTeW5jZWQgZnJvbSB0aGUgUGFnZS1GbG93IHJlcG9zaXRvcnkgKHNkay9zcmMpLiBFZGl0IGl0IHRoZXJlLCB0aGVuIHJ1biBucG0gcnVuIHN5bmM6c2RrLlxuLyoqXG4gKiBBIGZhaWxlZCBjYWxsIHRvIHRoZSBQYWdlLUZsb3cgYWdlbnQuIEJyYW5jaCBvbiBgY29kZWA7IGBtZXNzYWdlYCBpcyBmb3IgcGVvcGxlIGFuZCBtYXkgY2hhbmdlLlxuICpcbiAqIGBjb2RlYCBpcyBlaXRoZXIgYW4gYWdlbnQgY29kZSAoc2VlIHRoZSBlcnJvciB0YWJsZSBpbiBkb2NzL2FwaS9wYWdlLWZsb3ctYXBpLm1kKSBvciBvbmUgb2YgdGhlXG4gKiBjbGllbnQgY29kZXMgYmVsb3csIHdoaWNoIHRoZSBTREsgcmFpc2VzIGJlZm9yZSBvciBpbnN0ZWFkIG9mIGFuIGFnZW50IHJlcGx5OlxuICogLSBgbm90X3BhaXJlZGA6IG5vIHBhaXJpbmcgdG9rZW4gaXMgc2F2ZWQuXG4gKiAtIGBhZ2VudF91bnJlYWNoYWJsZWA6IHRoZSByZXF1ZXN0IG5ldmVyIGdvdCBhIHJlcGx5IChhZ2VudCBub3QgcnVubmluZywgb3IgcG9ydCBibG9ja2VkKS5cbiAqIC0gYGFnZW50X3RpbWVvdXRgOiB0aGUgYWdlbnQgZGlkIG5vdCByZXBseSB3aXRoaW4gdGhlIGNsaWVudCdzIHRpbWVvdXQuXG4gKiAtIGBpbnZhbGlkX3Jlc3BvbnNlYDogdGhlIGFnZW50IHJlcGxpZWQsIGJ1dCBub3QgaW4gYSBmb3JtIHRoZSBBUEkgZGVzY3JpYmVzLlxuICogLSBgcHJpbnRfb3V0Y29tZV91bmtub3duYDogYSBwcmludCB3YXMgc2VudCBidXQgaXRzIG91dGNvbWUgaXMgbm90IGtub3duLiBDaGVjayB0aGUgcHJpbnRlclxuICogICBxdWV1ZSBiZWZvcmUgcHJpbnRpbmcgYWdhaW4uXG4gKi9cbmV4cG9ydCBjbGFzcyBQYWdlRmxvd0Vycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBjb2RlOiBzdHJpbmcsXG4gICAgICAgIG1lc3NhZ2U6IHN0cmluZyxcbiAgICAgICAgcmVhZG9ubHkgcmV0cnlhYmxlOiBib29sZWFuLFxuICAgICAgICByZWFkb25seSBzdGF0dXM6IG51bWJlcixcbiAgICAgICAgcmVhZG9ubHkgY2F1c2U/OiB1bmtub3duLFxuICAgICkge1xuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAgICAgdGhpcy5uYW1lID0gJ1BhZ2VGbG93RXJyb3InO1xuICAgIH1cblxuICAgIC8qKiBUcnVlIHdoZW4gdGhlIHByaW50ZXIgbWF5IGFscmVhZHkgaGF2ZSBwcmludGVkIHRoZSBwYWdlLiAqL1xuICAgIGdldCBwcmludE1heUhhdmVIYXBwZW5lZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29kZSA9PT0gJ3ByaW50X291dGNvbWVfdW5rbm93bic7XG4gICAgfVxufVxuIl19