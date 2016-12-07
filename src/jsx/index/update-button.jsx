var UpdateButton = React.createClass({
  uploadSelect: function(event) {
    document.getElementById(this.props.id + '-upload').click()
    event.preventDefault()
  },
  uploadFailed: function(event) {
    // document.getElementById('flash').innerHTML = '<div class="alert alert-error" role="alert"><span class="octicon octicon-x" /> Upload failed</div>'
  },
  uploadFinished: function(event) {
    // document.getElementById('flash').innerHTML = '<div class="alert alert-success" role="alert"><span class="octicon octicon-check" /> Upload successful</div>'
  },
  uploadSubmit: function() {
    var file = document.getElementById(this.props.id + '-upload').files[0]

    var formData = new FormData()
    formData.append('blendfile', file)

    var request = new XMLHttpRequest()
    request.onload = this.uploadFinished
    request.onerror = this.uploadFailed
    request.open('POST', '/api/upload/' + this.props.id)
    request.responseType = 'json'
    request.send(formData)
  },
  updateFailed: function(event) {
    // document.getElementById('flash').innerHTML = '<div class="alert alert-error" role="alert"><span class="octicon octicon-x" /> Update failed</div>'
  },
  updateFinished: function(event) {
    // document.getElementById('flash').innerHTML = '<div class="alert alert-success" role="alert"><span class="octicon octicon-check" /> Update successful</div>'
  },
  updateSubmit: function(event) {
    event.preventDefault()

    var request = new XMLHttpRequest()
    request.onload = this.updateFinished
    request.onerror = this.updateFailed
    request.open('POST', '/api/upload/' + this.props.id)
    request.responseType = 'json'
    request.send()
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
                   id={this.props.id + '-upload'}
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
    )
  }
})
