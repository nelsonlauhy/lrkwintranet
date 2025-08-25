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
          // 如果搵唔到紀錄，出於安全，隱藏 Agent List
          const navAgent = document.querySelector('[data-role="nav-agentlist"]');
          if (navAgent) navAgent.classList.add('d-none');
          return;
        }
        const data = snapshot.docs[0].data();

        // Fill Firebase fields
        setTextIfExists("profileExt", data.Ext);
        setTextIfExists("profileDirectTel", data.DirectTel);
        setTextIfExists("profilePersonalTel", data.PersonalTel);
        setTextIfExists("profileTitle", data.Title);
        setTextIfExists("profileCompany", data.Company);

        // --- 控制 Navbar「Agent List」可見性 ---
        const canSeeAgentList = (data.AgentList === 'Y' || data.AgentList === true);
        const navAgent = document.querySelector('[data-role="nav-agentlist"]');
        if (navAgent) {
          // 如果冇權限就隱藏
          navAgent.classList.toggle('d-none', !canSeeAgentList);
        }
      })
      .catch(err => console.error("Error retrieving Firebase data:", err));
      // 出錯時都隱藏，避免誤曝
      const navAgent = document.querySelector('[data-role="nav-agentlist"]');
      if (navAgent) navAgent.classList.add('d-none');
  })
  .catch(err => console.error("Error retrieving Microsoft Graph profile:", err));
}

function setTextIfExists(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value || "";
}
