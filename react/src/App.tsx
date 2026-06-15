import FeedClip, { createIndexedDbFeedbackStore } from "@feedclip/sdk";
import "@feedclip/sdk/style.css";

const saveLocally = createIndexedDbFeedbackStore({
  databaseName: "feedclip-react-example",
});

export default function App() {
  return (
    <main className="demo-shell">
      <section className="demo-copy">
        <span className="eyebrow">React 19 example</span>
        <h1>See the feedback your users are trying to explain.</h1>
        <p>
          Record a short camera clip, add context, and submit it. This demo keeps
          everything in your browser with IndexedDB.
        </p>
        <ul>
          <li>No account or API key</li>
          <li>No upload to a third party</li>
          <li>Production-ready TypeScript config</li>
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
          onSubmit: saveLocally,
        }}
      />
    </main>
  );
}
