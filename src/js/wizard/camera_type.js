import React from 'react';

import StyleType from './style_type.js';

export default class CameraType extends React.Component {
  static navigationTitle = 'Camera';

  render() {
    return(
      <main>
        {this.props.mediaType === 'still' ?
          <div className="option">
            <h1>Fixed</h1>

            <div className="description">
              The camera is fixed to exactly one angle.
            </div>

            <div>
              <button className="btn btn-primary" onClick={this.props.navigate.bind(null, StyleType, { cameraType: 'fixed' })}>
                Choose
              </button>
            </div>
          </div>
        : null}

        {this.props.mediaType === 'animation' ?
          <div className="option">
            <h1>Turntable</h1>

            <div className="description">
              The camera turns 360 degrees around the object, staying on the same plane. Another way to imagine it, is that the camera were fixed, and the object placed on a table that turns 360 degrees.
            </div>

            <div>
              <button className="btn btn-primary" onClick={this.props.navigate.bind(null, StyleType, { cameraType: 'turntable' })}>
                Choose
              </button>
            </div>
          </div>
        : null}

        {this.props.mediaType === 'animation' ?
          <div className="option">
            <h1>Helix</h1>

            <div className="description">
              Like Turntable, but the camera also moves from below to above the object while it is turning around the object. If you trace the path the camera makes, it forms a helix, as it occurs in DNA strands.
            </div>

            <div>
              <button className="btn btn-primary" onClick={this.props.navigate.bind(null, StyleType, { cameraType: 'helix' })}>
                Choose
              </button>
            </div>
          </div>
        : null}

        {this.props.mediaType === 'web3d' ?
          <div className="option">
            <h1>User Controlled</h1>

            <div className="description">
              The user can freely move the camera around by moving the mouse or utilizing the keyboard.
            </div>

            <div>
              <button className="btn btn-primary" onClick={this.props.navigate.bind(null, StyleType, { cameraType: 'user' })}>
                Choose
              </button>
            </div>
          </div>
        : null}
      </main>
    );
  }
}
