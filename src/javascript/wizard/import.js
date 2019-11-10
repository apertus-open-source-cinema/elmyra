import React from 'react';

import Orient from './orient.js';

const SUPPORTED_FORMATS = [
  '3ds',
  'blend',
  'dae',
  'fbx',
  'obj',
  'ply',
  'stl'
];

export default class Import extends React.Component {
  static navigationTitle = 'Import';

  constructor(props) {
    super(props);
    this.state = {
      dragRegistered: false,
      stage: null,
      url: '',
    };
  }

  componentDidMount() {
    document.getElementById('import-url').focus();
  }

  changeUrl = event => {
    this.setState({ url: event.target.value.trim() });
  }

  importFailed = () => {
    alert('Failed to import the visualization.\n\nMake sure the URL directly points to a download of your 3D model. Especially\nwhen pasting a URL from github make sure to copy the raw link to the file\nand not the link to the page that shows the model in the browser! also\nmake sure to include http(s):// in the url!');

    console.error('/__internal/import');

    this.setState({ stage: 'failed' });
  }

  importFinished = event => {
    this.props.navigate(Orient, { importId: event.target.response.importId });
  }

  dragEnter = () => {
    this.setState({ dragRegistered: true });
  }

  dragOver = event => {
    event.preventDefault();
  }

  drop = event => {
    event.preventDefault();

    const dt = event.dataTransfer
    const file = dt.items ? dt.items[0].getAsFile() : dt.files[0];

    const extension = this.checkExtension(file.name);

    if(extension === null) return;

    this.setState({ stage: 'importing' });

    const request = new XMLHttpRequest();
    request.onload = this.importFinished;
    request.onerror = this.importFailed;
    request.open('POST', `/__internal/import/file/${extension}`);
    request.responseType = 'json';
    request.send(file);
  }

  dragLeave = () => {
    this.setState({ dragRegistered: false });
  }

  importFailed = () => {
    alert('Failed to import the visualization.\n\nMake sure the URL directly points to a download of your 3D model. Especially\nwhen pasting a URL from github make sure to copy the raw link to the file\nand not the link to the page that shows the model in the browser! also\nmake sure to include http(s):// in the url!');

    console.error('/__internal/import', status, error.toString());

    this.setState({ stage: 'failed' });
  }

  importFinished = event => {
    this.props.navigate(Orient, { importId: event.target.response.importId });
  }

  importSubmit = event => {
    event.preventDefault();

    if(!document.getElementById('import-url').checkValidity())
      return;

    const extension = this.checkExtension(this.state.url);

    if(extension === null) return;

    this.setState({ stage: 'importing' });

    const formData = new FormData();
    formData.append('url', this.state.url);

    const request = new XMLHttpRequest();
    request.onload = this.importFinished;
    request.onerror = this.importFailed;
    request.open('POST', `/__internal/import/url/${extension}`);
    request.responseType = 'json';
    request.send(formData);
  }

  selectFile = () => {
    document.getElementById('select-file-dialog').click();
  }

  checkExtension = url => {
    let extension = url.match(/\.[A-Za-z0-9]+$/);

    if(extension === null) {
      alert('The url does not end with a recognized file extension to identify the file format by.');
      return null;
    }

    extension = extension[0].slice(1).toLowerCase(); // remove dot, normalize case

    if(!SUPPORTED_FORMATS.includes(extension)) {
      alert(`The file extension .${extension} is not supported.`);
      return null;
    }

    return extension;
  }

  selectFileSubmit = () => {
    const file = document.getElementById('select-file-dialog').files[0];

    const extension = this.checkExtension(file.name);

    if(extension === null) return;

    this.setState({ stage: 'importing' });

    const request = new XMLHttpRequest();
    request.onload = this.importFinished;
    request.onerror = this.importFailed;
    request.open('POST', `/__internal/import/file/${extension}`);
    request.responseType = 'json';
    request.send(file);
  }

  render() {
    let import_btn_classes, import_btn_text;
    if(this.state.stage == 'importing') {
      import_btn_classes = 'btn btn-warning';
      import_btn_text = ' Importing ...';
    } else if(this.state.stage == 'failed') {
      import_btn_classes = 'btn btn-danger';
      import_btn_text = 'Import failed - Retry';
    } else {
      import_btn_classes = 'btn btn-primary';
      import_btn_text = 'Import';
    }

    return(
      <main>
        <div className="data-input">
          <h1>Import model</h1>

          <div className="description">
            Supported formats: .3ds, .blend, .dae, .fbx, .obj, .ply, .stl

            <br /><br />

            <div id="dropzone"
                 className={this.state.dragRegistered ? 'drag-registered' : null }
                 onClick={this.selectFile}
                 onDragEnter={this.dragEnter}
                 onDragOver={this.dragOver}
                 onDrop={this.drop}
                 onDragLeave={this.dragLeave} >
              <span>Drag and drop a file or click to open a file select dialog</span>
            </div>

            <br /><br />

            <form onSubmit={this.importSubmit}>

              <input id="import-url"
                     type="url"
                     className="form-control"
                     onChange={this.changeUrl}
                     value={this.state.url}
                     placeholder="Alternatively enter a URL, e.g. https://axiom.labs/secret-part.stl"
                     size="32"
                     required />

              <input type="file"
                     id="select-file-dialog"
                     style={{display: 'none'}}
                     accept=".3ds,.blend,.dae,.fbx,.obj,.ply,.stl"
                     onChange={this.selectFileSubmit} />

              <button className={import_btn_classes}
                      disabled={this.state.stage == 'importing'}
                      type="submit">
                {import_btn_text}
              </button>

            </form>
          </div>
        </div>
      </main>
    );
  }
}
