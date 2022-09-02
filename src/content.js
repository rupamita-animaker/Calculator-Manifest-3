/*global chrome*/

import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import RecordRTC, { MediaStreamRecorder, invokeSaveAsDialog } from 'recordrtc';
import Keypad from './components/Keypad';
import Screen from './components/Screen';
import styled from 'styled-components';
import { StyleSheetManager } from 'styled-components';

chrome.runtime.onMessage.addListener((req) => {
  if(req.message==='START_WITH_RECORDING') {
    // mandatory works here. Then why not in plugin content script ?
    navigator.getUserMedia({
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: req.screenId,
        }
      }
  }, (videoStream) => {
      const videoTracks = videoStream.getTracks();
      videoTracks.forEach(track => {
          track.addEventListener('ended', () => {
              alert(`video track ended`)
          });
      });
      navigator.mediaDevices.getUserMedia({
        audio: true
      }).then((audioStream) => {
        videoStream.addTrack(audioStream.getTracks()[0]);
        const recorder = RecordRTC(videoStream, {
          type: 'video',
          mimeType: 'video/webm;codecs=vp9,opus',
          recorderType: MediaStreamRecorder,
          getNativeBlob: !0,
        });
        recorder.startRecording();
        setTimeout(() => {
            recorder.stopRecording(() => {
                const blob = recorder.getBlob();
                invokeSaveAsDialog(blob);
            });
        }, 15000)
      }).catch((err) => {
          alert(`getUserMedia err audio: ${err}`);
      });
  }, (err) => {
      alert(`getUserMedia err video: ${err}`)
  })
  }
})

// create shadow host
const shadowHost = document.createElement('div');
shadowHost.className = 'shadow-host';
shadowHost.style = `
position: fixed;
top: 0;
right:0;
z-index: 99999999;
`;
const fontFaceStyle = document.createElement('style');
fontFaceStyle.appendChild(
    document.createTextNode(
        `
        @font-face {
            font-family: 'Big Shoulders Stencil Text';
            src: url(${chrome.runtime.getURL('static/media/BigShouldersStencilText-Medium.ttf')}) format('truetype);
            font-weight: 300;
            font-style: normal;
            font-display: swap;
        }
        `
    )
);
shadowHost.appendChild(fontFaceStyle);
document.body.appendChild(shadowHost);

// grab shadow host from dom
let host = document.querySelector('.shadow-host');
let root = host.attachShadow({mode: 'open'}); // create shadow root under the host

const styleSlot = document.createElement('section');

// append the styleSlot inside the shadow

root.appendChild(styleSlot);

// create the element where we would render our app
const renderIn = document.createElement('div');
// append the renderIn element inside the styleSlot
styleSlot.appendChild(renderIn);


// render the app
ReactDOM.render(
  <StyleSheetManager target={styleSlot}>
        <button onClick={() => {
          alert('clicked')
          chrome.runtime.sendMessage({ message: 'START_RECORDING' });
        }}>Start Recording</button>
  </StyleSheetManager>,
  renderIn
);