import { Component } from "@angular/core";
import { FeedClipAngularComponent } from "@feedclip/sdk/angular";
import { createIndexedDbFeedbackStore } from "@feedclip/sdk";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [FeedClipAngularComponent],
  template: `
    <main class="demo-shell">
      <section class="demo-copy">
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
