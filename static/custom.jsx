var ProgressBar = React.createClass({
  render: function() {
    var progress = (this.props.current / this.props.max) * 100;

    var classes = this.props.classes;
    if(typeof(classes) !== 'string') {
      classes = classes.join(' ');
    }

    return(
      <div className={classes}
           role="progressbar"
           aria-valuenow={this.props.current}
           aria-valuemin="0"
           aria-valuemax={this.props.max}
           style={{width: progress + '%'}}>
        <span className="sr-only">
          {this.props.current}/{this.props.max}
        </span>
      </div>
    );
  }
});

var ProcessingProgressBar = React.createClass({
  render: function() {
    var classes = ['progress-bar', 'progress-bar-striped', 'active'];

    if(this.props.renderQuality === 'production') {
      classes.push('progress-bar-success');
    } else if(this.props.renderQuality === 'preview') {
      classes.push('progress-bar-warning');
    } else {
      classes.push('progress-bar-danger');
    }

    var primaryBar;
    var backgroundBar;
    if(this.props.mediaType === 'animation') {
      if(this.props.renderedFrames < this.props.mediaFrameCount) {
        primaryBar = <ProgressBar classes={classes}
                                  current={this.props.renderedFrames}
                                  max={this.props.mediaFrameCount} />;
      } else {
        primaryBar = <ProgressBar classes={classes}
                                  current={this.props.lastRenderedFrame}
                                  max={this.props.mediaFrameCount} />;

        backgroundBar = <ProgressBar classes="progress-bar progress-bar-info progress-bar-striped active"
                                     current={0}
                                     max={this.props.lastRenderedFrame} />;
      }
    } else {
      primaryBar = <ProgressBar classes={classes} current={1} max={1} />;
    }

    return(
      <div className="progress">
        {primaryBar} {backgroundBar}
      </div>
    );
  }
});

var ProcessingStateDisplay = React.createClass({
  render: function() {
    if(typeof(this.props.processing) === "string") {
      return(
        <div style={{ borderTop: '1px solid #eee', marginTop: '15px', paddingTop: '18px' }}>
          <ProcessingProgressBar {... this.props} />
          <ProcessingStateText {... this.props} />
        </div>
      );
    } else {
      return <span />;
    }
  }
});

var MediaFormatIcon = React.createClass({
  render: function() {
    var classes;
    if(['mp4', 'ogv', 'webm'].indexOf(this.props.format) > -1) {
      classes = 'octicon octicon-triangle-right';
    } else if(['jpg', 'png', 'gif'].indexOf(this.props.format) > -1) {
      classes = 'octicon octicon-file-media';
    } else if(['zip'].indexOf(this.props.format) > -1) {
      classes = 'octicon octicon-file-zip';
    } else {
      classes = 'octicon octicon-file';
    }

    return <span className={classes} />;
  }
});

var DownloadOption = React.createClass({
  render: function() {
    if(this.props[this.props.format]) {
      var fileSize = <span className="text-muted">
        ({filesize(this.props[this.props.format].fileSize)})
      </span>;

      return(
        <li>
          <a href={'/' + this.props.title + '/' + this.props.currentVersionID + '/' + this.props.format}
             title="TODO: Explain format pro/con/criteria here"
             download={this.props.title}>
            <MediaFormatIcon format={this.props.format} /> {this.props.format} {fileSize}
            </a>
          </li>
        );
    } else {
      return(
        <li>
          No downloadable data yet.
        </li>
      );
    }
  }
});

var DownloadButton = React.createClass({
  render: function() {
    var defaultDownload;
    var downloadOptions;
    if(this.props.mediaType === 'animation') {
      defaultDownload = '/' + this.props.title + '/' + this.props.currentVersionID + '/mp4';
      downloadOptions = <ul className="dropdown-menu">
        <DownloadOption {... this.props} format="mp4" />
        <DownloadOption {... this.props} format="ogv" />
        <DownloadOption {... this.props} format="webm" />
        <DownloadOption {... this.props} format="gif" />
        <DownloadOption {... this.props} format="zip" />
      </ul>;
    } else {
      defaultDownload = '/' + this.props.title + '/' + this.props.currentVersionID + '/png';
      downloadOptions = <ul className="dropdown-menu">
        <DownloadOption {... this.props} format="png" />
        <DownloadOption {... this.props} format="jpg" />
      </ul>;
    }

    return(
      <div className="btn-group btn-block">
        <a href={defaultDownload} className="btn btn-primary">
          <i className="octicon octicon-desktop-download" /> Download
        </a>
        <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <span className="caret" />
          <span className="sr-only">Toggle Dropdown</span>
        </button>
        {downloadOptions}
      </div>
    );
  }
});

var EmbedField = React.createClass({
  clipboard: null,
  bindClipboard: function() {
    var btnId = '#' + this.props.title + '-copy';

    this.clipboard = new Clipboard(btnId);
    this.clipboard.on('success', function(e) {
        $(btnId).children('span').addClass('text-success');
        e.clearSelection();
    });
    this.clipboard.on('error', function(e) {
        $(btnId).children('span').addClass('text-danger');
    });
  },
  componentDidMount: function() {
    this.bindClipboard();
  },
  componentDidUpdate: function() {
    this.clipboard.destroy();
    this.bindClipboard();
  },
  render: function() {
    return(
      <div className="input-group">
        <input id={this.props.title + '-link'}
               type="text"
               className="form-control"
               placeholder="Embed URL"
               value={'http://feature.todo/' + this.props.title + '/' + this.props.currentVersionID}
               readOnly />

        <span className="input-group-btn">
          <button id={this.props.title + '-copy'}
                  className="btn btn-default"
                  type="button"
                  data-clipboard-target={'#' + this.props.title + '-link'}>
            <span className="octicon octicon-clippy" />
          </button>
        </span>
      </div>
    );
  }
});

var UpdateSceneForm = React.createClass({
  updateScene: function(event) {
    event.preventDefault();
    $.ajax({
      url: "/" + this.props.title + "/update",
      method: 'POST',
      data: new FormData(event.target),
      processData: false,
      contentType: false,
      success: function(data) {
        $('#flash').html(
          '<div class="alert alert-success" role="alert"><i class="fa fa-check" /> Update successful</div>'
        );
        setTimeout(function() { $('#flash').html(''); }, 5000);

        /* TODO: Refresh data globally */
      }.bind(this),
      error: function(xhr, status, error) {
        console.error(this.props.url, status, error.toString());
      }.bind(this)
    });
  },
  render: function() {
    return(
      <form onSubmit={this.updateScene}
            action={"/" + this.props.title + "/update"}
            className="pad"
            method="post"
            encType="multipart/form-data">

        <div className="form-group">
          <input type="file" name="blendfile" required />
        </div>

        <button type="submit" className="btn btn-warning btn-block">
          <i className="fa fa-upload" /> Update scene from .blend
        </button>
      </form>
    );
  }
});

var UpdateModelsButton = React.createClass({
  updateModels: function(event) {
    event.preventDefault();
    $.ajax({
      url: "/" + this.props.title + "/update",
      dataType: 'json',
      cache: false,
      success: function(data) {
        $('#flash').html(
          '<div class="alert alert-success" role="alert"><i class="fa fa-check" /> Update successful</div>'
        );
        setTimeout(function() { $('#flash').html(''); }, 5000);

        /* TODO: Refresh data globally */
      }.bind(this),
      error: function(xhr, status, error) {
        console.error(this.props.url, status, error.toString());
      }.bind(this)
    });
  },
  render: function() {
    return(
      <div className="pad">
        <a onClick={this.updateModels}
           href="#"
           className="btn btn-danger btn-block">
          <i className="fa fa-refresh" /> Update models from sources
        </a>
      </div>
    );
  }
});

var ProcessingStateText = React.createClass({
  render: function() {
    return(
      <div className="text-muted text-center">
        {this.props.processing}
      </div>
    );
  }
});

var VersionButton = React.createClass({
  uploadSelect: function(event) {
    $('#' + this.props.title + '-upload').click();
    event.preventDefault();
  },
  uploadSubmit: function() {
    var file = $('#' + this.props.title + '-upload')[0].files[0];

    var formData = new FormData();
    formData.append("blendfile", file);

    $.ajax({
      url: '/' + this.props.title + '/upload',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(response) {
        $('#flash').html(
          '<div class="alert alert-success" role="alert"><span class="octicon octicon-check" /> Upload successful</div>'
        );
      },
      error: function(jqXHR, textStatus, errorMessage) {
        $('#flash').html(
          '<div class="alert alert-error" role="alert"><span class="octicon octicon-x" /> ' + errorMessage + '</div>'
        );
      }
    });
  },
  updateSubmit: function(event) {
    event.preventDefault();

    console.log('boo')

    $.ajax({
      url: '/' + this.props.title + '/update',
      type: 'POST',
      success: function(response) {
        $('#flash').html(
          '<div class="alert alert-success" role="alert"><span class="octicon octicon-check" /> Update successful</div>'
        );
      },
      error: function(jqXHR, textStatus, errorMessage) {
        $('#flash').html(
          '<div class="alert alert-error" role="alert"><span class="octicon octicon-x" /> ' + errorMessage + '</div>'
        );
      }
    });
  },
  render: function() {
    var versions = this.props.versions.map(function(version, index) {
      return(
        <li key={index}>
          <a href="#" onClick={this.props.changeVersion.bind(null, version.version)}>
            {version.version}
          </a>
        </li>
      );
    }.bind(this));

    return(
      <span className="dropdown">
        <a href="#" className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i className="octicon octicon-three-bars" />
        </a>
        <ul className="dropdown-menu">
          <li className="dropdown-header">
            <span className="octicon octicon-sync" /> Dynamic Versions
          </li>
          <li>
            <a href="#" onClick={this.props.changeVersion.bind(null, 'latest')}>
              Latest
            </a>
          </li>
          <li className="disabled">
            <a href="#" onClick={this.props.changeVersion.bind(null, 'latest-published')}>
              Latest Published
            </a>
          </li>
          <li role="separator" className="divider"></li>

          <li className="dropdown-header">
            <span className="octicon octicon-lock" /> Permament Versions
          </li>
          {versions}
          <li role="separator" className="divider"></li>

          <li className="dropdown-header text-warning">
            <span className="octicon octicon-cloud-download" /> This Version
          </li>
          <li>
            <a href={'/' + this.props.title + '/' + this.props.currentVersionID + '/blend'} download>
              Download blendfile
            </a>
          </li>
          <li role="separator" className="divider"></li>

          <li className="dropdown-header">
            <span className="octicon octicon-cloud-upload" /> New Version
          </li>
          <li>
            <a href="#" onClick={this.uploadSelect} >
              <span className="text-warning octicon octicon-alert" /> Upload blendfile
            </a>
            <input type="file"
                   id={this.props.title + '-upload'}
                   style={{display: 'none'}}
                   accept=".blend"
                   onChange={this.uploadSubmit} />
          </li>
          <li>
            <a href="#" onClick={this.updateSubmit} >
              <span className="text-danger octicon octicon-alert" /> Update from source
            </a>
          </li>
        </ul>
      </span>
    );
  }
});

var VisualizationPanel = React.createClass({
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

            <ProcessingStateDisplay {... currentVersion} />
          </div>
        </div>
      </span>
    );
  }
});

var VisualizationList = React.createClass({
  loadFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({ visualizations: data.visualizations });
      }.bind(this),
      error: function(xhr, status, error) {
        console.error(this.props.url, status, error.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return { visualizations: [] };
  },
  componentDidMount: function() {
    this.loadFromServer();
    setInterval(this.loadFromServer, this.props.refreshInterval);
  },
  render: function() {
    var vizs = this.state.visualizations.map(function(visualization, index) {
      return(<VisualizationPanel {... visualization} key={index} />);
    });

    return(<section id="visualizations">{vizs}</section>);
  }
});

ReactDOM.render(
  <VisualizationList url="/visualizations" refreshInterval={5000} />,
  document.getElementById('react-container')
);
