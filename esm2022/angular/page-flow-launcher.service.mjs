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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZS1mbG93LWxhdW5jaGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYW5ndWxhci9wYWdlLWZsb3ctbGF1bmNoZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbkUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHFCQUFxQixDQUFDOztBQUV0RDs7O0dBR0c7QUFDSCxNQUFNLENBQUMsTUFBTSxzQkFBc0IsR0FBRyxJQUFJLGNBQWMsQ0FBUyx3QkFBd0IsRUFBRTtJQUN2RixVQUFVLEVBQUUsTUFBTTtJQUNsQixPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRTtDQUNwQixDQUFDLENBQUM7QUFFSCxvRkFBb0Y7QUFDcEYsTUFBTSxDQUFDLE1BQU0scUJBQXFCLEdBQUcsb0JBQW9CLENBQUM7QUFFMUQsZ0dBQWdHO0FBQ2hHLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQztBQUM1QixzREFBc0Q7QUFDdEQsTUFBTSxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7QUFDL0IsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDO0FBSTNCOzs7O0dBSUc7QUFFSCxNQUFNLE9BQU8sdUJBQXVCO0lBRHBDO1FBRXFCLGFBQVEsR0FBRyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDM0MsZ0JBQVcsR0FBRyxNQUFNLENBQUMsc0JBQXNCLENBQUMsQ0FBQztLQXFEekQ7SUFuREcsYUFBYTtRQUNULE9BQU8sSUFBSSxPQUFPLENBQWdCLENBQUMsT0FBTyxFQUFFLEVBQUU7WUFDMUMsSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDO1lBQ3BCLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDL0MsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1lBRTdCLE1BQU0sTUFBTSxHQUFHLENBQUMsT0FBc0IsRUFBRSxFQUFFO2dCQUN0QyxJQUFJLE9BQU87b0JBQUUsT0FBTztnQkFDcEIsT0FBTyxHQUFHLElBQUksQ0FBQztnQkFDZixZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3BCLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQzNDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxrQkFBa0IsRUFBRSxZQUFZLENBQUMsQ0FBQztnQkFDL0QsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUNmLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNyQixDQUFDLENBQUM7WUFDRiw4R0FBOEc7WUFDOUcsTUFBTSxNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDakMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUU7b0JBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ2hELENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNSLE1BQU0sWUFBWSxHQUFHLEdBQUcsRUFBRTtnQkFDdEIsSUFBSSxRQUFRLENBQUMsTUFBTTtvQkFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDM0MsQ0FBQyxDQUFDO1lBQ0YsTUFBTSxLQUFLLEdBQUcsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsRUFBRSxjQUFjLENBQUMsQ0FBQztZQUV4RSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ3hDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxZQUFZLENBQUMsQ0FBQztZQUM1RCxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNqQyxLQUFLLENBQUMsR0FBRyxHQUFHLHFCQUFxQixDQUFDO1FBQ3RDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELDZFQUE2RTtJQUM3RSxLQUFLLENBQUMsa0JBQWtCO1FBQ3BCLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxnQkFBZ0IsQ0FBQztRQUMvQyxPQUFPLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxRQUFRLEVBQUUsQ0FBQztZQUMzQixJQUFJLE1BQU0sSUFBSSxDQUFDLFlBQVksRUFBRTtnQkFBRSxPQUFPLElBQUksQ0FBQztZQUMzQyxNQUFNLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUM7UUFDdkUsQ0FBQztRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFTyxLQUFLLENBQUMsWUFBWTtRQUN0QixJQUFJLENBQUM7WUFDRCxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ3BDLE9BQU8sSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2Isb0ZBQW9GO1lBQ3BGLE1BQU0sSUFBSSxHQUFJLEtBQTJCLEVBQUUsSUFBSSxDQUFDO1lBQ2hELE9BQU8sSUFBSSxLQUFLLG1CQUFtQixJQUFJLElBQUksS0FBSyxlQUFlLENBQUM7UUFDcEUsQ0FBQztJQUNMLENBQUM7K0dBdERRLHVCQUF1QjttSEFBdkIsdUJBQXVCLGNBRFYsTUFBTTs7NEZBQ25CLHVCQUF1QjtrQkFEbkMsVUFBVTttQkFBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3Rpb25Ub2tlbiwgaW5qZWN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFBhZ2VGbG93U2VydmljZSB9IGZyb20gJy4vcGFnZS1mbG93LnNlcnZpY2UnO1xyXG5cclxuLyoqXHJcbiAqIFdoZXJlIHRoZSBQYWdlLUZsb3cgaW5zdGFsbGVyIGlzIGRvd25sb2FkZWQgZnJvbS4gRW1wdHkgdW50aWwgdGhlIHJlbGVhc2UgbG9jYXRpb24gaXMgc2V0OyB0aGVcclxuICogc2NyZWVuIHRoZW4gdGVsbHMgdGhlIHBlcnNvbiB0byBhc2sgSVQgZm9yIHRoZSBpbnN0YWxsZXIuXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgUEFHRV9GTE9XX0RPV05MT0FEX1VSTCA9IG5ldyBJbmplY3Rpb25Ub2tlbjxzdHJpbmc+KCdQQUdFX0ZMT1dfRE9XTkxPQURfVVJMJywge1xyXG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxyXG4gICAgZmFjdG9yeTogKCkgPT4gJycsXHJcbn0pO1xyXG5cclxuLyoqIFRoZSBsaW5rIHRoZSBpbnN0YWxsZXIgcmVnaXN0ZXJzLiBJdCBzdGFydHMgdGhlIGFnZW50LCBhbmQgZG9lcyBub3RoaW5nIGVsc2UuICovXHJcbmV4cG9ydCBjb25zdCBQQUdFX0ZMT1dfTEFVTkNIX0xJTksgPSAncGFnZS1mbG93Oi8vbGF1bmNoJztcclxuXHJcbi8qKiBIb3cgbG9uZyB0byB3YWl0IGZvciB0aGUgc3lzdGVtIHRvIHRha2UgdGhlIGxpbmsgYmVmb3JlIGRlY2lkaW5nIG5vIHByb2dyYW0gaXMgaW5zdGFsbGVkLiAqL1xyXG5jb25zdCBMQVVOQ0hfV0FJVF9NUyA9IDE1MDA7XHJcbi8qKiBIb3cgbG9uZyB0byB3YWl0IGZvciBhIHN0YXJ0ZWQgYWdlbnQgdG8gYW5zd2VyLiAqL1xyXG5jb25zdCBTVEFSVF9USU1FT1VUX01TID0gMjAwMDA7XHJcbmNvbnN0IFNUQVJUX1BPTExfTVMgPSAxMDAwO1xyXG5cclxuZXhwb3J0IHR5cGUgTGF1bmNoT3V0Y29tZSA9ICdzdGFydGVkJyB8ICdub3QtaW5zdGFsbGVkJztcclxuXHJcbi8qKlxyXG4gKiBTdGFydHMgdGhlIFBhZ2UtRmxvdyBhZ2VudCB3aGVuIGl0IGlzIGluc3RhbGxlZCBidXQgbm90IHJ1bm5pbmcuIEEgYnJvd3NlciBjYW5ub3QgYXNrIHdoZXRoZXJcclxuICogYSBwcm9ncmFtIGlzIGluc3RhbGxlZCwgc28gdGhpcyB1c2VzIHRoZSB1c3VhbCBjaGVjazogaGFuZCB0aGUgbGluayB0byB0aGUgc3lzdGVtLCB0aGVuIHNlZVxyXG4gKiB3aGV0aGVyIHRoZSBwYWdlIGxvc3QgZm9jdXMuIElmIGl0IGRpZCBub3QsIG5vIHByb2dyYW0gdG9vayB0aGUgbGluay5cclxuICovXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXHJcbmV4cG9ydCBjbGFzcyBQYWdlRmxvd0xhdW5jaGVyU2VydmljZSB7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHBhZ2VGbG93ID0gaW5qZWN0KFBhZ2VGbG93U2VydmljZSk7XHJcbiAgICByZWFkb25seSBkb3dubG9hZFVybCA9IGluamVjdChQQUdFX0ZMT1dfRE9XTkxPQURfVVJMKTtcclxuXHJcbiAgICByZXF1ZXN0TGF1bmNoKCk6IFByb21pc2U8TGF1bmNoT3V0Y29tZT4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxMYXVuY2hPdXRjb21lPigocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgc2V0dGxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBjb25zdCBmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpO1xyXG4gICAgICAgICAgICBmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZmluaXNoID0gKG91dGNvbWU6IExhdW5jaE91dGNvbWUpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChzZXR0bGVkKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICBzZXR0bGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignYmx1cicsIG9uQXdheSk7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd2aXNpYmlsaXR5Y2hhbmdlJywgb25WaXNpYmlsaXR5KTtcclxuICAgICAgICAgICAgICAgIGZyYW1lLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShvdXRjb21lKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgLy8gRm9jdXMgbW92aW5nIGludG8gdGhlIGhpZGRlbiBmcmFtZSBhbHNvIGZpcmVzIGJsdXIuIE9ubHkgYSBwcm9ncmFtIHRha2luZyBmb2N1cyBsZWF2ZXMgdGhlIHBhZ2Ugd2l0aG91dCBpdC5cclxuICAgICAgICAgICAgY29uc3Qgb25Bd2F5ID0gKCkgPT4gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWRvY3VtZW50Lmhhc0ZvY3VzKCkpIGZpbmlzaCgnc3RhcnRlZCcpO1xyXG4gICAgICAgICAgICB9LCAyMDApO1xyXG4gICAgICAgICAgICBjb25zdCBvblZpc2liaWxpdHkgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQuaGlkZGVuKSBmaW5pc2goJ3N0YXJ0ZWQnKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgY29uc3QgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IGZpbmlzaCgnbm90LWluc3RhbGxlZCcpLCBMQVVOQ0hfV0FJVF9NUyk7XHJcblxyXG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIG9uQXdheSk7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Zpc2liaWxpdHljaGFuZ2UnLCBvblZpc2liaWxpdHkpO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGZyYW1lKTtcclxuICAgICAgICAgICAgZnJhbWUuc3JjID0gUEFHRV9GTE9XX0xBVU5DSF9MSU5LO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBQb2xscyB0aGUgYWdlbnQgdW50aWwgaXQgYW5zd2Vycywgb3IgZ2l2ZXMgdXAgYWZ0ZXIgdGhlIHN0YXJ0IHRpbWVvdXQuICovXHJcbiAgICBhc3luYyB3YWl0VW50aWxSZWFjaGFibGUoKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgICAgY29uc3QgZGVhZGxpbmUgPSBEYXRlLm5vdygpICsgU1RBUlRfVElNRU9VVF9NUztcclxuICAgICAgICB3aGlsZSAoRGF0ZS5ub3coKSA8IGRlYWRsaW5lKSB7XHJcbiAgICAgICAgICAgIGlmIChhd2FpdCB0aGlzLmFnZW50QW5zd2VycygpKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgU1RBUlRfUE9MTF9NUykpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhc3luYyBhZ2VudEFuc3dlcnMoKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5wYWdlRmxvdy5jbGllbnQuaGVhbHRoKCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIC8vIEFuIHVucmVhY2hhYmxlIG9yIHNsb3cgYWdlbnQgaXMgbm90IHVwIHlldC4gQW55IG90aGVyIGFuc3dlciBtZWFucyBpdCBpcyBydW5uaW5nLlxyXG4gICAgICAgICAgICBjb25zdCBjb2RlID0gKGVycm9yIGFzIHsgY29kZT86IHN0cmluZyB9KT8uY29kZTtcclxuICAgICAgICAgICAgcmV0dXJuIGNvZGUgIT09ICdhZ2VudF91bnJlYWNoYWJsZScgJiYgY29kZSAhPT0gJ2FnZW50X3RpbWVvdXQnO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=