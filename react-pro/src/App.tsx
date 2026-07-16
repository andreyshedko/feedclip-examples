import { useCallback, useEffect, useState } from "react";
import FeedClip, {
  createIndexedDbFeedbackStore,
  type FeedClipLicenseConfig,
} from "@feedclip/sdk";
import "@feedclip/sdk/style.css";
import { loadDemoLicense } from "./license";
import EmbeddedPreviewNotice from "./EmbeddedPreviewNotice";

const saveLocally = createIndexedDbFeedbackStore({
  databaseName: "feedclip-react-pro-example",
});

export default function App() {
  const [license, setLicense] = useState<FeedClipLicenseConfig>();
  const [licenseError, setLicenseError] = useState("");
  const [isLicenseLoading, setIsLicenseLoading] = useState(true);

  const requestLicense = useCallback(async (signal?: AbortSignal) => {
    setLicenseError("");
    setIsLicenseLoading(true);
    try {
      const demoLicense = await loadDemoLicense(signal);
      if (signal?.aborted) return;
      setLicense(demoLicense);
    } catch (error: unknown) {
      if (signal?.aborted) return;
      setLicenseError(
        error instanceof Error ? error.message : "Pro demo is unavailable"
      );
    } finally {
      if (!signal?.aborted) setIsLicenseLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void requestLicense(controller.signal);
    return () => controller.abort();
  }, [requestLicense]);

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
        <span className="eyebrow">FeedClip Pro · React 19</span>
        <h1>Polished feedback capture on your own infrastructure.</h1>
        <p>
          Pro unlocks trimming, thumbnails, upload progress, and branding
          removal. This demo keeps submissions locally in IndexedDB.
        </p>
        <ul>
          <li>Temporary 15-minute demo license</li>
          <li>No permanent license in source code</li>
          <li>Your backend and storage remain yours</li>
        </ul>
        {license && licenseError && (
          <LicenseAlert
            message={licenseError}
            isRetrying={isLicenseLoading}
            onRetry={() => void requestLicense()}
          />
        )}
      </section>

      {license ? (
        <FeedClip
          config={{
            locale: "en-US",
            maxDurationMilliSeconds: 60_000,
            maxFileSize: 100_000_000,
            defaultVideoFileExtension: "webm",
            defaultVideoFileNameStyle: "ISO 8601",
            license,
            onLicenseError: setLicenseError,
            getContext: () => ({ source: "react-pro-stackblitz", plan: "pro" }),
            onSubmit: saveLocally,
          }}
        />
      ) : (
        <section className="license-panel" aria-live="polite">
          {licenseError ? (
            <LicenseAlert
              message={licenseError}
              isRetrying={isLicenseLoading}
              onRetry={() => void requestLicense()}
            />
          ) : (
            <p>Loading temporary Pro license…</p>
          )}
        </section>
      )}
      <CodeSample />
    </main>
  );
}

function CodeSample() {
  return (
    <section className="code-panel" aria-labelledby="code-heading">
      <div className="code-panel-heading">
        <div><span className="code-kicker">Copy this integration</span><h2 id="code-heading">React · Pro</h2></div>
        <a href="https://www.npmjs.com/package/@feedclip/sdk" target="_blank" rel="noreferrer">SDK docs ↗</a>
      </div>
      <pre><code>{`import FeedClip from "@feedclip/sdk";
import "@feedclip/sdk/style.css";

<FeedClip
  config={{
    license,
    onSubmit: saveFeedback,
    getContext: () => ({ issueId }),
  }}
/>`}</code></pre>
    </section>
  );
}

function LicenseAlert({
  message,
  isRetrying,
  onRetry,
}: {
  message: string;
  isRetrying: boolean;
  onRetry: () => void;
}) {
  return (
    <div className="license-alert" role="alert">
      <strong>Demo license did not load</strong>
      <p>{message}</p>
      <button type="button" onClick={onRetry} disabled={isRetrying}>
        {isRetrying ? "Retrying…" : "Try again"}
      </button>
    </div>
  );
}
