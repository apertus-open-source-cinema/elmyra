var Wizard = React.createClass({
  getInitialState: function() {
    return({
      steps: [Import]
    })
  },
  navigate: function(targetStep, stateChanges) {
    var previousStepIndex = this.state.steps.indexOf(targetStep)
    if(previousStepIndex === -1) {
      stateChanges.steps = this.state.steps.concat(targetStep)
    } else {
      stateChanges.steps = this.state.steps.slice(0, previousStepIndex + 1)
    }

    this.setState(stateChanges)
  },
  generate: function(id) {
    const generateParams = [
     'mediaType', 'mediaLength', 'mediaWidth', 'mediaHeight', 'importId',
     'orientFlipHorizontally', 'orientFlipVertically', 'orientRotateX',
     'orientRotateY', 'orientRotateZ', 'cameraType', 'styleType',
     'modifierType', 'modifierSectionAxis', 'modifierSectionLevel',
     'modifierSectionLevelFrom', 'modifierSectionLevelTo'
    ]

    var requestData = {}

    requestData['id'] = id

    generateParams.forEach(function(param) {
      if(this.state[param] !== undefined) {
        requestData[param] = this.state[param]
      }
    }.bind(this))

    var request = new XMLHttpRequest()
    request.onload = this.generateFinished
    request.onerror = this.generateFailed
    request.open('POST', '/api/generate')
    request.setRequestHeader('Content-Type', 'application/json; charset=utf-8')
    request.responseType = 'json'
    request.send(JSON.stringify(requestData))

    this.setState({ id: id })
  },
  generateFinished: function(event) {
    this.props.showIndex()
  },
  generateFailed: function(event) {
    alert('Failed to generate the visualization')
  },
  render: function() {
    var CurrentStep = this.state.steps[this.state.steps.length - 1]

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
            )
          }.bind(this))}
        </Navigation>

        <CurrentStep {... this.state} generate={this.generate} navigate={this.navigate} />
      </div>
    )
  }
})
