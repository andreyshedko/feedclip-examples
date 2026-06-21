<script setup lang="ts">
import FeedClipVue from "@feedclip/sdk/vue";
import { createIndexedDbFeedbackStore } from "@feedclip/sdk";
import "@feedclip/sdk/style.css";

const config = {
  locale: "en-US" as const,
  maxDurationMilliSeconds: 60_000,
  maxFileSize: 100_000_000,
  defaultVideoFileExtension: "webm" as const,
  defaultVideoFileNameStyle: "ISO 8601" as const,
  privacyNotice: {
    url: "https://github.com/andreyshedko/feedclip",
    label: "How this demo handles data",
  },
  getContext: () => ({
    source: "vue-stackblitz-example",
    plan: "demo",
  }),
  onSubmit: createIndexedDbFeedbackStore({
    databaseName: "feedclip-vue-free-example",
  }),
};
</script>

<template>
  <main class="demo-shell">
    <section class="demo-copy">
      <span class="eyebrow">Vue 3 example</span>
      <h1>Video feedback inside your Vue product.</h1>
      <p>
        The Vue lifecycle adapter renders the same tested capture engine and
        reacts to config changes. Submissions stay in local IndexedDB.
      </p>
      <ul>
        <li>No account or backend required</li>
        <li>Reactive configuration</li>
        <li>Automatic cleanup on unmount</li>
      </ul>
    </section>

    <FeedClipVue :config="config" />
  </main>
</template>
