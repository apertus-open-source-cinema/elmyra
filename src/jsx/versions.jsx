var VersionButton = React.createClass({
  render: function() {
    var label;
    if(this.props.currentVersionID === 'latest') {
      label = 'Latest Version';
    } else {
      label = 'Version ' + this.props.currentVersionID;
    }

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
          <i className="octicon octicon-versions" /> {label}
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
        </ul>
      </span>
    );
  }
});
