/*global chrome*/

import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import Keypad from './components/Keypad';
import Screen from './components/Screen';
import styled from 'styled-components';
import { StyleSheetManager } from 'styled-components';

const AppDiv = styled.div`
  text-align: center;
  display: ${(props) => props.display ? 'flex': 'none'};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 480px;
  height: 580px;
  background-color: rgba(245,104,156,255);
  `;

  const CalculatorDiv = styled.div`
  width: 90%;
  height: 90%;
  background-color: rgba(67,67,67,255);
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px  rgba(136,140,139,255) solid;
  outline: 2px solid rgba(42,42,33,255);
  border-radius: 17px;
  box-shadow: 58px 88px 238px #0a0909b5;
  `;


// code from calculator js
function Calculator() {
    const [value, setValue] = useState(0); // last value entered
    const [mainDisplay, setMainDisplay] = useState(false);

    chrome.runtime.onMessage.addListener((req) => {
        if(req.toggle) {
            setMainDisplay(!mainDisplay);
        }
    });

    const handleInputChange = useCallback((inp, lastVal='') => {
      chrome.runtime.sendMessage({
        operation: 'send-value',
        input: inp,
        value: lastVal 
      }, (response) => {
        setValue(response.result);
      });
    }, []);
    
    return (
        <AppDiv display = {mainDisplay}>
            <CalculatorDiv>
                <Screen
                value={value}
                setValue={setValue}
                handleInputChange={handleInputChange}
                />
                <Keypad
                value={value}
                setValue={setValue}
                handleInputChange={handleInputChange}
                />
            </CalculatorDiv>
        </AppDiv>
    );
  }
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
        <Calculator/>
  </StyleSheetManager>,
  renderIn
);