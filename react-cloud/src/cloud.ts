import {
  createFeedbackEndpointTransport,
  type FeedbackReceipt,
  type FeedbackSubmission,
} from "@feedclip/sdk";

const tokenEndpoint = "https://www.feedclip.dev/api/feedclip/demo-token";
const submissionEndpoint = "https://api.feedclip.dev/v1/submissions";

export type CloudSubmissionAccess = {
  feedbackId: string;
  token: string;
};

const sampleCompletedReceipt = (
  submission: FeedbackSubmission,
  receipt: FeedbackReceipt
): FeedbackReceipt => {
  const summary =
    submission.description.trim() ||
    "The public Cloud demo uploaded a recording successfully.";
  const issueMarkdown = [
    "# Sample Cloud issue export",
    "",
    "> OpenAI analysis is disabled for the public demo, so this is a safe sample result generated in the example UI.",
    "",
    "## Summary",
    summary,
    "",
    "## Priority",
    "- **Priority:** medium",
    "- **Category:** bug",
    "- **Sentiment:** neutral",
    "",
    "## Triage",
    "- **Impact:** degrades_workflow",
    "- **Reproducibility:** unknown",
    "- **Suggested owner:** product-engineering",
    "",
    "## Suggested next actions",
    "- [ ] Review the uploaded recording in your private Cloud storage.",
    "- [ ] Reproduce the reported flow in the same browser context.",
    "- [ ] Convert this sample report into a real tracker issue in production.",
    "",
    "## Reproduction steps",
    "- Record feedback in the React Cloud demo.",
    "- Submit it to the private demo bucket.",
    "- Copy the issue export from the result panel.",
  ].join("\n");

  return {
    ...receipt,
    status: "completed",
    analysis: {
      title: "Sample Cloud issue export",
      summary,
      category: submission.kind,
      priority: "medium",
      sentiment: "neutral",
      triage: {
        impact: "degrades_workflow",
        reproducibility: "unknown",
        suggestedOwner: "product-engineering",
      },
      nextActions: [
        "Review the uploaded recording in private Cloud storage",
        "Reproduce the reported flow in the same browser context",
        "Copy the issue export into your tracker",
      ],
      reproductionSteps: [
        "Record feedback in the React Cloud demo",
        "Submit it to the private demo bucket",
        "Copy the issue export from the result panel",
      ],
      expectedBehavior:
        "Production Cloud projects return AI-generated analysis after processing.",
      actualBehavior:
        "The public demo keeps OpenAI disabled and shows this safe sample result.",
      labels: ["feedclip-cloud", "demo"],
      issueMarkdown,
      environment: {
        pageUrl: submission.context.url,
        pageTitle: submission.context.title,
        browser: "Current browser",
        viewport: submission.context.viewport,
        language: submission.context.language,
        timezone: submission.context.timezone,
      },
    },
  };
};

export const submitToFeedClipCloud = async (
  submission: FeedbackSubmission,
  onProgress?: (percent: number) => void,
  onStored?: (access: CloudSubmissionAccess) => void
): Promise<FeedbackReceipt> => {
  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ feedbackId: submission.id }),
  });
  if (!response.ok) {
    throw new Error("Could not create a secure Cloud demo token");
  }

  const { token } = (await response.json()) as { token: string };
  const receipt = await createFeedbackEndpointTransport({
    endpoint: submissionEndpoint,
    headers: { Authorization: `Bearer ${token}` },
  })(submission, onProgress);
  onStored?.({ feedbackId: receipt.feedbackId, token });
  return sampleCompletedReceipt(submission, receipt);
};

export const deleteCloudSubmission = async ({
  feedbackId,
  token,
}: CloudSubmissionAccess): Promise<void> => {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15_000);
  const response = await fetch(
    `${submissionEndpoint}/${encodeURIComponent(feedbackId)}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    }
  ).finally(() => window.clearTimeout(timeout));
  if (!response.ok && response.status !== 404) {
    const message = await response.text().catch(() => "");
    throw new Error(
      message || `Could not delete the Cloud demo submission (${response.status})`
    );
  }
};
