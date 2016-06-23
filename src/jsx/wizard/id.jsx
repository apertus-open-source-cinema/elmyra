var ID = React.createClass({
  getInitialState: function() {
    return({ id: '' });
  },
  componentDidMount: function() {
    $('#id').focus();
  },
  statics: {
    navigationTitle: 'ID'
  },
  changeID: function(event) {
    this.setState({ id: event.target.value });
  },
  submitID: function(event) {
    if(document.getElementById('id').checkValidity()) {
      this.props.generate(this.state.id);
    }

    event.preventDefault();
  },
  render: function() {
    return(
      <main>

        <div className="data-input">
          <h1>
            ID
          </h1>

          <span className="text-muted">
            <span className="octicon octicon-info" /> Only small letters (a-z), digits (0-9) and dashes (-) allowed.
          </span>

          <div className="description">
            The ID should hint at the content of the visualization,
            it will be used to name the visualization in the overview,
            as well as in all URLs for embedding the visualization:

            <br /><br />

            <form onSubmit={this.submitID}>

              <input id="id"
                     type="text"
                     name="id"
                     className="form-control"
                     onChange={this.changeID}
                     value={this.state.id}
                     placeholder="axiom-beta-turntable"
                     required
                     pattern="[a-z0-9-]+" />

              <button className="btn btn-primary"
                      type="submit">
                Confirm & Generate Visualization
              </button>

            </form>
          </div>
        </div>

      </main>
    );
  }
});
