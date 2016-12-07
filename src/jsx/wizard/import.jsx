var Import = React.createClass({
  getInitialState: function() {
    return({
      dragRegistered: false,
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

    console.error('/api/import')

    this.setState({ stage: 'failed' })
  },
  importFinished: function(event) {
    this.props.navigate(Orient, { importId: event.target.response.importId })
  },
  dragEnter: function(event) {
    this.setState({ dragRegistered: true })
  },
  dragOver: function(event) {
    event.preventDefault()
  },
  drop: function(event) {
    event.preventDefault()

    var file = null

    var dt = event.dataTransfer
    if(dt.items) {
      file = dt.items[0].getAsFile()
    } else {
      file = dt.files[0]
    }

    var formData = new FormData()
    formData.append('file', file)

    this.setState({ stage: 'importing' })

    var request = new XMLHttpRequest()
    request.onload = this.importFinished
    request.onerror = this.importFailed
    request.open('POST', '/api/import')
    request.responseType = 'json'
    request.send(formData)
  },
  dragLeave: function(event) {
    this.setState({ dragRegistered: false })
  },
  importFailed: function(event) {
    alert('Failed to import the visualization.\n\nMake sure the URL directly points to a download of your 3D model. Especially\nwhen pasting a URL from github make sure to copy the raw link to the file\nand not the link to the page that shows the model in the browser! also\nmake sure to include http(s):// in the url!')

    console.error('/api/import', status, error.toString())

    this.setState({ stage: 'failed' })
  },
  importFinished: function(event) {
    this.props.navigate(Orient, { importId: event.target.response.importId })
  },
  importSubmit: function(event) {
    if(document.getElementById('import-url').checkValidity()) {
      this.setState({ stage: 'importing' })

      var formData = new FormData()
      formData.append('url', this.state.url)

      var request = new XMLHttpRequest()
      request.onload = this.importFinished
      request.onerror = this.importFailed
      request.open('POST', '/api/import')
      request.responseType = 'json'
      request.send(formData)
    }

    event.preventDefault()
  },
  selectFile: function(event) {
    document.getElementById('select-file-dialog').click()
  },
  selectFileSubmit: function() {
    var file = document.getElementById('select-file-dialog').files[0]

    var formData = new FormData()
    formData.append('file', file)

    this.setState({ stage: 'importing' })

    var request = new XMLHttpRequest()
    request.onload = this.importFinished
    request.onerror = this.importFailed
    request.open('POST', '/api/import')
    request.responseType = 'json'
    request.send(formData)
  },
  render: function() {
    var import_btn_classes, import_btn_text
    if(this.state.stage == 'importing') {
      import_btn_classes = 'btn btn-warning'
      import_btn_text = ' Importing ...'
    } else if(this.state.stage == 'failed') {
      import_btn_classes = 'btn btn-danger'
      import_btn_text = 'Import failed - Retry'
    } else {
      import_btn_classes = 'btn btn-primary'
      import_btn_text = 'Import'
    }

    return(
      <main>

        <div className="data-input">
          <h1>
            Import model
          </h1>

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
                     placeholder="Alternatively enter a URL, e.g. http://axiom.labs/secret-part.stl"
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
    )
  }
})
