var MediaLength = React.createClass({
  getInitialState: function() {
    return({
      length: 6
    });
  },
  statics: {
    navigationTitle: 'Length'
  },
  changeLength: function(event) {
    this.setState({ length: event.target.value });
  },
  render: function() {
    return(
      <main>

        <div className="option">
          <h1>
            Length
          </h1>

          <div className="description">
            Keep in mind that longer animations take longer to render.

            <input type="range"
                   onChange={this.changeLength}
                   min="1"
                   max="60"
                   value={this.state.length}
                   required
                   pattern="/^[a-z0-9-]+$/" />

            {this.state.length} seconds
          </div>

          <div>
            <button className="btn btn-primary" onClick={this.props.navigate.bind(null, MediaResolution, { mediaLength: this.state.length })}>
              Confirm
            </button>
          </div>
        </div>

      </main>
    );
  }
});
