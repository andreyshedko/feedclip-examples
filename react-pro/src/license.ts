import type { FeedClipLicenseConfig } from "@feedclip/sdk";

const licenseEndpoint = "https://www.feedclip.dev/api/feedclip/demo-license";

export const loadDemoLicense = async (
  signal?: AbortSignal
): Promise<FeedClipLicenseConfig> => {
  let response: Response;
  try {
    response = await fetch(licenseEndpoint, { method: "POST", signal });
  } catch {
    throw new Error(
      "The Pro demo service is unavailable. Please try again in a moment."
    );
  }
  if (!response.ok) throw new Error("Could not create a temporary Pro license");

  return (await response.json()) as FeedClipLicenseConfig;
};
