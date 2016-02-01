var MediaType = React.createClass({
  statics: {
    navigationTitle: 'Media'
  },
  render: function() {
    return(
      <main>

        <div className="option">
          <h1>
            Image
          </h1>

          <div className="description">
            A rendered still image.
          </div>

          <div>
            <button className="btn btn-primary" onClick={this.props.navigate.bind(null, Model, { mediaType: 'still' })}>
              Choose
            </button>
          </div>
        </div>

        <div className="option">
          <h1>
            Animation
          </h1>

          <div className="description">
            A rendered animation.
          </div>

          <div>
            <button className="btn btn-primary" onClick={this.props.navigate.bind(null, MediaLength, { mediaType: 'animation' })}>
              Choose
            </button>
          </div>
        </div>

        <div className="option">
          <h1>
            Web3D
          </h1>

          <div className="description">
            An interactive WebGL based 3D browser widget.
          </div>

          <div>
            <button className="btn btn-primary" onClick={this.props.navigate.bind(null, Model, { mediaType: 'web3d' })}>
              Choose
            </button>
          </div>
        </div>

      </main>
    );
  }
});
