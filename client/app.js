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

  // display the books on the page
  guestbook.forEach((entry) => {
    const { name, message, year } = entry;
    const p = document.createElement("p");
    p.textContent = `${name} (${year}): ${message}`;
    guestbookContainer.appendChild(p);
  });
}

getGuestbook();

// handle form data
async function handleSubmit(event) {
  event.preventDefault();
  // get form information
  const formData = new FormData(messageForm);
  const body = Object.fromEntries(formData);

  // make a post request
  const response = await fetch(
    "https://week-4-assignment-server.onrender.com/haunted_guestbook",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  console.log(response);

  if (response.ok) {
    // Clear the form
    messageForm.reset();
    // Refresh guestbook entries
    getGuestbook();
  }
}

messageForm.addEventListener("submit", handleSubmit);
