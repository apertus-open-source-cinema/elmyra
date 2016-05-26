var AnimatedCrossSection = React.createClass({
  getInitialState: function() {
    return({
      axis: 'z',
      levelFrom: 0,
      levelTo: 100,
    });
  },
  statics: {
    navigationTitle: 'Animated Cross Section'
  },
  changeAxis: function(event) {
    this.setState({ axis: event.target.value });
  },
  changeLevelFrom: function(event) {
    var newLevelFrom = parseInt(event.target.value)
    var levelTo = this.state.levelTo;

    this.setState({
      levelFrom: newLevelFrom,
      levelTo: levelTo < newLevelFrom ? newLevelFrom : levelTo
    });
  },
  changeLevelTo: function(event) {
    var levelFrom = this.state.levelFrom;
    var newLevelTo = parseInt(event.target.value)

    this.setState({
      levelFrom: levelFrom > newLevelTo ? newLevelTo : levelFrom,
      levelTo: newLevelTo
    });
  },
  render: function() {
    return(
      <main>

        <div className="option">
          <h1>
            Animated Cross Section
          </h1>

          <div className="description">
            Begin Level at which to cut through the mesh:

            <input type="range"
                   onChange={this.changeLevelFrom}
                   min="0"
                   max="100"
                   step="1"
                   value={this.state.levelFrom}
                   required />

                 {this.state.levelFrom}%

            <br /><br />

            End Level at which to cut through the mesh:

            <input type="range"
                   onChange={this.changeLevelTo}
                   min="0"
                   max="100"
                   step="1"
                   value={this.state.levelTo}
                   required />

                 {this.state.levelTo}%

            <br /><br />

            Axis:

            X <input className="axis x"
                     type="radio"
                     value="x"
                     onClick={this.changeAxis}
                     checked={this.state.axis === 'x'} />

                   Y <input className="axis y"
                     type="radio"
                     value="y"
                     onClick={this.changeAxis}
                     checked={this.state.axis === 'y'} />

                   Z <input className="axis z"
                     type="radio"
                     value="z"
                     onClick={this.changeAxis}
                     checked={this.state.axis === 'z'} />
          </div>

          <div>
            <button className="btn btn-primary" onClick={this.props.navigate.bind(null, ID, { modifierSectionLevelFrom: (this.state.levelFrom / 100.0), modifierSectionLevelTo: (this.state.levelTo / 100.0), modifierSectionAxis: this.state.axis })}>
              Confirm
            </button>
          </div>
        </div>

      </main>
    );
  }
});
