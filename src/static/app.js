document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Example data structure for activities with participants
  const activities = [
    {
      title: "Yoga Class",
      description: "A relaxing yoga session.",
      participants: ["Alice", "Bob", "Charlie"],
    },
    {
      title: "Cooking Workshop",
      description: "Learn to cook delicious meals.",
      participants: ["Dave", "Eve"],
    },
  ];

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const updatedActivities = await response.json();

      // Update activities array
      activities.length = 0;
      updatedActivities.forEach((activity) => activities.push(activity));

      renderActivities(); // Re-render activities
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Function to render activity cards
  function renderActivities() {
    activitiesList.innerHTML = ""; // Clear existing content

    activities.forEach((activity) => {
      const activityCard = document.createElement("div");
      activityCard.className = "activity-card";

      const spotsLeft = activity.max_participants - activity.participants.length;

      activityCard.innerHTML = `
        <h4>${activity.title}</h4>
        <p>${activity.description}</p>
        <p><strong>Availability:</strong> ${spotsLeft} spots left</p>
        <div class="participants">
          <h5>Participants:</h5>
          <ul>
            ${activity.participants.map((participant) => `<li>${participant} <span class='delete-icon' onclick='unregisterParticipant("${participant}")'>❌</span></li>`).join("")}
          </ul>
        </div>
      `;

      activitiesList.appendChild(activityCard);
    });
  }

  // Initialize app
  fetchActivities();
  renderActivities();
});
