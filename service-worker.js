const block_script = "function FindProxyForURL(url, host) {\n" +
            "  if (host.includes('fbcdn.net') || host.includes('prime.tiktok.com'))\n" +
            "    return 'PROXY blackhole:80';\n" +
            "  return 'DIRECT';\n" +
            "}";
const allow_script = "function FindProxyForURL(url, host) {\n" +
            "  return 'DIRECT';\n" +
            "}";

const getConfig = (is_blocking) => {
    return {
        mode: "pac_script",
        pacScript: { data: is_blocking ? block_script : allow_script }
    };
};

const update_is_blocking = (is_blocking) => {
    chrome.proxy.settings.set(
        {value: getConfig(is_blocking), scope: 'regular'},
        function() {}
    );

    console.log("Updated");
}

chrome.storage.local.get(["is_blocking"]).then((result) => {
    if (result) update_is_blocking(result.is_blocking);
    else {
        chrome.storage.local.set({ is_blocking: true });
        update_is_blocking(true);
    }
});
chrome.storage.onChanged.addListener((changes) => update_is_blocking(changes.is_blocking.newValue));  