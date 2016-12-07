var Orient = React.createClass({
  camera: null,
  scene: null,
  renderer: null,
  geometry: null,
  material: null,
  mesh: null,
  light: null,
  widgetFlipHorizontally: null,
  widgetFlipVertically: null,
  widgetTilt: null,
  widgetTurn: null,
  getInitialState: function() {
    return({
      flipHorizontally: false,
      flipVertically: false,
    });
  },
  statics: {
    navigationTitle: 'Orient',
    redHex: 0xff414e,
    greenHex: 0x9bff46,
    blueHex: 0x59e0ff,
  },
  componentDidMount: function() {
    this.scene = new THREE.Scene();

    this.scene.add(new THREE.AxisHelper(1));

    this.camera = new THREE.PerspectiveCamera(16, 720 / 480, 1, 20);
    this.camera.position.set(7.2706032, -3.5676303, 2.6419632);
    this.camera.up = new THREE.Vector3(0,0,1);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.scene.add(this.camera);

    this.light = new THREE.AmbientLight(0x404040);
    this.scene.add(this.light);

    this.light = new THREE.PointLight(Orient.redHex, 1, 10);
    this.light.position.set(3, 0 , 0);
    this.scene.add(this.light);

    this.light = new THREE.PointLight(Orient.greenHex, 1, 10);
    this.light.position.set(0, 3 , 0);
    this.scene.add(this.light);

    this.light = new THREE.PointLight(Orient.blueHex, 1, 10);
    this.light.position.set(0, 0 , 3);
    this.scene.add(this.light);

    this.renderer = new THREE.WebGLRenderer({ antialias: true }); //new THREE.CanvasRenderer();
    this.renderer.setSize(720, 480);
    this.renderer.setClearColor(0xffffff);

    document.getElementById('viewer-container').appendChild(this.renderer.domElement);

    // Render white background until obj is loaded
    this.renderer.render(this.scene, this.camera);

    // See http://threejs.org/docs/#Reference/Loaders/OBJLoader
    var loader = new THREE.OBJLoader();

    loader.load('/api/preview/' + this.props.importId, function(object) {
      object.children.forEach(function(child) {
        if(child.name == 'widget-flip-horizontally' ||
           child.name == 'widget-flip-vertically' ||
           child.name == 'widget-tilt' ||
           child.name == 'widget-turn') {

          child.material.color = new THREE.Color(0x000000);
          child.material.emissiveIntensity = 1;
          child.material.side = THREE.DoubleSide;
          child.visible = false;

          if(child.name == 'widget-flip-horizontally') {
            child.material.emissive = new THREE.Color(Orient.greenHex);
            this.widgetFlipHorizontally = child;
          } else if(child.name == 'widget-flip-vertically') {
            child.material.emissive = new THREE.Color(Orient.blueHex);
            this.widgetFlipVertically = child;
          } else if(child.name == 'widget-tilt') {
            child.material.emissive = new THREE.Color(Orient.redHex);
            this.widgetTilt = child;
          } else if(child.name == 'widget-turn') {
            child.material.emissive = new THREE.Color(Orient.blueHex);
            this.widgetTurn = child;
          }
        } else {
          var geometry = new THREE.Geometry().fromBufferGeometry(child.geometry);
          var material = child.material;
          material.color = new THREE.Color(0xffffff);
          material.side = THREE.DoubleSide;
          this.mesh = new THREE.Mesh(geometry, child.material)
        }
      }.bind(this));

      this.scene.add(this.widgetFlipHorizontally);
      this.scene.add(this.widgetFlipVertically);
      this.scene.add(this.widgetTilt);
      this.scene.add(this.widgetTurn);
      this.scene.add(this.mesh);

      this.renderer.render(this.scene, this.camera);
    }.bind(this));
  },
  flipNormals: function() {
    this.mesh.geometry.dynamic = true
    this.mesh.geometry.__dirtyVertices = true;
    this.mesh.geometry.__dirtyNormals = true;

    for(var f = 0; f < this.mesh.geometry.faces.length; f++) {
        this.mesh.geometry.faces[f].normal.x *= -1;
        this.mesh.geometry.faces[f].normal.y *= -1;
        this.mesh.geometry.faces[f].normal.z *= -1;
    }

    this.mesh.geometry.computeVertexNormals();
    this.mesh.geometry.computeFaceNormals();
  },
  flipHorizontally: function() {
    this.setState({ flipHorizontally: !this.state.flipHorizontally });
    this.mesh.geometry.scale(1, -1, 1);
    this.flipNormals();
    this.renderer.render(this.scene, this.camera);
  },
  flipVertically: function() {
    this.setState({ flipVertically: !this.state.flipVertically });
    this.mesh.geometry.scale(1, 1, -1);
    this.flipNormals();
    this.renderer.render(this.scene, this.camera);
  },
  tilt: function() {
    var q = new THREE.Quaternion();
    q.setFromAxisAngle(new THREE.Vector3(1, 0, 0), (90 * Math.PI) / 180);
    this.mesh.quaternion.multiplyQuaternions(q, this.mesh.quaternion);
    this.renderer.render(this.scene, this.camera);
  },
  turn: function() {
    var q = new THREE.Quaternion();
    q.setFromAxisAngle(new THREE.Vector3(0, 0, 1), (90 * Math.PI) / 180);
    this.mesh.quaternion.multiplyQuaternions(q, this.mesh.quaternion);
    this.renderer.render(this.scene, this.camera);
  },
  highlight: function(widget, state) {
    if(widget == 'flipHorizontally') {
      widget = this.widgetFlipHorizontally.visible = state;
    } else if(widget == 'flipVertically') {
      widget = this.widgetFlipVertically.visible = state;
    } else if(widget == 'turn') {
      widget = this.widgetTurn.visible = state;
    } else if(widget == 'tilt') {
      widget = this.widgetTilt.visible = state;
    }

    this.renderer.render(this.scene, this.camera);
  },
  saveTransformAndNavigate: function() {
    this.props.navigate(
      MediaType,
      {
        orientFlipHorizontally: this.state.flipHorizontally,
        orientFlipVertically: this.state.flipVertically,
        orientRotateX: this.mesh.rotation._x.toFixed(9), // toFixed to suppress exponential notation
        orientRotateY: this.mesh.rotation._y.toFixed(9), // (which is not understood further down the pipeline)
        orientRotateZ: this.mesh.rotation._z.toFixed(9),
      }
    );
  },
  render: function() {
    return(
      <main>

        <div className="tool">
          <h1>
            Orient
          </h1>

          <div className="description">
            Use the flip, tilt and turn tools to orient your model such that ...<br />
            - the front faces towards the camera along the red axis<br />
            - the top faces upwards along the blue axis<br />
            - the right side faces away from the camera along the green axis<br />

            <br /><br />

            <div id="viewer-container" />

            <br /><br />

            <div className="btn-group">
              <button className="btn btn-default"
                      onClick={this.flipHorizontally}
                      onMouseEnter={this.highlight.bind(null, 'flipHorizontally', true)}
                      onMouseLeave={this.highlight.bind(null, 'flipHorizontally', false)}>
                Flip Horizontally
              </button>

              <button className="btn btn-default"
                      onClick={this.flipVertically}
                      onMouseEnter={this.highlight.bind(null, 'flipVertically', true)}
                      onMouseLeave={this.highlight.bind(null, 'flipVertically', false)}>
                Flip Vertically
              </button>

              <button className="btn btn-default"
                      onClick={this.turn}
                      onMouseEnter={this.highlight.bind(null, 'turn', true)}
                      onMouseLeave={this.highlight.bind(null, 'turn', false)}>
                Turn 90°
              </button>

              <button className="btn btn-default"
                      onClick={this.tilt}
                      onMouseEnter={this.highlight.bind(null, 'tilt', true)}
                      onMouseLeave={this.highlight.bind(null, 'tilt', false)}>
                Tilt 90°
              </button>
            </div>
          </div>

          <div>
            <br/>

            <button id="confirm-button"
                    className="btn btn-primary"
                    onClick={this.saveTransformAndNavigate}>
              Continue
            </button>
          </div>
        </div>

      </main>
    );
  }
});
