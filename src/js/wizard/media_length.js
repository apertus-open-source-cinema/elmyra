import React from 'react';

import MediaResolution from './media_resolution.js';

export default class MediaLength extends React.Component {
  static navigationTitle = 'Length';

  constructor(props) {
    super(props);
    this.state = { length: 6 };
  }

  changeLength = event => {
    this.setState({ length: event.target.value });
  }

  render() {
    return(
      <main>
        <div className="option">
          <h1>Length</h1>

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
}
