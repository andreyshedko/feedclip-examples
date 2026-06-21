<script setup lang="ts">
import FeedClipVue from "@feedclip/sdk/vue";
import "@feedclip/sdk/style.css";
import { submitToFeedClipCloud } from "./cloud";

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
  onSubmit: submitToFeedClipCloud,
};
</script>

<template>
  <main class="demo-shell">
    <section class="demo-copy">
      <span class="eyebrow">Vue 3 example</span>
      <h1>Video feedback inside your Vue product.</h1>
      <p>
        The Vue lifecycle adapter renders the same tested capture engine and
        reacts to config changes. Submissions use the live FeedClip Cloud demo.
      </p>
      <ul>
        <li>No permanent API key in the browser</li>
        <li>Private storage with short-lived upload access</li>
        <li>Cloud storage without OpenAI API usage</li>
      </ul>
    </section>

    <FeedClipVue :config="config" />
  </main>
</template>
