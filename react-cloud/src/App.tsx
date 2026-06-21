import { useCallback, useEffect, useState } from "react";
import FeedClip, { type FeedClipLicenseConfig } from "@feedclip/sdk";
import "@feedclip/sdk/style.css";
import {
  deleteCloudSubmission,
  submitToFeedClipCloud,
  type CloudSubmissionAccess,
} from "./cloud";
import { loadDemoLicense } from "./license";

export default function App() {
  const [license, setLicense] = useState<FeedClipLicenseConfig>();
  const [licenseError, setLicenseError] = useState("");
  const [submissionAccess, setSubmissionAccess] =
    useState<CloudSubmissionAccess>();
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    void loadDemoLicense(controller.signal).then(setLicense).catch((error: unknown) => {
      if (controller.signal.aborted) return;
      setLicenseError(error instanceof Error ? error.message : "Cloud demo is unavailable");
    });
    return () => controller.abort();
  }, []);

  const submit = useCallback(
    (
      submission: Parameters<typeof submitToFeedClipCloud>[0],
      onProgress?: (percent: number) => void
    ) => {
      setSubmissionStatus("");
      return submitToFeedClipCloud(submission, onProgress, (access) => {
        setSubmissionAccess(access);
        setSubmissionStatus(
          "Uploaded to the private Cloud demo bucket. It will be deleted within 24 hours."
        );
      });
    },
    []
  );

  const deleteSubmission = useCallback(async () => {
    if (!submissionAccess) return;
    setIsDeleting(true);
    setSubmissionStatus("");
    try {
      await deleteCloudSubmission(submissionAccess);
      setSubmissionAccess(undefined);
      setSubmissionStatus("Submission deleted from the Cloud demo.");
    } catch (error) {
      setSubmissionStatus(error instanceof Error ? error.message : "Deletion failed");
    } finally {
      setIsDeleting(false);
    }
  }, [submissionAccess]);

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
          <li>Manual deletion or automatic deletion within 24 hours</li>
        </ul>
        {licenseError && <p role="alert">{licenseError}</p>}
        {submissionStatus && <p role="status">{submissionStatus}</p>}
        <div className="consent">
          <input
            id="cloud-demo-consent"
            type="checkbox"
            checked={hasConsent}
            onChange={(event) => setHasConsent(event.target.checked)}
          />
          <label htmlFor="cloud-demo-consent">
            I have read the{" "}
            <a
              href="https://www.feedclip.dev/privacy"
              target="_blank"
              rel="noreferrer"
            >
              Cloud demo privacy notice
            </a>
            . I understand that submitting uploads this recording for up to 24
            hours, and I will not record sensitive information.
          </label>
        </div>
        {submissionAccess && (
          <button
            className="delete-button"
            type="button"
            onClick={deleteSubmission}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting…" : "Delete my demo submission"}
          </button>
        )}
      </section>

      {license && hasConsent ? (
        <FeedClip
          config={{
            locale: "en-US",
            maxDurationMilliSeconds: 20_000,
            maxFileSize: 10 * 1024 * 1024,
            defaultVideoFileExtension: "webm",
            defaultVideoFileNameStyle: "ISO 8601",
            license,
            onLicenseError: setLicenseError,
            privacyNotice: {
              url: "https://www.feedclip.dev/privacy",
              label: "Cloud demo privacy and retention",
            },
            getContext: () => ({ source: "react-cloud-stackblitz", plan: "cloud" }),
            onSubmit: submit,
          }}
        />
      ) : (
        <section className="feedclip-shell" aria-live="polite">
          <p>
            {licenseError ||
              (license
                ? "Accept the demo privacy notice to start recording."
                : "Loading temporary Cloud license…")}
          </p>
        </section>
      )}
    </main>
  );
}
