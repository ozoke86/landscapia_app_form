document.addEventListener("DOMContentLoaded", () => {

  // STEP ELEMENTS
  const step1 = document.getElementById("step-1");
  const step2 = document.getElementById("step-2");
  const step3 = document.getElementById("step-3");

  // BUTTONS
  const next1 = document.getElementById("next-1");
  const back2 = document.getElementById("back-2");
  const homeBtn = document.getElementById("back-home");

  // FORM
  const form = document.getElementById("contractorForm");

  // CONDITIONAL FIELDS
  const regNumberGroup = document.getElementById("reg_number_group");
  const liabilityExpiryGroup = document.getElementById("liability_expiry_group");

  const regNumberField = document.getElementById("company_reg_number");
  const liabilityExpiryField = document.getElementById("liability_expiry");

  // TRADE SELECT
  const tradeSelect = document.getElementById("trade");

  // PREVENT ENTER KEY FROM SUBMITTING EARLY
  form.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  });

  // -----------------------------
  // INLINE VALIDATION HELPERS
  // -----------------------------
  function showError(field, message) {
    const group = field.closest(".form_group");
    const error = group.querySelector(".error_message");

    field.classList.add("error");
    field.classList.remove("valid");

    error.textContent = message;
    error.style.display = "block";
  }

  function clearError(field) {
    const group = field.closest(".form_group");
    const error = group.querySelector(".error_message");

    field.classList.remove("error");
    field.classList.add("valid");

    error.textContent = "";
    error.style.display = "none";
  }

  // -----------------------------
  // RADIO GROUP VALIDATION
  // -----------------------------
  function validateRadioGroup(name, message) {
    const group = document.querySelector(`input[name="${name}"]`)?.closest(".form_group");
    const error = group.querySelector(".error_message");
    const options = document.querySelectorAll(`input[name="${name}"]`);

    const selected = Array.from(options).some(option => option.checked);

    if (!selected) {
      error.textContent = message;
      error.style.display = "block";
      return false;
    } else {
      error.textContent = "";
      error.style.display = "none";
      return true;
    }
  }

  // Real-time validation for radio groups
  document.querySelectorAll("input[name='business_registered']").forEach(radio => {
    radio.addEventListener("change", () => {
      validateRadioGroup("business_registered", "Please select an option");
    });
  });

  document.querySelectorAll("input[name='public_liability']").forEach(radio => {
    radio.addEventListener("change", () => {
      validateRadioGroup("public_liability", "Please select an option");
    });
  });

  // -----------------------------
  // REAL-TIME VALIDATION FOR TEXT/NUMBER/EMAIL FIELDS
  // -----------------------------
  function attachRealtimeValidation() {
    const requiredFields = step1.querySelectorAll("[required]");

    requiredFields.forEach(field => {
      field.addEventListener("input", () => {
        if (!field.value.trim()) {
          showError(field, "This field is required");
        } else {
          clearError(field);
        }
      });
    });
  }

  attachRealtimeValidation();

  // -----------------------------
  // DYNAMIC STEP INDICATOR
  // -----------------------------
  function updateStepIndicator(stepNumber) {
    const steps = document.querySelectorAll(".step_number");

    steps.forEach(step => {
      if (parseInt(step.dataset.step) === stepNumber) {
        step.classList.add("active");
      } else {
        step.classList.remove("active");
      }
    });
  }

  updateStepIndicator(1);

  // -----------------------------
  // CONDITIONAL LOGIC — BUSINESS REGISTERED
  // -----------------------------
  document.querySelectorAll("input[name='business_registered']").forEach(radio => {
    radio.addEventListener("change", () => {
      if (radio.value === "yes") {
        regNumberGroup.style.display = "flex";
        regNumberField.setAttribute("required", "required");
      } else {
        regNumberGroup.style.display = "none";
        regNumberField.removeAttribute("required");
        regNumberField.value = "";
        clearError(regNumberField);
      }

      attachRealtimeValidation();
    });
  });

  // -----------------------------
  // CONDITIONAL LOGIC — PUBLIC LIABILITY
  // -----------------------------
  document.querySelectorAll("input[name='public_liability']").forEach(radio => {
    radio.addEventListener("change", () => {
      if (radio.value === "yes") {
        liabilityExpiryGroup.style.display = "flex";
        liabilityExpiryField.setAttribute("required", "required");
      } else {
        liabilityExpiryGroup.style.display = "none";
        liabilityExpiryField.removeAttribute("required");
        liabilityExpiryField.value = "";
        clearError(liabilityExpiryField);
      }

      attachRealtimeValidation();
    });
  });

  // -----------------------------
  // STEP 1 → STEP 2
  // -----------------------------
  next1.addEventListener("click", () => {

    const requiredFields = step1.querySelectorAll("[required]");
    let valid = true;

    // Validate text/number/email fields
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        showError(field, "This field is required");
        valid = false;
      } else {
        clearError(field);
      }
    });

    // Validate radio groups
    if (!validateRadioGroup("business_registered", "Please select an option")) valid = false;
    if (!validateRadioGroup("public_liability", "Please select an option")) valid = false;

    if (!valid) return;

    step1.style.display = "none";
    step2.style.display = "flex";

    updateStepIndicator(2);

    // Show correct trade block
    const selectedTrade = tradeSelect.value.toLowerCase();
    document.querySelectorAll(".trade-block").forEach(block => {
      block.style.display = "none";
    });

    const activeBlock = document.getElementById(`trade-${selectedTrade}`);
    if (activeBlock) activeBlock.style.display = "flex";

    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // -----------------------------
  // STEP 2 → STEP 1 (BACK)
  // -----------------------------
  back2.addEventListener("click", () => {
    step2.style.display = "none";
    step1.style.display = "flex";

    updateStepIndicator(1);

    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // -----------------------------
  // FINAL SUBMIT → STEP 3
  // -----------------------------
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const dataObject = {};

    formData.forEach((value, key) => {
      dataObject[key] = value;
    });

    console.log("APPLICATION SUBMITTED:");
    console.log(dataObject);

    step2.style.display = "none";
    step3.style.display = "flex";

    updateStepIndicator(3);

    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // -----------------------------
  // RETURN TO HOME
  // -----------------------------
  homeBtn.addEventListener("click", () => {
    window.location.href = "../index.html";
  });

});