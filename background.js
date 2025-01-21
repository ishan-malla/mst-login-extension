const targetDomain = "mysecondteacher.com.np";

async function isLoggedIn() {
  try {
    const possibleCookies = ["session", "auth", "token", "jwt"];

    for (const cookieName of possibleCookies) {
      const cookie = await chrome.cookies.get({
        name: cookieName,
        url: "https://mysecondteacher.com.np",
      });

      if (cookie) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error("Error checking login status:", error);
    return false;
  }
}

chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  const url = new URL(details.url);

  if (url.hostname === targetDomain && !url.hostname.startsWith("app.")) {
    const loggedIn = await isLoggedIn();

    if (loggedIn) {
      const newUrl = new URL(details.url);
      newUrl.hostname = "app." + newUrl.hostname;

      chrome.tabs.update(details.tabId, {
        url: newUrl.toString(),
      });
    }
  }
});
