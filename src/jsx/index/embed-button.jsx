var EmbedButton = React.createClass({
  clipboard: null,
  bindClipboard: function() {
    var btnId = '#' + this.props.title + '-copy';

    this.clipboard = new Clipboard(btnId);
    this.clipboard.on('success', function(e) {
      alert('Copied to clipboard!')
        e.clearSelection();
    });
    this.clipboard.on('error', function(e) {
      alert('Could not copy to your clipboard - please select and copy this manually:\n' + location.origin + '/vis/' + this.props.title + '/' + this.props.currentVersionID)
    });
  },
  componentDidMount: function() {
    this.bindClipboard();
  },
  componentDidUpdate: function() {
    this.clipboard.destroy();
    this.bindClipboard();
  },
  render: function() {
    var link = location.origin + '/vis/' + this.props.title + '/' + this.props.currentVersionID;

    return(
      <a href="#"
         id={this.props.title + '-copy'}
         title={link}
         data-clipboard-text={link} >
        <span className="octicon octicon-clippy" /> Embed
      </a>
    );
  }
});
