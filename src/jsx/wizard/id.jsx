var ID = React.createClass({
  getInitialState: function() {
    return({ id: '' });
  },
  statics: {
    navigationTitle: 'ID'
  },
  changeID: function(event) {
    this.setState({ id: event.target.value });
  },
  render: function() {
    return(
      <main>

        <div className="option">
          <h1>
            ID
          </h1>

          <span className="text-muted">
            <span className="octicon octicon-info" /> Only alphanumeric characters (A-Z/a-z/1-9) and dashes (-).
          </span>

          <div className="description">
            The ID should hint at the content of the visualization,
            it will be used to name the visualization in the overview,
            as well as in all URLs for embedding the visualization:

            <input type="text"
                   name="id"
                   className="form-control text-center"
                   onChange={this.changeID}
                   value={this.state.id}
                   placeholder="axiom-beta-turntable"
                   required
                   pattern="/^[a-z0-9-]+$/" />
          </div>

          <div>
            <button className="btn btn-primary" onClick={this.props.generate.bind(null, this.state.id)}>
              Generate Visualization
            </button>
          </div>
        </div>

      </main>
    );
  }
});
