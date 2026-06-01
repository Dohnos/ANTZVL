/**
 * Antik Zvole - Frontend Logic
 * Interactive elements, animations, and transitions.
 */

// --- EmailJS & Cloudinary Configuration ---
// Fill in your credentials here to activate live form submissions and photo uploads.
// See walkthrough.md for step-by-step instructions on setting these up.
const CONFIG = {
    EMAILJS_PUBLIC_KEY: 'OwmvA6xONh2s5ESbm',       // e.g., 'user_12345XYZ'
    EMAILJS_SERVICE_ID: 'service_vgfs2x1',       // e.g., 'service_gmail'
    EMAILJS_TEMPLATE_ID: 'template_96ldb6d',     // e.g., 'template_contact'
    CLOUDINARY_CLOUD_NAME: 'drrzl7evt',   // e.g., 'antikzvole'
    CLOUDINARY_UPLOAD_PRESET: 'AntikZvole' // e.g., 'antik_preset'
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Initialize EmailJS
    if (typeof emailjs !== 'undefined' && CONFIG.EMAILJS_PUBLIC_KEY !== 'YOUR_EMAILJS_PUBLIC_KEY') {
        emailjs.init({
            publicKey: CONFIG.EMAILJS_PUBLIC_KEY,
        });
    }

    // 2. Sticky Header compact mode on scroll
    const header = document.querySelector('.header');
    const handleScrollHeader = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScrollHeader);
    handleScrollHeader(); // Initial check

    // 3. Mobile Navigation Drawer Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileDrawer = document.querySelector('.mobile-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    const toggleMenu = () => {
        const isOpen = menuToggle.classList.toggle('open');
        mobileDrawer.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    menuToggle.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (menuToggle.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    // 4. Scroll Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Animates once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 5. Active Link Highlight on Scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const activeLinkObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-20% 0px -60% 0px'
    });

    sections.forEach(section => activeLinkObserver.observe(section));

    // 6. Interactive Gallery Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active state from current buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');

                // Add fade out animation first
                item.style.opacity = '0';
                item.style.transform = 'scale(0.95)';

                setTimeout(() => {
                    if (filterValue === 'all' || itemCategory === filterValue) {
                        item.classList.remove('hidden');
                        // Trigger fade in after display layout recalculation
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        item.classList.add('hidden');
                    }
                }, 300); // Duration matches CSS scale transition
            });
        });
    });

    // 7. Contact Form Photo Upload & Submission Logic
    const contactForm = document.getElementById('contactForm');
    const fileInput = document.getElementById('photos');
    const fileListContainer = document.getElementById('fileList');
    const formSuccessOverlay = document.getElementById('formSuccess');
    const closeSuccessBtn = document.getElementById('closeSuccessBtn');

    let attachedFiles = [];

    // File input change handler
    fileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);

        files.forEach(file => {
            // Check size (max 5MB per file just to be safe)
            if (file.size > 5 * 1024 * 1024) {
                alert(`Soubor ${file.name} překračuje maximální velikost 5MB.`);
                return;
            }

            // Ensure unique files are listed
            if (!attachedFiles.some(f => f.name === file.name && f.size === file.size)) {
                attachedFiles.push(file);
            }
        });

        updateFileList();
        // Reset inputs files array so it can be re-triggered
        fileInput.value = '';
    });

    // Render list of attached files
    const updateFileList = () => {
        fileListContainer.innerHTML = '';

        attachedFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.classList.add('file-item');

            const nameSpan = document.createElement('span');
            nameSpan.classList.add('file-item-name');
            nameSpan.textContent = file.name;

            const removeBtn = document.createElement('span');
            removeBtn.classList.add('file-item-remove');
            removeBtn.innerHTML = '<i data-lucide="x" class="icon-sm"></i>';
            removeBtn.addEventListener('click', () => {
                attachedFiles.splice(index, 1);
                updateFileList();
            });

            fileItem.appendChild(nameSpan);
            fileItem.appendChild(removeBtn);
            fileListContainer.appendChild(fileItem);
        });

        // Re-init lucide icons for newly added x buttons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    };

    // Cloudinary uploading helper
    const uploadToCloudinary = async (files) => {
        if (CONFIG.CLOUDINARY_CLOUD_NAME === 'YOUR_CLOUDINARY_CLOUD_NAME' || CONFIG.CLOUDINARY_UPLOAD_PRESET === 'YOUR_CLOUDINARY_UPLOAD_PRESET') {
            console.warn('Cloudinary: Chybí konfigurace (CLOUD_NAME nebo UPLOAD_PRESET). Používám mockovaná data nahrávání.');
            await new Promise(resolve => setTimeout(resolve, 1000));
            return files.map((file, i) => `https://res.cloudinary.com/demo/image/upload/v123456789/sample_antique_${i}.jpg`);
        }

        const uploadPromises = files.map(async (file) => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', CONFIG.CLOUDINARY_UPLOAD_PRESET);

            const response = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Nahrávání obrázku ${file.name} selhalo.`);
            }

            const data = await response.json();
            return data.secure_url;
        });

        return Promise.all(uploadPromises);
    };

    // EmailJS email sending helper
    const sendEmail = async (formData, imageUrls) => {
        const templateParams = {
            name: formData.name,
            phone: formData.phone,
            email: formData.email || 'Nebylo zadáno',
            service: formData.service,
            message: formData.message,
            image_urls: imageUrls.length > 0 ? imageUrls.join(',\n') : 'Žádné přiložené fotografie'
        };

        if (CONFIG.EMAILJS_PUBLIC_KEY === 'YOUR_EMAILJS_PUBLIC_KEY' || CONFIG.EMAILJS_SERVICE_ID === 'YOUR_EMAILJS_SERVICE_ID' || CONFIG.EMAILJS_TEMPLATE_ID === 'YOUR_EMAILJS_TEMPLATE_ID') {
            console.warn('EmailJS: Chybí konfigurace. Zpráva nebyla skutečně odeslána. Výpis dat v konzoli.');
            console.log('Odesílané parametry:', templateParams);
            await new Promise(resolve => setTimeout(resolve, 800));
            return { status: 200, text: 'OK (Mocked)' };
        }

        return emailjs.send(CONFIG.EMAILJS_SERVICE_ID, CONFIG.EMAILJS_TEMPLATE_ID, templateParams);
    };

    // Form submit handler
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Basic verification
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const service = document.getElementById('service').value;
        const message = document.getElementById('message').value.trim();

        if (!name || !phone || !message) {
            alert('Vyplňte prosím všechna povinná pole označená hvězdičkou (*).');
            return;
        }

        // Disable button and change state
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Odesílám...</span><i data-lucide="loader-2" class="icon-spin"></i>';
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        try {
            // Step 1: Upload photos to Cloudinary if there are any
            let imageUrls = [];
            if (attachedFiles.length > 0) {
                submitBtn.innerHTML = '<span>Nahrávám fotky...</span><i data-lucide="loader-2" class="icon-spin"></i>';
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
                imageUrls = await uploadToCloudinary(attachedFiles);
            }

            // Step 2: Send email via EmailJS
            submitBtn.innerHTML = '<span>Odesílám zprávu...</span><i data-lucide="loader-2" class="icon-spin"></i>';
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            await sendEmail({ name, phone, email, service, message }, imageUrls);

            // Show success screen
            formSuccessOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';

            // Reset form
            contactForm.reset();
            attachedFiles = [];
            updateFileList();
        } catch (error) {
            console.error('Chyba při odesílání formuláře:', error);
            alert(`Odeslání selhalo: ${error.message || 'Neznámá chyba'}. Zkuste to prosím znovu nebo nás kontaktujte telefonicky.`);
        } finally {
            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    });

    // Success drawer close button
    closeSuccessBtn.addEventListener('click', () => {
        formSuccessOverlay.classList.remove('open');
        document.body.style.overflow = '';
    });
});
