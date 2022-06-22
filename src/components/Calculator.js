import React, { useState, useCallback } from 'react';

import Keypad from './Keypad';
import Screen from './Screen';

function Calculator() {
    const [value, setValue] = useState(0); // last value entered
    const [evaluate, setEvaluate] = useState(false); // will be set to true when '=' is clicked
  
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
        <div className='calculator'>
          <Screen
          value={value}
          evaluate={evaluate}
          setValue={setValue}
          setEvaluate={setEvaluate}
          handleInputChange={handleInputChange}
          />
          <Keypad
          value={value}
          setValue={setValue}
          handleInputChange={handleInputChange}
          />
        </div>
    );
  }
  
export default Calculator;
  