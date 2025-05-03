const checkBoxEl = document.getElementById("checkbox1");
const ytbCheckBoxEl = document.getElementById("checkbox2");
const xCheckBoxEl = document.getElementById("checkbox3");
const startTimerEl = document.getElementById("start-timer");
const timer_string = document.getElementById("time");

let initialSettings = {};

chrome.storage.local.get(["is_blocking", "is_also_blocking_youtube", "is_also_blocking_x"]).then((result) => {
    if (result.is_blocking != undefined && result.is_also_blocking_youtube != undefined && result.is_also_blocking_x != undefined) {
        checkBoxEl.checked = !result.is_blocking;
        ytbCheckBoxEl.checked = !result.is_also_blocking_youtube;
        xCheckBoxEl.checked = !result.is_also_blocking_x;
        
        initialSettings = { ...result };
    }
});
checkBoxEl.addEventListener("input", async (e) => await chrome.storage.local.set({ is_blocking: !checkBoxEl.checked }));
ytbCheckBoxEl.addEventListener("input", async (e) => await chrome.storage.local.set({ is_also_blocking_youtube: !ytbCheckBoxEl.checked }));
xCheckBoxEl.addEventListener("input", async (e) => await chrome.storage.local.set({ is_also_blocking_x: !xCheckBoxEl.checked }));

startTimerEl.addEventListener("click", async (e) => {
    const timerString = timer_string.value;
    if (timerString) {
        timer_string.value = "";
        const timer = timerString.split(":");
        if (timer.length !== 3 || timer.some((t) => isNaN(t)) || timer.some((t) => t < 0)) {
            alert("Please enter a valid time in the format HH:MM:SS");
            return;
        }
        const hours = parseInt(timer[0]);
        const minutes = parseInt(timer[1]);
        const seconds = parseInt(timer[2]);
        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        
        const response = await chrome.runtime.sendMessage({ initialSettings, totalSeconds });
        if (response && response.success) {
            alert("Timer started successfully!");
        } else {
            alert("Failed to start timer.");
        }
    }
    else {
        alert("Please enter a valid time in the format HH:MM:SS");
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.initialSettings) {
        const { is_blocking, is_also_blocking_youtube, is_also_blocking_x } = request.initialSettings;
        
        checkBoxEl.checked = !is_blocking;
        ytbCheckBoxEl.checked = !is_also_blocking_youtube;
        xCheckBoxEl.checked = !is_also_blocking_x;
        sendResponse({ success: true });
    }
    else sendResponse({ success: false });
});