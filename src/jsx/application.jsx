var Application = React.createClass({
  refreshInterval: 2000,
  loadFromServer: function() {
    $.ajax({
      url: '/visualizations',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({ visualizations: data.visualizations });
      }.bind(this),
      error: function(xhr, status, error) {
        console.error('/visualizations', status, error.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return({
      show: 'index',
      visualizations: []
    });
  },
  componentDidMount: function() {
    this.loadFromServer();
    setInterval(this.loadFromServer, this.refreshInterval);
  },
  showIndex: function() {
    this.setState({ show: 'index' });
  },
  showWizard: function() {
    this.setState({ show: 'wizard' });
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
              return(<Visualization {... v} key={index} />);
            })}
          </section>
        </div>
      );

    } else if(this.state.show === 'wizard') {

      return(
        <div id="application">
          <Wizard showIndex={this.showIndex} />
        </div>
      );

    }
  }
});

$(function() {
  ReactDOM.render(
    <Application />,
    document.getElementById('application')
  );
});
