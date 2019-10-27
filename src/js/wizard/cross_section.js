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
}
