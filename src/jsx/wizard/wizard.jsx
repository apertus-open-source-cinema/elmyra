var Wizard = React.createClass({
  getInitialState: function() {
    return({
      steps: [MediaType]
    });
  },
  navigate: function(targetStep, stateChanges) {
    var previousStepIndex = this.state.steps.indexOf(targetStep);
    if(previousStepIndex === -1) {
      stateChanges.steps = this.state.steps.concat(targetStep);
    } else {
      stateChanges.steps = this.state.steps.slice(0, previousStepIndex + 1);
    }

    this.setState(stateChanges);
  },
  generate: function(id) {
    this.setState({ id: id });

    var postData = {
      'id': id,
      'media-type': this.state.mediaType,
      'media-length': this.state.mediaLength,
      'media-width': this.state.mediaWidth,
      'media-height': this.state.mediaHeight,
      'model-url': this.state.modelUrl,
      'camera-type': this.state.cameraType,
      'style-type': this.state.styleType,
      'modifier-type': this.state.modifierType,
      'modifier-section-axis': this.state.modifierSectionAxis,
      'modifier-section-level': this.state.modifierSectionLevel,
      'modifier-section-level-from': this.state.modifierSectionLevelFrom,
      'modifier-section-level-to': this.state.modifierSectionLevelTo,
    };

    $.ajax({
      url: '/generate',
      data: postData,
      dataType: 'json',
      cache: false,
      method: 'POST',
      success: function(data) {
        window.location = '/';
      }.bind(this),
      error: function(xhr, status, error) {
        alert('Failed to generate the visualization');
        console.error('/generate', status, error.toString());
      }.bind(this)
    });
  },
  render: function() {
    var CurrentStep = this.state.steps[this.state.steps.length - 1];

    return(
      <div id="wizard">
        <Navigation>
          <a onClick={this.props.showIndex}>
            Cancel
          </a>

          {this.state.steps.map(function(step, index) {
            return(
              <a className={step === CurrentStep ? "active" : null}
                onClick={this.navigate.bind(null, step)}
                key={step.navigationTitle}>
                {index + 1} {step.navigationTitle}
              </a>
            );
          }.bind(this))}
        </Navigation>

        <CurrentStep {... this.state} generate={this.generate} navigate={this.navigate} />
      </div>
    );
  }
});
