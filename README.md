# FeedClip framework examples

Standalone examples for the published
[`@feedclip/sdk`](https://www.npmjs.com/package/@feedclip/sdk) package.

The repository contains three Free framework integrations plus focused React
demos for Pro and Cloud. No example exposes a permanent project or license key.

| Example | Mode | Source | Hosted demo |
|---|---|---|---|
| React 19 | Free · local IndexedDB | [`react`](./react) | To be deployed |
| Vue 3 | Free · local IndexedDB | [`vue`](./vue) | To be deployed |
| Angular 21 | Free · local IndexedDB | [`angular`](./angular) | To be deployed |
| React 19 Pro | Pro · self-hosted storage | [`react-pro`](./react-pro) | To be deployed |
| React 19 Cloud | Cloud · managed storage | [`react-cloud`](./react-cloud) | To be deployed |

The Pro and Cloud demos request a short-lived signed demo license. Cloud also
uses a five-minute scoped upload token and does not call OpenAI in the public
example.

## Hosted demos

The production demos should be deployed as five independent Vercel projects,
each with its Vercel **Root Directory** set to the matching framework folder.
Every folder contains a `vercel.json` with the build and output settings. Use
these stable subdomains once the Vercel projects and DNS records are created:

| Example | Domain |
|---|---|
| React | `react-demo.feedclip.dev` |
| Vue | `vue-demo.feedclip.dev` |
| Angular | `angular-demo.feedclip.dev` |
| React Pro | `pro-demo.feedclip.dev` |
| React Cloud | `cloud-demo.feedclip.dev` |

StackBlitz links are intentionally not used as the primary demo path because
embedded previews cannot reliably request screen-sharing permissions and
detached preview URLs can expire.

For Pro and Cloud hosted demos, add all five demo origins to the landing/API
environment allowlists before testing license creation:

```text
FEEDCLIP_DEMO_ALLOWED_ORIGINS=https://react-demo.feedclip.dev,https://vue-demo.feedclip.dev,https://angular-demo.feedclip.dev,https://pro-demo.feedclip.dev,https://cloud-demo.feedclip.dev
FEEDCLIP_ALLOWED_ORIGINS=https://react-demo.feedclip.dev,https://vue-demo.feedclip.dev,https://angular-demo.feedclip.dev,https://pro-demo.feedclip.dev,https://cloud-demo.feedclip.dev
```

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
