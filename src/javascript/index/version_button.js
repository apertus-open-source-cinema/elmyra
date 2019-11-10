import Octicon, { Lock, Sync, Versions } from '@primer/octicons-react';
import React from 'react';

export default class VersionButton extends React.Component {
  render() {
    let label;
    if(this.props.currentVersionID === 'latest') {
      label = 'Latest Version';
    } else {
      label = `Version ${this.props.currentVersionID}`;
    }

    const versions = this.props.versions.map(version =>
      <a className="dropdown-item"
         href="#"
         key={version.version}
         onClick={this.props.changeVersion.bind(null, version.version)}>
        {version.version}
      </a>
    );

    return(
      <span className="dropdown">
        <a href="#" className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <Octicon icon={Versions} /> {label}
        </a>
        <div className="dropdown-menu">
          <div className="dropdown-header">
            <Octicon icon={Sync} /> Dynamic Versions
          </div>
          <div >
          <a className="dropdown-item"
             href="#"
             onClick={this.props.changeVersion.bind(null, 'latest')}>
            Latest
          </a>
          </div>
          <a className="dropdown-item disabled"
             href="#"
             onClick={this.props.changeVersion.bind(null, 'latest-published')}>
            Latest Published
          </a>
          <div className="dropdown-divider" />

          <div className="dropdown-header">
            <Octicon icon={Lock} /> Permanent Versions
          </div>
          {versions}
          <div className="dropdown-divider" />
        </div>
      </span>
    );
  }
}
