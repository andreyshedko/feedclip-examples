import type { FeedClipLicenseConfig } from "@feedclip/sdk";

const licenseEndpoint = "https://www.feedclip.dev/api/feedclip/demo-license";

export const loadDemoLicense = async (
  signal?: AbortSignal
): Promise<FeedClipLicenseConfig> => {
  const response = await fetch(licenseEndpoint, { method: "POST", signal });
  if (!response.ok) throw new Error("Could not create a temporary Pro license");

  return (await response.json()) as FeedClipLicenseConfig;
};
