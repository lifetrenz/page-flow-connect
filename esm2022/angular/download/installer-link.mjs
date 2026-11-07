/** The newest Windows installer (the per-machine MSI from 0.3.0), published as a GitHub release asset under a fixed name. */
export const PAGE_FLOW_WINDOWS_INSTALLER_URL = 'https://github.com/lifetrenz/page-flow/releases/latest/download/PageFlow-Setup.msi';
/**
 * Which system the person is on. The browser's platform name is preferred. The user agent is the
 * fallback, and phones and tablets are not desktop systems, so they are 'unknown'.
 */
export function detectClientOs(platform) {
    const name = platform.userAgentData?.platform ?? '';
    if (name) {
        if (/windows/i.test(name))
            return 'windows';
        if (/macos|mac os/i.test(name))
            return 'macos';
        if (/linux/i.test(name))
            return 'linux';
        return 'unknown';
    }
    const agent = platform.userAgent ?? '';
    if (/iphone|ipad|ipod|android/i.test(agent))
        return 'unknown';
    if (/windows/i.test(agent))
        return 'windows';
    if (/macintosh|mac os x/i.test(agent))
        return 'macos';
    if (/linux/i.test(agent))
        return 'linux';
    return 'unknown';
}
/**
 * The installer link for a system, or null when no installer exists for it. The override (the
 * PAGE_FLOW_DOWNLOAD_URL setting) replaces the default Windows link when it is set.
 */
export function installerUrl(os, override) {
    if (os !== 'windows')
        return null;
    return override || PAGE_FLOW_WINDOWS_INSTALLER_URL;
}
/** The name of a system in the "not yet available" text. */
export function osLabel(os) {
    switch (os) {
        case 'windows':
            return 'Windows';
        case 'macos':
            return 'macOS';
        case 'linux':
            return 'Linux';
        case 'unknown':
            return 'this computer';
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdGFsbGVyLWxpbmsuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYW5ndWxhci9kb3dubG9hZC9pbnN0YWxsZXItbGluay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFTQSw2SEFBNkg7QUFDN0gsTUFBTSxDQUFDLE1BQU0sK0JBQStCLEdBQ3hDLG9GQUFvRixDQUFDO0FBRXpGOzs7R0FHRztBQUNILE1BQU0sVUFBVSxjQUFjLENBQUMsUUFBd0I7SUFDbkQsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsRUFBRSxRQUFRLElBQUksRUFBRSxDQUFDO0lBQ3BELElBQUksSUFBSSxFQUFFLENBQUM7UUFDUCxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQUUsT0FBTyxTQUFTLENBQUM7UUFDNUMsSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUFFLE9BQU8sT0FBTyxDQUFDO1FBQy9DLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFBRSxPQUFPLE9BQU8sQ0FBQztRQUN4QyxPQUFPLFNBQVMsQ0FBQztJQUNyQixDQUFDO0lBQ0QsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUM7SUFDdkMsSUFBSSwyQkFBMkIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQUUsT0FBTyxTQUFTLENBQUM7SUFDOUQsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUFFLE9BQU8sU0FBUyxDQUFDO0lBQzdDLElBQUkscUJBQXFCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUFFLE9BQU8sT0FBTyxDQUFDO0lBQ3RELElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7UUFBRSxPQUFPLE9BQU8sQ0FBQztJQUN6QyxPQUFPLFNBQVMsQ0FBQztBQUNyQixDQUFDO0FBRUQ7OztHQUdHO0FBQ0gsTUFBTSxVQUFVLFlBQVksQ0FBQyxFQUFZLEVBQUUsUUFBZ0I7SUFDdkQsSUFBSSxFQUFFLEtBQUssU0FBUztRQUFFLE9BQU8sSUFBSSxDQUFDO0lBQ2xDLE9BQU8sUUFBUSxJQUFJLCtCQUErQixDQUFDO0FBQ3ZELENBQUM7QUFFRCw0REFBNEQ7QUFDNUQsTUFBTSxVQUFVLE9BQU8sQ0FBQyxFQUFZO0lBQ2hDLFFBQVEsRUFBRSxFQUFFLENBQUM7UUFDVCxLQUFLLFNBQVM7WUFDVixPQUFPLFNBQVMsQ0FBQztRQUNyQixLQUFLLE9BQU87WUFDUixPQUFPLE9BQU8sQ0FBQztRQUNuQixLQUFLLE9BQU87WUFDUixPQUFPLE9BQU8sQ0FBQztRQUNuQixLQUFLLFNBQVM7WUFDVixPQUFPLGVBQWUsQ0FBQztJQUMvQixDQUFDO0FBQ0wsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBUaGUgZGVza3RvcCBzeXN0ZW1zIHRoZSBQYWdlLUZsb3cgaW5zdGFsbGVyIGV4aXN0cyBmb3IsIG9yICd1bmtub3duJyB3aGVuIG5vbmUgaXMgcmVjb2duaXNlZC4gKi9cbmV4cG9ydCB0eXBlIENsaWVudE9zID0gJ3dpbmRvd3MnIHwgJ21hY29zJyB8ICdsaW51eCcgfCAndW5rbm93bic7XG5cbi8qKiBUaGUgcGFydHMgb2YgYG5hdmlnYXRvcmAgdGhhdCBpZGVudGlmeSB0aGUgc3lzdGVtLiAqL1xuZXhwb3J0IGludGVyZmFjZSBDbGllbnRQbGF0Zm9ybSB7XG4gICAgdXNlckFnZW50RGF0YT86IHsgcGxhdGZvcm0/OiBzdHJpbmcgfTtcbiAgICB1c2VyQWdlbnQ/OiBzdHJpbmc7XG59XG5cbi8qKiBUaGUgbmV3ZXN0IFdpbmRvd3MgaW5zdGFsbGVyICh0aGUgcGVyLW1hY2hpbmUgTVNJIGZyb20gMC4zLjApLCBwdWJsaXNoZWQgYXMgYSBHaXRIdWIgcmVsZWFzZSBhc3NldCB1bmRlciBhIGZpeGVkIG5hbWUuICovXG5leHBvcnQgY29uc3QgUEFHRV9GTE9XX1dJTkRPV1NfSU5TVEFMTEVSX1VSTCA9XG4gICAgJ2h0dHBzOi8vZ2l0aHViLmNvbS9saWZldHJlbnovcGFnZS1mbG93L3JlbGVhc2VzL2xhdGVzdC9kb3dubG9hZC9QYWdlRmxvdy1TZXR1cC5tc2knO1xuXG4vKipcbiAqIFdoaWNoIHN5c3RlbSB0aGUgcGVyc29uIGlzIG9uLiBUaGUgYnJvd3NlcidzIHBsYXRmb3JtIG5hbWUgaXMgcHJlZmVycmVkLiBUaGUgdXNlciBhZ2VudCBpcyB0aGVcbiAqIGZhbGxiYWNrLCBhbmQgcGhvbmVzIGFuZCB0YWJsZXRzIGFyZSBub3QgZGVza3RvcCBzeXN0ZW1zLCBzbyB0aGV5IGFyZSAndW5rbm93bicuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZXRlY3RDbGllbnRPcyhwbGF0Zm9ybTogQ2xpZW50UGxhdGZvcm0pOiBDbGllbnRPcyB7XG4gICAgY29uc3QgbmFtZSA9IHBsYXRmb3JtLnVzZXJBZ2VudERhdGE/LnBsYXRmb3JtID8/ICcnO1xuICAgIGlmIChuYW1lKSB7XG4gICAgICAgIGlmICgvd2luZG93cy9pLnRlc3QobmFtZSkpIHJldHVybiAnd2luZG93cyc7XG4gICAgICAgIGlmICgvbWFjb3N8bWFjIG9zL2kudGVzdChuYW1lKSkgcmV0dXJuICdtYWNvcyc7XG4gICAgICAgIGlmICgvbGludXgvaS50ZXN0KG5hbWUpKSByZXR1cm4gJ2xpbnV4JztcbiAgICAgICAgcmV0dXJuICd1bmtub3duJztcbiAgICB9XG4gICAgY29uc3QgYWdlbnQgPSBwbGF0Zm9ybS51c2VyQWdlbnQgPz8gJyc7XG4gICAgaWYgKC9pcGhvbmV8aXBhZHxpcG9kfGFuZHJvaWQvaS50ZXN0KGFnZW50KSkgcmV0dXJuICd1bmtub3duJztcbiAgICBpZiAoL3dpbmRvd3MvaS50ZXN0KGFnZW50KSkgcmV0dXJuICd3aW5kb3dzJztcbiAgICBpZiAoL21hY2ludG9zaHxtYWMgb3MgeC9pLnRlc3QoYWdlbnQpKSByZXR1cm4gJ21hY29zJztcbiAgICBpZiAoL2xpbnV4L2kudGVzdChhZ2VudCkpIHJldHVybiAnbGludXgnO1xuICAgIHJldHVybiAndW5rbm93bic7XG59XG5cbi8qKlxuICogVGhlIGluc3RhbGxlciBsaW5rIGZvciBhIHN5c3RlbSwgb3IgbnVsbCB3aGVuIG5vIGluc3RhbGxlciBleGlzdHMgZm9yIGl0LiBUaGUgb3ZlcnJpZGUgKHRoZVxuICogUEFHRV9GTE9XX0RPV05MT0FEX1VSTCBzZXR0aW5nKSByZXBsYWNlcyB0aGUgZGVmYXVsdCBXaW5kb3dzIGxpbmsgd2hlbiBpdCBpcyBzZXQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnN0YWxsZXJVcmwob3M6IENsaWVudE9zLCBvdmVycmlkZTogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgaWYgKG9zICE9PSAnd2luZG93cycpIHJldHVybiBudWxsO1xuICAgIHJldHVybiBvdmVycmlkZSB8fCBQQUdFX0ZMT1dfV0lORE9XU19JTlNUQUxMRVJfVVJMO1xufVxuXG4vKiogVGhlIG5hbWUgb2YgYSBzeXN0ZW0gaW4gdGhlIFwibm90IHlldCBhdmFpbGFibGVcIiB0ZXh0LiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9zTGFiZWwob3M6IENsaWVudE9zKTogc3RyaW5nIHtcbiAgICBzd2l0Y2ggKG9zKSB7XG4gICAgICAgIGNhc2UgJ3dpbmRvd3MnOlxuICAgICAgICAgICAgcmV0dXJuICdXaW5kb3dzJztcbiAgICAgICAgY2FzZSAnbWFjb3MnOlxuICAgICAgICAgICAgcmV0dXJuICdtYWNPUyc7XG4gICAgICAgIGNhc2UgJ2xpbnV4JzpcbiAgICAgICAgICAgIHJldHVybiAnTGludXgnO1xuICAgICAgICBjYXNlICd1bmtub3duJzpcbiAgICAgICAgICAgIHJldHVybiAndGhpcyBjb21wdXRlcic7XG4gICAgfVxufVxuIl19