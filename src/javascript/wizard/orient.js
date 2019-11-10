import React from 'react';
import {
  AmbientLight,
  AxesHelper,
  Color,
  DoubleSide,
  Geometry,
  Mesh,
  PerspectiveCamera,
  PointLight,
  Quaternion,
  Scene,
  Vector3,
  WebGLRenderer
} from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

import MediaType from './media_type.js';

const RED_HEX = 0xff414e;
const GREEN_HEX = 0x9bff46;
const BLUE_HEX = 0x59e0ff;

export default class Orient extends React.Component {
  static navigationTitle = 'Orient';

  camera = null;
  geometry = null;
  light = null;
  material = null;
  mesh = null;
  renderer = null;
  scene = null;
  widgetFlipHorizontally = null;
  widgetFlipVertically = null;
  widgetTilt = null;
  widgetTurn = null;

  constructor(props) {
    super(props);
    this.state = {
      flipHorizontally: false,
      flipVertically: false,
    };
  }

  componentDidMount() {
    this.scene = new Scene();

    this.scene.add(new AxesHelper(1));

    this.camera = new PerspectiveCamera(16, 720 / 480, 1, 20);
    this.camera.position.set(7.2706032, -3.5676303, 2.6419632);
    this.camera.up = new Vector3(0,0,1);
    this.camera.lookAt(new Vector3(0, 0, 0));
    this.scene.add(this.camera);

    this.light = new AmbientLight(0x404040);
    this.scene.add(this.light);

    this.light = new PointLight(RED_HEX, 1, 10);
    this.light.position.set(3, 0 , 0);
    this.scene.add(this.light);

    this.light = new PointLight(GREEN_HEX, 1, 10);
    this.light.position.set(0, 3 , 0);
    this.scene.add(this.light);

    this.light = new PointLight(BLUE_HEX, 1, 10);
    this.light.position.set(0, 0 , 3);
    this.scene.add(this.light);

    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setSize(720, 480);
    this.renderer.setClearColor(0xffffff);

    document.getElementById('viewer-container').appendChild(this.renderer.domElement);

    // Render white background until obj is loaded
    this.renderer.render(this.scene, this.camera);

    const loader = new OBJLoader();

    loader.load(`/__internal/preview/${this.props.importId}`, root => {
      for(const child of root.children) {
        if(child.name == 'widget-flip-horizontally' ||
           child.name == 'widget-flip-vertically' ||
           child.name == 'widget-tilt' ||
           child.name == 'widget-turn') {

          child.material.color = new Color(0x000000);
          child.material.emissiveIntensity = 1;
          child.material.side = DoubleSide;
          child.visible = false;

          if(child.name == 'widget-flip-horizontally') {
            child.material.emissive = new Color(GREEN_HEX);
            this.widgetFlipHorizontally = child;
          } else if(child.name == 'widget-flip-vertically') {
            child.material.emissive = new Color(BLUE_HEX);
            this.widgetFlipVertically = child;
          } else if(child.name == 'widget-tilt') {
            child.material.emissive = new Color(RED_HEX);
            this.widgetTilt = child;
          } else if(child.name == 'widget-turn') {
            child.material.emissive = new Color(BLUE_HEX);
            this.widgetTurn = child;
          }
        } else {
          const geometry = new Geometry().fromBufferGeometry(child.geometry);
          const material = child.material;
          material.color = new Color(0xffffff);
          material.side = DoubleSide;
          this.mesh = new Mesh(geometry, child.material);
        }
      }

      this.scene.add(this.widgetFlipHorizontally);
      this.scene.add(this.widgetFlipVertically);
      this.scene.add(this.widgetTilt);
      this.scene.add(this.widgetTurn);
      this.scene.add(this.mesh);

      this.renderer.render(this.scene, this.camera);
    });
  }

  flipNormals = () => {
    this.mesh.geometry.dynamic = true
    this.mesh.geometry.__dirtyVertices = true;
    this.mesh.geometry.__dirtyNormals = true;

    for(let f = 0; f < this.mesh.geometry.faces.length; f++) {
      this.mesh.geometry.faces[f].normal.x *= -1;
      this.mesh.geometry.faces[f].normal.y *= -1;
      this.mesh.geometry.faces[f].normal.z *= -1;
    }

    this.mesh.geometry.computeVertexNormals();
    this.mesh.geometry.computeFaceNormals();
  }

  flipHorizontally = () => {
    this.setState({ flipHorizontally: !this.state.flipHorizontally });
    this.mesh.geometry.scale(1, -1, 1);
    this.flipNormals();
    this.renderer.render(this.scene, this.camera);
  }

  flipVertically = () => {
    this.setState({ flipVertically: !this.state.flipVertically });
    this.mesh.geometry.scale(1, 1, -1);
    this.flipNormals();
    this.renderer.render(this.scene, this.camera);
  }

  tilt = () => {
    const q = new Quaternion();
    q.setFromAxisAngle(new Vector3(1, 0, 0), (90 * Math.PI) / 180);
    this.mesh.quaternion.multiplyQuaternions(q, this.mesh.quaternion);
    this.renderer.render(this.scene, this.camera);
  }

  turn = () => {
    const q = new Quaternion();
    q.setFromAxisAngle(new Vector3(0, 0, 1), (90 * Math.PI) / 180);
    this.mesh.quaternion.multiplyQuaternions(q, this.mesh.quaternion);
    this.renderer.render(this.scene, this.camera);
  }

  highlight = (widget, state) => {
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
  }

  saveTransformAndNavigate = () => {
    this.props.navigate(
      MediaType,
      {
        orientFlipHorizontally: this.state.flipHorizontally,
        orientFlipVertically: this.state.flipVertically,
        orientRotateX: this.mesh.rotation._x,
        orientRotateY: this.mesh.rotation._y,
        orientRotateZ: this.mesh.rotation._z
      }
    );
  }

  render() {
    return(
      <main>
        <div className="tool">
          <h1>Orient</h1>

          <div className="description">
            Use the flip, tilt and turn tools to orient your model such that ...<br />
            - the front faces towards the camera along the red axis<br />
            - the top faces upwards along the blue axis<br />
            - the right side faces away from the camera along the green axis<br />

            <br /><br />

            <div id="viewer-container" />

            <br /><br />

            <div className="btn-group" role="toolbar" aria-label="Alignment tools">
              <button className="btn btn-secondary"
                      onClick={this.flipHorizontally}
                      onMouseEnter={this.highlight.bind(null, 'flipHorizontally', true)}
                      onMouseLeave={this.highlight.bind(null, 'flipHorizontally', false)}>
                Flip Horizontally
              </button>

              <button className="btn btn-secondary"
                      onClick={this.flipVertically}
                      onMouseEnter={this.highlight.bind(null, 'flipVertically', true)}
                      onMouseLeave={this.highlight.bind(null, 'flipVertically', false)}>
                Flip Vertically
              </button>

              <button className="btn btn-secondary"
                      onClick={this.turn}
                      onMouseEnter={this.highlight.bind(null, 'turn', true)}
                      onMouseLeave={this.highlight.bind(null, 'turn', false)}>
                Turn 90°
              </button>

              <button className="btn btn-secondary"
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
}
