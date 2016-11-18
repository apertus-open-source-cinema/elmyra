var Visualization = React.createClass({
  getInitialState: function() {
    return({ currentVersionID: 'latest' });
  },
  changeVersion: function(versionID) {
    this.setState({ currentVersionID: versionID });
  },
  preview: function() {
    var currentVersion = this.props.versions[0];

    if(currentVersion.mediaType === 'animation') {
      var content = '<video autoplay controls><source src="' + location.origin + '/vis/' + currentVersion.title + '/' + this.state.currentVersionID + '"></video>';
      $.featherlight(content, { type: 'html' });
    } else if (currentVersion.mediaType === 'still') {
      var content = '/vis/' + currentVersion.title + '/' + this.state.currentVersionID;
      $.featherlight(content, { type: 'image' });
    } else if (currentVersion.mediaType === 'web3d') {
      var content = location.origin + '/vis/' + currentVersion.title + '/' + this.state.currentVersionID;
      $.featherlight({
        iframe: content,
        iframeMaxWidth: '80%',
        iframeWidth: 1280,
        iframeHeight: 720
      });
    }
  },
  render: function() {
    var currentVersion = this.props.versions[0];

    if(this.state.currentVersionID !== 'latest') {
      this.props.versions.forEach(function(version) {
        if(version.version === this.state.currentVersionID) {
          currentVersion = version;
        }
      }.bind(this));
    }

    var title = [];

    if(currentVersion.mediaWidth !== undefined && currentVersion.mediaHeight !== undefined) {
      title.push(currentVersion.mediaWidth + 'x' + currentVersion.mediaHeight);
    }

    if(currentVersion.minimumSamples !== undefined) {
      title.push(currentVersion.minimumSamples + 'samples');
    }

    if(currentVersion.mediaType === 'animation') {
      var duration = moment.duration(currentVersion.mediaLength, 'seconds');
      title.push(moment.utc(duration.asMilliseconds()).format("mm:ss"));
    }

    var previewImage;
    var previewClasses = ['preview'];
    if(currentVersion.lastRender === undefined) {
      previewClasses.push('pending');
      previewImage = 'Rendering soon';
    } else {
      var invalidate_cache = '?' + moment(currentVersion.lastRender).unix();

      previewImage = <img src={'/vis/' + currentVersion.title + '/' + this.state.currentVersionID + '/thumbnail' + invalidate_cache}
                          title={title.join('\n')} />;
    }

    var processing;
    if(typeof(currentVersion.processing) === "string") {
      previewClasses.push('active');
      processing = <span className="octicon octicon-zap"
                         title={currentVersion.processing}
                         style={{color: 'rgb(255, 153, 0)', cursor: 'help', position: 'relative', top: '-2px'}} />;

      if(currentVersion.lastRender === undefined) {
        previewImage = 'Now rendering';
      }
    }

    var overlayClasses;
    if(currentVersion.mediaType === 'still') {
      overlayClasses = 'octicon octicon-device-camera overlay still'
    } else if(currentVersion.mediaType === 'animation') {
      overlayClasses = 'octicon octicon-device-camera-video overlay animation'
    } else if(currentVersion.mediaType === 'web3d') {
      overlayClasses = 'octicon octicon-device-mobile overlay web3d'
    }

    return(
      <div className="visualization">
        <div className={previewClasses.join(' ')}>
          <a onClick={currentVersion.lastRender === undefined ? null : this.preview}>
            {previewImage}
          </a>

          <span className={overlayClasses} />
        </div>

        <div className="menu">
          <div className="header">
            <h5 className="title">
              {currentVersion.title} {processing}
            </h5>
            <span className="version">
              <VersionButton {... currentVersion}
                             currentVersionID={this.state.currentVersionID}
                             versions={this.props.versions}
                             changeVersion={this.changeVersion} />
                         </span>
          </div>

          {/* TODO: Show render quality in conjunction with samples */}
          {/* TODO: <ProcessingState {... currentVersion} />*/}
          <div className="controls">
            <DownloadButton {... currentVersion} currentVersionID={this.state.currentVersionID} />
            <EmbedButton {... currentVersion} currentVersionID={this.state.currentVersionID} />
            <UpdateButton {... currentVersion} currentVersionID={this.state.currentVersionID} />
          </div>
        </div>
      </div>
    );
  }
});
