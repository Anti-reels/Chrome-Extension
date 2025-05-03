const block_script = (is_meta, is_youtube, is_also_blocking_x) => 
    "function FindProxyForURL(url, host) {" +
            "if (false" + (is_meta || is_youtube || is_also_blocking_x ? " || " : "")
            + (is_meta ? "host.includes('fbcdn.net') || host.includes('prime.tiktok.com')" : "")
            + (is_youtube ? (is_meta ? " || " : "") + "host.includes('googlevideo.com')" : "")
            + (is_also_blocking_x ? (is_youtube || is_meta ? " || " : "") + "host.includes('twimg.com')" : "") + "){return'PROXY blackhole:80';}return'DIRECT';}";

const getConfig = (is_blocking, is_also_blocking_youtube, is_also_blocking_x) => {
    return {
        mode: "pac_script",
        pacScript: { data: block_script(is_blocking, is_also_blocking_youtube, is_also_blocking_x) }
    };
};

const update_is_blocking = async (is_blocking, is_also_blocking_youtube, is_also_blocking_x) => {
    if (is_blocking == undefined) is_blocking = await getOldValue(true, false, false);
    if (is_also_blocking_youtube == undefined) is_also_blocking_youtube = await getOldValue(false, true, false);
    if (is_also_blocking_x == undefined) is_also_blocking_x = await getOldValue(false, false, true);
        
    chrome.proxy.settings.set(
        { value: getConfig(is_blocking, is_also_blocking_youtube, is_also_blocking_x), scope: 'regular' },
        function() {}
    );

    
}

const getOldValue = async (is_blocking, is_also_blocking_youtube, is_also_blocking_x) => {
    if (is_blocking) {
        const result = await chrome.storage.local.get(["is_blocking"]);
        if (result) return result.is_blocking;
        else {
            await chrome.storage.local.set({ is_blocking: true });
            return true;
        }
    }

    if (is_also_blocking_youtube) {
        const result = await chrome.storage.local.get(["is_also_blocking_youtube"]);
        if (result) return result.is_also_blocking_youtube;
        else {
            await chrome.storage.local.set({ is_also_blocking_youtube: false });
            return false;
        }
    }

    if (is_also_blocking_x) {
        const result = await chrome.storage.local.get(["is_also_blocking_x"]);
        if (result) return result.is_also_blocking_x;
        else {
            await chrome.storage.local.set({ is_also_blocking_x: false });
            return false;
        }
    }

    return null;
}

chrome.storage.local.get(["is_blocking", "is_also_blocking_youtube", "is_also_blocking_x"]).then((result) => {
    if (result.is_blocking != undefined && result.is_also_blocking_youtube != undefined && result.is_also_blocking_x != undefined) update_is_blocking(result.is_blocking, result.is_also_blocking_youtube, result.is_also_blocking_x);
    else {
        chrome.storage.local.set({ is_blocking: true, is_also_blocking_youtube: false, is_also_blocking_x: false });
        update_is_blocking(true, false, false);
    }
});

chrome.storage.onChanged.addListener((changes) => {
    if (changes.is_blocking) update_is_blocking(changes.is_blocking.newValue, undefined, undefined);
    if (changes.is_also_blocking_youtube) update_is_blocking(undefined, changes.is_also_blocking_youtube.newValue, undefined);
    if (changes.is_also_blocking_x) update_is_blocking(undefined, undefined, changes.is_also_blocking_x.newValue);
});  

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.totalSeconds && request.initialSettings) {
            const { totalSeconds, initialSettings } = request;
            const { is_blocking, is_also_blocking_youtube, is_also_blocking_x } = initialSettings;
            
            setTimeout(() => {
                update_is_blocking(is_blocking, is_also_blocking_youtube, is_also_blocking_x);
                chrome.storage.local.set({ is_blocking, is_also_blocking_youtube, is_also_blocking_x });
                chrome.runtime.sendMessage({ initialSettings });
            }, totalSeconds * 1000);
            sendResponse({ success: true });
        }
        else sendResponse({ success: false });
    }
);
  