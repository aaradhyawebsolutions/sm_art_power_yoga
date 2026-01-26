/**
 * SM art Power Yoga - Form Validation
 * jQuery-based form validation with custom error messages
 */

(function($) {
    'use strict';

    $(document).ready(function() {
        // Initialize form validation
        initContactFormValidation();
        initNewsletterValidation();
        initRegistrationFormValidation();
        
        // Real-time validation
        enableRealTimeValidation();
    });

    /**
     * Contact form validation
     */
    function initContactFormValidation() {
        $('#contactForm').on('submit', function(e) {
            e.preventDefault();
            
            // Clear previous errors
            clearFormErrors($(this));
            
            let isValid = true;
            const form = $(this);
            
            // Validate name
            const name = form.find('#name').val().trim();
            if (name === '') {
                showError('#name', 'Please enter your name');
                isValid = false;
            } else if (name.length < 2) {
                showError('#name', 'Name must be at least 2 characters');
                isValid = false;
            } else if (!/^[a-zA-Z\s]+$/.test(name)) {
                showError('#name', 'Name can only contain letters and spaces');
                isValid = false;
            }
            
            // Validate email
            const email = form.find('#email').val().trim();
            if (email === '') {
                showError('#email', 'Please enter your email');
                isValid = false;
            } else if (!isValidEmail(email)) {
                showError('#email', 'Please enter a valid email address');
                isValid = false;
            }
            
            // Validate phone
            const phone = form.find('#phone').val().trim();
            if (phone === '') {
                showError('#phone', 'Please enter your phone number');
                isValid = false;
            } else if (!isValidPhone(phone)) {
                showError('#phone', 'Please enter a valid 10-digit phone number');
                isValid = false;
            }
            
            // Validate subject (optional)
            const subject = form.find('#subject').val().trim();
            if (subject !== '' && subject.length < 5) {
                showError('#subject', 'Subject must be at least 5 characters');
                isValid = false;
            }
            
            // Validate message
            const message = form.find('#message').val().trim();
            if (message === '') {
                showError('#message', 'Please enter your message');
                isValid = false;
            } else if (message.length < 10) {
                showError('#message', 'Message must be at least 10 characters');
                isValid = false;
            }
            
            if (isValid) {
                submitContactForm(form);
            }
            
            return false;
        });
    }

    /**
     * Newsletter subscription validation
     */
    function initNewsletterValidation() {
        $('#newsletterForm').on('submit', function(e) {
            e.preventDefault();
            
            clearFormErrors($(this));
            
            const email = $(this).find('input[type="email"]').val().trim();
            
            if (email === '') {
                showError($(this).find('input[type="email"]'), 'Please enter your email');
                return false;
            }
            
            if (!isValidEmail(email)) {
                showError($(this).find('input[type="email"]'), 'Please enter a valid email');
                return false;
            }
            
            submitNewsletterForm($(this));
            return false;
        });
    }

    /**
     * Registration/Inquiry form validation
     */
    function initRegistrationFormValidation() {
        $('#registrationForm').on('submit', function(e) {
            e.preventDefault();
            
            clearFormErrors($(this));
            
            let isValid = true;
            const form = $(this);
            
            // Validate all required fields
            form.find('[required]').each(function() {
                const $field = $(this);
                const value = $field.val().trim();
                
                if (value === '') {
                    showError($field, 'This field is required');
                    isValid = false;
                }
            });
            
            // Validate age (if exists)
            const age = form.find('#age').val();
            if (age && (age < 5 || age > 100)) {
                showError('#age', 'Please enter a valid age between 5 and 100');
                isValid = false;
            }
            
            // Validate location selection
            const location = form.find('#location').val();
            if (!location || location === '') {
                showError('#location', 'Please select a location');
                isValid = false;
            }
            
            if (isValid) {
                submitRegistrationForm(form);
            }
            
            return false;
        });
    }

    /**
     * Real-time validation on input
     */
    function enableRealTimeValidation() {
        // Validate on blur
        $('input, textarea, select').on('blur', function() {
            const $field = $(this);
            validateField($field);
        });
        
        // Remove error on input
        $('input, textarea, select').on('input change', function() {
            const $field = $(this);
            if ($field.hasClass('is-invalid')) {
                $field.removeClass('is-invalid');
                $field.next('.invalid-feedback').remove();
            }
        });
        
        // Phone number formatting
        $('input[type="tel"]').on('input', function() {
            let value = $(this).val().replace(/\D/g, '');
            if (value.length > 10) {
                value = value.slice(0, 10);
            }
            $(this).val(value);
        });
    }

    /**
     * Validate individual field
     */
    function validateField($field) {
        const value = $field.val().trim();
        const fieldType = $field.attr('type');
        const fieldId = $field.attr('id');
        
        // Clear previous error
        $field.removeClass('is-invalid');
        $field.next('.invalid-feedback').remove();
        
        // Required field check
        if ($field.prop('required') && value === '') {
            showError($field, 'This field is required');
            return false;
        }
        
        // Email validation
        if (fieldType === 'email' && value !== '' && !isValidEmail(value)) {
            showError($field, 'Please enter a valid email address');
            return false;
        }
        
        // Phone validation
        if (fieldType === 'tel' && value !== '' && !isValidPhone(value)) {
            showError($field, 'Please enter a valid 10-digit phone number');
            return false;
        }
        
        // URL validation
        if (fieldType === 'url' && value !== '' && !isValidURL(value)) {
            showError($field, 'Please enter a valid URL');
            return false;
        }
        
        // Number validation
        if (fieldType === 'number') {
            const min = $field.attr('min');
            const max = $field.attr('max');
            
            if (min && value < parseInt(min)) {
                showError($field, `Value must be at least ${min}`);
                return false;
            }
            
            if (max && value > parseInt(max)) {
                showError($field, `Value must not exceed ${max}`);
                return false;
            }
        }
        
        // Minimum length check
        const minLength = $field.attr('minlength');
        if (minLength && value.length > 0 && value.length < parseInt(minLength)) {
            showError($field, `Must be at least ${minLength} characters`);
            return false;
        }
        
        return true;
    }

    /**
     * Email validation
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Phone validation (Indian format)
     */
    function isValidPhone(phone) {
        const phoneRegex = /^[6-9]\d{9}$/;
        return phoneRegex.test(phone);
    }

    /**
     * URL validation
     */
    function isValidURL(url) {
        const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        return urlRegex.test(url);
    }

    /**
     * Show error message
     */
    function showError(field, message) {
        const $field = $(field);
        
        $field.addClass('is-invalid');
        
        // Remove existing error message
        $field.next('.invalid-feedback').remove();
        
        // Add new error message
        $field.after(`<div class="invalid-feedback d-block">${message}</div>`);
        
        // Scroll to first error
        if ($('.is-invalid').length === 1) {
            $('html, body').animate({
                scrollTop: $field.offset().top - 100
            }, 300);
        }
    }

    /**
     * Clear all form errors
     */
    function clearFormErrors(form) {
        form.find('.is-invalid').removeClass('is-invalid');
        form.find('.invalid-feedback').remove();
        form.find('.alert').remove();
    }

    /**
     * Submit contact form
     */
    function submitContactForm(form) {
        const submitBtn = form.find('button[type="submit"]');
        const originalText = submitBtn.html();
        
        // Disable button and show loading
        submitBtn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-2"></i>Sending...');
        
        // Get form data
        const formData = {
            name: form.find('#name').val().trim(),
            email: form.find('#email').val().trim(),
            phone: form.find('#phone').val().trim(),
            subject: form.find('#subject').val().trim(),
            message: form.find('#message').val().trim()
        };
        
        // Simulate form submission (replace with actual AJAX call)
        setTimeout(function() {
            // Show success message
            showSuccessMessage(form, 'Thank you! Your message has been sent successfully. We will get back to you soon.');
            
            // Reset form
            form[0].reset();
            
            // Re-enable button
            submitBtn.prop('disabled', false).html(originalText);
            
            // Optional: Send to email service or backend
            console.log('Form Data:', formData);
            
        }, 1500);
    }

    /**
     * Submit newsletter form
     */
    function submitNewsletterForm(form) {
        const submitBtn = form.find('button[type="submit"]');
        const originalText = submitBtn.html();
        
        submitBtn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i>');
        
        const email = form.find('input[type="email"]').val().trim();
        
        setTimeout(function() {
            showSuccessMessage(form, 'Successfully subscribed to our newsletter!');
            form[0].reset();
            submitBtn.prop('disabled', false).html(originalText);
            
            console.log('Newsletter Email:', email);
        }, 1000);
    }

    /**
     * Submit registration form
     */
    function submitRegistrationForm(form) {
        const submitBtn = form.find('button[type="submit"]');
        const originalText = submitBtn.html();
        
        submitBtn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-2"></i>Submitting...');
        
        const formData = form.serializeArray();
        
        setTimeout(function() {
            showSuccessMessage(form, 'Registration successful! We will contact you shortly with more details.');
            form[0].reset();
            submitBtn.prop('disabled', false).html(originalText);
            
            console.log('Registration Data:', formData);
        }, 2000);
    }

    /**
     * Show success message
     */
    function showSuccessMessage(form, message) {
        // Remove existing alerts
        form.find('.alert').remove();
        
        // Add success alert
        const alert = $(`
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <i class="fas fa-check-circle me-2"></i>${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `);
        
        form.prepend(alert);
        
        // Scroll to alert
        $('html, body').animate({
            scrollTop: alert.offset().top - 100
        }, 300);
        
        // Auto-dismiss after 5 seconds
        setTimeout(function() {
            alert.fadeOut(function() {
                $(this).remove();
            });
        }, 5000);
    }

    /**
     * Show error message
     */
    function showErrorMessage(form, message) {
        form.find('.alert').remove();
        
        const alert = $(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <i class="fas fa-exclamation-circle me-2"></i>${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `);
        
        form.prepend(alert);
        
        $('html, body').animate({
            scrollTop: alert.offset().top - 100
        }, 300);
    }

})(jQuery);