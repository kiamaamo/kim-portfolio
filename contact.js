// Replace the placeholders below with values from your EmailJS account
// - YOUR_USER_ID (public key) for emailjs.init
// - YOUR_SERVICE_ID and YOUR_TEMPLATE_ID for sendForm
(function(){
  if (!window.emailjs) return console.warn('EmailJS not loaded');
  emailjs.init('S0zvw0KU0YABEAX36'); // public key

  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  form.addEventListener('submit', function(e){
    e.preventDefault();
    status.textContent = '';
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

     // Ensure email is sent under common template variable names
    try {
      var emailField = form.querySelector('input[name="reply_to"]');
      var emailVal = (emailField && emailField.value) ? emailField.value.trim() : '';
      if (emailVal) {
        // Some EmailJS templates use {{user_email}} or {{userEmail}} — create a hidden field so both are sent
        var hidden = form.querySelector('input[name="user_email"]');
        if (!hidden) {
          hidden = document.createElement('input');
          hidden.type = 'hidden';
          hidden.name = 'user_email';
          form.appendChild(hidden);
        }
        hidden.value = emailVal;
      }
    } catch (e) {
      console.warn('Could not copy email to hidden field', e);
    }
    
    emailjs.sendForm('service_ah0jn2d','template_moxovtx', this)
      .then(function(){
        status.textContent = 'Thank you — your message was sent.';
        form.reset();
      }, function(err){
        console.error('EmailJS error:', err);
        status.textContent = 'Sorry — something went wrong. Please try again or email kimmaamo670@gmail.com';
      })
      .finally(function(){
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      });
  });
})();
