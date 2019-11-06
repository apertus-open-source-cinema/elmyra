import filesize from 'filesize';
import Octicon from '@primer/octicons-react';
import React from 'react';

import {
  DesktopDownload,
  FileBinary,
  FileCode,
  FileMedia,
  FileZip,
  TriangleRight
} from '@primer/octicons-react';

const FORMAT_TOOLTIPS = {
  'png': 'Larger filesizes but lossless, supports transparency - great for reduced, graphic designs',
  'jpg': 'Very small filesizes but lossy, no transparency - great for visually dense, detailed images',
  'svg': 'Vector-based line graphic - only available for illustrated/line-based styles',
  'mp4': 'Most widely spread video format - use this e.g. for uploading to Youtube',
  'ogv': 'An alternative, open format',
  'webm': 'An alternative, open format',
  'gif': 'Bad quality but biggest fun factor',
  'png.zip': 'Larger filesizes but lossless, supports transparency - great for reduced, graphic designs',
  'svg.zip': 'Vector-based line graphic - only available for illustrated/line-based styles'
};

class DownloadOption extends React.Component {
  render() {
    if(this.props[this.props.format]) {
      const fileSize =
        <span className="text-muted">
          ({filesize(this.props[this.props.format].fileSize)})
        </span>
      ;

      return(
        <a className="dropdown-item"
           download={`${this.props.id}.${this.props.format}`}
           href={`/${this.props.id}/${this.props.currentVersionID}/${this.props.format}`}
           title={FORMAT_TOOLTIPS[this.props.format]} >
          {this.props.format} {fileSize}
        </a>
      );
    } else {
      return(
        <div className="dropdown-item disabled"
             title="Not available (yet)">
          {this.props.format}
        </div>
      );
    }
  }
}

export default class DownloadButton extends React.Component {
  render() {
    const blendOption =
      <a className="dropdown-item"
         download
         href={`/${this.props.id}/${this.props.currentVersionID}/blend`}
         title="Download this visualization's source blender file">
        blend
      </a>
    ;

    let downloadOptions;
    if(this.props.mediaType === 'animation') {
      downloadOptions =
        <div className="dropdown-menu">
          <div className="dropdown-header">
            <Octicon icon={FileBinary} /> 3D Scene Files
          </div>
          {blendOption}
          <div className="dropdown-divider" />

          <div className="dropdown-header">
            <Octicon icon={TriangleRight} /> Video Files
          </div>
          <DownloadOption {...this.props} format="mp4" />
          <DownloadOption {...this.props} format="ogv" />
          <DownloadOption {...this.props} format="webm" />
          <DownloadOption {...this.props} format="gif" />
          <div className="dropdown-divider" />

          <div className="dropdown-header">
            <Octicon icon={FileZip} /> All Frames as Images
          </div>
          <DownloadOption {...this.props} format="png.zip" />
          <DownloadOption {...this.props} format="svg.zip" />
        </div>
      ;
    } else /* if(this.props.mediaType === 'still') */ {
      downloadOptions =
        <div className="dropdown-menu">
          <div className="dropdown-header">
            <Octicon icon={FileBinary} /> 3D Scene Files
          </div>
          {blendOption}
          <div className="dropdown-divider" />

          <div className="dropdown-header">
            <Octicon icon={FileMedia} /> Image Files
          </div>
          <DownloadOption {...this.props} format="png" />
          <DownloadOption {...this.props} format="jpg" />
          <div className="dropdown-divider" />

          <div className="dropdown-header">
            <Octicon icon={FileCode} /> Vector Files
          </div>
          <DownloadOption {...this.props} format="svg" />
        </div>
      ;
    }

    return(
      <div className="dropdown">
        <a href="#" className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <Octicon icon={DesktopDownload} /> Download
        </a>
        {downloadOptions}
      </div>
    );
  }
}
