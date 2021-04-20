chrome.alarms.create({
	periodInMinutes: 1 / 60,
});

chrome.alarms.onAlarm.addListener((alarm) => {
	chrome.storage.local.get(["timer", "isRunning"], (res) => {
		// null check if timer key doesn't exist in storage
		const time = res.timer ?? 0;
		const isRunning = res.isRunning ?? true;
		if (!isRunning) {
			return;
		}
		chrome.storage.local.set({
			timer: time + 1,
		});
		chrome.action.setBadgeText({
			text: `${time + 1}`,
		});
		chrome.storage.sync.get(["notificationTime"], (res) => {
			const notificationTime = res.notificationTime ?? 1000;
			if (time % notificationTime == 0) {
				// shows desktop notification fires every notification time seconds
				// notificationTime is set in storage via options page
				this.registration.showNotification("Chrome Timer Extension", {
					body: `${notificationTime} seconds has passed!`,
					icon: "icon.png",
				});
			}
		});
	});
});
