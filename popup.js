const timeElement = document.getElementById("time");
const nameElement = document.getElementById("name");
const timerElement = document.getElementById("timer");

chrome.action.setBadgeText(
	{
		text: "TIME",
	},
	() => console.log("finished")
);

// since we want to show incrementing time in the popup, we need to call this in a setInterval
// When the popup is opened, this file runs once
function updateTimeElements() {
	chrome.storage.local.get(["timer"], (res) => {
		const time = res.timer ?? 0;
		timerElement.textContent = `The timer is at: ${time} seconds`;
	});
	const currentTime = new Date().toLocaleTimeString();
	timeElement.textContent = `The time is: ${currentTime}`;
}

// get time in storage right away so there is not a delay when popup is opened
// setInterval will not call it until 1 second has passed
updateTimeElements();
setInterval(updateTimeElements, 1000);

chrome.storage.sync.get(["name"], (res) => {
	const name = res.name ?? "???";
	nameElement.textContent = `Your name is: ${name}`;
});

const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const resetBtn = document.getElementById("reset");

startBtn.addEventListener("click", () => {
	chrome.storage.local.set({
		isRunning: true,
	});
});

stopBtn.addEventListener("click", () => {
	chrome.storage.local.set({
		isRunning: false,
	});
});

resetBtn.addEventListener("click", () => {
	// chrome.storage.local.set({
	// 	timer: 0,
	// 	isRunning: false,
	// });
});
