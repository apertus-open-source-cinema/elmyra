import React from 'react';

export default class Preview extends React.Component {
  componentDidMount() {
    document.addEventListener('keydown', event => {
      if(this.props.visualization !== null && (event.keyCode === 27 || event.key === 'Escape')) {
        this.props.closePreview();
      }
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.visualization !== this.props.visualization ||
           nextProps.versionID !== this.props.versionID;
  }

  stopPropagation = event => {
    event.stopPropagation();
  }

  render() {
    if(this.props.visualization === null)
      return null;

    const url = `${location.origin}/${this.props.visualization.id}/${this.props.versionID}?seed=${Date.now()}`;

    let content;
    if(this.props.visualization.mediaType === 'animation') {
      content = <video autoPlay controls>
        <source src={url} />
      </video>;
    } else if(this.props.visualization.mediaType === 'still') {
      content = <img src={url} />;
    } else {
      content = <iframe id="web3d-iframe" src={url}></iframe>;
    }

    return(
      <div id="preview" onClick={this.props.closePreview} >
        <div id="preview-content" onClick={this.stopPropagation}>{content}</div>
      </div>
    );
  }
}
