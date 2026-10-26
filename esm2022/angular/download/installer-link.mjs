/** The newest Windows installer, published as a GitHub release asset under a fixed name. */
export const PAGE_FLOW_WINDOWS_INSTALLER_URL = 'https://github.com/lifetrenz/page-flow/releases/latest/download/PageFlow-Setup.exe';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdGFsbGVyLWxpbmsuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYW5ndWxhci9kb3dubG9hZC9pbnN0YWxsZXItbGluay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFTQSw0RkFBNEY7QUFDNUYsTUFBTSxDQUFDLE1BQU0sK0JBQStCLEdBQ3hDLG9GQUFvRixDQUFDO0FBRXpGOzs7R0FHRztBQUNILE1BQU0sVUFBVSxjQUFjLENBQUMsUUFBd0I7SUFDbkQsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsRUFBRSxRQUFRLElBQUksRUFBRSxDQUFDO0lBQ3BELElBQUksSUFBSSxFQUFFLENBQUM7UUFDUCxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQUUsT0FBTyxTQUFTLENBQUM7UUFDNUMsSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUFFLE9BQU8sT0FBTyxDQUFDO1FBQy9DLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFBRSxPQUFPLE9BQU8sQ0FBQztRQUN4QyxPQUFPLFNBQVMsQ0FBQztJQUNyQixDQUFDO0lBQ0QsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUM7SUFDdkMsSUFBSSwyQkFBMkIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQUUsT0FBTyxTQUFTLENBQUM7SUFDOUQsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUFFLE9BQU8sU0FBUyxDQUFDO0lBQzdDLElBQUkscUJBQXFCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUFFLE9BQU8sT0FBTyxDQUFDO0lBQ3RELElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7UUFBRSxPQUFPLE9BQU8sQ0FBQztJQUN6QyxPQUFPLFNBQVMsQ0FBQztBQUNyQixDQUFDO0FBRUQ7OztHQUdHO0FBQ0gsTUFBTSxVQUFVLFlBQVksQ0FBQyxFQUFZLEVBQUUsUUFBZ0I7SUFDdkQsSUFBSSxFQUFFLEtBQUssU0FBUztRQUFFLE9BQU8sSUFBSSxDQUFDO0lBQ2xDLE9BQU8sUUFBUSxJQUFJLCtCQUErQixDQUFDO0FBQ3ZELENBQUM7QUFFRCw0REFBNEQ7QUFDNUQsTUFBTSxVQUFVLE9BQU8sQ0FBQyxFQUFZO0lBQ2hDLFFBQVEsRUFBRSxFQUFFLENBQUM7UUFDVCxLQUFLLFNBQVM7WUFDVixPQUFPLFNBQVMsQ0FBQztRQUNyQixLQUFLLE9BQU87WUFDUixPQUFPLE9BQU8sQ0FBQztRQUNuQixLQUFLLE9BQU87WUFDUixPQUFPLE9BQU8sQ0FBQztRQUNuQixLQUFLLFNBQVM7WUFDVixPQUFPLGVBQWUsQ0FBQztJQUMvQixDQUFDO0FBQ0wsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBUaGUgZGVza3RvcCBzeXN0ZW1zIHRoZSBQYWdlLUZsb3cgaW5zdGFsbGVyIGV4aXN0cyBmb3IsIG9yICd1bmtub3duJyB3aGVuIG5vbmUgaXMgcmVjb2duaXNlZC4gKi9cclxuZXhwb3J0IHR5cGUgQ2xpZW50T3MgPSAnd2luZG93cycgfCAnbWFjb3MnIHwgJ2xpbnV4JyB8ICd1bmtub3duJztcclxuXHJcbi8qKiBUaGUgcGFydHMgb2YgYG5hdmlnYXRvcmAgdGhhdCBpZGVudGlmeSB0aGUgc3lzdGVtLiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIENsaWVudFBsYXRmb3JtIHtcclxuICAgIHVzZXJBZ2VudERhdGE/OiB7IHBsYXRmb3JtPzogc3RyaW5nIH07XHJcbiAgICB1c2VyQWdlbnQ/OiBzdHJpbmc7XHJcbn1cclxuXHJcbi8qKiBUaGUgbmV3ZXN0IFdpbmRvd3MgaW5zdGFsbGVyLCBwdWJsaXNoZWQgYXMgYSBHaXRIdWIgcmVsZWFzZSBhc3NldCB1bmRlciBhIGZpeGVkIG5hbWUuICovXHJcbmV4cG9ydCBjb25zdCBQQUdFX0ZMT1dfV0lORE9XU19JTlNUQUxMRVJfVVJMID1cclxuICAgICdodHRwczovL2dpdGh1Yi5jb20vbGlmZXRyZW56L3BhZ2UtZmxvdy9yZWxlYXNlcy9sYXRlc3QvZG93bmxvYWQvUGFnZUZsb3ctU2V0dXAuZXhlJztcclxuXHJcbi8qKlxyXG4gKiBXaGljaCBzeXN0ZW0gdGhlIHBlcnNvbiBpcyBvbi4gVGhlIGJyb3dzZXIncyBwbGF0Zm9ybSBuYW1lIGlzIHByZWZlcnJlZC4gVGhlIHVzZXIgYWdlbnQgaXMgdGhlXHJcbiAqIGZhbGxiYWNrLCBhbmQgcGhvbmVzIGFuZCB0YWJsZXRzIGFyZSBub3QgZGVza3RvcCBzeXN0ZW1zLCBzbyB0aGV5IGFyZSAndW5rbm93bicuXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZGV0ZWN0Q2xpZW50T3MocGxhdGZvcm06IENsaWVudFBsYXRmb3JtKTogQ2xpZW50T3Mge1xyXG4gICAgY29uc3QgbmFtZSA9IHBsYXRmb3JtLnVzZXJBZ2VudERhdGE/LnBsYXRmb3JtID8/ICcnO1xyXG4gICAgaWYgKG5hbWUpIHtcclxuICAgICAgICBpZiAoL3dpbmRvd3MvaS50ZXN0KG5hbWUpKSByZXR1cm4gJ3dpbmRvd3MnO1xyXG4gICAgICAgIGlmICgvbWFjb3N8bWFjIG9zL2kudGVzdChuYW1lKSkgcmV0dXJuICdtYWNvcyc7XHJcbiAgICAgICAgaWYgKC9saW51eC9pLnRlc3QobmFtZSkpIHJldHVybiAnbGludXgnO1xyXG4gICAgICAgIHJldHVybiAndW5rbm93bic7XHJcbiAgICB9XHJcbiAgICBjb25zdCBhZ2VudCA9IHBsYXRmb3JtLnVzZXJBZ2VudCA/PyAnJztcclxuICAgIGlmICgvaXBob25lfGlwYWR8aXBvZHxhbmRyb2lkL2kudGVzdChhZ2VudCkpIHJldHVybiAndW5rbm93bic7XHJcbiAgICBpZiAoL3dpbmRvd3MvaS50ZXN0KGFnZW50KSkgcmV0dXJuICd3aW5kb3dzJztcclxuICAgIGlmICgvbWFjaW50b3NofG1hYyBvcyB4L2kudGVzdChhZ2VudCkpIHJldHVybiAnbWFjb3MnO1xyXG4gICAgaWYgKC9saW51eC9pLnRlc3QoYWdlbnQpKSByZXR1cm4gJ2xpbnV4JztcclxuICAgIHJldHVybiAndW5rbm93bic7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUaGUgaW5zdGFsbGVyIGxpbmsgZm9yIGEgc3lzdGVtLCBvciBudWxsIHdoZW4gbm8gaW5zdGFsbGVyIGV4aXN0cyBmb3IgaXQuIFRoZSBvdmVycmlkZSAodGhlXHJcbiAqIFBBR0VfRkxPV19ET1dOTE9BRF9VUkwgc2V0dGluZykgcmVwbGFjZXMgdGhlIGRlZmF1bHQgV2luZG93cyBsaW5rIHdoZW4gaXQgaXMgc2V0LlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGluc3RhbGxlclVybChvczogQ2xpZW50T3MsIG92ZXJyaWRlOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHtcclxuICAgIGlmIChvcyAhPT0gJ3dpbmRvd3MnKSByZXR1cm4gbnVsbDtcclxuICAgIHJldHVybiBvdmVycmlkZSB8fCBQQUdFX0ZMT1dfV0lORE9XU19JTlNUQUxMRVJfVVJMO1xyXG59XHJcblxyXG4vKiogVGhlIG5hbWUgb2YgYSBzeXN0ZW0gaW4gdGhlIFwibm90IHlldCBhdmFpbGFibGVcIiB0ZXh0LiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gb3NMYWJlbChvczogQ2xpZW50T3MpOiBzdHJpbmcge1xyXG4gICAgc3dpdGNoIChvcykge1xyXG4gICAgICAgIGNhc2UgJ3dpbmRvd3MnOlxyXG4gICAgICAgICAgICByZXR1cm4gJ1dpbmRvd3MnO1xyXG4gICAgICAgIGNhc2UgJ21hY29zJzpcclxuICAgICAgICAgICAgcmV0dXJuICdtYWNPUyc7XHJcbiAgICAgICAgY2FzZSAnbGludXgnOlxyXG4gICAgICAgICAgICByZXR1cm4gJ0xpbnV4JztcclxuICAgICAgICBjYXNlICd1bmtub3duJzpcclxuICAgICAgICAgICAgcmV0dXJuICd0aGlzIGNvbXB1dGVyJztcclxuICAgIH1cclxufVxyXG4iXX0=