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

    var thumbnail;
    if(currentVersion.thumbnail === undefined) {
      thumbnail = <div className="text-center"
                       style={{ color: '#ccc', width: '480px', height: '240px' }} >
        No preview yet
      </div>;
     } else {
       var invalidate_cache = '?' + moment(currentVersion.thumbnail.exported).unix();

       thumbnail = <img src={'/' + currentVersion.title + '/' + this.state.currentVersionID + '/thumbnail' + invalidate_cache}
                        className="img-responsive"
                        title={title.join('\n')}
                        style={{ maxWidth: '480px', maxHeight: '240px' }} />;
     }

     var version;
     if(this.state.currentVersionID === 'latest') {
       version = 'Latest Version';
     } else {
       version = 'Version ' + this.state.currentVersionID;
     }

    return(
      <span className="visualization">
        <div className="panel panel-default">
          <div className="panel-body" style={{backgroundColor: "inherit"}}>
            <div className="text-center">
              <h4>
                <VersionButton {... currentVersion}
                               currentVersionID={this.state.currentVersionID}
                               versions={this.props.versions}
                               changeVersion={this.changeVersion} /> {currentVersion.title}
              </h4>
              <span className="text-muted" style={{position: "relative", top: "-10px"}}>
                {version}
              </span>
            </div>

            {/* TODO: Show render quality in conjunction with samples */}

            <br />

            <span>
              {thumbnail}
            </span>

            <br /><br />

            <div className="row">
              <div className="col-xs-4">
               <DownloadButton {... currentVersion} currentVersionID={this.state.currentVersionID} />
              </div>
              <div className="col-xs-8">
                <EmbedField {... currentVersion} currentVersionID={this.state.currentVersionID} />
              </div>
            </div>

            <ProcessingState {... currentVersion} />
          </div>
        </div>
      </span>
    );
  }
});
