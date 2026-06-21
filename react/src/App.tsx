import FeedClip from "@feedclip/sdk";
import "@feedclip/sdk/style.css";
import { submitToFeedClipCloud } from "./cloud";

export default function App() {
  return (
    <main className="demo-shell">
      <section className="demo-copy">
        <span className="eyebrow">React 19 example</span>
        <h1>See the feedback your users are trying to explain.</h1>
        <p>
          Record a short camera clip, add context, and submit it to the live
          FeedClip Cloud pipeline.
        </p>
        <ul>
          <li>No account or permanent API key in the browser</li>
          <li>Private storage with short-lived upload access</li>
          <li>Cloud storage without OpenAI API usage</li>
        </ul>
      </section>

      <FeedClip
        config={{
          locale: "en-US",
          maxDurationMilliSeconds: 60_000,
          maxFileSize: 100_000_000,
          defaultVideoFileExtension: "webm",
          defaultVideoFileNameStyle: "ISO 8601",
          privacyNotice: {
            url: "https://github.com/andreyshedko/feedclip",
            label: "How this demo handles data",
          },
          getContext: () => ({
            source: "react-stackblitz-example",
            plan: "demo",
          }),
          onSubmit: submitToFeedClipCloud,
        }}
      />
    </main>
  );
}
