import { useState } from "react";

export default function EmbeddedPreviewNotice() {
  const [isEmbedded] = useState(() => window.parent !== window);
  if (!isEmbedded) return null;

  return (
    <aside className="embedded-preview-notice" role="note">
      <strong>Screen recording needs a standalone tab.</strong>
      <p>
        StackBlitz blocks screen sharing inside its embedded preview. Use the
        StackBlitz preview toolbar&apos;s <b>Open preview in a new tab</b> button,
        then choose <b>Record screen</b> again.
      </p>
    </aside>
  );
}
