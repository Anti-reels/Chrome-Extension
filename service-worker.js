const block_script = (is_youtube) => {
    return "function FindProxyForURL(url, host) {\n" +
            "  if (host.includes('fbcdn.net') || host.includes('prime.tiktok.com')"
            + (is_youtube ? " || host.includes('googlevideo.com')" : "") +
            "){\n" +
            "    return 'PROXY blackhole:80';}\n" +
            "  return 'DIRECT';\n" +
            "}";
};
const only_block_ytb = "function FindProxyForURL(url, host) {\n" +
            "  if (host.includes('googlevideo.com')) {" +
            "    return 'PROXY blackhole:80';}\n" +
            "  return 'DIRECT';\n" +
            "}";

const allow_script = "function FindProxyForURL(url, host) {\n" +
            "  return 'DIRECT';\n" +
            "}";

const getConfig = (is_blocking, is_also_blocking_youtube) => {
    return {
        mode: "pac_script",
        pacScript: { data: is_blocking ? block_script(is_also_blocking_youtube) : !is_blocking && is_also_blocking_youtube ? only_block_ytb : allow_script }
    };
};

const update_is_blocking = async (is_blocking, is_also_blocking_youtube) => {
    if (is_blocking == undefined) is_blocking = await getOldValue(true, false);
    if (is_also_blocking_youtube == undefined) is_also_blocking_youtube = await getOldValue(false, true);
    
    console.log(getConfig(is_blocking, is_also_blocking_youtube).pacScript.data);
    

    chrome.proxy.settings.set(
        { value: getConfig(is_blocking, is_also_blocking_youtube), scope: 'regular' },
        function() {}
    );

    console.log("Updated " + is_blocking + " and " + is_also_blocking_youtube);
}

const getOldValue = async (is_blocking, is_also_blocking_youtube) => {
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

    return null;
}

chrome.storage.local.get(["is_blocking", "is_also_blocking_youtube"]).then((result) => {
    if (result) update_is_blocking(result.is_blocking, result.is_also_blocking_youtube);
    else {
        chrome.storage.local.set({ is_blocking: true, is_also_blocking_youtube: false });
        update_is_blocking(true, false);
    }
});
chrome.storage.onChanged.addListener((changes) => {
    if (changes.is_blocking) {
        update_is_blocking(changes.is_blocking.newValue, undefined);
    }

    if (changes.is_also_blocking_youtube) {
        update_is_blocking(undefined, changes.is_also_blocking_youtube.newValue);
    }
});  