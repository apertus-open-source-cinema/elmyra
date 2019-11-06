import React from 'react';

import ModifierType from './modifier_type.js';

export default class StyleType extends React.Component {
  static navigationTitle = 'Style';

  render() {
    return(
      <main>
        <div className="option">
          <h1>Realistic</h1>

          <div className="description">
            A realistically-oriented style.
          </div>

          <div>
            <button className="btn btn-primary" onClick={this.props.navigate.bind(null, ModifierType, { styleType: 'realistic' })}>
              Choose
            </button>
          </div>
        </div>

        <div className="option">
          <h1>Illustrated</h1>

          <div className="description">
            A blueprint-like, line-based aesthetic.
          </div>

          <div>
            <button className="btn btn-primary" onClick={this.props.navigate.bind(null, ModifierType, { styleType: 'illustrated' })}>
              Choose
            </button>
          </div>
        </div>
      </main>
    );
  }
}
