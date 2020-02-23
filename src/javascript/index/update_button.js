import Octicon, { Alert, Check, CloudUpload, X } from '@primer/octicons-react';
import React from 'react';

export default function UpdateButton({ visualization }) {
  const uploadSelect = event => {
    document.getElementById(`${visualization.id}-upload`).click();
    event.preventDefault();
  };

  const uploadFailed = event => {
    // document.getElementById('flash').innerHTML = '<div class="alert alert-error" role="alert"><Octicon icon={X} /> Upload failed</div>'
  };

  const uploadFinished = event => {
    // document.getElementById('flash').innerHTML = '<div class="alert alert-success" role="alert"><Octicon icon={Check} /> Upload successful</div>'
  };

  const uploadSubmit = () => {
    const file = document.getElementById(`${visualization.id}-upload`).files[0];

    const formData = new FormData();
    formData.append('blendfile', file);

    const request = new XMLHttpRequest();
    request.onload = this.uploadFinished;
    request.onerror = this.uploadFailed;
    request.open('POST', `/__internal/upload/${visualization.id}`);
    request.responseType = 'json';
    request.send(formData);
  };

  const updateFailed = event => {
    // document.getElementById('flash').innerHTML = '<div class="alert alert-error" role="alert"><Octicon icon={X} /> Update failed</div>'
  };

  const updateFinished = event => {
    // document.getElementById('flash').innerHTML = '<div class="alert alert-success" role="alert"><Octicon icon={Check} /> Update successful</div>'
  };

  const updateSubmit = event => {
    event.preventDefault();

    const request = new XMLHttpRequest();
    request.onload = updateFinished;
    request.onerror = updateFailed;
    request.open('POST', `/__internal/upload/${visualization.id}`);
    request.responseType = 'json';
    request.send();
  }

  return(
    <div className="dropdown">
      <a href="#" className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <Octicon icon={CloudUpload} /> Update
      </a>
      <div className="dropdown-menu">
        <a className="dropdown-item"
           href="#"
           onClick={uploadSelect}>
          <span className="text-warning"><Octicon icon={Alert} /></span> Upload blendfile
        </a>
        <input type="file"
               id={`${visualization.id}-upload`}
               style={{ display: 'none' }}
               accept=".blend"
               onChange={uploadSubmit} />
        <a className="dropdown-item"
           href="#"
           onClick={updateSubmit}>
          <span className="text-danger"><Octicon icon={Alert} /></span> Update from source
        </a>
      </div>
    </div>
  );
}
