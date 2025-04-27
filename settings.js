const checkBoxEl = document.getElementById("checkbox1");
const ytbCheckBoxEl = document.getElementById("checkbox2");
const xCheckBoxEl = document.getElementById("checkbox3");

chrome.storage.local.get(["is_blocking", "is_also_blocking_youtube", "is_also_blocking_x"]).then((result) => {
    if (result.is_blocking != undefined && result.is_also_blocking_youtube != undefined && result.is_also_blocking_x != undefined) {
        checkBoxEl.checked = !result.is_blocking;
        ytbCheckBoxEl.checked = !result.is_also_blocking_youtube;
        xCheckBoxEl.checked = !result.is_also_blocking_x;
    }
});
checkBoxEl.addEventListener("input", async (e) => await chrome.storage.local.set({ is_blocking: !checkBoxEl.checked }));
ytbCheckBoxEl.addEventListener("input", async (e) => await chrome.storage.local.set({ is_also_blocking_youtube: !ytbCheckBoxEl.checked }));
xCheckBoxEl.addEventListener("input", async (e) => await chrome.storage.local.set({ is_also_blocking_x: !xCheckBoxEl.checked }));

/*
* TODO
*   DONE: Implement additional switch specifically for youtube since it can sometimes be useful
*   DONE: Add Youtube icon to the UI
*   DONE: Change version to 1.1
*   DONE: Push updates to github
*   DONE: Push updates to chrome store
*   ---
*   DONE: Add X Support (1.2)
*   DONE: Redesign
*   DONE: push to github
*   DONE: Push updates to chrome store
*   ---
*
*   Continue working on the android app
*/