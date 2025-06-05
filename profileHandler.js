function loadUserProfile(token) {
  const db = firebase.firestore();

  fetch("https://graph.microsoft.com/v1.0/me", {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(profile => {
    const displayName = profile.displayName || "";
    const [firstName, ...lastParts] = displayName.split(" ");
    const lastName = lastParts.join(" ");
    const email = (profile.mail || profile.userPrincipalName).toLowerCase().trim();
    const jobTitle = profile.jobTitle || "";

    // Fill initials
    const initials = (firstName[0] || "") + (lastName[0] || "");
    setTextIfExists("profileInitials", initials);

    // Fill name and email
    setTextIfExists("profileFirstName", firstName);
    setTextIfExists("profileLastName", lastName);
    setTextIfExists("profileEmail", email);
    setTextIfExists("profileJobTitle", jobTitle); // safe if not in modal

    // Now query Firebase using email
    db.collection("companydirectory").where("Email", "==", email).get()
      .then(snapshot => {
        if (snapshot.empty) {
          console.warn("No matching record in Firebase for:", email);
          return;
        }
        const data = snapshot.docs[0].data();

        // Fill Firebase fields
        setTextIfExists("profileExt", data.Ext);
        setTextIfExists("profileDirectTel", data.DirectTel);
        setTextIfExists("profilePersonalTel", data.PersonalTel);
        setTextIfExists("profileTitle", data.Title);
        setTextIfExists("profileCompany", data.Company);
      })
      .catch(err => console.error("Error retrieving Firebase data:", err));
  })
  .catch(err => console.error("Error retrieving Microsoft Graph profile:", err));
}

function setTextIfExists(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value || "";
}
