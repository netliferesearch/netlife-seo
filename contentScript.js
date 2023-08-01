function processHtml() {
    // Fetch the page's title, description, canonical URL, meta robots, and body text.
    var title = document.querySelector('title')?.innerText || "";
    var metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || "";
    var canonicalUrl = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || "";
    var metaRobots = document.querySelector('meta[name="robots"]')?.getAttribute('content') || "";

    // Fetch body content and calculate word count
    var bodyContent = document.querySelector('body')?.innerText || "";
    
    // Calculate the number of words in the body text
    var wordCount = bodyContent.split(/\s+/).length;

    // Return the extracted data
    return {
        title: title, 
        metaDescription: metaDescription, 
        canonicalUrl: canonicalUrl, 
        metaRobots: metaRobots,
        wordCount: wordCount
    };
  }

  // Fetch and process the HTML of the page
  var seoData = processHtml();

  // Send the processed SEO data to the background script
  chrome.runtime.sendMessage({msg: 'seo_data', data: seoData});  