var MediaFormatIcon = React.createClass({
  render: function() {
    var classes;
    if(['mp4', 'ogv', 'webm'].indexOf(this.props.format) > -1) {
      classes = 'octicon octicon-triangle-right';
    } else if(['jpg', 'png', 'gif'].indexOf(this.props.format) > -1) {
      classes = 'octicon octicon-file-media';
    } else if(['svg'].indexOf(this.props.format) > -1) {
      classes = 'octicon octicon-file-code';
    } else if(['png.zip', 'svg.zip'].indexOf(this.props.format) > -1) {
      classes = 'octicon octicon-file-zip';
    } else {
      classes = 'octicon octicon-file';
    }

    return <span className={classes} />;
  }
});

var DownloadOption = React.createClass({
  formatTooltips: {
    'png': 'Larger filesizes but lossless, supports transparency - great for reduced, graphic designs',
    'jpg': 'Very small filesizes but lossy, no transparency - great for visually dense, detailed images',
    'svg': 'Vector-based line graphic - only available for illustrated/line-based styles',
    'mp4': 'Most widely spread video format - use this e.g. for uploading to Youtube',
    'ogv': 'An alternative, open format',
    'webm': 'An alternative, open format',
    'gif': 'Bad quality but biggest fun factor',
    'png.zip': 'All frames of the animation as .png (lossless, supports transparency) in a .zip file',
    'svg.zip': 'All frames of the animation as .svg (vector-based line graphics) in a .zip file - only available for illustrated/line-based styles'
  },
  render: function() {
    if(this.props[this.props.format]) {
      var fileSize = <span className="text-muted">
        ({filesize(this.props[this.props.format].fileSize)})
      </span>;

      return(
        <li>
          <a href={'/vis/' + this.props.title + '/' + this.props.currentVersionID + '/' + this.props.format}
             title={this.formatTooltips[this.props.format]}
             download={this.props.title + '.' + this.props.format}>
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
      defaultDownload = '/vis/' + this.props.title + '/' + this.props.currentVersionID + '/mp4';
      downloadOptions = <ul className="dropdown-menu">
        <DownloadOption {... this.props} format="mp4" />
        <DownloadOption {... this.props} format="ogv" />
        <DownloadOption {... this.props} format="webm" />
        <DownloadOption {... this.props} format="gif" />
        <DownloadOption {... this.props} format="png.zip" />
        <DownloadOption {... this.props} format="svg.zip" />
      </ul>;
    } else {
      defaultDownload = '/vis/' + this.props.title + '/' + this.props.currentVersionID + '/png';
      downloadOptions = <ul className="dropdown-menu">
        <DownloadOption {... this.props} format="png" />
        <DownloadOption {... this.props} format="jpg" />
        <DownloadOption {... this.props} format="svg" />
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
