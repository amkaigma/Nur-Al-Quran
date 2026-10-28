async function check() {
  const res = await fetch("https://qurancentral.com/assets/index-Ip-LD48B.js");
  const text = await res.text();
  const apiUrls = text.match(/https?:\/\/[a-zA-Z0-9.-]+\.qurancentral\.com[^\s"'`)]+/g);
  console.log("Found api urls:", [...new Set(apiUrls)]);
}
check();
