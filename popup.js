import validateSeo from './validateSeo.js';

// Once the page is loaded, send a message to the background script to run the HTML processing script
document.addEventListener('DOMContentLoaded', function() {
  // Send a message to the background script to run the processHtml script
  chrome.runtime.sendMessage({msg: 'run_script'}, function(response) {
    
    // If there was an error, log it to the console
    if (response.error) {
      console.error(response.error);
    } else {
      // If there was no error, update the popup content with the received data
      updateElementText('title', response.title);
      updateElementText('meta-description', response.metaDescription);
      updateElementText('canonical-url', response.canonicalUrl);
      updateElementText('meta-robots', response.metaRobots);
      updateElementText('word-count', response.wordCount);
      updateElementText('robots-txt', response.robotsTxt ? response.robotsTxt : "Not Found");

      // Validate the SEO and update the status indicators
      let validationResults = validateSeo(response);
      updateStatus('title-row', validationResults.title.pass, validationResults.title.warn);
      updateStatus('description-row', validationResults.description.pass, validationResults.description.warn);
      updateStatus('url-row', validationResults.url, !validationResults.url);
      updateStatus('robots-row', validationResults.robots, !validationResults.robots);
      updateStatus('wordCount-row', validationResults.wordCount.pass, validationResults.wordCount.warn);
      updateStatus('robotsTxt-row', response.robotsTxt ? true : false, false); // update status of robots.txt check
      
      // Display the headers data in the Headers tab
      displayHeaders(response.headers);
    }
  });
});

function updateElementText(id, text) {
  let element = document.getElementById(id);
  if (element) {
    element.innerText = text;

    if (id === 'title' || id === 'meta-description') {
      // Set the length text for title and meta description
      let lengthElement = document.getElementById(id + '-length');
      if (lengthElement) {
        lengthElement.innerHTML = `<br>(${text.length} tegn)`;
      }
    }
  }
}

// Define tooltips for each status and value
const tooltips = {
  title: {
    pass: "Tittelen er optimal ved 50-60 tegn",
    warn: "Tittelen bør være mellom 50 og 60 tegn, men ingen straff om den er for kort eller lang",
    fail: "Finner ingen tittel"
  },
  description: {
    pass: "Meta beskrivelsen er optimal ved 100-160 tegn",
    warn: "Meta beskrivelsen er optimal ved 100-160 tegn",
    fail: "Finner ingen meta beskrivelse"
  },
  wordCount: {
    pass: "Innholdet har mer enn 1000 ord",
    warn: "Innholdet har mellom 200 og 1000 ord. Ved høy konkurranse bør innholdet ha mer enn 1000 ord",
    fail: "Antall ord er lavere enn 200 ord"
  },
  url: {
    pass: "URL-en refererer til seg selv",
    warn: "Siden sender synlighet til en annen url, eller så finnes det ingen canonical url",
    fail: "Ingen canonical url er angitt"
  },
  robots: {
    pass: "Denne siden kan indekseres",
    warn: "Denne siden kan ikke indekseres",
    fail: "Denne siden kan ikke indekseres"
  },
  robotsTxt: {
    pass: "robots.txt finnes på nettstedet",
    fail: "robots.txt ble ikke funnet"
  }
};

function updateStatus(id, pass, warn) {
  var statusElement = document.getElementById(id)?.querySelector('.status');
  if (statusElement) {
    statusElement.classList.remove('pass', 'warn', 'fail'); // Reset status
    let status = 'fail'; // default to fail
    if (pass) {
      statusElement.classList.add('pass');
      status = 'pass';
    } else if (warn) {
      statusElement.classList.add('warn');
      status = 'warn';
    } else {
      statusElement.classList.add('fail');
    }

    // Remove "-row" from the id for matching with tooltips object
    let tooltipId = id.replace('-row', '');

    // set the tooltip text based on the id and status
    statusElement.title = tooltips[tooltipId][status];
  }
}

function displayHeaders(headers) {
  let headersTable = document.getElementById('headers-table');
  if (headersTable) {
    headersTable.innerHTML = ''; // clear any existing rows

    // Group headers by tag
    let headersByTag = headers.reduce((groups, header) => {
      (groups[header.tag] = groups[header.tag] || []).push(header.text);
      return groups;
    }, {});

    // Create a row for each tag
    for (let tag in headersByTag) {
      let row = document.createElement('tr');
      let labelCell = document.createElement('td');
      let valueCell = document.createElement('td');
      let ul = document.createElement('ul');

      // Add each header text to the list
      headersByTag[tag].forEach(text => {
        let li = document.createElement('li');
        li.innerText = text;
        ul.appendChild(li);
      });

      labelCell.innerText = tag;
      valueCell.appendChild(ul);
      row.appendChild(labelCell);
      row.appendChild(valueCell);
      headersTable.appendChild(row);
    }
  }
}

function openTab(evt, tabName) {

  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    if (tabcontent[i]) {
      tabcontent[i].style.display = "none";
    }
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    if (tablinks[i]) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  let tabElement = document.getElementById(tabName);
  if (tabElement) {
    tabElement.style.display = "block";
    evt.currentTarget.className += " active";
  }
}


document.addEventListener('DOMContentLoaded', (event) => {

  // add event listeners for the tab buttons
  addEventListenerById('tab-basic', (event) => openTab(event, 'Basic'));
  addEventListenerById('tab-headers', (event) => openTab(event, 'Headers'));

  // click the 'Basic' tab by default
  let basicTab = document.getElementById('tab-basic');
  if (basicTab) {
    basicTab.click();
  }
});

function addEventListenerById(id, listener) {
  let element = document.getElementById(id);
  if (element) {
    element.addEventListener('click', listener);
  }
}