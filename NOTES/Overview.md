# Extensions

Docs: https://developer.chrome.com

- `Start Building`

## Test Extension:

- Go to `chrome://extensions`
- Toggle on Developer mode in top right
- Select `Load Unpacked` and select folder where your manifest.json file is
- (Anytime you update manifest file, need to reload the extension in the chrome browser)
  - You don't need to refresh the extension when editing css etc., only when manifest file is updated
- Can inspect extension popup by right clicking and selecting inspect (shows dev tools and console)

# Manifest File

- Tells chrome browser what extension does and what JavaScript and HTML files compose the Chrome extension

- JSON formatted file: create a file named `manifest.json` at the root

keys:

```json
{
	"manifest_version": 3, // use latest
	"name": "My Extension",
	"version": "1.0.0", // anything you want here
	"description": "Hello Chrome World",
	"icons": {
		// add icons - sqaure 16x16, etc. Chrome automatically scales the png to these sizes
		"16": "icon.png",
		"48": "icon.png",
		"128": "icon.png"
	},
	"action": {
		// action when extension icon clicked in browser - specify a html file and set icon sizes (selected by chrome automatically)
		"default_icon": {
			"16": "icon.png",
			"24": "icon.png",
			"32": "icon.png"
		},
		"default_title": "Timer Title",
		"default_popup": "popup.html" // will show popup when ext icon clicked in chrome
	},
	"options_page": "options.html", // make a file for the options when you right click on the extension and select `options`
	"background": {
		// background script run in service worker (always runs even if extension is closed). This creates a service worker
		"service_worker": "background.js"
	}
}
```

# Chrome APIS

Interact with the browser using Chrome APIs provided: `chrome.<apiName>`

## Actions

- Can use chrome api or manifest to perform actions
- See list and docs here: https://developer.chrome.com/docs/extensions/reference/action/

Ex:

```javascript
// sets text on chrome extension icon
// shows when popup is opened on small extension icon
chrome.action.setBadgeText(
	{
		text: "TIME",
	},
	() => console.log("finished")
);
```

## Storage

- Used to store data (similar to localStorage) which other Javascript code can access
  - `chrome.storage.sync` - syncs across sessions, in general use this to save across browser instances
  - `chrome.storage.local` - local to a session
- Need to add this api to permissions array in the manifest.json file
  - `"permissions": ["storage"]`
- Use this api

```javascript
// first param is obj you want to set in storage, second is callback when saving is done
chrome.storage.sync.set(
	{
		name: "myname",
		notificationTime: new Date().toLocaleTimeString(),
	},
	() => {
		console.log("storage item set callback(optional)");
	}
);
```

- Get item: use .set and use the keys you used in an array to set the data:

```javascript
chrome.storage.sync.get(["name", "notificationTime"], (res) => {
	// set ui with data etc... res,name, res.notificationTime
});
```

## Alarms api

- chrome.alarms.create() First param is name of alarm, can give multiple names or none if you just need a single alarm
- pass in properties of the object for the alarm

```javascript
chrome.alarms.create({
  periodInMinutes: 1 / 60, // fires every 1 sec
  delayInMinutes: ..., // delay first alarm until this time
  when: `<time alarm starts firing>`
})

// handle alarm event:
chrome.alarms.onAlarm.addListener((alarm) => {
	console.log("handle alarm fired");
});
```

## Notifications API/Service Worker Registration

- used to be used for desktop notifications, but now the service worker used in background scripts has a .showNotification() method on Registration
- Need to add "notifications" to permissions array in manifest.json file even if not using it directly in order for it to work with service worker
- can call the method off the service worker in the sw file:

```javascript
// pass in title body and icon for the notification shown
this.registration.showNotification("Chrome Timer Extension", {
	body: `${notificationTime} seconds has passed!`,
	icon: "icon.png",
});
```

## Background scripts

JavaScript code does not run when popup is closed for extension (i.e a setInterval, etc. You need to use background scripts - service workers - to do a long running action when the extension is closed)

- add a background field to the manifest file pointing to a JavaScript file
- If the service worker becomes inactive, the JavaScript file for it will be run again if it wakes up.
  - Can use the chrome.alarm API to keep doing work if the service worker goes to sleep
