const checkBoxEl = document.getElementById("checkbox1");
chrome.storage.local.get(["is_blocking"]).then((result) => {
    if (result) checkBoxEl.checked = !result.is_blocking;
});
checkBoxEl.addEventListener("input", async (e) => await chrome.storage.local.set({ is_blocking: !checkBoxEl.checked }));