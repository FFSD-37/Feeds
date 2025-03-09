const form = document.getElementById("registerForm");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const passwordToggle = document.getElementById("passwordToggle");
const confirmPasswordToggle = document.getElementById("confirmPasswordToggle");
const imageupload = document.getElementById('pfp');

const validateFullName = (name) => {
  return name.length >= 2 && /^[a-zA-Z\s]+$/.test(name);
};

const validateUsername = (username) => {
  return /^[a-zA-Z0-9]{3,20}$/.test(username);
};

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePhone = (phone) => {
  return /^\+?[\d\s-]{10,}$/.test(phone);
};

const validatePassword = (password) => {
  return (
    password.length >= 6 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password)
  );
};

const validateDOB = (dob) => {
  const date = new Date(dob);
  const today = new Date();
  const age = today.getFullYear() - date.getFullYear();
  return age >= 13 && age <= 120;
};

const showError = (input, isValid) => {
  const showError = (input, isValid) => {
    if (!input) {
      console.error("Invalid input element:", input);
      return;
    }

    // Handle radio buttons (RadioNodeList)
    if (input instanceof RadioNodeList) {
      input = input[0]; // Select the first radio button in the group
    }

    if (!(input instanceof HTMLElement)) {
      console.error("Invalid input element (not an HTMLElement):", input);
      return;
    }

    // Handle checkboxes separately
    let formGroup = input.closest(".form-group") || input.closest(".checkbox-group");
    if (!formGroup) {
      console.error("Could not find .form-group or .checkbox-group for:", input);
      return;
    }

    if (!isValid) {
      formGroup.classList.add("error");
    } else {
      formGroup.classList.remove("error");
    }
  };
};


[passwordToggle, confirmPasswordToggle].forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const input = toggle.previousElementSibling;
    if (input.type === "password") {
      input.type = "text";
      toggle.textContent = "👁️‍🗨️";
    } else {
      input.type = "password";
      toggle.textContent = "👁️";
    }
  });
});

form.addEventListener("submit", (e) => {
  // e.preventDefault();

  const fullNameValid = validateFullName(form.fullName.value);
  const usernameValid = validateUsername(form.username.value);
  const emailValid = validateEmail(form.email.value);
  const phoneValid = validatePhone(form.phone.value);
  const passwordValid = validatePassword(form.password.value);
  const passwordsMatch = form.password.value === form.confirmPassword.value;
  const dobValid = validateDOB(form.dob.value);
  const genderValid = form.gender.value;
  const termsValid = form.terms.checked;
  const bio = form.bio.value;

  showError(form.fullName, fullNameValid);
  showError(form.username, usernameValid);
  showError(form.email, emailValid);
  showError(form.phone, phoneValid);
  showError(form.password, passwordValid);
  showError(form.confirmPassword, passwordsMatch);
  showError(form.dob, dobValid);
  showError(form.gender, genderValid);
  showError(form.terms, termsValid);
  showError(form.bio, bio);

  if (
    fullNameValid &&
    usernameValid &&
    emailValid &&
    phoneValid &&
    passwordValid &&
    passwordsMatch &&
    dobValid &&
    genderValid &&
    termsValid &&
    bio
  ) {


    console.log("Form submitted:", {
      fullName: form.fullName.value,
      username: form.username.value,
      email: form.email.value,
      phone: form.phone.value,
      dob: form.dob.value,
      gender: form.gender.value,
      password: form.password.value,
      bio: form.bio.value,
    });
  }
});

async function getAuth() {
  let res = await fetch('/imagKitauth')
  return res;
}

imageupload.addEventListener('change', handleUpload);
async function handleUpload() {
  const authResponse = await getAuth();

  if (!authResponse.ok) throw new Error("Failed to fetch auth details");

  const authData = await authResponse.json();
  var imagekit = new ImageKit({
    publicKey: "public_wnJ6iUhf4XCA3x6A/XV68fTEU4Y=",
    urlEndpoint: "https://ik.imagekit.io/FFSD0037/",
  });

  var file = document.getElementById("pfp");
  imagekit.upload({
    file: file.files[0],
    fileName: file.files[0].name || "sample-file.jpg",
    tags: ["tag1"],
    responseFields: "tags",
    token: authData.token,
    signature: authData.signature,
    expire: authData.expire,
  }, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      document.getElementById("profileImageUrl").value = result.url;
      console.log(result);
    }
  });
}

function openOverlay() {
  event.preventDefault();
  document.getElementById("overlay").classList.add("show-overlay");
}

function closeOverlay() {
  document.getElementById("overlay").classList.remove("show-overlay");
}
