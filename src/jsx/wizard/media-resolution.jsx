var MediaResolution = React.createClass({
  getInitialState: function() {
    return({
      height: 640,
      width: 480
    });
  },
  statics: {
    navigationTitle: 'Resolution'
  },
  changeWidth: function(event) {
    this.setState({ width: parseInt(event.target.value) });
  },
  changeHeight: function(event) {
    this.setState({ height: parseInt(event.target.value) });
  },
  render: function() {
    return(
      <main>

        <div className="option">
          <h1>
            DCI 4K
          </h1>

          <div className="description">
            This is the film and video production industry 4K standard.
          </div>

          <div>
            <button className="btn btn-primary" onClick={this.props.navigate.bind(null, CameraType, { mediaWidth: 4096, mediaHeight: 2160 })}>
              Choose
            </button>
          </div>
        </div>

        <div className="option">
          <h1>
            UHD-1
          </h1>
          <span className="text-muted">
            <span className="octicon octicon-info" /> Also known as UHDTV, 2160p
          </span>

          <div className="description">
            This is the consumer 4K standard, use it for material you want to show on consumer display devices, television and also for Youtube.
          </div>

          <div>
            <button className="btn btn-primary" onClick={this.props.navigate.bind(null, CameraType, { mediaWidth: 3840, mediaHeight: 2160 })}>
              Choose
            </button>
          </div>
        </div>

        <div className="option">
          <h1>
            1080p
          </h1>
          <span className="text-muted">
            <span className="octicon octicon-info" /> Also known as Full HD, FHD.
          </span>

          <div className="description">

          </div>

          <div>
            <button className="btn btn-primary" onClick={this.props.navigate.bind(null, CameraType, { mediaWidth: 1920, mediaHeight: 1080 })}>
              Choose
            </button>
          </div>
        </div>

        <div className="option">
          <h1>
            720p
          </h1>

          <div className="description">
            It renders quicker than 1080p.
          </div>

          <div>
            <button className="btn btn-primary" onClick={this.props.navigate.bind(null, CameraType, { mediaWidth: 1280, mediaHeight: 720})}>
              Choose
            </button>
          </div>
        </div>

        <div className="option">
          <h1>
            Custom
          </h1>

          <div className="description">
            <div className="insert-group">
              <input type="text"
                     min="16"
                     max="64000"
                     onChange={this.changeWidth}
                     value={this.state.width} />
              <div className="insert">✕</div>
              <input type="text"
                     min="16"
                     max="64000"
                     onChange={this.changeHeight}
                     value={this.state.height} />
            </div>
          </div>

          <div>
            <button className="btn btn-primary" onClick={this.props.navigate.bind(null, CameraType, { mediaWidth: this.state.width, mediaHeight: this.state.height })}>
              Choose
            </button>
          </div>
        </div>

      </main>
    );
  }
});
