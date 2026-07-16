import { expect, Page, test } from "@playwright/test";
import { webcrypto } from "node:crypto";
import path from "node:path";

const mockScript = path.join(__dirname, "media-mocks.js");
const createPaidLicense = async () => {
  const keyPair = await webcrypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["sign", "verify"]
  );
  const encode = (value: string | ArrayBuffer) =>
    Buffer.from(value instanceof ArrayBuffer ? new Uint8Array(value) : value).toString("base64url");
  const now = Math.floor(Date.now() / 1_000);
  const header = encode(JSON.stringify({ alg: "ES256", typ: "FCL", kid: "examples-e2e" }));
  const claims = encode(
    JSON.stringify({
      iss: "https://license.feedclip.test",
      aud: "@feedclip/sdk",
      sub: "examples-e2e",
      projectId: "examples-e2e",
      plan: "paid",
      iat: now - 60,
      exp: now + 3_600,
    })
  );
  const input = `${header}.${claims}`;
  const signature = await webcrypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    keyPair.privateKey,
    new TextEncoder().encode(input)
  );
  return {
    token: `${input}.${encode(signature)}`,
    publicKey: await webcrypto.subtle.exportKey("jwk", keyPair.publicKey),
    issuer: "https://license.feedclip.test",
    audience: "@feedclip/sdk",
    projectId: "examples-e2e",
  };
};
const paidLicensePromise = createPaidLicense();

const openExample = async (page: Page, url: string): Promise<void> => {
  await page.addInitScript({ path: mockScript });
  await page.goto(url);
};

const completeRecording = async (page: Page): Promise<void> => {
  await page.getByRole("button", { name: "Record screen" }).click();
  await expect(page.getByRole("button", { name: "Stop recording" })).toBeVisible();
  await page.getByRole("button", { name: "Stop recording" }).click();
  await expect(page.getByText("Review and send")).toBeVisible();
};

for (const example of [
  { name: "React", url: "http://127.0.0.1:4301", codeHeading: "React · Free SDK" },
  { name: "Vue", url: "http://127.0.0.1:4302", codeHeading: "Vue 3 · Free SDK" },
  { name: "Angular", url: "http://127.0.0.1:4303", codeHeading: "Angular · Free SDK" },
]) {
  test(`${example.name} Free example completes recording, upload, dedupe, and reset`, async ({ page }) => {
    await openExample(page, example.url);
    await expect(page.getByRole("heading", { name: example.codeHeading })).toBeVisible();
    await completeRecording(page);
    const upload = page.getByRole("button", { name: "Upload video" });
    await upload.click();

    await expect(page.getByText("Feedback received")).toBeVisible();
    await expect(upload).toBeDisabled();
    await upload.click({ force: true });
    await page.getByRole("button", { name: "Record another" }).click();
    await expect(page.getByRole("button", { name: "Record screen" })).toBeEnabled();
  });
}

test("Pro example loads its temporary license and completes the paid flow", async ({ page }) => {
  const paidLicense = await paidLicensePromise;
  await page.route("https://www.feedclip.dev/api/feedclip/demo-license", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(paidLicense) })
  );
  await openExample(page, "http://127.0.0.1:4304");

  await expect(page.getByText("Paid", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "React · Pro" })).toBeVisible();
  await completeRecording(page);
  await page.getByRole("button", { name: "Upload video" }).click();
  await expect(page.getByText("Feedback received")).toBeVisible();
});

test("Pro example recovers after the license endpoint fails", async ({ page }) => {
  const paidLicense = await paidLicensePromise;
  const licenseUrl = "https://www.feedclip.dev/api/feedclip/demo-license";
  await page.route(licenseUrl, (route) =>
    route.fulfill({ status: 503, body: "unavailable" })
  );
  await openExample(page, "http://127.0.0.1:4304");

  await expect(page.getByRole("alert")).toContainText("Demo license did not load");
  await page.unroute(licenseUrl);
  await page.route(licenseUrl, (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(paidLicense) })
  );
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.getByText("Paid", { exact: true })).toBeVisible();
});

test("Cloud example uploads, renders its result, and deletes the submission", async ({ page }) => {
  const paidLicense = await paidLicensePromise;
  await page.route("https://www.feedclip.dev/api/feedclip/demo-license", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(paidLicense) })
  );
  await page.route("https://www.feedclip.dev/api/feedclip/demo-token", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ token: "e2e-token" }) })
  );
  await page.route("https://api.feedclip.dev/v1/submissions", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ feedbackId: "cloud-e2e", status: "received" }),
    })
  );
  await page.route("https://api.feedclip.dev/v1/submissions/cloud-e2e", (route) =>
    route.fulfill({ status: 204, body: "" })
  );
  await openExample(page, "http://127.0.0.1:4305");
  await page.getByRole("checkbox").check();
  await expect(page.getByText("Paid", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "React · Cloud" })).toBeVisible();
  await completeRecording(page);
  await page.getByRole("button", { name: "Upload video" }).click();

  await expect(page.getByText("Sample Cloud issue export", { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/Uploaded to the private Cloud demo bucket/)).toBeVisible();
  await page.getByRole("button", { name: "Delete my demo submission" }).click();
  await expect(page.getByText("Submission deleted from the Cloud demo.")).toBeVisible();
});

test("Cloud example reports a failed upload and leaves retry available", async ({ page }) => {
  const paidLicense = await paidLicensePromise;
  await page.route("https://www.feedclip.dev/api/feedclip/demo-license", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(paidLicense) })
  );
  await page.route("https://www.feedclip.dev/api/feedclip/demo-token", (route) =>
    route.fulfill({ status: 503, body: "unavailable" })
  );
  await openExample(page, "http://127.0.0.1:4305");
  await page.getByRole("checkbox").check();
  await expect(page.getByText("Paid", { exact: true })).toBeVisible();
  await completeRecording(page);
  const upload = page.getByRole("button", { name: "Upload video" });
  await upload.click();

  await expect(page.getByRole("alert")).toContainText("Error uploading video");
  await expect(upload).toBeEnabled();
});
