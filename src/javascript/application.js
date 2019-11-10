import React, { useEffect, useState } from 'react';

import Navigation from './navigation.js';
import Preview from './preview.js';
import Visualization from './index/visualization.js';
import Wizard from './wizard/wizard.js';

const REFRESH_INTERVAL = 2000;

export default function Application() {
  const [preview, setPreview] = useState({
    visualization: null,
    versionID: null
  });
  const [wizard, showWizard] = useState(false);
  const [visualizations, setVisualizations] = useState([]);

  const loadFromServer = () => {
    const request = new XMLHttpRequest();
    request.onload = event => setVisualizations(event.target.response);
    request.onerror = event => console.error('/__internal/visualizations');
    request.open('GET', '/__internal/visualizations');
    request.responseType = 'json';
    request.send();
  };

  useEffect(() => {
    loadFromServer();

    const interval = setInterval(loadFromServer, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const openPreview = (visualization, versionID) => {
    setPreview({ visualization: visualization, versionID: versionID });
  };

  const closePreview = () => {
    setPreview({ visualization: null, versionID: null });
  };

  if(wizard)
    return(
      <div id="application">
        <Wizard showIndex={() => { loadFromServer(); showWizard(false); }} />
      </div>
    );

  return(
    <div id="application">
      <Navigation>
        <a href="#" onClick={() => showWizard(true)}>
          New
        </a>
      </Navigation>

      <section id="visualizations">
        {visualizations.map((versions, index) =>
          <Visualization openPreview={openPreview} key={index} versions={versions} />
        )}
      </section>

      <Preview {...preview} closePreview={closePreview} />
    </div>
  );
}
