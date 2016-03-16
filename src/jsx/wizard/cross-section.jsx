var CrossSection = React.createClass({
  getInitialState: function() {
    return({
      axis: 'z',
      level: 50
    });
  },
  statics: {
    navigationTitle: 'Cross Section'
  },
  changeAxis: function(event) {
    this.setState({ axis: event.target.value });
  },
  changeLevel: function(event) {
    this.setState({ level: parseInt(event.target.value) });
  },
  render: function() {
    return(
      <main>

        <div className="option">
          <h1>
            Cross Section
          </h1>

          <div className="description">
            Level at which to cut through the mesh:

            <input type="range"
                   onChange={this.changeLevel}
                   min="0"
                   max="100"
                   step="1"
                   value={this.state.level}
                   required />

                 {this.state.level}%

            <br /><br />

            Axis:

            X <input type="radio" value="x" onClick={this.changeAxis} checked={this.state.axis === 'x'} />
            Y <input type="radio" value="y" onClick={this.changeAxis} checked={this.state.axis === 'y'} />
            Z <input type="radio" value="z" onClick={this.changeAxis} checked={this.state.axis === 'z'} />
          </div>

          <div>
            <button className="btn btn-primary" onClick={this.props.navigate.bind(null, ID, { modifierSectionLevel: (this.state.level / 100.0), modifierSectionAxis: this.state.axis })}>
              Confirm
            </button>
          </div>
        </div>

      </main>
    );
  }
});
