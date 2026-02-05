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

  // Prevent Enter key from submitting early
  form.addEventListener("keydown", (e) => {
    if (e.key === "Enter") e.preventDefault();
  });

  // ============================================================
  //  TRADE QUESTION SCHEMA
  // ============================================================
  const tradeQuestions = {
    landscaper: [
      {
        type: "number",
        label: "Years in business",
        name: "ls_years_business",
        required: true
      },
      {
        type: "multiselect",
        label: "Are you registered with BALI/APL?",
        name: "ls_bali_apl",
        options: ["BALI", "APL", "No"],
        required: true
      },
      {
        type: "radio",
        label: "Do you have experience reading plans?",
        name: "ls_reading_plans",
        options: ["Yes", "No"],
        required: true
      },
      {
        type: "radio",
        label: "Are you CIS registered?",
        name: "ls_cis_registered",
        options: ["Yes", "No"],
        required: true
      },
      {
        type: "multiselect",
        label: "Areas of experience",
        name: "ls_experience_areas",
        options: [
          "Porcelain Paving",
          "Natural Stone Paving",
          "Real Lawn",
          "Artificial Lawn"
        ]
      },
      {
        type: "textarea",
        label: "Additional Notes",
        name: "ls_notes"
      }
    ],

    bricklayer: [
      { type: "text", label: "Question 1", name: "bl_question1" },
      { type: "text", label: "Question 2", name: "bl_question2" },
      { type: "text", label: "Question 3", name: "bl_question3" },
      { type: "text", label: "Question 4", name: "bl_question4" }
    ],

    groundworker: [
      { type: "text", label: "Question 1", name: "gw_question1" },
      { type: "text", label: "Question 2", name: "gw_question2" },
      { type: "text", label: "Question 3", name: "gw_question3" },
      { type: "text", label: "Question 4", name: "gw_question4" }
    ],

    joiner: [
      { type: "text", label: "Question 1", name: "j_question1" },
      { type: "text", label: "Question 2", name: "j_question2" },
      { type: "text", label: "Question 3", name: "j_question3" },
      { type: "text", label: "Question 4", name: "j_question4" }
    ],

    electrician: [
      { type: "text", label: "Question 1", name: "el_question1" },
      { type: "text", label: "Question 2", name: "el_question2" },
      { type: "text", label: "Question 3", name: "el_question3" },
      { type: "text", label: "Question 4", name: "el_question4" }
    ],

    plumber: [
      { type: "text", label: "Question 1", name: "pl_question1" },
      { type: "text", label: "Question 2", name: "pl_question2" },
      { type: "text", label: "Question 3", name: "pl_question3" },
      { type: "text", label: "Question 4", name: "pl_question4" }
    ]
  };

  // ============================================================
  //  DYNAMIC QUESTION RENDERER
  // ============================================================
  function renderTradeQuestions(trade) {
    const container = document.getElementById("trade-questions");
    container.innerHTML = ""; // Clear previous

    const questions = tradeQuestions[trade];
    if (!questions) {
      container.classList.add("hidden");
      return;
    }

    container.classList.remove("hidden");

    // Title
    const title = document.createElement("h3");
    title.textContent = `${trade.charAt(0).toUpperCase() + trade.slice(1)} Details`;
    container.appendChild(title);

    // Generate each question
    questions.forEach(q => {
      const group = document.createElement("div");
      group.className = "form__group";

      // Label
      const label = document.createElement("label");
      label.textContent = q.label + (q.required ? " *" : "");
      group.appendChild(label);

      // Input types
      if (q.type === "text" || q.type === "number") {
        const input = document.createElement("input");
        input.type = q.type;
        input.name = q.name;
        input.className = "form__input";
        if (q.required) input.required = true;
        group.appendChild(input);
      }

      if (q.type === "radio") {
        const wrapper = document.createElement("div");
        wrapper.className = "flex gap-md";

        q.options.forEach(opt => {
          const label = document.createElement("label");
          label.innerHTML = `<input type="radio" name="${q.name}" value="${opt}"> ${opt}`;
          wrapper.appendChild(label);
        });

        group.appendChild(wrapper);
      }

      if (q.type === "multiselect") {
        const wrapper = document.createElement("div");
        wrapper.className = "flex-col gap-sm";

        q.options.forEach(opt => {
          const label = document.createElement("label");
          label.innerHTML = `<input type="checkbox" name="${q.name}" value="${opt}"> ${opt}`;
          wrapper.appendChild(label);
        });

        group.appendChild(wrapper);
      }

      if (q.type === "textarea") {
        const textarea = document.createElement("textarea");
        textarea.name = q.name;
        textarea.className = "form__input";
        textarea.rows = 4;
        group.appendChild(textarea);
      }

      // Error message
      const error = document.createElement("small");
      error.className = "form__error";
      group.appendChild(error);

      container.appendChild(group);
    });
  }

  // ============================================================
  //  ERROR HANDLING HELPERS
  // ============================================================
  function showError(field, message) {
    const group = field.closest(".form__group");
    const error = group.querySelector(".form__error");

    field.classList.add("error");
    field.classList.remove("valid");

    error.textContent = message;
    error.style.display = "block";
  }

  function clearError(field) {
    const group = field.closest(".form__group");
    const error = group.querySelector(".form__error");

    field.classList.remove("error");
    field.classList.add("valid");

    error.textContent = "";
    error.style.display = "none";
  }

  // ============================================================
  //  RADIO GROUP VALIDATION
  // ============================================================
  function validateRadioGroup(name, message) {
    const group = document.querySelector(`input[name="${name}"]`)?.closest(".form__group");
    const error = group.querySelector(".form__error");
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

  // Real-time radio validation
  ["business_registered", "public_liability"].forEach(name => {
    document.querySelectorAll(`input[name="${name}"]`).forEach(radio => {
      radio.addEventListener("change", () => {
        validateRadioGroup(name, "Please select an option");
      });
    });
  });

  // ============================================================
  //  REAL-TIME VALIDATION FOR STEP 1
  // ============================================================
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

  // ============================================================
  //  STEP INDICATOR
  // ============================================================
  function updateStepIndicator(stepNumber) {
    const steps = document.querySelectorAll(".steps__circle");

    steps.forEach(step => {
      if (parseInt(step.dataset.step) === stepNumber) {
        step.classList.add("steps__circle--active");
      } else {
        step.classList.remove("steps__circle--active");
      }
    });
  }

  updateStepIndicator(1);

  // ============================================================
  //  CONDITIONAL LOGIC — BUSINESS REGISTERED
  // ============================================================
  document.querySelectorAll("input[name='business_registered']").forEach(radio => {
    radio.addEventListener("change", () => {
      if (radio.value === "yes") {
        regNumberGroup.classList.remove("hidden");
        regNumberField.required = true;
      } else {
        regNumberGroup.classList.add("hidden");
        regNumberField.required = false;
        regNumberField.value = "";
        clearError(regNumberField);
      }

      attachRealtimeValidation();
    });
  });

  // ============================================================
  //  CONDITIONAL LOGIC — PUBLIC LIABILITY
  // ============================================================
  document.querySelectorAll("input[name='public_liability']").forEach(radio => {
    radio.addEventListener("change", () => {
      if (radio.value === "yes") {
        liabilityExpiryGroup.classList.remove("hidden");
        liabilityExpiryField.required = true;
      } else {
        liabilityExpiryGroup.classList.add("hidden");
        liabilityExpiryField.required = false;
        liabilityExpiryField.value = "";
        clearError(liabilityExpiryField);
      }

      attachRealtimeValidation();
    });
  });

  // ============================================================
  //  STEP 1 → STEP 2
  // ============================================================
  next1.addEventListener("click", () => {
    const requiredFields = step1.querySelectorAll("[required]");
    let valid = true;

    // Validate required fields
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

    // Switch steps
    step1.classList.remove("form-step--active");
    step1.classList.add("hidden");

    step2.classList.add("form-step--active");
    step2.classList.remove("hidden");

    updateStepIndicator(2);

    // Render dynamic trade questions
    const selectedTrade = tradeSelect.value.toLowerCase();
    renderTradeQuestions(selectedTrade);

    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ============================================================
  //  STEP 2 → STEP 1 (BACK)
  // ============================================================
  back2.addEventListener("click", () => {
    step2.classList.remove("form-step--active");
    step2.classList.add("hidden");

    step1.classList.add("form-step--active");
    step1.classList.remove("hidden");

    updateStepIndicator(1);

    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ============================================================
  //  FINAL SUBMIT → STEP 3
  // ============================================================
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const dataObject = {};

    formData.forEach((value, key) => {
      // Handle multi-select checkboxes
      if (dataObject[key]) {
        if (!Array.isArray(dataObject[key])) {
          dataObject[key] = [dataObject[key]];
        }
        dataObject[key].push(value);
      } else {
        dataObject[key] = value;
      }
    });

    console.log("APPLICATION SUBMITTED:");
    console.log(dataObject);

    step2.classList.remove("form-step--active");
    step2.classList.add("hidden");

    step3.classList.add("form-step--active");
    step3.classList.remove("hidden");

    updateStepIndicator(3);

    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ============================================================
  //  RETURN TO HOME
  // ============================================================
  homeBtn.addEventListener("click", () => {
    window.location.href = "../index.html";
  });

});