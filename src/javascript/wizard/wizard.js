import React from 'react';

import Import from './import.js';
import Navigation from '../navigation.js';

const GENERATE_PARAMS = [
 'mediaAnimated',
 'mediaLength',
 'mediaWidth',
 'mediaHeight',
 'importId',
 'orientFlipHorizontally',
 'orientFlipVertically',
 'orientRotateX',
 'orientRotateY',
 'orientRotateZ',
 'cameraType',
 'styleType',
 'modifierType',
 'modifierSectionAxis',
 'modifierSectionLevel',
 'modifierSectionLevelFrom',
 'modifierSectionLevelTo'
];

export default class Wizard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { steps: [Import] };
  }

  navigate = (targetStep, stateChanges) => {
    const previousStepIndex = this.state.steps.indexOf(targetStep);
    if(previousStepIndex === -1) {
      stateChanges.steps = this.state.steps.concat(targetStep);
    } else {
      stateChanges.steps = this.state.steps.slice(0, previousStepIndex + 1);
    }

    this.setState(stateChanges);
  }

  generate = id => {
    const requestData = {};

    requestData['id'] = id;

    GENERATE_PARAMS.forEach(param => {
      if(this.state[param] !== undefined) {
        requestData[param] = this.state[param];
      }
    });

    const request = new XMLHttpRequest();
    request.onload = this.generateFinished;
    request.onerror = this.generateFailed;
    request.open('POST', '/__internal/generate');
    request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    request.responseType = 'json';
    request.send(JSON.stringify(requestData));

    this.setState({ id: id });
  }

  generateFinished = () => {
    this.props.showIndex();
  }

  generateFailed = () => {
    alert('Failed to generate the visualization');
  }

  render() {
    const CurrentStep = this.state.steps[this.state.steps.length - 1];

    return(
      <div id="wizard">
        <Navigation>
          <a href="#" onClick={this.props.showIndex}>
            Cancel
          </a>

          {this.state.steps.map((step, index) =>
            <a className={step === CurrentStep ? 'active' : null}
               href="#"
               key={step.navigationTitle}
               onClick={this.navigate.bind(null, step)}>
              {index + 1} {step.navigationTitle}
            </a>
          )}
        </Navigation>

        <CurrentStep {...this.state} generate={this.generate} navigate={this.navigate} />
      </div>
    );
  }
}
