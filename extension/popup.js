// Code for Chrome extension

/**
 * Get the current URL.
 *
 * @param {function(string)} callback called when the URL of the current tab
 *   is found.
 */

// hard-coded sample urls
var urls = ["https://www.linkedin.com/in/thomas-andruszewski-93588488", "https://www.linkedin.com/in/deborah-bae-19088655"]

// "https://www.linkedin.com/in/deborah-bae-19088655", "https://www.linkedin.com/in/jamie-bussel-1b037875", "https://www.linkedin.com/in/joseph-calabrese-9033707", "https://www.linkedin.com/in/abbey-mahady-cofsky-4035354", "https://www.linkedin.com/in/denise-davis-46aa796", "https://www.linkedin.com/in/nancy-wieler-fishman-9a93503b", "https://www.linkedin.com/in/david-adler-5829188"

function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, (tabs) => {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

// scrapes Foundation Center page for board and staff members' names, titles and LinkedIn URLs and creates an array in the proper format to write to the Google sheet
function scrapeFC() {
  chrome.tabs.executeScript(null,
    {code: `
      var staff = document.querySelectorAll('#profile-staff li');
      var data = [];
      staff.forEach(item => data.push([item.childNodes[0].textContent, item.childNodes[1].textContent.replace(', ', '').trim(), item.childNodes[2] ? item.childNodes[2].href : null]));
    `});
}

// this will be where all the LinkedIn profiles will be scraped
function scrapeLI() {
  urls.forEach(url => chrome.tabs.create({url: url}))
}

document.addEventListener('DOMContentLoaded', function() {
    getCurrentTabUrl(function(url) {
    if(url.includes('fconline.foundationcenter.org')){
      scrapeFC();
    }
    else{
      scrapeLI();
    }
  });
});

// Resources
// https://developers.google.com/api-client-library/javascript/samples/samples
// http://developer.streak.com/2014/10/how-to-use-gmail-api-in-chrome-extension.html
