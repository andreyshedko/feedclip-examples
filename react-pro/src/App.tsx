import { useEffect, useState } from "react";
import FeedClip, {
  createIndexedDbFeedbackStore,
  type FeedClipLicenseConfig,
} from "@feedclip/sdk";
import "@feedclip/sdk/style.css";
import { loadDemoLicense } from "./license";

const saveLocally = createIndexedDbFeedbackStore({
  databaseName: "feedclip-react-pro-example",
});

export default function App() {
  const [license, setLicense] = useState<FeedClipLicenseConfig>();
  const [licenseError, setLicenseError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    void loadDemoLicense(controller.signal).then(setLicense).catch((error: unknown) => {
      if (controller.signal.aborted) return;
      setLicenseError(error instanceof Error ? error.message : "Pro demo is unavailable");
    });
    return () => controller.abort();
  }, []);

  return (
    <main className="demo-shell">
      <section className="demo-copy">
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
        {licenseError && <p role="alert">{licenseError}</p>}
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
        <section className="feedclip-shell" aria-live="polite">
          <p>{licenseError || "Loading temporary Pro license…"}</p>
        </section>
      )}
    </main>
  );
}
