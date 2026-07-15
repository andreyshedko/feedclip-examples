<script setup lang="ts">
import { computed } from "vue";
import FeedClipVue from "@feedclip/sdk/vue";
import { createIndexedDbFeedbackStore } from "@feedclip/sdk";
import "@feedclip/sdk/style.css";

const isEmbedded = computed(() => typeof window !== "undefined" && window.parent !== window);
const previewUrl = typeof window === "undefined" ? "" : window.location.href;

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
    <aside v-if="isEmbedded" class="embedded-preview-notice" role="note">
      <strong>Screen recording needs a standalone tab.</strong>
      <p>StackBlitz blocks screen sharing inside its embedded preview. Open this example in a new tab, then choose <b>Record screen</b> again.</p>
      <a :href="previewUrl" target="_blank" rel="noreferrer">Open this preview in a new tab</a>
    </aside>
    <section class="demo-copy">
      <a class="brand-link" href="https://www.feedclip.dev" target="_blank" rel="noreferrer">
        <span class="brand-mark" aria-hidden="true">
          <span class="brand-dot"></span>
        </span>
        feedclip
      </a>
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
