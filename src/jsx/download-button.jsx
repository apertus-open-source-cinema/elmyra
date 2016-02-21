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
        <li className="disabled">
          <a title="Not available (yet)">
            <MediaFormatIcon format={this.props.format} /> {this.props.format}
            </a>
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
