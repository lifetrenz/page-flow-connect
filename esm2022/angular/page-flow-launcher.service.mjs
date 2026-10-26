import { Injectable, InjectionToken, inject } from '@angular/core';
import { PageFlowService } from './page-flow.service';
import * as i0 from "@angular/core";
/**
 * An override for the Windows installer link. Empty means the default GitHub release link, which
 * is used for Windows only; other systems get a "not yet available" message.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZS1mbG93LWxhdW5jaGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYW5ndWxhci9wYWdlLWZsb3ctbGF1bmNoZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbkUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHFCQUFxQixDQUFDOztBQUV0RDs7O0dBR0c7QUFDSCxNQUFNLENBQUMsTUFBTSxzQkFBc0IsR0FBRyxJQUFJLGNBQWMsQ0FBUyx3QkFBd0IsRUFBRTtJQUN2RixVQUFVLEVBQUUsTUFBTTtJQUNsQixPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRTtDQUNwQixDQUFDLENBQUM7QUFFSCxvRkFBb0Y7QUFDcEYsTUFBTSxDQUFDLE1BQU0scUJBQXFCLEdBQUcsb0JBQW9CLENBQUM7QUFFMUQsZ0dBQWdHO0FBQ2hHLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQztBQUM1QixzREFBc0Q7QUFDdEQsTUFBTSxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7QUFDL0IsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDO0FBSTNCOzs7O0dBSUc7QUFFSCxNQUFNLE9BQU8sdUJBQXVCO0lBRHBDO1FBRXFCLGFBQVEsR0FBRyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDM0MsZ0JBQVcsR0FBRyxNQUFNLENBQUMsc0JBQXNCLENBQUMsQ0FBQztLQXFEekQ7SUFuREcsYUFBYTtRQUNULE9BQU8sSUFBSSxPQUFPLENBQWdCLENBQUMsT0FBTyxFQUFFLEVBQUU7WUFDMUMsSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDO1lBQ3BCLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDL0MsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1lBRTdCLE1BQU0sTUFBTSxHQUFHLENBQUMsT0FBc0IsRUFBRSxFQUFFO2dCQUN0QyxJQUFJLE9BQU87b0JBQUUsT0FBTztnQkFDcEIsT0FBTyxHQUFHLElBQUksQ0FBQztnQkFDZixZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3BCLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQzNDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxrQkFBa0IsRUFBRSxZQUFZLENBQUMsQ0FBQztnQkFDL0QsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUNmLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNyQixDQUFDLENBQUM7WUFDRiw4R0FBOEc7WUFDOUcsTUFBTSxNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDakMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUU7b0JBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ2hELENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNSLE1BQU0sWUFBWSxHQUFHLEdBQUcsRUFBRTtnQkFDdEIsSUFBSSxRQUFRLENBQUMsTUFBTTtvQkFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDM0MsQ0FBQyxDQUFDO1lBQ0YsTUFBTSxLQUFLLEdBQUcsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsRUFBRSxjQUFjLENBQUMsQ0FBQztZQUV4RSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ3hDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxZQUFZLENBQUMsQ0FBQztZQUM1RCxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNqQyxLQUFLLENBQUMsR0FBRyxHQUFHLHFCQUFxQixDQUFDO1FBQ3RDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELDZFQUE2RTtJQUM3RSxLQUFLLENBQUMsa0JBQWtCO1FBQ3BCLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxnQkFBZ0IsQ0FBQztRQUMvQyxPQUFPLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxRQUFRLEVBQUUsQ0FBQztZQUMzQixJQUFJLE1BQU0sSUFBSSxDQUFDLFlBQVksRUFBRTtnQkFBRSxPQUFPLElBQUksQ0FBQztZQUMzQyxNQUFNLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUM7UUFDdkUsQ0FBQztRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFTyxLQUFLLENBQUMsWUFBWTtRQUN0QixJQUFJLENBQUM7WUFDRCxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ3BDLE9BQU8sSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2Isb0ZBQW9GO1lBQ3BGLE1BQU0sSUFBSSxHQUFJLEtBQTJCLEVBQUUsSUFBSSxDQUFDO1lBQ2hELE9BQU8sSUFBSSxLQUFLLG1CQUFtQixJQUFJLElBQUksS0FBSyxlQUFlLENBQUM7UUFDcEUsQ0FBQztJQUNMLENBQUM7K0dBdERRLHVCQUF1QjttSEFBdkIsdUJBQXVCLGNBRFYsTUFBTTs7NEZBQ25CLHVCQUF1QjtrQkFEbkMsVUFBVTttQkFBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3Rpb25Ub2tlbiwgaW5qZWN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFBhZ2VGbG93U2VydmljZSB9IGZyb20gJy4vcGFnZS1mbG93LnNlcnZpY2UnO1xyXG5cclxuLyoqXHJcbiAqIEFuIG92ZXJyaWRlIGZvciB0aGUgV2luZG93cyBpbnN0YWxsZXIgbGluay4gRW1wdHkgbWVhbnMgdGhlIGRlZmF1bHQgR2l0SHViIHJlbGVhc2UgbGluaywgd2hpY2hcclxuICogaXMgdXNlZCBmb3IgV2luZG93cyBvbmx5OyBvdGhlciBzeXN0ZW1zIGdldCBhIFwibm90IHlldCBhdmFpbGFibGVcIiBtZXNzYWdlLlxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IFBBR0VfRkxPV19ET1dOTE9BRF9VUkwgPSBuZXcgSW5qZWN0aW9uVG9rZW48c3RyaW5nPignUEFHRV9GTE9XX0RPV05MT0FEX1VSTCcsIHtcclxuICAgIHByb3ZpZGVkSW46ICdyb290JyxcclxuICAgIGZhY3Rvcnk6ICgpID0+ICcnLFxyXG59KTtcclxuXHJcbi8qKiBUaGUgbGluayB0aGUgaW5zdGFsbGVyIHJlZ2lzdGVycy4gSXQgc3RhcnRzIHRoZSBhZ2VudCwgYW5kIGRvZXMgbm90aGluZyBlbHNlLiAqL1xyXG5leHBvcnQgY29uc3QgUEFHRV9GTE9XX0xBVU5DSF9MSU5LID0gJ3BhZ2UtZmxvdzovL2xhdW5jaCc7XHJcblxyXG4vKiogSG93IGxvbmcgdG8gd2FpdCBmb3IgdGhlIHN5c3RlbSB0byB0YWtlIHRoZSBsaW5rIGJlZm9yZSBkZWNpZGluZyBubyBwcm9ncmFtIGlzIGluc3RhbGxlZC4gKi9cclxuY29uc3QgTEFVTkNIX1dBSVRfTVMgPSAxNTAwO1xyXG4vKiogSG93IGxvbmcgdG8gd2FpdCBmb3IgYSBzdGFydGVkIGFnZW50IHRvIGFuc3dlci4gKi9cclxuY29uc3QgU1RBUlRfVElNRU9VVF9NUyA9IDIwMDAwO1xyXG5jb25zdCBTVEFSVF9QT0xMX01TID0gMTAwMDtcclxuXHJcbmV4cG9ydCB0eXBlIExhdW5jaE91dGNvbWUgPSAnc3RhcnRlZCcgfCAnbm90LWluc3RhbGxlZCc7XHJcblxyXG4vKipcclxuICogU3RhcnRzIHRoZSBQYWdlLUZsb3cgYWdlbnQgd2hlbiBpdCBpcyBpbnN0YWxsZWQgYnV0IG5vdCBydW5uaW5nLiBBIGJyb3dzZXIgY2Fubm90IGFzayB3aGV0aGVyXHJcbiAqIGEgcHJvZ3JhbSBpcyBpbnN0YWxsZWQsIHNvIHRoaXMgdXNlcyB0aGUgdXN1YWwgY2hlY2s6IGhhbmQgdGhlIGxpbmsgdG8gdGhlIHN5c3RlbSwgdGhlbiBzZWVcclxuICogd2hldGhlciB0aGUgcGFnZSBsb3N0IGZvY3VzLiBJZiBpdCBkaWQgbm90LCBubyBwcm9ncmFtIHRvb2sgdGhlIGxpbmsuXHJcbiAqL1xyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxyXG5leHBvcnQgY2xhc3MgUGFnZUZsb3dMYXVuY2hlclNlcnZpY2Uge1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBwYWdlRmxvdyA9IGluamVjdChQYWdlRmxvd1NlcnZpY2UpO1xyXG4gICAgcmVhZG9ubHkgZG93bmxvYWRVcmwgPSBpbmplY3QoUEFHRV9GTE9XX0RPV05MT0FEX1VSTCk7XHJcblxyXG4gICAgcmVxdWVzdExhdW5jaCgpOiBQcm9taXNlPExhdW5jaE91dGNvbWU+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8TGF1bmNoT3V0Y29tZT4oKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgbGV0IHNldHRsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgY29uc3QgZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcclxuICAgICAgICAgICAgZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGZpbmlzaCA9IChvdXRjb21lOiBMYXVuY2hPdXRjb21lKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2V0dGxlZCkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgc2V0dGxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xyXG4gICAgICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2JsdXInLCBvbkF3YXkpO1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndmlzaWJpbGl0eWNoYW5nZScsIG9uVmlzaWJpbGl0eSk7XHJcbiAgICAgICAgICAgICAgICBmcmFtZS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUob3V0Y29tZSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIC8vIEZvY3VzIG1vdmluZyBpbnRvIHRoZSBoaWRkZW4gZnJhbWUgYWxzbyBmaXJlcyBibHVyLiBPbmx5IGEgcHJvZ3JhbSB0YWtpbmcgZm9jdXMgbGVhdmVzIHRoZSBwYWdlIHdpdGhvdXQgaXQuXHJcbiAgICAgICAgICAgIGNvbnN0IG9uQXdheSA9ICgpID0+IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFkb2N1bWVudC5oYXNGb2N1cygpKSBmaW5pc2goJ3N0YXJ0ZWQnKTtcclxuICAgICAgICAgICAgfSwgMjAwKTtcclxuICAgICAgICAgICAgY29uc3Qgb25WaXNpYmlsaXR5ID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LmhpZGRlbikgZmluaXNoKCdzdGFydGVkJyk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGNvbnN0IHRpbWVyID0gc2V0VGltZW91dCgoKSA9PiBmaW5pc2goJ25vdC1pbnN0YWxsZWQnKSwgTEFVTkNIX1dBSVRfTVMpO1xyXG5cclxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBvbkF3YXkpO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd2aXNpYmlsaXR5Y2hhbmdlJywgb25WaXNpYmlsaXR5KTtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChmcmFtZSk7XHJcbiAgICAgICAgICAgIGZyYW1lLnNyYyA9IFBBR0VfRkxPV19MQVVOQ0hfTElOSztcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogUG9sbHMgdGhlIGFnZW50IHVudGlsIGl0IGFuc3dlcnMsIG9yIGdpdmVzIHVwIGFmdGVyIHRoZSBzdGFydCB0aW1lb3V0LiAqL1xyXG4gICAgYXN5bmMgd2FpdFVudGlsUmVhY2hhYmxlKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgICAgIGNvbnN0IGRlYWRsaW5lID0gRGF0ZS5ub3coKSArIFNUQVJUX1RJTUVPVVRfTVM7XHJcbiAgICAgICAgd2hpbGUgKERhdGUubm93KCkgPCBkZWFkbGluZSkge1xyXG4gICAgICAgICAgICBpZiAoYXdhaXQgdGhpcy5hZ2VudEFuc3dlcnMoKSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIFNUQVJUX1BPTExfTVMpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYXN5bmMgYWdlbnRBbnN3ZXJzKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGFnZUZsb3cuY2xpZW50LmhlYWx0aCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAvLyBBbiB1bnJlYWNoYWJsZSBvciBzbG93IGFnZW50IGlzIG5vdCB1cCB5ZXQuIEFueSBvdGhlciBhbnN3ZXIgbWVhbnMgaXQgaXMgcnVubmluZy5cclxuICAgICAgICAgICAgY29uc3QgY29kZSA9IChlcnJvciBhcyB7IGNvZGU/OiBzdHJpbmcgfSk/LmNvZGU7XHJcbiAgICAgICAgICAgIHJldHVybiBjb2RlICE9PSAnYWdlbnRfdW5yZWFjaGFibGUnICYmIGNvZGUgIT09ICdhZ2VudF90aW1lb3V0JztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19