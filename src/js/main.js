import 'bootstrap';

import React from 'react';
import ReactDOM from 'react-dom';

import Navigation from './navigation.js';
import Preview from './preview.js';
import Visualization from './index/visualization.js';
import Wizard from './wizard/wizard.js';

const REFRESH_INTERVAL = 2000;

class Application extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      preview: {
        visualization: null,
        versionID: null
      },
      show: 'index',
      visualizations: []
    };
  }

  loadFromServer = () => {
    const request = new XMLHttpRequest();
    request.onload = this.loadFinished;
    request.onerror = this.loadFailed;
    request.open('GET', '/api/visualizations');
    request.responseType = 'json';
    request.send();
  }

  componentDidMount() {
    this.loadFromServer();
    setInterval(this.loadFromServer, REFRESH_INTERVAL);
  }

  loadFailed = event => {
    console.error('/api/visualizations');
  }

  loadFinished = event => {
    this.setState({ visualizations: event.target.response.visualizations });
  }

  closePreview = () => {
    this.setState({
      preview: {
        visualization: null,
        versionID: null
      }
    });
  }

  openPreview = (visualization, versionID) => {
    this.setState({
      preview: {
        visualization: visualization,
        versionID: versionID
      }
    });
  }

  showIndex = () => {
    this.setState({ show: 'index' });
    this.loadFromServer();
  }

  showWizard = () => {
    this.setState({ show: 'wizard' });
  }

  render() {
    if(this.state.show === 'index') {
      return(
        <div id="application">
          <Navigation>
            <a href="#" onClick={this.showWizard}>
              New
            </a>
          </Navigation>

          <section id="visualizations">
            {this.state.visualizations.map((viz, index) =>
              <Visualization {...viz} openPreview={this.openPreview} key={index} />
            )}
          </section>

          <Preview {...this.state.preview} closePreview={this.closePreview} />
        </div>
      );
    } else /* if(this.state.show === 'wizard') */ {
      return(
        <div id="application">
          <Wizard showIndex={this.showIndex} />
        </div>
      );
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Application />,
    document.getElementById('application-container')
  );
});
