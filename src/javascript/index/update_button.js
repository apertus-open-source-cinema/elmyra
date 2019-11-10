import Octicon, { Alert, Check, CloudUpload, X } from '@primer/octicons-react';
import React from 'react';

export default class UpdateButton extends React.Component {
  uploadSelect(event) {
    document.getElementById(`${this.props.id}-upload`).click();
    event.preventDefault();
  }

  uploadFailed = event => {
    // document.getElementById('flash').innerHTML = '<div class="alert alert-error" role="alert"><Octicon icon={X} /> Upload failed</div>'
  }

  uploadFinished = event => {
    // document.getElementById('flash').innerHTML = '<div class="alert alert-success" role="alert"><Octicon icon={Check} /> Upload successful</div>'
  }

  uploadSubmit = () => {
    const file = document.getElementById(`${this.props.id}-upload`).files[0];

    const formData = new FormData();
    formData.append('blendfile', file);

    const request = new XMLHttpRequest();
    request.onload = this.uploadFinished;
    request.onerror = this.uploadFailed;
    request.open('POST', `/__internal/upload/${this.props.id}`);
    request.responseType = 'json';
    request.send(formData);
  }

  updateFailed = event => {
    // document.getElementById('flash').innerHTML = '<div class="alert alert-error" role="alert"><Octicon icon={X} /> Update failed</div>'
  }

  updateFinished = event => {
    // document.getElementById('flash').innerHTML = '<div class="alert alert-success" role="alert"><Octicon icon={Check} /> Update successful</div>'
  }

  updateSubmit = event => {
    event.preventDefault();

    const request = new XMLHttpRequest();
    request.onload = this.updateFinished;
    request.onerror = this.updateFailed;
    request.open('POST', `/__internal/upload/${this.props.id}`);
    request.responseType = 'json';
    request.send();
  }

  render() {
    return(
      <div className="dropdown">
        <a href="#" className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <Octicon icon={CloudUpload} /> Update
        </a>
        <div className="dropdown-menu">
          <a className="dropdown-item"
             href="#"
             onClick={this.uploadSelect}>
            <span className="text-warning"><Octicon icon={Alert} /></span> Upload blendfile
          </a>
          <input type="file"
                 id={`${this.props.id}-upload`}
                 style={{ display: 'none' }}
                 accept=".blend"
                 onChange={this.uploadSubmit} />
          <a className="dropdown-item"
             href="#"
             onClick={this.updateSubmit}>
            <span className="text-danger"><Octicon icon={Alert} /></span> Update from source
          </a>
        </div>
      </div>
    );
  }
}
