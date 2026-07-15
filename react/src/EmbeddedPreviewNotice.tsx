import { useState } from "react";

export default function EmbeddedPreviewNotice() {
  const [isEmbedded] = useState(() => window.parent !== window);
  if (!isEmbedded) return null;

  return (
    <aside className="embedded-preview-notice" role="note">
      <strong>Screen recording needs a standalone tab.</strong>
      <p>
        StackBlitz blocks screen sharing inside its embedded preview. Open this
        example in a new tab, then choose <b>Record screen</b> again.
      </p>
      <a href={window.location.href} target="_blank" rel="noreferrer">
        Open this preview in a new tab
      </a>
    </aside>
  );
}
