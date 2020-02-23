import ClipboardJS from 'clipboard';
import Octicon, { Clippy } from '@primer/octicons-react';
import React, { useEffect } from 'react';

export default function EmbedButton({ versionID, visualization }) {
  const link = `${location.origin}/${visualization.id}/${versionID}`;

  useEffect(() => {
    const clipboard = new ClipboardJS(`#${visualization.id}-copy`);

    clipboard.on('success', event => {
      alert('Copied to clipboard!');
      event.clearSelection();
    });

    clipboard.on('error', event =>
      alert(`Could not copy to your clipboard - please select and copy this manually:\n${link}`)
    );

    return () => clipboard.destroy();
  });

  return(
    <a href="#"
       id={`${visualization.id}-copy`}
       title={link}
       data-clipboard-text={link} >
      <Octicon icon={Clippy} /> Embed
    </a>
  );
}
