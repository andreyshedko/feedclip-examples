import FeedClip, { createIndexedDbFeedbackStore } from "@feedclip/sdk";
import "@feedclip/sdk/style.css";
import EmbeddedPreviewNotice from "./EmbeddedPreviewNotice";

const saveLocally = createIndexedDbFeedbackStore({
  databaseName: "feedclip-react-free-example",
});

export default function App() {
  return (
    <main className="demo-shell">
      <EmbeddedPreviewNotice />
      <section className="demo-copy">
        <a className="brand-link" href="https://www.feedclip.dev" target="_blank" rel="noreferrer">
          <span className="brand-mark" aria-hidden="true">
            <span className="brand-dot" />
          </span>
          feedclip
        </a>
        <span className="eyebrow">React 19 example</span>
        <h1>See the feedback your users are trying to explain.</h1>
        <p>
          Record a short camera clip, add context, and save it to local browser
          storage with the free SDK.
        </p>
        <ul>
          <li>No account or backend required</li>
          <li>Submissions stay in IndexedDB</li>
          <li>MIT licensed, including commercial use</li>
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
            plan: "free",
          }),
          onSubmit: saveLocally,
        }}
      />
      <CodeSample />
    </main>
  );
}

function CodeSample() {
  return (
    <section className="code-panel" aria-labelledby="code-heading">
      <div className="code-panel-heading">
        <div>
          <span className="code-kicker">Copy this integration</span>
          <h2 id="code-heading">React · Free SDK</h2>
        </div>
        <a href="https://www.npmjs.com/package/@feedclip/sdk" target="_blank" rel="noreferrer">npm package ↗</a>
      </div>
      <pre><code>{`import FeedClip, { createIndexedDbFeedbackStore } from "@feedclip/sdk";
import "@feedclip/sdk/style.css";

<FeedClip
  config={{
    maxDurationMilliSeconds: 60_000,
    onSubmit: createIndexedDbFeedbackStore({
      databaseName: "feedback",
    }),
  }}
/>`}</code></pre>
    </section>
  );
}
