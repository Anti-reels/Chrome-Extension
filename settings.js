const checkBoxEl = document.getElementById("checkbox1");
const ytbCheckBoxEl = document.getElementById("checkbox2");

chrome.storage.local.get(["is_blocking", "is_also_blocking_youtube"]).then((result) => {
    if (result) {
        checkBoxEl.checked = !result.is_blocking;
        ytbCheckBoxEl.checked = !result.is_also_blocking_youtube;
    }
});
checkBoxEl.addEventListener("input", async (e) => await chrome.storage.local.set({ is_blocking: !checkBoxEl.checked }));
ytbCheckBoxEl.addEventListener("input", async (e) => await chrome.storage.local.set({ is_also_blocking_youtube: !ytbCheckBoxEl.checked }));

/*
* TODO
*   Implement additional switch specifically for youtube since it can sometimes be useful
*   Add Youtube icon to the UI
*   Change version to 1.1
*   Push updates to github
*   Push updates to chrome store
*   Continue working on the android app
*/