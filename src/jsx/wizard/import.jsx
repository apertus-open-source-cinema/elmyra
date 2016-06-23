var Import = React.createClass({
  getInitialState: function() {
    return({
      stage: null,
      url: '',
    });
  },
  componentDidMount: function() {
    $('#import-url').focus();
  },
  statics: {
    navigationTitle: 'Import'
  },
  changeUrl: function(event) {
    this.setState({ url: event.target.value.trim() });
  },
  importSubmit: function(event) {
    if(document.getElementById('import-url').checkValidity()) {
      this.setState({ stage: 'importing' });

      $.ajax({
        url: '/import',
        data: { 'url': this.state.url },
        dataType: 'json',
        cache: false,
        method: 'POST',
        success: function(data) {
          this.props.navigate(Orient, { importID: data.importID });
        }.bind(this),
        error: function(xhr, status, error) {
          alert(`Failed to import the visualization.\n\n

Make sure the URL directly points to a download of your 3D model. Especially
when pasting a URL from github make sure to copy the raw link to the file
and not the link to the page that shows the model in the browser! also
make sure to include http(s):// in the url!`);

          console.error('/import', status, error.toString());

          this.setState({ stage: 'failed' });
        }.bind(this)
      });
    }

    event.preventDefault();
  },
  render: function() {
    var import_btn_classes, import_btn_text;
    if(this.state.stage == 'importing') {
      import_btn_classes = 'btn btn-warning';
      import_btn_text = [<span className="octicon octicon-zap" />, ' Importing'];
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
