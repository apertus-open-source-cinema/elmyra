var ProgressBar = React.createClass({
  render: function() {
    var progress = (this.props.current / this.props.max) * 100;

    var classes = this.props.classes;
    if(typeof(classes) !== 'string') {
      classes = classes.join(' ');
    }

    return(
      <div className={classes}
           role="progressbar"
           aria-valuenow={this.props.current}
           aria-valuemin="0"
           aria-valuemax={this.props.max}
           style={{width: progress + '%'}}>
        <span className="sr-only">
          {this.props.current}/{this.props.max}
        </span>
      </div>
    );
  }
});

var ProcessingProgressBar = React.createClass({
  render: function() {
    var classes = ['progress-bar', 'progress-bar-striped', 'active'];

    if(this.props.renderQuality === 'production') {
      classes.push('progress-bar-success');
    } else if(this.props.renderQuality === 'preview') {
      classes.push('progress-bar-warning');
    } else {
      classes.push('progress-bar-danger');
    }

    var primaryBar;
    var backgroundBar;
    if(this.props.mediaType === 'animation') {
      if(this.props.renderedFrames < this.props.mediaFrameCount) {
        primaryBar = <ProgressBar classes={classes}
                                  current={this.props.renderedFrames}
                                  max={this.props.mediaFrameCount} />;
      } else {
        primaryBar = <ProgressBar classes={classes}
                                  current={this.props.lastRenderedFrame}
                                  max={this.props.mediaFrameCount} />;

        backgroundBar = <ProgressBar classes="progress-bar progress-bar-info progress-bar-striped active"
                                     current={0}
                                     max={this.props.lastRenderedFrame} />;
      }
    } else {
      primaryBar = <ProgressBar classes={classes} current={1} max={1} />;
    }

    return(
      <div className="progress">
        {primaryBar} {backgroundBar}
      </div>
    );
  }
});

var ProcessingState = React.createClass({
  render: function() {
    if(typeof(this.props.processing) === "string") {
      return(
        <div style={{ borderTop: '1px solid #eee', marginTop: '15px', paddingTop: '18px' }}>
          <ProcessingProgressBar {... this.props} />
          <div className="text-muted text-center">
            {this.props.processing}
          </div>
        </div>
      );
    } else {
      return <span />;
    }
  }
});
