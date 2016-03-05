var Visualization = React.createClass({
  getInitialState: function() {
    return({ currentVersionID: 'latest' });
  },
  changeVersion: function(versionID) {
    this.setState({ currentVersionID: versionID });
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
    if(currentVersion.lastRender === undefined) {
      previewImage = <div className="text-center">No preview yet</div>;
     } else {
       var invalidate_cache = '?' + moment(currentVersion.lastRender).unix();

       previewImage = <img src={'/vis/' + currentVersion.title + '/' + this.state.currentVersionID + '/thumbnail' + invalidate_cache}
                        title={title.join('\n')} />;
     }

     var processing;
     if(typeof(currentVersion.processing) === "string") {
       processing = <span className="octicon octicon-zap"
                          title={currentVersion.processing}
                          style={{color: 'rgb(255, 153, 0)', cursor: 'help', position: 'relative', top: '-2px'}} />;
     }

    return(
      <div className="visualization">
        <div className={typeof(currentVersion.processing) === "string" ? 'preview active' : 'preview'}>
          <a href="#">
            {previewImage}
          </a>
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
