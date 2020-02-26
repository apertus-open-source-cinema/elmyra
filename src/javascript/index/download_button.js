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

function DownloadOption({ format, version, visualization }) {
  if(version.meta[format] === null) {
    return(
      <div className="dropdown-item disabled"
           title="Not available (yet)">
        {format}
      </div>
    );
  }


  const fileSize =
    <span className="text-muted">
      ({filesize(version.meta[format].fileSize)})
    </span>
  ;

  return(
    <a className="dropdown-item"
       download={`${visualization.id}.${format}`}
       href={`/${visualization.id}/${version}/${format}`}
       title={FORMAT_TOOLTIPS[format]} >
      {format} {fileSize}
    </a>
  );
}

export default function DownloadButton({ version, visualization }) {
  const blendOption =
    <a className="dropdown-item"
       download
       href={`/${visualization.id}/${version}/blend`}
       title="Download this visualization's source blender file">
      blend
    </a>
  ;

  let downloadOptions;
  if(version.meta.mediaAnimated) {
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
        <DownloadOption format="mp4" version={version} visualization={visualization} />
        <DownloadOption format="ogv" version={version} visualization={visualization} />
        <DownloadOption format="webm" version={version} visualization={visualization} />
        <DownloadOption format="gif" version={version} visualization={visualization} />
        <div className="dropdown-divider" />

        <div className="dropdown-header">
          <Octicon icon={FileZip} /> All Frames as Images
        </div>
        <DownloadOption format="png.zip" version={version} visualization={visualization} />
        <DownloadOption format="svg.zip" version={version} visualization={visualization} />
      </div>
    ;
  } else {
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
        <DownloadOption format="png" version={version} visualization={visualization} />
        <DownloadOption format="jpg" version={version} visualization={visualization} />
        <div className="dropdown-divider" />

        <div className="dropdown-header">
          <Octicon icon={FileCode} /> Vector Files
        </div>
        <DownloadOption format="svg" version={version} visualization={visualization} />
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
