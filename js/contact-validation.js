/**
 * HITKOS APPS STUDIO — Contact Form Validation
 * Clean, inline validation with smooth UX
 */

document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('contactForm');
  if (!form) return;

  // ---- Element References ----
  const nameInput    = document.getElementById('contactName');
  const emailInput   = document.getElementById('contactEmail');
  const phoneInput   = document.getElementById('contactPhone');
  const messageInput = document.getElementById('contactMessage');

  const nameError    = document.getElementById('nameError');
  const emailError   = document.getElementById('emailError');
  const phoneError   = document.getElementById('phoneError');
  const messageError = document.getElementById('messageError');

  const submitBtn       = document.getElementById('submitBtn');
  const btnText         = submitBtn.querySelector('.btn-text');
  const btnLoading      = submitBtn.querySelector('.btn-loading');
  const btnSuccessText  = submitBtn.querySelector('.btn-success-text');
  const formSuccessMsg  = document.getElementById('formSuccessMsg');

  // ---- Validation Rules ----
  const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,15}$/;

  /**
   * Show error on a field
   */
  function showError(input, errorEl, message) {
    input.classList.add('field-invalid');
    input.classList.remove('field-valid');
    errorEl.textContent = message;
    errorEl.classList.add('visible');
  }

  /**
   * Clear error on a field
   */
  function clearError(input, errorEl) {
    input.classList.remove('field-invalid');
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
  }

  /**
   * Mark field as valid
   */
  function markValid(input, errorEl) {
    input.classList.remove('field-invalid');
    input.classList.add('field-valid');
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
  }

  // ---- Individual Field Validators ----

  function validateName() {
    const val = nameInput.value.trim();
    if (!val) {
      showError(nameInput, nameError, 'Please enter your name.');
      return false;
    }
    if (val.length < 2) {
      showError(nameInput, nameError, 'Name must be at least 2 characters.');
      return false;
    }
    markValid(nameInput, nameError);
    return true;
  }

  function validateEmail() {
    const val = emailInput.value.trim();
    if (!val) {
      showError(emailInput, emailError, 'Please enter your email address.');
      return false;
    }
    if (!emailRegex.test(val)) {
      showError(emailInput, emailError, 'Please enter a valid email address.');
      return false;
    }
    markValid(emailInput, emailError);
    return true;
  }

  function validatePhone() {
    const val = phoneInput.value.trim();
    if (val && !phoneRegex.test(val)) {
      showError(phoneInput, phoneError, 'Please enter a valid phone number.');
      return false;
    }
    if (val) {
      markValid(phoneInput, phoneError);
    } else {
      clearError(phoneInput, phoneError);
    }
    return true;
  }

  function validateMessage() {
    const val = messageInput.value.trim();
    if (!val) {
      showError(messageInput, messageError, 'Please enter your message.');
      return false;
    }
    if (val.length < 10) {
      showError(messageInput, messageError, 'Message must be at least 10 characters.');
      return false;
    }
    markValid(messageInput, messageError);
    return true;
  }

  // ---- Real-time Validation (on blur) ----
  nameInput.addEventListener('blur', validateName);
  emailInput.addEventListener('blur', validateEmail);
  phoneInput.addEventListener('blur', validatePhone);
  messageInput.addEventListener('blur', validateMessage);

  // ---- Clear errors on input (responsive feedback) ----
  nameInput.addEventListener('input', () => {
    if (nameInput.classList.contains('field-invalid')) validateName();
  });

  emailInput.addEventListener('input', () => {
    if (emailInput.classList.contains('field-invalid')) validateEmail();
  });

  phoneInput.addEventListener('input', () => {
    if (phoneInput.classList.contains('field-invalid')) validatePhone();
  });

  messageInput.addEventListener('input', () => {
    if (messageInput.classList.contains('field-invalid')) validateMessage();
  });

  // ---- Form Submission ----
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Run all validations
    const isNameValid    = validateName();
    const isEmailValid   = validateEmail();
    const isPhoneValid   = validatePhone();
    const isMessageValid = validateMessage();

    if (!isNameValid || !isEmailValid || !isPhoneValid || !isMessageValid) {
      // Scroll to first error
      const firstError = form.querySelector('.field-invalid');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
      return;
    }

    // ---- Simulate Submission ----
    // Show loading state
    btnText.classList.add('d-none');
    btnLoading.classList.remove('d-none');
    submitBtn.disabled = true;

    // Collect form data
    const formData = new FormData(form);

    // Submit to Formspree
    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
    .then(response => {
      if (response.ok) {
        // Show success state on button
        btnLoading.classList.add('d-none');
        btnSuccessText.classList.remove('d-none');
        submitBtn.style.background = '#00D4AA';
        submitBtn.style.boxShadow = '0 4px 25px rgba(0, 212, 170, 0.35)';

        // Show success message
        form.reset();
        removeAllValidClasses();

        setTimeout(() => {
          formSuccessMsg.classList.remove('d-none');
          formSuccessMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 500);

        // Reset button after 5 seconds
        setTimeout(() => {
          btnSuccessText.classList.add('d-none');
          btnText.classList.remove('d-none');
          submitBtn.disabled = false;
          submitBtn.style.background = '';
          submitBtn.style.boxShadow = '';
        }, 5000);
      } else {
        throw new Error('Form submission failed');
      }
    })
    .catch(error => {
      console.error('❌ Submission error:', error);
      btnLoading.classList.add('d-none');
      btnText.classList.remove('d-none');
      submitBtn.disabled = false;
      alert('Something went wrong. Please try again or email us directly.');
    });
  });

  /**
   * Remove all valid/invalid classes
   */
  function removeAllValidClasses() {
    [nameInput, emailInput, phoneInput, messageInput].forEach(input => {
      input.classList.remove('field-valid', 'field-invalid');
    });
    [nameError, emailError, phoneError, messageError].forEach(el => {
      el.textContent = '';
      el.classList.remove('visible');
    });
  }

});
