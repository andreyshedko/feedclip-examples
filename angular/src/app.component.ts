import { Component } from "@angular/core";
import { FeedClipAngularComponent } from "@feedclip/sdk/angular";
import { createIndexedDbFeedbackStore } from "@feedclip/sdk";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [FeedClipAngularComponent],
  template: `
    <main class="demo-shell">
      @if (isEmbedded) {
        <aside class="embedded-preview-notice" role="note">
          <strong>Screen recording needs a standalone tab.</strong>
          <p>StackBlitz blocks screen sharing inside its embedded preview. Use the StackBlitz preview toolbar&apos;s <b>Open preview in a new tab</b> button, then choose <b>Record screen</b> again.</p>
        </aside>
      }
      <section class="demo-copy">
        <a class="brand-link" href="https://www.feedclip.dev" target="_blank" rel="noreferrer">
          <span class="brand-mark" aria-hidden="true">
            <span class="brand-dot"></span>
          </span>
          feedclip
        </a>
        <span class="eyebrow">Angular 21 example</span>
        <h1>Drop video feedback into an Angular product.</h1>
        <p>
          The standalone adapter handles mount, config updates, and cleanup.
          Submissions stay in local IndexedDB.
        </p>
        <ul>
          <li>No account or backend required</li>
          <li>Standalone Angular component</li>
          <li>Strict TypeScript configuration</li>
        </ul>
      </section>

      <feedclip-widget [config]="config" />
    </main>
  `,
})
export class AppComponent {
  readonly isEmbedded = typeof window !== "undefined" && window.parent !== window;
  readonly config = {
    locale: "en-US" as const,
    maxDurationMilliSeconds: 60_000,
    maxFileSize: 100_000_000,
    defaultVideoFileExtension: "webm" as const,
    defaultVideoFileNameStyle: "ISO 8601" as const,
    privacyNotice: {
      url: "https://github.com/andreyshedko/feedclip",
      label: "How this demo handles data",
    },
    getContext: () => ({
      source: "angular-stackblitz-example",
      plan: "demo",
    }),
    onSubmit: createIndexedDbFeedbackStore({
      databaseName: "feedclip-angular-free-example",
    }),
  };
}
