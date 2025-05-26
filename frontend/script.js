document.addEventListener("DOMContentLoaded", () => {
  const designerList = document.getElementById("designerList");
  const filterBtn = document.getElementById("filter-shortlisted");

  // Attempt to fetch data from the live API
  fetch("https://emptycup-api.onrender.com/api/designers")
    .then(res => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then(data => {
      renderDesigners(data);
    })
    .catch(err => {
      console.error("Failed to fetch from live API, attempting local fallback:", err);
      // Fallback to local JSON file
      fetch("./data/designers.json")
        .then(res => {
          if (!res.ok) {
            throw new Error("Local fallback failed");
          }
          return res.json();
        })
        .then(data => {
          renderDesigners(data);
        })
        .catch(err => {
          console.error("Failed to fetch designers from both live API and local fallback:", err);
          designerList.innerHTML = `<p style="color:red;">Unable to load designers. Please try again later.</p>`;
        });
    });

  function renderDesigners(data) {
    data.forEach(designer => {
      const card = document.createElement("section");
      card.className = "designer-card";
      card.dataset.shortlisted = "false";

      card.innerHTML = `
        <div class="card-header">
          <h2 class="designer-title">${designer.name}</h2>
          <img src="./assets/icons/options.svg" alt="Options" class="card-options">
        </div>
        <div class="rating">${"★".repeat(designer.rating)}${"☆".repeat(5 - designer.rating)}</div>
        <p class="description">${designer.description}</p>
        <div class="stats">
          <div class="stat"><strong>${designer.projects}</strong><br>Projects</div>
          <div class="stat"><strong>${designer.years}</strong><br>Years</div>
          <div class="stat"><strong>${designer.price}</strong><br>Price</div>
        </div>
        <div class="contacts">
          ${designer.contacts.map(phone => `<p>📞 ${phone}</p>`).join("")}
        </div>
        <div class="card-actions">
          <div class="action-btn"><img src="./assets/icons/details.svg">Details</div>
          <div class="action-btn"><img src="./assets/icons/hide.svg">Hide</div>
          <div class="action-btn shortlist-btn"><img src="./assets/icons/shortlist.svg" class="shortlist-icon">Shortlist</div>
          <div class="action-btn"><img src="./assets/icons/report.svg">Report</div>
        </div>
      `;

      designerList.appendChild(card);
    });

    attachShortlistHandlers();
  }

  function attachShortlistHandlers() {
    const shortlistButtons = document.querySelectorAll(".shortlist-btn");
    const cards = document.querySelectorAll(".designer-card");

    function applyFilter() {
      const showOnlyShortlisted = filterBtn.classList.contains("active");
      cards.forEach(card => {
        const isShortlisted = card.dataset.shortlisted === "true";
        card.style.display = showOnlyShortlisted && !isShortlisted ? "none" : "block";
      });
    }

    shortlistButtons.forEach(button => {
      button.addEventListener("click", () => {
        const card = button.closest(".designer-card");
        const isShortlisted = card.dataset.shortlisted === "true";

        const newState = (!isShortlisted).toString();
        card.dataset.shortlisted = newState;

        const img = button.querySelector(".shortlist-icon");
        img.src = newState === "true"
          ? "./assets/icons/shortlist-filled.svg"
          : "./assets/icons/shortlist.svg";

        if (filterBtn.classList.contains("active")) {
          applyFilter();
        }
      });
    });

    filterBtn.addEventListener("click", () => {
      filterBtn.classList.toggle("active");
      applyFilter();
    });
  }
});
