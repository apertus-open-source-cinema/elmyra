import ClipboardJS from 'clipboard';
import Octicon, { Clippy } from '@primer/octicons-react';
import React from 'react';

export default class EmbedButton extends React.Component {
  clipboard = null;

  bindClipboard() {
    this.clipboard = new ClipboardJS(`#${this.props.id}-copy`);
    this.clipboard.on('success', event => {
      alert('Copied to clipboard!');
      event.clearSelection();
    });
    this.clipboard.on('error', event => {
      alert(`Could not copy to your clipboard - please select and copy this manually:\n${location.origin}/${this.props.id}/${this.props.currentVersionID}`);
    });
  }

  componentDidMount() {
    this.bindClipboard();
  }

  componentDidUpdate() {
    this.clipboard.destroy();
    this.bindClipboard();
  }

  render() {
    const link = `${location.origin}/${this.props.id}/${this.props.currentVersionID}`;

    return(
      <a href="#"
         id={`${this.props.id}-copy`}
         title={link}
         data-clipboard-text={link} >
        <Octicon icon={Clippy} /> Embed
      </a>
    );
  }
}
