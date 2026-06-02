const overlay = document.getElementById("modalOverlay");
const modal = document.getElementById("modal");
const closeBtn = document.getElementById("modalClose");
const doneBtn = document.getElementById("doneBtn");
const formView = document.getElementById("formView");
const successView = document.getElementById("successView");
const form = document.getElementById("signupForm");
const submitBtn = document.getElementById("submitBtn");

// ── Open / close ───────────────────────────────────
function openModal() {
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
  document.getElementById("fullName").focus();
}

function closeModal() {
  overlay.classList.remove("open");
  document.body.style.overflow = "";
}

function showSuccess() {
  formView.classList.add("hidden");
  successView.classList.remove("hidden");
}

function resetModal() {
  form.reset();
  clearErrors();
  formView.classList.remove("hidden");
  successView.classList.add("hidden");
}

// ── Trigger: "Join the Waitlist" row ──────────────
document.querySelectorAll(".step-label").forEach((label) => {
  if (label.textContent.trim() === "Join the Waitlist") {
    label.style.cursor = "pointer";
    label.addEventListener("click", openModal);
  }
});

// ── Close actions ──────────────────────────────────
closeBtn.addEventListener("click", () => {
  closeModal();
  resetModal();
});
doneBtn.addEventListener("click", () => {
  closeModal();
  resetModal();
});

overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
    closeModal();
    resetModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && overlay.classList.contains("open")) {
    closeModal();
    resetModal();
  }
});

// ── Validation ─────────────────────────────────────
function clearErrors() {
  ["nameError", "emailError", "phoneError", "cityError"].forEach((id) => {
    document.getElementById(id).textContent = "";
  });
  form.querySelectorAll("input").forEach((i) => i.classList.remove("invalid"));
}

function setError(fieldId, errorId, msg) {
  const input = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  input.classList.add("invalid");
  error.textContent = msg;
  return false;
}

function validate(name, email, phone, city) {
  let valid = true;
  clearErrors();

  if (!name.trim()) {
    valid = setError("fullName", "nameError", "Please enter your name.");
  }

  if (!email.trim()) {
    valid = setError("email", "emailError", "Please enter your email address.");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    valid = setError(
      "email",
      "emailError",
      "Please enter a valid email address."
    );
  }

  if (!phone.trim()) {
    valid = setError(
      "phone",
      "phoneError",
      "Please enter your WhatsApp number."
    );
  } else if (!/^[\d\s\+\-\(\)]{7,15}$/.test(phone)) {
    valid = setError(
      "phone",
      "phoneError",
      "Please enter a valid phone number."
    );
  }

  if (!city.trim()) {
    valid = setError("city", "cityError", "Please enter your city.");
  }

  return valid;
}

// ── Submit ─────────────────────────────────────────
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const city = document.getElementById("city").value;

  if (!validate(name, email, phone, city)) return;

  submitBtn.disabled = true;
  submitBtn.textContent = "Saving…";

  const entry = {
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    city: city.trim(),
    signedUpAt: new Date().toISOString(),
  };

  // Save to localStorage (append to existing list)
  const existing = JSON.parse(localStorage.getItem("waitlistEntries") || "[]");
  existing.push(entry);
  localStorage.setItem("waitlistEntries", JSON.stringify(existing));

  submitBtn.disabled = false;
  submitBtn.textContent = "Sign Me Up";

  showSuccess();
});
