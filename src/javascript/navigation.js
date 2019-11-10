import React from 'react';

export default class Navigation extends React.Component {
  render() {
    return(
      <nav>
        <a href="/" id="logo">
          E L M Y R A <span id="version">&nbsp;&nbsp;β</span>
        </a>

        {this.props.children}
      </nav>
    );
  }
}
