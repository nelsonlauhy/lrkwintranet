const msalConfig = {
  auth: {
    clientId: "17f20b04-4113-4a8a-baaf-5dc56b284dac",  // ← from your screenshot
    authority: "https://login.microsoftonline.com/9f6c51b3-4040-49cf-a898-30bb9f2cfc92", // ← your Directory (tenant) ID
    redirectUri: window.location.origin
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false
  }
};