// ===== GLOBAL FUNCTIONS =====

/**
 * Set default date to today
 */
function setDefaultDate() {
    const dateInput = document.getElementById('effective_date');
    if (dateInput) {
        dateInput.valueAsDate = new Date();
    }
}

/**
 * Scroll to form section smoothly
 */
function scrollToForm() {
    const formSection = document.getElementById('form-section');
    if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Show loading state on button
 */
function showLoading(button) {
    const originalText = button.textContent;
    button.innerHTML = '<span class="loading-spinner"></span> Processing...';
    button.disabled = true;
    return originalText;
}

/**
 * Hide loading state on button
 */
function hideLoading(button, originalText) {
    button.textContent = originalText;
    button.disabled = false;
}

/**
 * Show error message for form field
 */
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);
    
    if (field) {
        field.style.borderColor = '#dc3545';
    }
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

/**
 * Clear error message for form field
 */
function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);
    
    if (field) {
        field.style.borderColor = '#ced4da';
    }
    
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

/**
 * Validate email format
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ===== FORM PAGE SPECIFIC FUNCTIONS =====

/**
 * Calculate agreement fee based on type
 */
function calculateFee() {
    const agreementType = document.getElementById('agreement_type');
    const feeBanner = document.getElementById('feeBanner');
    
    if (!agreementType || !feeBanner) return;
    
    let fee = 20000; // Default fee
    
    if (agreementType.value === 'affidavit') {
        fee = 0; // Affidavit is free
    }
    
    // Update fee display
    if (fee === 0) {
        feeBanner.innerHTML = 'Agreement Generation Fee: <strong>FREE</strong>';
    } else {
        feeBanner.innerHTML = `Agreement Generation Fee: <strong>₦${fee.toLocaleString()} (Required before submission)</strong>`;
    }
}

/**
 * Validate intake form
 */
function validateIntakeForm() {
    let isValid = true;
    
    // Required fields
    const requiredFields = [
        'agreement_type',
        'party_a_name',
        'party_a_address',
        'party_a_email',
        'party_b_name',
        'party_b_address',
        'effective_date',
        'jurisdiction',
        'description'
    ];
    
    // Clear previous errors
    requiredFields.forEach(fieldId => clearError(fieldId));
    
    // Validate required fields
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field || !field.value.trim()) {
            showError(fieldId, 'This field is required');
            isValid = false;
        }
    });
    
    // Validate email format
    const emailField = document.getElementById('party_a_email');
    if (emailField && emailField.value.trim()) {
        if (!validateEmail(emailField.value.trim())) {
            showError('party_a_email', 'Please enter a valid email address');
            isValid = false;
        }
    }
    
    // Validate description length
    const descriptionField = document.getElementById('description');
    if (descriptionField && descriptionField.value.trim()) {
        const wordCount = descriptionField.value.trim().split(/\s+/).length;
        if (wordCount > 200) {
            showError('description', 'Description must not exceed 200 words');
            isValid = false;
        }
    }
    
    return isValid;
}

/**
 * Generate agreement preview
 */
function generatePreview() {
    const agreementType = document.getElementById('agreement_type');
    const partyAName = document.getElementById('party_a_name');
    const partyBName = document.getElementById('party_b_name');
    const effectiveDate = document.getElementById('effective_date');
    const jurisdiction = document.getElementById('jurisdiction');
    const description = document.getElementById('description');
    
    if (!agreementType || !partyAName || !partyBName || !effectiveDate || !jurisdiction || !description) {
        return;
    }
    
    // Get values
    const type = agreementType.value;
    const partyA = partyAName.value.trim();
    const partyB = partyBName.value.trim();
    const date = new Date(effectiveDate.value);
    const location = jurisdiction.value.trim();
    const desc = description.value.trim();
    
    // Validate
    if (!type || !partyA || !partyB || !date || !location || !desc) {
        alert('Please fill in all required fields before previewing.');
        return;
    }
    
    // Format date
    const formattedDate = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    // Get agreement type text
    const typeText = agreementType.options[agreementType.selectedIndex].text;
    
    // Generate preview HTML
    const previewContent = document.getElementById('previewContent');
    if (previewContent) {
        previewContent.innerHTML = `
            <h4>${typeText}</h4>
            <p><strong>Effective Date:</strong> ${formattedDate}</p>
            
            <p><strong>BETWEEN:</strong><br>
            ${partyA} (hereinafter referred to as "Party A")</p>
            
            <p><strong>AND:</strong><br>
            ${partyB} (hereinafter referred to as "Party B")</p>
            
            <p><strong>PURPOSE:</strong></p>
            <p>${desc}</p>
            
            <p><strong>GOVERNING LAW:</strong><br>
            This Agreement shall be governed by and construed in accordance with the laws of ${location}.</p>
            
            <p><strong>IN WITNESS WHEREOF,</strong> the parties have executed this Agreement as of the Effective Date.</p>
            
            <div style="margin-top: 2rem; border-top: 1px solid #ccc; padding-top: 2rem;">
                <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
                    <div style="flex: 1; min-width: 200px; margin: 10px;">
                        <p>_________________________</p>
                        <p><strong>${partyA}</strong></p>
                        <p>Party A</p>
                    </div>
                    <div style="flex: 1; min-width: 200px; margin: 10px;">
                        <p>_________________________</p>
                        <p><strong>${partyB}</strong></p>
                        <p>Party B</p>
                    </div>
                </div>
            </div>
        `;
        
        // Show preview
        const previewSection = document.getElementById('agreementPreview');
        if (previewSection) {
            previewSection.style.display = 'block';
            previewSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

/**
 * Process payment simulation
 */
function processPayment() {
    const button = document.getElementById('submitButton');
    const originalText = showLoading(button);
    
    // Get agreement type for fee calculation
    const agreementType = document.getElementById('agreement_type').value;
    const fee = agreementType === 'affidavit' ? 0 : 20000;
    
    // Simulate API call delay
    setTimeout(() => {
        hideLoading(button, originalText);
        
        if (fee === 0) {
            // Free affidavit
            alert('Your affidavit has been generated successfully! Download link has been sent to your email.');
            document.getElementById('agreementForm').reset();
            setDefaultDate();
        } else {
            // Paid agreement
            alert(`In a real implementation, this would redirect to a payment gateway (Paystack/Flutterwave) for processing the ₦${fee.toLocaleString()} fee.\n\nAfter successful payment, the PDF would be generated and delivered to your email.`);
            
            // Simulate successful payment
            setTimeout(() => {
                alert('Payment successful! Your agreement has been generated and sent to your email. Thank you for using LexPact!');
                document.getElementById('agreementForm').reset();
                setDefaultDate();
                
                // Hide preview
                const previewSection = document.getElementById('agreementPreview');
                if (previewSection) {
                    previewSection.style.display = 'none';
                }
            }, 1000);
        }
    }, 2000);
}

/**
 * Submit intake form
 */
function submitIntakeForm(event) {
    event.preventDefault();
    
    if (!validateIntakeForm()) {
        return;
    }
    
    const agreementType = document.getElementById('agreement_type').value;
    
    if (agreementType === 'affidavit') {
        // Free affidavit - process immediately
        processPayment();
    } else {
        // Paid agreement - show preview first
        generatePreview();
        
        // Update payment button text with actual fee
        const paymentButton = document.getElementById('paymentButton');
        if (paymentButton) {
            paymentButton.style.display = 'block';
            paymentButton.textContent = `Proceed to Payment (₦20,000)`;
            
            // Scroll to payment button
            paymentButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

// ===== INITIALIZATION =====

/**
 * Initialize page functionality
 */
function initPage() {
    // Set default date on form page
    setDefaultDate();
    
    // Set up fee calculation on form page
    const agreementTypeSelect = document.getElementById('agreement_type');
    if (agreementTypeSelect) {
        agreementTypeSelect.addEventListener('change', calculateFee);
        calculateFee(); // Initial calculation
    }
    
    // Set up form submission on form page
    const agreementForm = document.getElementById('agreementForm');
    if (agreementForm) {
        agreementForm.addEventListener('submit', submitIntakeForm);
    }
    
    // Set up real-time validation
    const formInputs = document.querySelectorAll('.form-control');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim()) {
                clearError(this.id);
            }
        });
    });
    
    // Set up payment button on form page
    const paymentButton = document.getElementById('paymentButton');
    if (paymentButton) {
        paymentButton.addEventListener('click', processPayment);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initPage);