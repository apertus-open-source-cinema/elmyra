var DownloadOption = React.createClass({
  formatTooltips: {
    'png': 'Larger filesizes but lossless, supports transparency - great for reduced, graphic designs',
    'jpg': 'Very small filesizes but lossy, no transparency - great for visually dense, detailed images',
    'svg': 'Vector-based line graphic - only available for illustrated/line-based styles',
    'mp4': 'Most widely spread video format - use this e.g. for uploading to Youtube',
    'ogv': 'An alternative, open format',
    'webm': 'An alternative, open format',
    'gif': 'Bad quality but biggest fun factor',
    'png.zip': 'Larger filesizes but lossless, supports transparency - great for reduced, graphic designs',
    'svg.zip': 'Vector-based line graphic - only available for illustrated/line-based styles',
    'html': 'Full website with embedded interactive Blend4Web 3D viewer'
  },
  render: function() {
    if(this.props[this.props.format]) {
      var fileSize = <span className="text-muted">
        ({filesize(this.props[this.props.format].fileSize)})
      </span>;

      return(
        <li>
          <a href={'/' + this.props.id + '/' + this.props.currentVersionID + '/' + this.props.format}
             title={this.formatTooltips[this.props.format]}
             download={this.props.id + '.' + this.props.format}>
            {this.props.format} {fileSize}
            </a>
          </li>
        );
    } else {
      return(
        <li className="disabled">
          <a title="Not available (yet)">
            {this.props.format}
          </a>
        </li>
      );
    }
  }
});

var DownloadButton = React.createClass({
  render: function() {
    var blendOption = <li>
      <a href={'/' + this.props.id + '/' + this.props.currentVersionID + '/blend'}
         download
         title="Download this visualization's source blender file">
        blend
      </a>
    </li>;

    var downloadOptions;
    if(this.props.mediaType === 'animation') {
      downloadOptions = <ul className="dropdown-menu">
        <li className="dropdown-header">
          <span className="octicon octicon-file-binary" /> 3D Scene Files
        </li>
        {blendOption}
        <li role="separator" className="divider"></li>

        <li className="dropdown-header">
          <span className="octicon octicon-triangle-right" /> Video Files
        </li>
        <DownloadOption {... this.props} format="mp4" />
        <DownloadOption {... this.props} format="ogv" />
        <DownloadOption {... this.props} format="webm" />
        <DownloadOption {... this.props} format="gif" />
        <li role="separator" className="divider"></li>

        <li className="dropdown-header">
          <span className="octicon octicon-file-zip" /> All Frames as Images
        </li>
        <DownloadOption {... this.props} format="png.zip" />
        <DownloadOption {... this.props} format="svg.zip" />
      </ul>;
    } else if(this.props.mediaType === 'still') {
      downloadOptions = <ul className="dropdown-menu">
        <li className="dropdown-header">
          <span className="octicon octicon-file-binary" /> 3D Scene Files
        </li>
        {blendOption}
        <li role="separator" className="divider"></li>

        <li className="dropdown-header">
          <span className="octicon octicon-file-media" /> Image Files
        </li>
        <DownloadOption {... this.props} format="png" />
        <DownloadOption {... this.props} format="jpg" />
        <li role="separator" className="divider"></li>

        <li className="dropdown-header">
          <span className="octicon octicon-file-code" /> Vector Files
        </li>
        <DownloadOption {... this.props} format="svg" />
      </ul>;
    } else if(this.props.mediaType === 'web3d') {
      downloadOptions = <ul className="dropdown-menu">
        <li className="dropdown-header">
          <span className="octicon octicon-file-binary" /> 3D Scene Files
        </li>
        {blendOption}
        <li role="separator" className="divider"></li>

        <li className="dropdown-header">
          <span className="octicon octicon-file-media" /> Website
        </li>
        <DownloadOption {... this.props} format="html" />
      </ul>;
    }

    return(
      <div className="dropdown">
        <a href="#" className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i className="octicon octicon-desktop-download" /> Download
        </a>
        {downloadOptions}
      </div>
    );
  }
});
