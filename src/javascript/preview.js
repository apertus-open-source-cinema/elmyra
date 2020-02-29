import React, { useEffect } from 'react';

export default function Preview({ setPreview, version, versionID, visualization }) {
  useEffect(() => {
    const escape = event => {
      if(event.key === 'Escape') { setPreview(null); }
    };

    document.addEventListener('keydown', escape);

    return document.removeEventListener('keydown', escape);
  });

  const url = `/${visualization.id}/${versionID}?${Date.now()}`;

  return(
    <div id="preview" onClick={() => setPreview(null)} >
      <div id="preview-content" onClick={event => event.stopPropagation()}>
        {version.meta.mediaAnimated ?
          <video autoPlay controls>
            <source src={url} />
          </video>
            :
          <img src={url} />
        }
      </div>
    </div>
  );
}
