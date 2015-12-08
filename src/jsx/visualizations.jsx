var Visualizations = React.createClass({
  loadFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({ visualizations: data.visualizations });
      }.bind(this),
      error: function(xhr, status, error) {
        console.error(this.props.url, status, error.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return { visualizations: [] };
  },
  componentDidMount: function() {
    this.loadFromServer();
    setInterval(this.loadFromServer, this.props.refreshInterval);
  },
  render: function() {
    var vizs = this.state.visualizations.map(function(visualization, index) {
      return(<Visualization {... visualization} key={index} />);
    });

    return(<section id="visualizations">{vizs}</section>);
  }
});
