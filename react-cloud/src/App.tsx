import { useEffect, useState } from "react";
import FeedClip, { type FeedClipLicenseConfig } from "@feedclip/sdk";
import "@feedclip/sdk/style.css";
import { submitToFeedClipCloud } from "./cloud";
import { loadDemoLicense } from "./license";

export default function App() {
  const [license, setLicense] = useState<FeedClipLicenseConfig>();
  const [licenseError, setLicenseError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    void loadDemoLicense(controller.signal).then(setLicense).catch((error: unknown) => {
      if (controller.signal.aborted) return;
      setLicenseError(error instanceof Error ? error.message : "Cloud demo is unavailable");
    });
    return () => controller.abort();
  }, []);

  return (
    <main className="demo-shell">
      <section className="demo-copy">
        <span className="eyebrow">FeedClip Cloud · React 19</span>
        <h1>Managed feedback upload without browser secrets.</h1>
        <p>
          Cloud includes the Pro capture experience and sends submissions to
          private managed storage with short-lived project credentials.
        </p>
        <ul>
          <li>No permanent API key in the browser</li>
          <li>Private storage with short-lived upload access</li>
          <li>OpenAI disabled for this public demo</li>
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
            getContext: () => ({ source: "react-cloud-stackblitz", plan: "cloud" }),
            onSubmit: submitToFeedClipCloud,
          }}
        />
      ) : (
        <section className="feedclip-shell" aria-live="polite">
          <p>{licenseError || "Loading temporary Cloud license…"}</p>
        </section>
      )}
    </main>
  );
}
