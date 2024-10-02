// Copyright 2022 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
console.log('hello backgorund')

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Only inject when the tab is fully loaded and is a new tab page
  if (changeInfo.status === 'complete') {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['inject.js']
    });

    chrome.scripting.insertCSS({
      target: { tabId: tabId },
      files: ['inject.css']
    });
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "bob.trigger") {
    // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //   const activeTab = tabs[0];
    //   chrome.windows.update(activeTab.windowId, { focused: true }, () => {
    //     chrome.tabs.update(activeTab.id, { active: true });
    //   })
    //   chrome.tabs.sendMessage(activeTab.id, { type: "bob.trigger" });
    // });
    chrome.windows.getLastFocused(
      {populate: false}, 
      function(currentWindow) {
        const width = 400;
        const height = 300;
        const left = Math.round((currentWindow.width - width) / 2);
        const top = Math.round((currentWindow.height - height) / 2);

        chrome.windows.create({
            url: 'popup.html',  // URL of the popup content
            type: 'popup',      // Type set to 'popup'
            width: width,
            height: height,
            left: left,
            top: top
        }, (newWindow) => {
            console.log('Popup window created:', newWindow);
        });
      }
  );
    
  }
});
