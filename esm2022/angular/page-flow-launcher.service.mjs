import { Injectable, InjectionToken, inject } from '@angular/core';
import { PageFlowService } from './page-flow.service';
import * as i0 from "@angular/core";
/**
 * Where the Page-Flow installer is downloaded from. Empty until the release location is set; the
 * screen then tells the person to ask IT for the installer.
 */
export const PAGE_FLOW_DOWNLOAD_URL = new InjectionToken('PAGE_FLOW_DOWNLOAD_URL', {
    providedIn: 'root',
    factory: () => '',
});
/** The link the installer registers. It starts the agent, and does nothing else. */
export const PAGE_FLOW_LAUNCH_LINK = 'page-flow://launch';
/** How long to wait for the system to take the link before deciding no program is installed. */
const LAUNCH_WAIT_MS = 1500;
/** How long to wait for a started agent to answer. */
const START_TIMEOUT_MS = 20000;
const START_POLL_MS = 1000;
/**
 * Starts the Page-Flow agent when it is installed but not running. A browser cannot ask whether
 * a program is installed, so this uses the usual check: hand the link to the system, then see
 * whether the page lost focus. If it did not, no program took the link.
 */
export class PageFlowLauncherService {
    constructor() {
        this.pageFlow = inject(PageFlowService);
        this.downloadUrl = inject(PAGE_FLOW_DOWNLOAD_URL);
    }
    requestLaunch() {
        return new Promise((resolve) => {
            let settled = false;
            const frame = document.createElement('iframe');
            frame.style.display = 'none';
            const finish = (outcome) => {
                if (settled)
                    return;
                settled = true;
                clearTimeout(timer);
                window.removeEventListener('blur', onAway);
                document.removeEventListener('visibilitychange', onVisibility);
                frame.remove();
                resolve(outcome);
            };
            // Focus moving into the hidden frame also fires blur. Only a program taking focus leaves the page without it.
            const onAway = () => setTimeout(() => {
                if (!document.hasFocus())
                    finish('started');
            }, 200);
            const onVisibility = () => {
                if (document.hidden)
                    finish('started');
            };
            const timer = setTimeout(() => finish('not-installed'), LAUNCH_WAIT_MS);
            window.addEventListener('blur', onAway);
            document.addEventListener('visibilitychange', onVisibility);
            document.body.appendChild(frame);
            frame.src = PAGE_FLOW_LAUNCH_LINK;
        });
    }
    /** Polls the agent until it answers, or gives up after the start timeout. */
    async waitUntilReachable() {
        const deadline = Date.now() + START_TIMEOUT_MS;
        while (Date.now() < deadline) {
            if (await this.agentAnswers())
                return true;
            await new Promise((resolve) => setTimeout(resolve, START_POLL_MS));
        }
        return false;
    }
    async agentAnswers() {
        try {
            await this.pageFlow.client.health();
            return true;
        }
        catch (error) {
            // An unreachable or slow agent is not up yet. Any other answer means it is running.
            const code = error?.code;
            return code !== 'agent_unreachable' && code !== 'agent_timeout';
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: PageFlowLauncherService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: PageFlowLauncherService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: PageFlowLauncherService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZS1mbG93LWxhdW5jaGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wYWdlLWZsb3cvc3JjL2FuZ3VsYXIvcGFnZS1mbG93LWxhdW5jaGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ25FLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQzs7QUFFdEQ7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sc0JBQXNCLEdBQUcsSUFBSSxjQUFjLENBQVMsd0JBQXdCLEVBQUU7SUFDdkYsVUFBVSxFQUFFLE1BQU07SUFDbEIsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUU7Q0FDcEIsQ0FBQyxDQUFDO0FBRUgsb0ZBQW9GO0FBQ3BGLE1BQU0sQ0FBQyxNQUFNLHFCQUFxQixHQUFHLG9CQUFvQixDQUFDO0FBRTFELGdHQUFnRztBQUNoRyxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUM7QUFDNUIsc0RBQXNEO0FBQ3RELE1BQU0sZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO0FBQy9CLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQztBQUkzQjs7OztHQUlHO0FBRUgsTUFBTSxPQUFPLHVCQUF1QjtJQURwQztRQUVxQixhQUFRLEdBQUcsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQzNDLGdCQUFXLEdBQUcsTUFBTSxDQUFDLHNCQUFzQixDQUFDLENBQUM7S0FxRHpEO0lBbkRHLGFBQWE7UUFDVCxPQUFPLElBQUksT0FBTyxDQUFnQixDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQzFDLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQztZQUNwQixNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQy9DLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztZQUU3QixNQUFNLE1BQU0sR0FBRyxDQUFDLE9BQXNCLEVBQUUsRUFBRTtnQkFDdEMsSUFBSSxPQUFPO29CQUFFLE9BQU87Z0JBQ3BCLE9BQU8sR0FBRyxJQUFJLENBQUM7Z0JBQ2YsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNwQixNQUFNLENBQUMsbUJBQW1CLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUMzQyxRQUFRLENBQUMsbUJBQW1CLENBQUMsa0JBQWtCLEVBQUUsWUFBWSxDQUFDLENBQUM7Z0JBQy9ELEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDZixPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDckIsQ0FBQyxDQUFDO1lBQ0YsOEdBQThHO1lBQzlHLE1BQU0sTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2pDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFO29CQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNoRCxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDUixNQUFNLFlBQVksR0FBRyxHQUFHLEVBQUU7Z0JBQ3RCLElBQUksUUFBUSxDQUFDLE1BQU07b0JBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzNDLENBQUMsQ0FBQztZQUNGLE1BQU0sS0FBSyxHQUFHLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLEVBQUUsY0FBYyxDQUFDLENBQUM7WUFFeEUsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztZQUN4QyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDNUQsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDakMsS0FBSyxDQUFDLEdBQUcsR0FBRyxxQkFBcUIsQ0FBQztRQUN0QyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCw2RUFBNkU7SUFDN0UsS0FBSyxDQUFDLGtCQUFrQjtRQUNwQixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsZ0JBQWdCLENBQUM7UUFDL0MsT0FBTyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsUUFBUSxFQUFFLENBQUM7WUFDM0IsSUFBSSxNQUFNLElBQUksQ0FBQyxZQUFZLEVBQUU7Z0JBQUUsT0FBTyxJQUFJLENBQUM7WUFDM0MsTUFBTSxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDO1FBQ3ZFLENBQUM7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRU8sS0FBSyxDQUFDLFlBQVk7UUFDdEIsSUFBSSxDQUFDO1lBQ0QsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNwQyxPQUFPLElBQUksQ0FBQztRQUNoQixDQUFDO1FBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNiLG9GQUFvRjtZQUNwRixNQUFNLElBQUksR0FBSSxLQUEyQixFQUFFLElBQUksQ0FBQztZQUNoRCxPQUFPLElBQUksS0FBSyxtQkFBbUIsSUFBSSxJQUFJLEtBQUssZUFBZSxDQUFDO1FBQ3BFLENBQUM7SUFDTCxDQUFDOytHQXREUSx1QkFBdUI7bUhBQXZCLHVCQUF1QixjQURWLE1BQU07OzRGQUNuQix1QkFBdUI7a0JBRG5DLFVBQVU7bUJBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0aW9uVG9rZW4sIGluamVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBQYWdlRmxvd1NlcnZpY2UgfSBmcm9tICcuL3BhZ2UtZmxvdy5zZXJ2aWNlJztcclxuXHJcbi8qKlxyXG4gKiBXaGVyZSB0aGUgUGFnZS1GbG93IGluc3RhbGxlciBpcyBkb3dubG9hZGVkIGZyb20uIEVtcHR5IHVudGlsIHRoZSByZWxlYXNlIGxvY2F0aW9uIGlzIHNldDsgdGhlXHJcbiAqIHNjcmVlbiB0aGVuIHRlbGxzIHRoZSBwZXJzb24gdG8gYXNrIElUIGZvciB0aGUgaW5zdGFsbGVyLlxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IFBBR0VfRkxPV19ET1dOTE9BRF9VUkwgPSBuZXcgSW5qZWN0aW9uVG9rZW48c3RyaW5nPignUEFHRV9GTE9XX0RPV05MT0FEX1VSTCcsIHtcclxuICAgIHByb3ZpZGVkSW46ICdyb290JyxcclxuICAgIGZhY3Rvcnk6ICgpID0+ICcnLFxyXG59KTtcclxuXHJcbi8qKiBUaGUgbGluayB0aGUgaW5zdGFsbGVyIHJlZ2lzdGVycy4gSXQgc3RhcnRzIHRoZSBhZ2VudCwgYW5kIGRvZXMgbm90aGluZyBlbHNlLiAqL1xyXG5leHBvcnQgY29uc3QgUEFHRV9GTE9XX0xBVU5DSF9MSU5LID0gJ3BhZ2UtZmxvdzovL2xhdW5jaCc7XHJcblxyXG4vKiogSG93IGxvbmcgdG8gd2FpdCBmb3IgdGhlIHN5c3RlbSB0byB0YWtlIHRoZSBsaW5rIGJlZm9yZSBkZWNpZGluZyBubyBwcm9ncmFtIGlzIGluc3RhbGxlZC4gKi9cclxuY29uc3QgTEFVTkNIX1dBSVRfTVMgPSAxNTAwO1xyXG4vKiogSG93IGxvbmcgdG8gd2FpdCBmb3IgYSBzdGFydGVkIGFnZW50IHRvIGFuc3dlci4gKi9cclxuY29uc3QgU1RBUlRfVElNRU9VVF9NUyA9IDIwMDAwO1xyXG5jb25zdCBTVEFSVF9QT0xMX01TID0gMTAwMDtcclxuXHJcbmV4cG9ydCB0eXBlIExhdW5jaE91dGNvbWUgPSAnc3RhcnRlZCcgfCAnbm90LWluc3RhbGxlZCc7XHJcblxyXG4vKipcclxuICogU3RhcnRzIHRoZSBQYWdlLUZsb3cgYWdlbnQgd2hlbiBpdCBpcyBpbnN0YWxsZWQgYnV0IG5vdCBydW5uaW5nLiBBIGJyb3dzZXIgY2Fubm90IGFzayB3aGV0aGVyXHJcbiAqIGEgcHJvZ3JhbSBpcyBpbnN0YWxsZWQsIHNvIHRoaXMgdXNlcyB0aGUgdXN1YWwgY2hlY2s6IGhhbmQgdGhlIGxpbmsgdG8gdGhlIHN5c3RlbSwgdGhlbiBzZWVcclxuICogd2hldGhlciB0aGUgcGFnZSBsb3N0IGZvY3VzLiBJZiBpdCBkaWQgbm90LCBubyBwcm9ncmFtIHRvb2sgdGhlIGxpbmsuXHJcbiAqL1xyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxyXG5leHBvcnQgY2xhc3MgUGFnZUZsb3dMYXVuY2hlclNlcnZpY2Uge1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBwYWdlRmxvdyA9IGluamVjdChQYWdlRmxvd1NlcnZpY2UpO1xyXG4gICAgcmVhZG9ubHkgZG93bmxvYWRVcmwgPSBpbmplY3QoUEFHRV9GTE9XX0RPV05MT0FEX1VSTCk7XHJcblxyXG4gICAgcmVxdWVzdExhdW5jaCgpOiBQcm9taXNlPExhdW5jaE91dGNvbWU+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8TGF1bmNoT3V0Y29tZT4oKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgbGV0IHNldHRsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgY29uc3QgZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcclxuICAgICAgICAgICAgZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGZpbmlzaCA9IChvdXRjb21lOiBMYXVuY2hPdXRjb21lKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2V0dGxlZCkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgc2V0dGxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xyXG4gICAgICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2JsdXInLCBvbkF3YXkpO1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndmlzaWJpbGl0eWNoYW5nZScsIG9uVmlzaWJpbGl0eSk7XHJcbiAgICAgICAgICAgICAgICBmcmFtZS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUob3V0Y29tZSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIC8vIEZvY3VzIG1vdmluZyBpbnRvIHRoZSBoaWRkZW4gZnJhbWUgYWxzbyBmaXJlcyBibHVyLiBPbmx5IGEgcHJvZ3JhbSB0YWtpbmcgZm9jdXMgbGVhdmVzIHRoZSBwYWdlIHdpdGhvdXQgaXQuXHJcbiAgICAgICAgICAgIGNvbnN0IG9uQXdheSA9ICgpID0+IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFkb2N1bWVudC5oYXNGb2N1cygpKSBmaW5pc2goJ3N0YXJ0ZWQnKTtcclxuICAgICAgICAgICAgfSwgMjAwKTtcclxuICAgICAgICAgICAgY29uc3Qgb25WaXNpYmlsaXR5ID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LmhpZGRlbikgZmluaXNoKCdzdGFydGVkJyk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGNvbnN0IHRpbWVyID0gc2V0VGltZW91dCgoKSA9PiBmaW5pc2goJ25vdC1pbnN0YWxsZWQnKSwgTEFVTkNIX1dBSVRfTVMpO1xyXG5cclxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBvbkF3YXkpO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd2aXNpYmlsaXR5Y2hhbmdlJywgb25WaXNpYmlsaXR5KTtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChmcmFtZSk7XHJcbiAgICAgICAgICAgIGZyYW1lLnNyYyA9IFBBR0VfRkxPV19MQVVOQ0hfTElOSztcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogUG9sbHMgdGhlIGFnZW50IHVudGlsIGl0IGFuc3dlcnMsIG9yIGdpdmVzIHVwIGFmdGVyIHRoZSBzdGFydCB0aW1lb3V0LiAqL1xyXG4gICAgYXN5bmMgd2FpdFVudGlsUmVhY2hhYmxlKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgICAgIGNvbnN0IGRlYWRsaW5lID0gRGF0ZS5ub3coKSArIFNUQVJUX1RJTUVPVVRfTVM7XHJcbiAgICAgICAgd2hpbGUgKERhdGUubm93KCkgPCBkZWFkbGluZSkge1xyXG4gICAgICAgICAgICBpZiAoYXdhaXQgdGhpcy5hZ2VudEFuc3dlcnMoKSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIFNUQVJUX1BPTExfTVMpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYXN5bmMgYWdlbnRBbnN3ZXJzKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGFnZUZsb3cuY2xpZW50LmhlYWx0aCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAvLyBBbiB1bnJlYWNoYWJsZSBvciBzbG93IGFnZW50IGlzIG5vdCB1cCB5ZXQuIEFueSBvdGhlciBhbnN3ZXIgbWVhbnMgaXQgaXMgcnVubmluZy5cclxuICAgICAgICAgICAgY29uc3QgY29kZSA9IChlcnJvciBhcyB7IGNvZGU/OiBzdHJpbmcgfSk/LmNvZGU7XHJcbiAgICAgICAgICAgIHJldHVybiBjb2RlICE9PSAnYWdlbnRfdW5yZWFjaGFibGUnICYmIGNvZGUgIT09ICdhZ2VudF90aW1lb3V0JztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19