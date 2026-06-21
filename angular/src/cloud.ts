import {
  createFeedbackEndpointTransport,
  type FeedbackReceipt,
  type FeedbackSubmission,
} from "@feedclip/sdk";

const tokenEndpoint = "https://www.feedclip.dev/api/feedclip/demo-token";
const submissionEndpoint = "https://api.feedclip.dev/v1/submissions";

export const submitToFeedClipCloud = async (
  submission: FeedbackSubmission,
  onProgress?: (percent: number) => void
): Promise<FeedbackReceipt> => {
  const response = await fetch(tokenEndpoint, { method: "POST" });
  if (!response.ok) throw new Error("Could not create a secure Cloud demo token");

  const { token } = (await response.json()) as { token: string };
  return createFeedbackEndpointTransport({
    endpoint: submissionEndpoint,
    headers: { Authorization: `Bearer ${token}` },
  })(submission, onProgress);
};
