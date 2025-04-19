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

chrome.proxy.settings.set(
    {value: getConfig(true), scope: 'regular'},
    function() {}
);