var Import = React.createClass({
  getInitialState: function() {
    return({ url: '' });
  },
  statics: {
    navigationTitle: 'Model'
  },
  changeUrl: function(event) {
    this.setState({ url: event.target.value.trim() });
  },
  importModel: function() {
    $.ajax({
      url: '/import',
      data: { 'url': this.state.url },
      dataType: 'json',
      cache: false,
      method: 'POST',
      success: function(data) {
        this.setState({ importID: data.importID });
      }.bind(this),
      error: function(xhr, status, error) {
        alert(`Failed to import the visualization.\n\n

Make sure the URL directly points to a download of your 3D model. Especially
when pasting a URL from github make sure to copy the raw link to the file
and not the link to the page that shows the model in the browser! also
make sure to include http(s):// in the url!`);

        console.error('/import', status, error.toString());
      }.bind(this)
    });
  },
  render: function() {
    return(
      <main>

        <div className="option">
          <h1>
            Model
          </h1>

          <div className="description">
            Download URL for your 3D model.

            <br /><br />

            <input type="url"
                   onChange={this.changeUrl}
                   value={this.state.url}
                   placeholder="http://somesite.com/model.stl"
                   size="64"
                   required />

                 <button className={this.state.importID ? 'btn btn-success' : 'btn btn-warning'} onClick={this.importModel}>
              {this.state.importID ? 'Import successful! (Click to reimport)' : 'Import (and give it some time to download and process!)'}
            </button>
          </div>

          <div>
            <button id="confirm-button"
                    className="btn btn-primary"
                    disabled={!this.state.importID}
                    onClick={this.props.navigate.bind(null, MediaType, { importID: this.state.importID })}>
              Continue
            </button>
          </div>
        </div>

      </main>
    );
  }
});
