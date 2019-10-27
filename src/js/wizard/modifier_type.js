import React from 'react';

import AnimatedCrossSection from './animated_cross_section.js';
import CrossSection from './cross_section.js';
import ID from './id.js';

export default class ModifierType extends React.Component {
  static navigationTitle = 'Modifier';

  render() {
    return(
      <main>
        <div className="option">
          <h1>None</h1>

          <div className="description">
            Do not use any modifier.
          </div>

          <div>
            <button className="btn btn-primary" onClick={this.props.navigate.bind(null, ID, { modifierType: 'none' })}>
              Choose
            </button>
          </div>
        </div>

        <div className="option">
          <h1>Cross Section</h1>

          <div className="description">
            You can think about it as cutting your model in half and throwing away one of the pieces, so the insides of the other show.
          </div>

          <div>
            <button className="btn btn-primary" onClick={this.props.navigate.bind(null, CrossSection, { modifierType: 'cross-section' })}>
              Choose
            </button>
          </div>
        </div>

        <div className="option">
          <h1>Animated Cross Section</h1>

          <div className="description">
            Same as Cross Section, only the plane where you cut moves at each frame, allowing you to see through your whole model over the course of the animation.
          </div>

          <div>
            <button className="btn btn-primary" onClick={this.props.navigate.bind(null, AnimatedCrossSection, { modifierType: 'animated-cross-section' })}>
              Choose
            </button>
          </div>
        </div>
      </main>
    );
  }
}
