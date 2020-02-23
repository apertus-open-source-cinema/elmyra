import React from 'react';

export default class Preview extends React.Component {
  componentDidMount() {
    document.addEventListener('keydown', event => {
      if(this.props.visualization !== null && event.key === 'Escape') {
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

    const url = `${location.origin}/${this.props.visualization.id}/${this.props.versionID}?${Date.now()}`;

    let content;
    if(this.props.visualization.mediaAnimated) {
      content = <video autoPlay controls>
        <source src={url} />
      </video>;
    } else {
      content = <img src={url} />;
    }

    return(
      <div id="preview" onClick={this.props.closePreview} >
        <div id="preview-content" onClick={this.stopPropagation}>{content}</div>
      </div>
    );
  }
}
