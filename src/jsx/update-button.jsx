var UpdateButton = React.createClass({
  uploadSelect: function(event) {
    $('#' + this.props.title + '-upload').click();
    event.preventDefault();
  },
  uploadSubmit: function() {
    var file = $('#' + this.props.title + '-upload')[0].files[0];

    var formData = new FormData();
    formData.append("blendfile", file);

    $.ajax({
      url: '/vis/' + this.props.title + '/upload',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(response) {
        $('#flash').html(
          '<div class="alert alert-success" role="alert"><span class="octicon octicon-check" /> Upload successful</div>'
        );
      },
      error: function(jqXHR, textStatus, errorMessage) {
        $('#flash').html(
          '<div class="alert alert-error" role="alert"><span class="octicon octicon-x" /> ' + errorMessage + '</div>'
        );
      }
    });
  },
  updateSubmit: function(event) {
    event.preventDefault();

    $.ajax({
      url: '/vis/' + this.props.title + '/update',
      type: 'POST',
      success: function(response) {
        $('#flash').html(
          '<div class="alert alert-success" role="alert"><span class="octicon octicon-check" /> Update successful</div>'
        );
      },
      error: function(jqXHR, textStatus, errorMessage) {
        $('#flash').html(
          '<div class="alert alert-error" role="alert"><span class="octicon octicon-x" /> ' + errorMessage + '</div>'
        );
      }
    });
  },
  render: function() {
    return(
      <div className="dropdown">
        <a href="#" className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i className="octicon octicon-cloud-upload" /> Update
        </a>
        <ul className="dropdown-menu">
          <li>
            <a href="#" onClick={this.uploadSelect} >
              <span className="text-warning octicon octicon-alert" /> Upload blendfile
            </a>
            <input type="file"
                   id={this.props.title + '-upload'}
                   style={{display: 'none'}}
                   accept=".blend"
                   onChange={this.uploadSubmit} />
          </li>
          <li>
            <a href="#" onClick={this.updateSubmit} >
              <span className="text-danger octicon octicon-alert" /> Update from source
            </a>
          </li>
        </ul>
      </div>
    );
  }
});
