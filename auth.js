const msalInstance = new msal.PublicClientApplication(msalConfig);

msalInstance.handleRedirectPromise()
  .then((response) => {
    const account = response?.account || msalInstance.getAllAccounts()[0];
    if (account) {
      msalInstance.setActiveAccount(account);

      // Acquire token silently
      msalInstance.acquireTokenSilent({
        scopes: ["User.Read"]
      }).then(tokenResponse => {
        sessionStorage.setItem("user", JSON.stringify({
          username: account.username,
          name: account.name,
          token: tokenResponse.accessToken
        }));

        // Get user details including jobTitle
        fetch("https://graph.microsoft.com/v1.0/me", {
          headers: {
            Authorization: `Bearer ${tokenResponse.accessToken}`
          }
        })
        .then(res => res.json())
        .then(profile => {
          sessionStorage.setItem("jobTitle", profile.jobTitle || "");
          window.location.href = "agentlist.html";
        });

      }).catch(err => {
        console.error("Silent token acquisition failed:", err);
        msalInstance.loginRedirect({ scopes: ["User.Read"] });
      });
    } else {
      // Not signed in, redirect
      msalInstance.loginRedirect({ scopes: ["User.Read"] });
    }
  })
  .catch(err => console.error("Login error:", err));