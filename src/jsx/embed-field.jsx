var EmbedField = React.createClass({
  clipboard: null,
  bindClipboard: function() {
    var btnId = '#' + this.props.title + '-copy';

    this.clipboard = new Clipboard(btnId);
    this.clipboard.on('success', function(e) {
        $(btnId).children('span').addClass('text-success');
        e.clearSelection();
    });
    this.clipboard.on('error', function(e) {
        $(btnId).children('span').addClass('text-danger');
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
    return(
      <div className="input-group">
        <input id={this.props.title + '-link'}
               type="text"
               className="form-control"
               placeholder="Embed URL"
               value={location.origin + '/' + this.props.title + '/' + this.props.currentVersionID}
               readOnly />

        <span className="input-group-btn">
          <button id={this.props.title + '-copy'}
                  className="btn btn-default"
                  type="button"
                  data-clipboard-target={'#' + this.props.title + '-link'}>
            <span className="octicon octicon-clippy" />
          </button>
        </span>
      </div>
    );
  }
});
