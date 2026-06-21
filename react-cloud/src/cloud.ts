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
  return receipt;
};

export const deleteCloudSubmission = async ({
  feedbackId,
  token,
}: CloudSubmissionAccess): Promise<void> => {
  const response = await fetch(
    `${submissionEndpoint}/${encodeURIComponent(feedbackId)}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!response.ok && response.status !== 404) {
    throw new Error("Could not delete the Cloud demo submission");
  }
};
