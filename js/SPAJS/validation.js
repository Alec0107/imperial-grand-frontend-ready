
export function validateName(name) {
  // Allow letters, spaces, hyphens, and apostrophes
  const namePattern = /^[A-Za-z]+([ '-][A-Za-z]+)*$/;

  // Trim extra spaces before validating
  const trimmed = name.trim();

  // Check if empty
  if (trimmed === "") {
    return { valid: false, message: "Name is required." };
  }

  // Check length boundaries
  if (trimmed.length < 3 || trimmed.length > 50) {
    return { valid: false, message: "Name must be between 3 and 50 characters." };
  }

  // Check valid pattern
  if (!namePattern.test(trimmed)) {
    return { valid: false, message: "Please enter a valid full name (letters only)." };
  }

  console.log("NAME: VALID");
  return { valid: true };
}

export function validateEmail(email){
  const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  if(email === ""){
    return { valid : false, message: "Email is required." };
  }

  if(!emailPattern.test(email)){
    return { valid: false, message: "Please enter a valid Email format" };
  }

  console.log("EMAIL: VALID")
  return { valid: true }
}

export function validatePassword(passwordValue){
  //const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if(passwordValue === ""){
    return { valid : false, message: "Password is required." };
  }

  if(passwordValue.length < 8){
    return { valid : false, message: "Password length must be at least 8 characters." };
  }

  if(!/[A-Z]/.test(passwordValue)){
    return { valid : false, message: "Missing uppercase letter." };
  }

  if(!/[a-z]/.test(passwordValue)){
    return { valid : false, message: "Missing lowercase letter." };
  }

  if(!/\d/.test(passwordValue)){
    return { valid : false, message: "Must have at least one number." };
  }

  if(!/[@$!%*?&]/.test(passwordValue)){
    return { valid : false, message: "Missing special character." };
  }

  console.log("PASSWORD: VALID")
  return { valid: true }
}