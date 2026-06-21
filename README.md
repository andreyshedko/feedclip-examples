# FeedClip framework examples

Standalone examples for the published
[`@feedclip/sdk`](https://www.npmjs.com/package/@feedclip/sdk) package.

The React project demonstrates storage-only FeedClip Cloud using a short-lived
browser token. It does not expose a permanent key or call OpenAI. Vue and
Angular currently store submissions locally in browser IndexedDB.

| Framework | Mode | Source | Open in StackBlitz |
|---|---|---|---|
| React 19 | Cloud storage-only | [`react`](./react) | [Open example](https://stackblitz.com/github/andreyshedko/feedclip-examples/tree/main/react) |
| Vue 3 | Local IndexedDB | [`vue`](./vue) | [Open example](https://stackblitz.com/github/andreyshedko/feedclip-examples/tree/main/vue) |
| Angular 21 | Local IndexedDB | [`angular`](./angular) | [Open example](https://stackblitz.com/github/andreyshedko/feedclip-examples/tree/main/angular) |

## Local development

Open a framework directory, then run:

```bash
npm install
npm run dev
```

Camera access requires HTTPS or localhost and user permission.
