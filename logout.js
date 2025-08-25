// logout.js
(function () {
  document.addEventListener("DOMContentLoaded", () => {
    // 確保 signOutLink 存在，以及 msal 庫 & config 已經載入
    const link = document.getElementById("signOutLink");
    if (!link || !window.msal || !window.msalConfig) {
      return;
    }

    // 用你現有的 msalConfig 建立 PublicClientApplication
    const msalApp = new msal.PublicClientApplication(msalConfig);

    // 綁定 Sign Out click 事件
    link.addEventListener("click", (e) => {
      e.preventDefault();

      try {
        sessionStorage.clear();
        // 如你有用 localStorage cache，可以一併清：
        // localStorage.clear();
      } catch (err) {
        console.warn("Error clearing storage:", err);
      }

      // 執行登出並重導向
      msalApp.logoutRedirect({
        postLogoutRedirectUri: window.location.origin + "/index.html"
      });
    });
  });
})();
