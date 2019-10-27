import Octicon, { Info } from '@primer/octicons-react';
import React from 'react';

export default class ID extends React.Component {
  static navigationTitle = 'ID';

  constructor(props) {
    super(props);
    this.state = { id: '' };
  }

  componentDidMount() {
    document.getElementById('id').focus();
  }

  changeID = event => {
    this.setState({ id: event.target.value });
  }

  submitID = event => {
    if(document.getElementById('id').checkValidity()) {
      const submitButton = document.getElementById('id-submit');

      submitButton.classList.remove('btn-primary');
      submitButton.classList.add('btn-warning');
      submitButton.setAttribute('disabled', true);
      submitButton.innerHTML = 'Generating ...';

      this.props.generate(this.state.id);
    }

    event.preventDefault();
  }

  render() {
    return(
      <main>
        <div className="data-input">
          <h1>ID</h1>

          <span className="text-muted">
            <Octicon icon={Info} /> Only small letters (a-z), digits (0-9) and dashes (-) allowed.
          </span>

          <div className="description">
            The ID should hint at the content of the visualization,
            it will be used to name the visualization in the overview,
            as well as in all URLs for embedding the visualization:

            <br /><br />

            <form onSubmit={this.submitID}>

              <input id="id"
                     type="text"
                     name="id"
                     className="form-control"
                     onChange={this.changeID}
                     value={this.state.id}
                     placeholder="axiom-beta-turntable"
                     required
                     pattern="[a-z0-9-]+" />

              <button id="id-submit"
                      className="btn btn-primary"
                      type="submit">
                Confirm & Generate Visualization
              </button>

            </form>
          </div>
        </div>
      </main>
    );
  }
}
