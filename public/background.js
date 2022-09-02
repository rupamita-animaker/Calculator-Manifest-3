/*global chrome */

chrome.runtime.onInstalled.addListener((appDetails) => {
    if(appDetails.reason==='install' || appDetails.reason==='update') {
        chrome.tabs.query({}, (tabs) => {
            tabs.forEach((tab) => {
                if(tab.url.match((/(chrome):\/\//gi))) {
                    return;
                }
                // chrome.tabs.executeScript --> chrome.scripting.executeScript
                // needs permission for "scripting" in manifest.json
                chrome.scripting.executeScript({
                  target: {tabId: tab.id},
                  files: ['/static/js/content.js'],
                }
                , function() {
                    if(chrome.runtime.lastError) {
                        console.error("Script injection failed: " + chrome.runtime.lastError.message);
                    }
                });
            })
        })
    }
});

// chrome.browserAction.onClicked --> chrome.action.onClicked
chrome.action.onClicked.addListener(() => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        let tab = tabs[0];
        chrome.tabs.sendMessage(tab.id, {toggle: true});
    });
})

chrome.runtime.onMessage.addListener((request, sender, response) => {
  if(request.message === 'START_RECORDING') {
    chrome.desktopCapture.chooseDesktopMedia(['tab', 'screen', 'window'], sender.tab, (screenId, options) => {
      if (screenId === '') {
        chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {message: 'NO_SCREENID'});
        } )
      } else {
        chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {message: 'START_WITH_RECORDING', screenId});
        } )
        // sendMessageToActiveTab({message: 'TEST_USER_MEDIA'})
      }
  });
  }
/*
    if(request.operation==='send-value') {
      let inp = request.input;
      let value = request.value;
      let lastIndex = inp.length - 1;
  
      if(inp[lastIndex] != '=') {
        response({result: value + inp});
      }
      else if(inp[lastIndex]=='=' && lastIndex!=0 && inp[lastIndex-1]=='=') {
        // corner case where '=' is pressed twice
        response({result: 0});
      }
      else {
        if(value==='' && inp[lastIndex]==='=') {
            inp = inp.slice(0, -1); // remove the equal sign
            value = value + inp; // add to value
          }
        // last input was '=' and value isn't 0
        
        if(value!==0) {
          // steps to evaluating expression        
          const operators = {
            '+' : {
              expression: 'a+b',
              precedence: 1,
              action: (a, b) => {return a+b}
            },
            '-' : {
              expression: 'a-b',
              precedence: 1,
              action: (a, b) => {return a-b}
            },
            '*' : {
              expression: 'a*b',
              precedence: 2,
              action: (a, b) => {return a*b}
            },
            '/' : {
              expression: 'a/b',
              precedence: 2,
              action: (a, b) => {return a/b}
            },
            '%' : {
              expression: 'a/100',
              precedence: 3,
              action: (a) => {return a/100}
            }
          };
  
          // set up infix
          let lastItem = '0';
          let infix = [];
          for(let i=0; i<value.length; i++) {
            let item = value[i];
            let nextItem;
            if(i<value.length-1) {
            nextItem = value[i+1];
            }
            else {
            nextItem = '=';
            }
            console.log('lastItem: ' + lastItem);
            console.log('item: ' + item);
            console.log('nextItem: ' + nextItem);
            if(!(item in operators)) {
              if((item=='(' || item==')')) {
                // if you get ( or ) add as single item to infix
                lastItem = item;
                infix.push(item);
              }
              else if((lastItem in operators || (Number(lastItem)==0 && lastItem!='0.') || lastItem=='(' || lastItem==')') && item!='.') {
                // if item is a digit and last item was either of operators, 0, ( or )
                lastItem = item;
                if((['(', ')', '='].includes(nextItem)) || (nextItem in operators)) {
                    // single digit number found
                    console.log('pushing: ' + item);
                    infix.push(item);
                }
              }
              else if(lastItem=='0' && item=='.') {
                lastItem = lastItem + item;
              }
              else{
                lastItem = lastItem + item; // add in digit or period and build number
                if((['(', ')', '='].includes(nextItem)) || (nextItem in operators)) {
                    // when number ends, add to infix
                    infix.push(lastItem);
                }
              }
            }
            else {
                lastItem = item;
                infix.push(item);
            }
            console.log('infix: ' + infix);
          }
  
          // infix to postfix
          let temp = [];
          let postf = [];
          lastItem = 0;
          console.log('infix is: ' + infix);
          for(let i=0; i<infix.length; i++) {
            let item = infix[i];
            let nextItem = (i<infix.length-1) ? infix[i+1] : '';
            console.log('inf item: ' + item);
            console.log('postf: ' + postf);
            console.log('temp: ' + temp);
            if(!(item in operators)) {
              if(item!=')' && item!='(') {
                  postf.push(Number(item));
              }
              else if(item=='(') {
                  temp.push(item);
              }
              else if(item==')') {
                  while(temp[temp.length-1]!='(') {
                      console.log('temp[temp.length-1]: ' + temp[temp.length-1]);
                      postf.push(temp.pop());
                  }
                  temp.pop();
              }
            }
            else {
              if((lastItem=='0' || lastItem=='(') && (item=='+' || item=='-') && (!(nextItem in operators) && !(['(', ')', ''].includes(nextItem)))) {
                  postf.push(Number(item+nextItem));
                  i = i + 1;
              }
              else if(temp.length==0 || temp[temp.length-1]=='(') {
                  temp.push(item);
              }
              else {
                  while(temp.length>0 && (temp[temp.length-1]!='(') && (operators[temp[temp.length-1]].precedence >= operators[item].precedence)) {
                      postf.push(temp.pop());
                  }
                  temp.push(item);
              }
            }
            lastItem = item;
          }
          while(temp.length>0) {
            postf.push(temp.pop());
          }
  
          // evaluate postfix
          let result = 0;
          postf.forEach((item) => {
            if(!(item in operators)) {
              temp.push(item);
            }
            else {
              if(item!='%') {
                let b = temp.pop();
                if((item=='-' || item=='+') && temp.length==0) {
                  temp.push(Number(item+b));
                }
                else {
                  let a = temp.pop();
                  temp.push(operators[item].action(a,b));
                }
              }
              else {
                let a = temp.pop();
                temp.push(operators[item].action(a));
              }
            }
          });
          if(temp.length>0) {
            result = (temp.pop());
          }
          response({result: result,
                    postf: postf});
        }
      }
    } */
  });