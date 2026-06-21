import { Component } from "@angular/core";
import { FeedClipAngularComponent } from "@feedclip/sdk/angular";
import { submitToFeedClipCloud } from "./cloud";

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
          Submissions use the live FeedClip Cloud demo.
        </p>
        <ul>
          <li>No permanent API key in the browser</li>
          <li>Private storage with short-lived upload access</li>
          <li>Cloud storage without OpenAI API usage</li>
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
    onSubmit: submitToFeedClipCloud,
  };
}
