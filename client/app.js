const guestbookContainer = document.getElementById("guestbook-container");
const messageForm = document.getElementById("messageForm");

// handle API data
async function getGuestbook() {
  guestbookContainer.innerHTML = "";
  const response = await fetch(
    "https://week-4-assignment-server.onrender.com/haunted_guestbook"
  );
  const guestbook = await response.json();
  console.log(guestbook);

  // Sort guestbook entries by ID
  guestbook.sort((a, b) => a.id - b.id);

  // display guestbook on the page
  guestbook.forEach((entry) => {
    const { id, name, message, year, haunts = 0 } = entry;

    // Create a container for each entry
    const entryContainer = document.createElement("div");
    entryContainer.className = "entry";

    // Display the entry text
    const p = document.createElement("p");
    p.textContent = `${name} (${year}): ${message}`;
    entryContainer.appendChild(p);

    // Create the "Haunt" button
    const hauntButton = document.createElement("button");
    hauntButton.textContent = "👻 Haunt";
    hauntButton.className = "haunt";
    hauntButton.onclick = () => handleHaunt(id);
    entryContainer.appendChild(hauntButton);

    // Display the haunt count
    const hauntCount = document.createElement("span");
    hauntCount.textContent = ` Haunts: ${haunts}`;
    hauntCount.style.marginLeft = "10px";
    entryContainer.appendChild(hauntCount);

    guestbookContainer.appendChild(entryContainer);
  });
}

getGuestbook();

// handle form data
async function handleSubmit(event) {
  event.preventDefault();

  // Get form information
  const formData = new FormData(messageForm);
  const body = Object.fromEntries(formData);

  // Basic validation
  if (!body.name || !body.message || !body.year) {
    alert("Please fill out all fields.");
    return;
  }

  if (
    isNaN(body.year) ||
    body.year < 1000 ||
    body.year > new Date().getFullYear()
  ) {
    alert(
      "Please enter a valid year of death between 1000 and the current year."
    );
    return;
  }

  // Make a post request
  const response = await fetch(
    "https://week-4-assignment-server.onrender.com/haunted_guestbook",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (response.ok) {
    // Clear the form
    messageForm.reset();
    // Refresh guestbook entries
    getGuestbook();
  } else {
    alert("Failed to submit the message. Please try again.");
  }
}

messageForm.addEventListener("submit", handleSubmit);

// Handle the "Haunt" action
async function handleHaunt(id) {
  const response = await fetch(
    `https://week-4-assignment-server.onrender.com/haunted_guestbook/${id}/haunt`,
    {
      method: "PATCH",
    }
  );

  if (response.ok) {
    getGuestbook(); // Refresh to update haunt count
  }
}
