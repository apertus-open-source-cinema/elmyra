var Application = React.createClass({
  refreshInterval: 2000,
  loadFromServer: function() {
    var request = new XMLHttpRequest()
    request.onload = this.loadFinished
    request.onerror = this.loadFailed
    request.open('GET', '/visualizations')
    request.responseType = 'json'
    request.send()
  },
  getInitialState: function() {
    return({
      show: 'index',
      visualizations: []
    })
  },
  componentDidMount: function() {
    this.loadFromServer()
    setInterval(this.loadFromServer, this.refreshInterval)
  },
  loadFailed: function(event) {
    console.error('/visualizations')
  },
  loadFinished: function(event) {
    this.setState({ visualizations: event.target.response.visualizations })
  },
  showIndex: function() {
    this.setState({ show: 'index' })
    this.loadFromServer()
  },
  showWizard: function() {
    this.setState({ show: 'wizard' })
  },
  render: function() {
    if(this.state.show === 'index') {

      return(
        <div id="application">
          <Navigation>
            <a onClick={this.showWizard}>
              New
            </a>
          </Navigation>
          <section id="visualizations">
            {this.state.visualizations.map(function(v, index) {
              return(<Visualization {... v} key={index} />)
            })}
          </section>
        </div>
      )

    } else if(this.state.show === 'wizard') {

      return(
        <div id="application">
          <Wizard showIndex={this.showIndex} />
        </div>
      )

    }
  }
})

document.addEventListener('DOMContentLoaded', function(event) {
  ReactDOM.render(
    <Application />,
    document.getElementById('application-container')
  )
})
