document.addEventListener("DOMContentLoaded", () => {

  /* -----------------------------------
     ELEMENT REFERENCES
  ----------------------------------- */

  const form = document.querySelector("[data-form='subcontractor-application']");
  const steps = document.querySelectorAll(".form-step");
  const stepIndicatorNumbers = document.querySelectorAll(".step-indicator__number");

  const nextBtn = document.querySelector(".form-step__next");
  const backBtn = document.querySelector(".form-step__back");
  const homeBtn = document.querySelector(".home-button");

  const tradeSelect = document.getElementById("trade");

  const regNumberGroup = document.getElementById("reg_number_group");
  const regNumberField = document.getElementById("company_reg_number");

  const liabilityExpiryGroup = document.getElementById("liability_expiry_group");
  const liabilityExpiryField = document.getElementById("liability_expiry");


  /* -----------------------------------
     STEP MANAGER
  ----------------------------------- */

  let currentStep = 1;

  function showStep(step) {
    steps.forEach(s => s.classList.remove("form-step--active"));
    document.querySelector(`.form-step[data-step="${step}"]`).classList.add("form-step--active");

    updateStepIndicator(step);
    currentStep = step;

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateStepIndicator(step) {
    stepIndicatorNumbers.forEach(num => {
      const isActive = parseInt(num.dataset.step) === step;
      num.classList.toggle("step-indicator__number--active", isActive);
    });
  }

  showStep(1);


  /* -----------------------------------
     VALIDATION HELPERS
  ----------------------------------- */

  function showError(field, message) {
    const group = field.closest(".form-group");
    const error = group.querySelector(".form-group__error");

    field.classList.add("error");
    field.classList.remove("valid");

    error.textContent = message;
    error.style.display = "block";
  }

  function clearError(field) {
    const group = field.closest(".form-group");
    const error = group.querySelector(".form-group__error");

    field.classList.remove("error");
    field.classList.add("valid");

    error.textContent = "";
    error.style.display = "none";
  }

  function validateField(field) {
    if (field.hasAttribute("required") && !field.value.trim()) {
      showError(field, "This field is required");
      return false;
    }
    clearError(field);
    return true;
  }

  function validateRadioGroup(name, message) {
    const options = document.querySelectorAll(`input[name="${name}"]`);
    const group = options[0].closest(".form-group");
    const error = group.querySelector(".form-group__error");

    const selected = Array.from(options).some(o => o.checked);

    if (!selected) {
      error.textContent = message;
      error.style.display = "block";
      return false;
    }

    error.textContent = "";
    error.style.display = "none";
    return true;
  }


  /* -----------------------------------
     REAL-TIME VALIDATION
  ----------------------------------- */

  form.addEventListener("input", (e) => {
    if (e.target.matches("[required]")) {
      validateField(e.target);
    }
  });


  /* -----------------------------------
     CONDITIONAL LOGIC
  ----------------------------------- */

  function toggleConditional(group, field, show) {
    if (show) {
      group.hidden = false;
      field.setAttribute("required", "required");
    } else {
      group.hidden = true;
      field.removeAttribute("required");
      field.value = "";
      clearError(field);
    }
  }

  form.addEventListener("change", (e) => {
    if (e.target.name === "business_registered") {
      toggleConditional(regNumberGroup, regNumberField, e.target.value === "yes");
    }

    if (e.target.name === "public_liability") {
      toggleConditional(liabilityExpiryGroup, liabilityExpiryField, e.target.value === "yes");
    }
  });


  /* -----------------------------------
     TRADE BLOCK MANAGER
  ----------------------------------- */

  function showTradeBlock() {
    const selected = tradeSelect.value.toLowerCase();

    document.querySelectorAll(".trade-block").forEach(block => {
      block.hidden = true;
    });

    const active = document.getElementById(`trade-${selected}`);
    if (active) active.hidden = false;
  }


  /* -----------------------------------
     STEP 1 → STEP 2
  ----------------------------------- */

  nextBtn.addEventListener("click", () => {
    const requiredFields = steps[0].querySelectorAll("[required]");
    let valid = true;

    requiredFields.forEach(field => {
      if (!validateField(field)) valid = false;
    });

    if (!validateRadioGroup("business_registered", "Please select an option")) valid = false;
    if (!validateRadioGroup("public_liability", "Please select an option")) valid = false;

    if (!valid) return;

    showTradeBlock();
    showStep(2);
  });


  /* -----------------------------------
     STEP 2 → STEP 1
  ----------------------------------- */

  backBtn.addEventListener("click", () => {
    showStep(1);
  });


  /* -----------------------------------
     FORM SUBMISSION → STEP 3
  ----------------------------------- */

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fields = form.querySelectorAll("[data-field]");
    const payload = {};

    fields.forEach(field => {
      if (field.type === "radio") {
        if (field.checked) payload[field.dataset.field] = field.value;
      } else {
        payload[field.dataset.field] = field.value;
      }
    });

    console.log("APPLICATION SUBMITTED:");
    console.log(payload);

    showStep(3);
  });


  /* -----------------------------------
     RETURN TO HOME
  ----------------------------------- */

  homeBtn.addEventListener("click", () => {
    window.location.href = "../index.html";
  });

});