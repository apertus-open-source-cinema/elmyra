import React from 'react';

import ID from './id.js';

export default class CrossSection extends React.Component {
  static navigationTitle = 'Cross Section';

  constructor(props) {
    super(props);
    this.state = {
      axis: 'z',
      level: 50
    };
  }

  changeAxis = event => {
    this.setState({ axis: event.target.value });
  }

  changeLevel = event => {
    this.setState({ level: parseInt(event.target.value) });
  }

  render() {
    return(
      <main>

        <div className="option">
          <h1>Cross Section</h1>

          <div className="description">
            Level at which to cut through the mesh:

            <input className="custom-range"
                   max="100"
                   min="0"
                   onChange={this.changeLevel}
                   required
                   step="1"
                   type="range"
                   value={this.state.level}/>

                 {this.state.level}%

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
            <button className="btn btn-primary" onClick={this.props.navigate.bind(null, ID, { modifierSectionLevel: (this.state.level / 100.0), modifierSectionAxis: this.state.axis })}>
              Confirm
            </button>
          </div>
        </div>
      </main>
    );
  }
}
