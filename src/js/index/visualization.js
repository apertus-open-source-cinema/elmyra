import moment from 'moment';
import Octicon, { DeviceCamera, DeviceCameraVideo, Zap } from '@primer/octicons-react';
import React from 'react';

import DownloadButton from './download_button.js';
import EmbedButton from './embed_button.js';
import UpdateButton from './update_button.js';
import VersionButton from './version_button.js';

export default class Visualization extends React.Component {
  constructor(props) {
    super(props);
    this.state = { currentVersionID: 'latest' };
  }

  changeVersion = versionID => {
    this.setState({ currentVersionID: versionID });
  }

  preview = () => {
    this.props.openPreview(this.props.versions[0], this.state.currentVersionID);
  }

  render() {
    let currentVersion = this.props.versions[0];

    if(this.state.currentVersionID !== 'latest') {
      this.props.versions.forEach(version => {
        if(version.version === this.state.currentVersionID) {
          currentVersion = version;
        }
      });
    }

    const title = [];

    if(currentVersion.mediaWidth !== undefined && currentVersion.mediaHeight !== undefined) {
      title.push(`${currentVersion.mediaWidth}x${currentVersion.mediaHeight}`);
    }

    if(currentVersion.minimumSamples !== undefined) {
      title.push(`${currentVersion.minimumSamples}samples`);
    }

    if(currentVersion.mediaType === 'animation') {
      const duration = moment.duration(currentVersion.mediaLength, 'seconds');
      title.push(moment.utc(duration.asMilliseconds()).format("mm:ss"));
    }

    let previewImage;
    const previewClasses = ['preview'];
    if(currentVersion.lastRender === undefined) {
      previewClasses.push('pending');
      previewImage = 'Rendering soon';
    } else {
      const invalidate_cache = `?${moment(currentVersion.lastRender).unix()}`;
      previewImage = <img src={`/${currentVersion.id}/${this.state.currentVersionID}/thumbnail${invalidate_cache}`}
                          title={title.join('\n')} />;
    }

    let processing;
    if(typeof(currentVersion.processing) === "string") {
      previewClasses.push('active');
      processing =
        <span style={{ color: 'rgb(255, 153, 0)', cursor: 'help', position: 'relative', top: '-2px' }}
              title={currentVersion.processing} >
          <Octicon icon={Zap} />
        </span>
      ;

      if(currentVersion.lastRender === undefined) {
        previewImage = 'Now rendering';
      }
    }

    let overlayClasses, overlayIcon;
    if(currentVersion.mediaType === 'still') {
      overlayClasses = 'overlay still';
      overlayIcon = <Octicon icon={DeviceCamera} />;
    } else /* if(currentVersion.mediaType === 'animation') */ {
      overlayClasses = 'overlay animation';
      overlayIcon = <Octicon icon={DeviceCameraVideo} />;
    }

    return(
      <div className="visualization">
        <div className={previewClasses.join(' ')}>
          <a onClick={currentVersion.lastRender === undefined ? null : this.preview}>
            {previewImage}
          </a>

          <span className={overlayClasses}>
            {overlayIcon}
          </span>
        </div>

        <div className="menu">
          <div className="header">
            <h5 className="title">
              {currentVersion.id} {processing}
            </h5>
            <span className="version">
              <VersionButton {...currentVersion}
                             currentVersionID={this.state.currentVersionID}
                             versions={this.props.versions}
                             changeVersion={this.changeVersion} />
            </span>
          </div>

          {/* TODO: Show render quality in conjunction with samples */}
          {/* TODO: <ProcessingState {... currentVersion} />*/}
          <div className="controls">
            <DownloadButton {...currentVersion} currentVersionID={this.state.currentVersionID} />
            <EmbedButton {...currentVersion} currentVersionID={this.state.currentVersionID} />
            <UpdateButton {...currentVersion} currentVersionID={this.state.currentVersionID} />
          </div>
        </div>
      </div>
    );
  }
}
