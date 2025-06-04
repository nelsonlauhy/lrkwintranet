const msalConfig = {
  auth: {
    clientId: "cf01424e-21e3-4b98-bb96-93d91e32cf7b",  // ← from your screenshot
    authority: "https://login.microsoftonline.com/9f6c51b3-4040-49cf-a898-30bb9f2cfc92", // ← your Directory (tenant) ID
    redirectUri: window.location.origin
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false
  }
};