var Preview = React.createClass({
  componentDidMount: function() {
    document.addEventListener('keydown', (event) => {
      if(this.props.type !== null && (event.keyCode === 27 || event.key === 'Escape')) {
        this.props.closePreview()
      }
    })
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return nextProps.type !== this.props.type || nextProps.url !== this.props.url
  },
  stopPropagation: function(event) {
    event.stopPropagation()
  },
  render: function() {
    var content

    if(this.props.type === null) {
      return null
    } else if(this.props.type === 'animation') {
      content = <video autoPlay controls>
        <source src={this.props.url} />
      </video>
    } else if(this.props.type === 'still') {
      content = <img src={this.props.url} />
    } else {
      content = <iframe id="web3d-iframe" src={this.props.url}></iframe>
    }

    return(
      <div id="preview" onClick={this.props.closePreview} >
        <div id="preview-content" onClick={this.stopPropagation}>{content}</div>
      </div>
    )
  }
})
