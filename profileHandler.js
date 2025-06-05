// profileHandler.js
function loadUserProfile(token) {
  fetch("https://graph.microsoft.com/v1.0/me", {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(profile => {
    const [firstName, ...lastParts] = profile.displayName.split(" ");
    const lastName = lastParts.join(" ");
    const email = (profile.mail || profile.userPrincipalName).toLowerCase().trim();

    document.getElementById("profileFirstName").textContent = firstName;
    document.getElementById("profileLastName").textContent = lastName;
    document.getElementById("profileEmail").textContent = email;
    document.getElementById("profileJobTitle").textContent = profile.jobTitle || "";
    document.getElementById("profileInitials").textContent =
      (firstName[0] || "") + (lastName[0] || "");

    db.collection("companydirectory").where("Email", "==", email).get()
      .then(snapshot => {
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data();
          document.getElementById("profileExt").textContent = data.Ext || "";
          document.getElementById("profileDirectTel").textContent = data.DirectTel || "";
          document.getElementById("profilePersonalTel").textContent = data.PersonalTel || "";
          document.getElementById("profileCompanyCode").textContent = data.companyCode || "";
          document.getElementById("profileTitle").textContent = data.Title || "";
          document.getElementById("profileOfficeName").textContent = data.OfficeName || "";
          document.getElementById("profileCompany").textContent = data.Company || "";
        }
      });
  });
}
