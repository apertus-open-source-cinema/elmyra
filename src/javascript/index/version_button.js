import Octicon, { Lock, Sync, Versions } from '@primer/octicons-react';
import React from 'react';

export default function VersionButton({ setVersionID, versionID, versions }) {
  const label = versionID === 'latest' ? 'Latest Version' : `Version ${versionID}`;

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
           onClick={() => setVersionID('latest')}>
          Latest
        </a>
        </div>
        <a className="dropdown-item disabled"
           href="#"
           onClick={() => setVersionID('latest-published')}>
          Latest Published
        </a>
        <div className="dropdown-divider" />

        <div className="dropdown-header">
          <Octicon icon={Lock} /> Permanent Versions
        </div>
        {versions.map(version =>
          <a className="dropdown-item"
             href="#"
             key={version.id}
             onClick={() => setVersionID(version.id)}>
            {version.id}
          </a>
        )}
        <div className="dropdown-divider" />
      </div>
    </span>
  );
}
