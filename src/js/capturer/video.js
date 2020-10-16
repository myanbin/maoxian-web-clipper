"use strict";

import T           from '../lib/tool.js';
import Asset       from '../lib/asset.js';
import Task        from '../lib/task.js';
import CaptureTool from './tool.js';

/*!
 * Capture Element <video>
 */


/**
 *
 * @param {Object} opts
 *   - {String} saveFormat
 *   - {String} baseUrl
 *   - {String} clipId
 *   - {Object} storageInfo
 *   - {Object} mimeTypeDict
 *
 */
function capture(node, opts) {
  const {saveFormat, baseUrl, clipId, storageInfo, mimeTypeDict = {}} = opts;
  const tasks = [];

  node.removeAttribute('crossorigin');
  // referrerpolicy attribute

  // handle src
  const src = node.getAttribute('src');
  if (src !== null) {
    const {isValid, url, message} = T.completeUrl(src, baseUrl);
    if (isValid) {
      const {filename, path} = Asset.calcInfo(url, storageInfo, {httpMimeType: mimeTypeDict[url]}, clipId);
      const task = Task.createVideoTask(filename, url, clipId);
      node.setAttribute('src', path);
      tasks.push(task);
    } else {
      node.setAttribute('data-mx-warn', message);
      node.setAttribute('data-mx-original-src', (src || ''));
      node.setAttribute('src', 'invalid-url.mp4');
    }
  } else {
    const sourceNodes = node.querySelectorAll('source');
    [].forEach.call(sourceNodes, (sourceNode) => {
      const {tasks: sourceTasks} = CaptureTool.captureVideoSrc(sourceNode, opts);
      tasks.push(...sourceTasks);
    });
  }

  return {node, tasks};
}

const CapturerVideo = {capture: capture}

export default CapturerVideo;
