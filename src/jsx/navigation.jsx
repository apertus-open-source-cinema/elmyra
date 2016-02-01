var Navigation = React.createClass({
  render: function() {
    return(
      <nav>
        <a href="/" id="logo">
          E L M Y R A <span id="version">&nbsp;&nbsp;β</span>
        </a>

        {this.props.children}
      </nav>
    );
  }
});

// <div id="flash"></div>
