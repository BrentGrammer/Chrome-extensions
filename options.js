const nameInput = document.getElementById("name-input");
const timeInput = document.getElementById("time-input");
const saveBtn = document.getElementById("save-btn");

saveBtn.addEventListener("click", () => {
	console.log("save clicked");
	const name = nameInput.value;
	const notificationTime = timeInput.value;
	chrome.storage.sync.set(
		{
			name,
			notificationTime,
		},
		() => {
			console.log("saved to storage");
		}
	);
});

chrome.storage.sync.get(["name", "notificationTime"], (res) => {
	nameInput.value = res.name ?? "???";
	timeInput.value = res.notificationTime ?? 1000;
});
