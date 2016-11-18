var Import = React.createClass({
  getInitialState: function() {
    return({
      stage: null,
      url: '',
    })
  },
  componentDidMount: function() {
    document.getElementById('import-url').focus()
  },
  statics: {
    navigationTitle: 'Import'
  },
  changeUrl: function(event) {
    this.setState({ url: event.target.value.trim() })
  },
  importFailed: function(event) {
    alert('Failed to import the visualization.\n\nMake sure the URL directly points to a download of your 3D model. Especially\nwhen pasting a URL from github make sure to copy the raw link to the file\nand not the link to the page that shows the model in the browser! also\nmake sure to include http(s):// in the url!')

    console.error('/import')

    this.setState({ stage: 'failed' })
  },
  importFinished: function(event) {
    this.props.navigate(Orient, { importId: event.target.response.importId })
  },
  importSubmit: function(event) {
    if(document.getElementById('import-url').checkValidity()) {
      this.setState({ stage: 'importing' })

      var formData = new FormData();
      formData.append('url', this.state.url);

      var request = new XMLHttpRequest()
      request.onload = this.importFinished
      request.onerror = this.importFailed
      request.open('POST', '/import')
      request.responseType = 'json'
      request.send(formData)
    }

    event.preventDefault()
  },
  render: function() {
    var import_btn_classes, import_btn_text;
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
          <h1>
            Import model
          </h1>

          <div className="description">
            Enter the download URL for your 3D model.

            <br /><br />

            <form onSubmit={this.importSubmit}>

              <input id="import-url"
                     type="url"
                     className="form-control"
                     onChange={this.changeUrl}
                     value={this.state.url}
                     placeholder="http://axiom.labs/secret-part.stl"
                     size="32"
                     required />

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
});
