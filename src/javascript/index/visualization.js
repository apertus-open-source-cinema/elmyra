import moment from 'moment';
import Octicon, { DeviceCamera, DeviceCameraVideo, Zap } from '@primer/octicons-react';
import React, { useState } from 'react';

import DownloadButton from './download_button.js';
import EmbedButton from './embed_button.js';
import UpdateButton from './update_button.js';
import VersionButton from './version_button.js';

export default function Visualization({ openPreview, visualization }) {
  const [versionID, setVersionID] = useState('latest');

  const preview = () => openPreview(visualization, versionID);

  const version = versionID === 'latest' ?
                  visualization.versions[0] :
                  visualization.versions.find(iterated => iterated.id === versionID);

  const { meta } = version;

  const title = [];

  if(meta.mediaWidth !== null && meta.mediaHeight !== null) {
    title.push(`${meta.mediaWidth}x${meta.mediaHeight}`);
  }

  if(meta.lastRenderedSamples !== null) {
    title.push(`${meta.lastRenderedSamples} samples`);
  }

  if(meta.mediaAnimated) {
    const duration = moment.duration(meta.mediaLength, 'seconds');
    title.push(moment.utc(duration.asMilliseconds()).format("mm:ss"));
  }

  let previewImage;
  const previewClasses = ['preview'];
  if(meta.lastRender === null) {
    previewClasses.push('pending');
    previewImage = 'Rendering soon';
  } else {
    const lastRender = moment(meta.lastRender).unix();
    previewImage = <img src={`/${visualization.id}/${versionID}/thumbnail?${lastRender}`}
                        title={title.join('\n')} />;
  }

  let processing;
  if(typeof(meta.processing) === 'string') {
    previewClasses.push('active');
    processing =
      <span style={{ color: 'rgb(255, 153, 0)', cursor: 'help', position: 'relative', top: '-2px' }}
            title={meta.processing} >
        <Octicon icon={Zap} />
      </span>
    ;

    if(meta.lastRender === null) {
      previewImage = 'Now rendering';
    }
  }

  let overlayClasses, overlayIcon;
  if(meta.mediaAnimated) {
    overlayClasses = 'overlay animation';
    overlayIcon = <Octicon icon={DeviceCameraVideo} />;
  } else {
    overlayClasses = 'overlay still';
    overlayIcon = <Octicon icon={DeviceCamera} />;
  }

  return(
    <div className="visualization">
      <div className={previewClasses.join(' ')}>
        <a onClick={meta.lastRender === null ? null : preview}>
          {previewImage}
        </a>

        <span className={overlayClasses}>
          {overlayIcon}
        </span>
      </div>

      <div className="menu">
        <div className="header">
          <h5 className="title">
            {visualization.id} {processing}
          </h5>
          <span className="version">
            <VersionButton setVersionID={setVersionID}
                           versionID={versionID}
                           versions={visualization.versions} />
          </span>
        </div>

        {/* TODO: Show render quality in conjunction with samples */}
        {/* TODO: <ProcessingState {... meta} />*/}
        <div className="controls">
          <DownloadButton version={version} visualization={visualization} />
          <EmbedButton versionID={versionID} visualization={visualization} />
          <UpdateButton visualization={visualization} />
        </div>
      </div>
    </div>
  );
}
