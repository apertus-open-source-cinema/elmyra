var Preview = React.createClass({
  componentDidMount: function() {
    document.addEventListener('keydown', function(event) {
      if(this.props.visualization !== null && (event.keyCode === 27 || event.key === 'Escape')) {
        this.props.closePreview()
      }
    }.bind(this))
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return nextProps.visualization !== this.props.visualization ||
           nextProps.versionID !== this.props.versionID
  },
  stopPropagation: function(event) {
    event.stopPropagation()
  },
  render: function() {
    if(this.props.visualization === null) {
      return null
    } else {
      var content
      var url = location.origin + '/vis/' +
                this.props.visualization.title + '/' + this.props.versionID +
                '?seed=' + Date.now()

      if(this.props.visualization.mediaType === 'animation') {
        content = <video autoPlay controls>
          <source src={url} />
        </video>
      } else if(this.props.visualization.mediaType === 'still') {
        content = <img src={url} />
      } else {
        content = <iframe id="web3d-iframe" src={url}></iframe>
      }

      return(
        <div id="preview" onClick={this.props.closePreview} >
          <div id="preview-content" onClick={this.stopPropagation}>{content}</div>
        </div>
      )
    }
  }
})
