const checkBoxEl = document.getElementById("checkbox1");
chrome.storage.local.get(["is_blocking"]).then((result) => {
    if (result) checkBoxEl.checked = !result.is_blocking;
});
checkBoxEl.addEventListener("input", async (e) => await chrome.storage.local.set({ is_blocking: !checkBoxEl.checked }));

/*
* TODO
*   Implement additional switch specifically for youtube since it can sometimes be useful
*   Add Youtube icon to the UI
*   Change version to 1.1
*   Push updates to github
*   Push updates to chrome store
*   Continue working on the android app
*/