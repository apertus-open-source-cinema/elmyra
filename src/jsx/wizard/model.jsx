var Model = React.createClass({
  getInitialState: function() {
    return({ url: '' });
  },
  statics: {
    navigationTitle: 'Model'
  },
  changeUrl: function(event) {
    this.setState({ url: event.target.value });
  },
  render: function() {
    return(
      <main>

        <div className="option">
          <h1>
            Model
          </h1>

          <span className="text-muted">
            <span className="octicon octicon-info" /> Download location of your 3D model.
          </span>

          <div className="description">
            The URL has to directly point to a download of your 3D model. Especially
            when pasting a URL from github make sure to copy the raw link to the file
            and not the link to the page that shows the model in the browser! also
            make sure to include http(s):// in the url!

            <input type="url"
                   onChange={this.changeUrl}
                   value={this.state.url}
                   placeholder="http://somesite.com/model.stl"
                   required />
          </div>

          <div>
            <button className="btn btn-primary" onClick={this.props.navigate.bind(null, MediaResolution, { modelUrl: this.state.url })}>
              Confirm
            </button>
          </div>
        </div>

      </main>
    );
  }
});
