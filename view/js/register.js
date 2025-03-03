const form = document.getElementById("registerForm");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const passwordToggle = document.getElementById("passwordToggle");
const confirmPasswordToggle = document.getElementById("confirmPasswordToggle");
const imageupload = document.getElementById('imageInput');

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

  showError(form.fullName, fullNameValid);
  showError(form.username, usernameValid);
  showError(form.email, emailValid);
  showError(form.phone, phoneValid);
  showError(form.password, passwordValid);
  showError(form.confirmPassword, passwordsMatch);
  showError(form.dob, dobValid);
  showError(form.gender, genderValid);
  showError(form.terms, termsValid);

  if (
    fullNameValid &&
    usernameValid &&
    emailValid &&
    phoneValid &&
    passwordValid &&
    passwordsMatch &&
    dobValid &&
    genderValid &&
    termsValid
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
      file: form.file.value,
    });
  }
});

// const imagekit = new ImageKit({
//   publicKey: "public_wnJ6iUhf4XCA3x6A/XV68fTEU4Y=",
//   urlEndpoint: "https://ik.imagekit.io/FFSD0037/",
// });

async function handleUpload(e) {
  e.preventDefault();
  console.log('imsgekit');
  
  let res=await fetch('/imagKitauth')
  res=await res.json();
  console.log(res);
}

imageupload.addEventListener('click',handleUpload);
async function upload(data) {
  const file = document.getElementById("file1");
  const authenticationEndpoint = "https://your";
  const authResponse = await fetch(authenticationEndpoint, {
    method: "GET",
    // You can also pass headers and validate the request source in the backend, or you can use headers for any other use case.
    headers: {
'Content-Type': 'application/json',
      'Authorization': 'Bearer your-access-token',
      'CustomHeader': 'CustomValue'
    },
  });

  if (!authResponse.ok) {
    throw new Error("Failed to fetch auth details");
  }

  const authData = await authResponse.json();

  imagekit.upload({
    file: file.files[0],
    fileName: "abc.jpg",
    tags: ["tag1"],
    token: authData.token,
    signature: authData.signature,
    expire: authData.expire,
  }, function(err, result) {
    console.log(imagekit.url({
      src: result.url,
      transformation : [{ height: 300, width: 400}]
    }));
  })
}

function openOverlay() {
  event.preventDefault();
  document.getElementById("overlay").classList.add("show-overlay");
}

function closeOverlay() {
  document.getElementById("overlay").classList.remove("show-overlay");
}
