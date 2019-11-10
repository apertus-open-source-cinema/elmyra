import React from 'react';

import ID from './id.js';

export default class AnimatedCrossSection extends React.Component {
  static navigationTitle = 'Animated Cross Section';

  constructor(props) {
    super(props);
    this.state = {
      axis: 'z',
      levelFrom: 0,
      levelTo: 100,
    };
  }

  changeAxis = event => {
    this.setState({ axis: event.target.value });
  }

  changeLevelFrom = event => {
    const newLevelFrom = parseInt(event.target.value);
    const levelTo = this.state.levelTo;

    this.setState({
      levelFrom: newLevelFrom,
      levelTo: levelTo < newLevelFrom ? newLevelFrom : levelTo
    });
  }

  changeLevelTo = event => {
    const levelFrom = this.state.levelFrom;
    const newLevelTo = parseInt(event.target.value);

    this.setState({
      levelFrom: levelFrom > newLevelTo ? newLevelTo : levelFrom,
      levelTo: newLevelTo
    });
  }

  render() {
    return(
      <main>

        <div className="option">
          <h1>
            Animated Cross Section
          </h1>

          <div className="description">
            Begin Level at which to cut through the mesh:

            <input className="custom-range"
                   max="100"
                   min="0"
                   onChange={this.changeLevelFrom}
                   required
                   step="1"
                   type="range"
                   value={this.state.levelFrom} />

                 {this.state.levelFrom}%

            <br /><br />

            End Level at which to cut through the mesh:

            <input className="custom-range"
                   max="100"
                   min="0"
                   onChange={this.changeLevelTo}
                   required
                   step="1"
                   type="range"
                   value={this.state.levelTo} />

                 {this.state.levelTo}%

            <br /><br />

            Axis:&nbsp;&nbsp;

            <div className="custom-control custom-radio custom-control-inline">
              <input checked={this.state.axis === 'x'}
                     className="custom-control-input axis x"
                     id="axis-x"
                     onChange={this.changeAxis}
                     type="radio"
                     value="x" />
              <label className="custom-control-label" htmlFor="axis-x">X</label>
            </div>

            <div className="custom-control custom-radio custom-control-inline">
              <input checked={this.state.axis === 'y'}
                     className="custom-control-input axis y"
                     id="axis-y"
                     onChange={this.changeAxis}
                     type="radio"
                     value="y" />
              <label className="custom-control-label" htmlFor="axis-y">Y</label>
            </div>

            <div className="custom-control custom-radio custom-control-inline">
              <input checked={this.state.axis === 'z'}
                     className="custom-control-input axis z"
                     id="axis-z"
                     onChange={this.changeAxis}
                     type="radio"
                     value="z" />
              <label className="custom-control-label" htmlFor="axis-z">Z</label>
            </div>
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
}
