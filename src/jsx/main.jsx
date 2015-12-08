$(function() {

  if($('#react-container').length > 0) {
    ReactDOM.render(
      <Visualizations url="/visualizations" refreshInterval={5000} />,
      document.getElementById('react-container')
    );
  }

});
