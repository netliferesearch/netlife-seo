// Start listening to messages coming from other scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // When we receive a message with the 'run_script' command
    if (request.msg === 'run_script') {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: function() {
                    var title = document.querySelector('title')?.innerText || "";
                    var metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || "";
                    var canonicalUrl = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || "";
                    var metaRobots = document.querySelector('meta[name="robots"]')?.getAttribute('content') || "";
                    var headers = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).map(header => {
                        return {
                          tag: header.tagName,
                          text: header.innerText
                        };
                      });
                    var bodyText = document.querySelector('body')?.innerText || "";
                    var wordCount = bodyText.split(/\s+/).length; // count the words in the body

                    return {
                        title: title, 
                        metaDescription: metaDescription, 
                        canonicalUrl: canonicalUrl, 
                        metaRobots: metaRobots,
                        currentUrl: window.location.href,
                        headers: headers,
                        wordCount: wordCount
                    };
                }
            }).then((results) => {
                // Handle the results from the page script
                if (results && results.length > 0) {
                  // Fetch the robots.txt file
                  var url = new URL(results[0].result.currentUrl);
                  fetch(url.origin + '/robots.txt')
                    .then(response => {
                      if (response.ok) return response.text();
                      else throw new Error('No robots.txt found');
                    })
                    .then(text => {
                      results[0].result.robotsTxt = text;
                      sendResponse(results[0].result);
                    })
                    .catch(error => {
                      results[0].result.robotsTxt = null;
                      sendResponse(results[0].result);
                    });
                } else {
                  sendResponse({
                    error: 'No results returned from script execution.'
                  });
                }
              }).catch((error) => {
                sendResponse({
                  error: `Error executing script: ${error.message}`
                });
              });
            });
        
            return true; // This is required to use sendResponse asynchronously
          }
        });