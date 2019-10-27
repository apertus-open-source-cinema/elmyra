import React from 'react';

import MediaLength from './media_length.js';
import MediaResolution from './media_resolution.js';

export default class MediaType extends React.Component {
  static navigationTitle = 'Media';

  render() {
    return(
      <main>
        <div className="option">
          <h1>Image</h1>

          <div className="description">
            A rendered still image.
          </div>

          <div>
            <button className="btn btn-primary" onClick={this.props.navigate.bind(null, MediaResolution, { mediaType: 'still' })}>
              Choose
            </button>
          </div>
        </div>

        <div className="option">
          <h1>Animation</h1>

          <div className="description">
            A rendered animation.
          </div>

          <div>
            <button className="btn btn-primary" onClick={this.props.navigate.bind(null, MediaLength, { mediaType: 'animation' })}>
              Choose
            </button>
          </div>
        </div>

        <div className="option">
          <h1>Web3D</h1>

          <div className="description">
            An interactive WebGL based 3D browser widget.
          </div>

          <div>
            <button className="btn btn-primary" onClick={this.props.navigate.bind(null, MediaResolution, { mediaType: 'web3d' })}>
              Choose
            </button>
          </div>
        </div>
      </main>
    );
  }
}
