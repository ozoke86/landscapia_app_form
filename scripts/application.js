document.addEventListener("DOMContentLoaded", () => {
  const step1 = document.getElementById("step-1");
  const step2 = document.getElementById("step-2");
  const step3 = document.getElementById("step-3");

  const next1 = document.getElementById("next-1");
  const back2 = document.getElementById("back-2");
  const tradeSelect = document.getElementById("trade");

  const form = document.getElementById("contractorForm");

  // Prevent Enter key from submitting the form early
  form.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  });

  // STEP 1 → STEP 2
  next1.addEventListener("click", () => {
    // Validate required fields in Step 1
    const requiredFields = step1.querySelectorAll("[required]");
    let valid = true;

    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        field.style.borderColor = "red";
        valid = false;
      } else {
        field.style.borderColor = "var(--grahite)";
      }
    });

    if (!valid) {
      alert("Please complete all required fields before continuing.");
      return;
    }

    // Hide Step 1, show Step 2
    step1.style.display = "none";
    step2.style.display = "flex";

    // Show correct trade block
    const selectedTrade = tradeSelect.value.toLowerCase();
    document.querySelectorAll(".trade-block").forEach((block) => {
      block.style.display = "none";
    });

    const activeBlock = document.getElementById(`trade-${selectedTrade}`);
    if (activeBlock) activeBlock.style.display = "flex";
  });

  // STEP 2 → STEP 1 (Back button)
  back2.addEventListener("click", () => {
    step2.style.display = "none";
    step1.style.display = "flex";
  });

  // FINAL SUBMIT → STEP 3 + Console Output
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Collect all form data
    const formData = new FormData(form);
    const dataObject = {};

    formData.forEach((value, key) => {
      dataObject[key] = value;
    });

    console.log("APPLICATION SUBMITTED:");
    console.log(dataObject);

    // Move to Step 3
    step2.style.display = "none";
    step3.style.display = "flex";

    // Optional: scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.getElementById("back-home").addEventListener("click", () => {
    window.location.href = "index.html";
  });
});
