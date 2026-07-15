# FeedClip framework examples

Standalone examples for the published
[`@feedclip/sdk`](https://www.npmjs.com/package/@feedclip/sdk) package.

The repository contains three Free framework integrations plus focused React
demos for Pro and Cloud. No example exposes a permanent project or license key.

| Example | Mode | Source | Open in StackBlitz |
|---|---|---|---|
| React 19 | Free · local IndexedDB | [`react`](./react) | [Open example](https://stackblitz.com/github/andreyshedko/feedclip-examples/tree/main/react) |
| Vue 3 | Free · local IndexedDB | [`vue`](./vue) | [Open example](https://stackblitz.com/github/andreyshedko/feedclip-examples/tree/main/vue) |
| Angular 21 | Free · local IndexedDB | [`angular`](./angular) | [Open example](https://stackblitz.com/github/andreyshedko/feedclip-examples/tree/main/angular) |
| React 19 Pro | Pro · self-hosted storage | [`react-pro`](./react-pro) | [Open example](https://stackblitz.com/github/andreyshedko/feedclip-examples/tree/main/react-pro) |
| React 19 Cloud | Cloud · managed storage | [`react-cloud`](./react-cloud) | [Open example](https://stackblitz.com/github/andreyshedko/feedclip-examples/tree/main/react-cloud) |

The Pro and Cloud demos request a short-lived signed demo license. Cloud also
uses a five-minute scoped upload token and does not call OpenAI in the public
example.

## Screen recording in StackBlitz

StackBlitz embeds the running app in an iframe. Browsers block screen sharing
from that embedded preview, so use StackBlitz's own **Open preview in a new
tab** control in the preview toolbar, then choose **Record screen** again.
Do not open the raw preview URL manually: StackBlitz may show a “Connect to
Project” screen for an unlinked tab. Camera recording can be started in the
embedded preview.

## Local development

Open a framework directory, then run:

```bash
npm install
npm run dev
```

Camera access requires HTTPS or localhost and user permission.
