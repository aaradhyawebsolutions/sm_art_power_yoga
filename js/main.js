/**
 * SM art Power Yoga - Main JavaScript
 * Handles core functionality and interactions
 */

(function($) {
    'use strict';

    // Initialize when DOM is ready
    $(document).ready(function() {
        
        // Navbar scroll effect
        initNavbarScroll();
        
        // Smooth scrolling for anchor links
        initSmoothScroll();
        
        // Mobile menu toggle animation
        initMobileMenu();
        
        // Back to top button
        initBackToTop();
        
        // Counter animation
        initCounterAnimation();
        
        // Initialize tooltips and popovers
        initBootstrapComponents();
        
        // Lazy loading images
        initLazyLoading();
        
        // Current year in footer
        updateCopyrightYear();
        
        // Active navigation link
        setActiveNavLink();
    });

    /**
     * Navbar scroll effect - Add shadow and change background on scroll
     */
    function initNavbarScroll() {
        $(window).scroll(function() {
            if ($(this).scrollTop() > 50) {
                $('.navbar').addClass('scrolled');
            } else {
                $('.navbar').removeClass('scrolled');
            }
        });
    }

    /**
     * Smooth scrolling for anchor links
     */
    function initSmoothScroll() {
        $('a[href*="#"]:not([href="#"])').click(function(e) {
            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && 
                location.hostname == this.hostname) {
                
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                
                if (target.length) {
                    e.preventDefault();
                    
                    $('html, body').animate({
                        scrollTop: target.offset().top - 70
                    }, 800, 'swing', function() {
                        // Update URL hash
                        if (history.pushState) {
                            history.pushState(null, null, target.selector);
                        }
                    });
                    
                    // Close mobile menu if open
                    if ($('.navbar-toggler').is(':visible')) {
                        $('.navbar-collapse').collapse('hide');
                    }
                }
            }
        });
    }

    /**
     * Mobile menu animations
     */
    function initMobileMenu() {
        $('.navbar-toggler').click(function() {
            $(this).toggleClass('active');
        });
        
        // Close menu when clicking outside
        $(document).click(function(event) {
            var clickover = $(event.target);
            var navbar = $('.navbar-collapse');
            var opened = navbar.hasClass('show');
            
            if (opened === true && !clickover.hasClass('navbar-toggler') && 
                clickover.parents('.navbar-collapse').length === 0) {
                navbar.collapse('hide');
                $('.navbar-toggler').removeClass('active');
            }
        });
        
        // Animate menu items on open
        $('.navbar-collapse').on('shown.bs.collapse', function() {
            $('.nav-item').each(function(index) {
                $(this).css({
                    'animation': 'slideInRight 0.5s ease forwards',
                    'animation-delay': (index * 0.1) + 's',
                    'opacity': '0'
                });
            });
        });
    }

    /**
     * Back to top button functionality
     */
    function initBackToTop() {
        // Create back to top button if it doesn't exist
        if ($('#backToTop').length === 0) {
            $('body').append('<button id="backToTop" title="Back to Top"><i class="fas fa-arrow-up"></i></button>');
        }
        
        // Show/hide button based on scroll position
        $(window).scroll(function() {
            if ($(this).scrollTop() > 300) {
                $('#backToTop').addClass('show');
            } else {
                $('#backToTop').removeClass('show');
            }
        });
        
        // Scroll to top on click
        $('#backToTop').click(function(e) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: 0
            }, 600, 'swing');
        });
    }

    /**
     * Animated counters for statistics
     */
    function initCounterAnimation() {
        $('.counter').each(function() {
            var $this = $(this);
            var countTo = $this.attr('data-count');
            
            if (countTo) {
                var observer = new IntersectionObserver(function(entries) {
                    entries.forEach(function(entry) {
                        if (entry.isIntersecting) {
                            $({ countNum: 0 }).animate({
                                countNum: countTo
                            }, {
                                duration: 2000,
                                easing: 'swing',
                                step: function() {
                                    $this.text(Math.floor(this.countNum));
                                },
                                complete: function() {
                                    $this.text(this.countNum);
                                }
                            });
                            observer.unobserve(entry.target);
                        }
                    });
                });
                
                observer.observe($this[0]);
            }
        });
    }

    /**
     * Initialize Bootstrap components
     */
    function initBootstrapComponents() {
        // Initialize tooltips
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function(tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
        
        // Initialize popovers
        var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
        popoverTriggerList.map(function(popoverTriggerEl) {
            return new bootstrap.Popover(popoverTriggerEl);
        });
    }

    /**
     * Lazy loading for images
     */
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            var imageObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        var image = entry.target;
                        if (image.dataset.src) {
                            image.src = image.dataset.src;
                            image.removeAttribute('data-src');
                        }
                        imageObserver.unobserve(image);
                    }
                });
            });
            
            document.querySelectorAll('img[data-src]').forEach(function(img) {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for older browsers
            $('img[data-src]').each(function() {
                $(this).attr('src', $(this).data('src'));
            });
        }
    }

    /**
     * Update copyright year
     */
    function updateCopyrightYear() {
        var currentYear = new Date().getFullYear();
        $('.copyright-year').text(currentYear);
        
        // If element doesn't exist, update any year in footer
        if ($('.copyright-year').length === 0) {
            $('footer p:contains("2026")').html(function(_, html) {
                return html.replace('2026', currentYear);
            });
        }
    }

    /**
     * Set active navigation link based on current page
     */
    function setActiveNavLink() {
        var currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        $('.nav-link').each(function() {
            var linkPage = $(this).attr('href').split('/').pop();
            
            if (linkPage === currentPage || 
                (currentPage === '' && linkPage === 'index.html')) {
                $(this).addClass('active');
            } else {
                $(this).removeClass('active');
            }
        });
    }

    /**
     * Preloader (optional)
     */
    function initPreloader() {
        $(window).on('load', function() {
            $('.preloader').fadeOut('slow', function() {
                $(this).remove();
            });
        });
    }

    /**
     * Gallery lightbox functionality
     */
    window.openGalleryModal = function(imageSrc, title) {
        // Create modal if it doesn't exist
        if ($('#galleryModal').length === 0) {
            var modalHTML = `
                <div class="modal fade" id="galleryModal" tabindex="-1">
                    <div class="modal-dialog modal-dialog-centered modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title"></h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body text-center">
                                <img src="" class="img-fluid rounded" alt="">
                            </div>
                        </div>
                    </div>
                </div>
            `;
            $('body').append(modalHTML);
        }
        
        // Update modal content
        $('#galleryModal .modal-title').text(title || 'Gallery Image');
        $('#galleryModal img').attr('src', imageSrc).attr('alt', title || 'Gallery Image');
        
        // Show modal
        var modal = new bootstrap.Modal(document.getElementById('galleryModal'));
        modal.show();
    };

    /**
     * Schedule filter functionality
     */
    window.filterSchedule = function(location) {
        if (location === 'all') {
            $('.schedule-row').fadeIn();
        } else {
            $('.schedule-row').hide();
            $('.schedule-row[data-location="' + location + '"]').fadeIn();
        }
        
        // Update active button
        $('.filter-btn').removeClass('active');
        $('.filter-btn[data-filter="' + location + '"]').addClass('active');
    };

    /**
     * Contact form phone number formatting
     */
    function formatPhoneNumber() {
        $('input[type="tel"]').on('input', function() {
            var value = $(this).val().replace(/\D/g, '');
            if (value.length > 10) {
                value = value.slice(0, 10);
            }
            $(this).val(value);
        });
    }

    // Initialize phone formatting
    formatPhoneNumber();

    /**
     * Testimonial carousel auto-play (if using carousel)
     */
    function initTestimonialCarousel() {
        if ($('.testimonial-carousel').length) {
            $('.testimonial-carousel').carousel({
                interval: 5000,
                pause: 'hover'
            });
        }
    }

    /**
     * FAQ accordion scroll to active
     */
    $('.accordion-button').on('click', function() {
        setTimeout(function() {
            $('html, body').animate({
                scrollTop: $(this).offset().top - 100
            }, 300);
        }.bind(this), 350);
    });

    /**
     * Print functionality
     */
    window.printPage = function() {
        window.print();
    };

    /**
     * Share functionality
     */
    window.shareOnSocial = function(platform) {
        var url = encodeURIComponent(window.location.href);
        var title = encodeURIComponent(document.title);
        var shareUrl;
        
        switch(platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/share/1GC3rmP5UX//sharer/sharer.php?u=${url}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${title}%20${url}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                break;
        }
        
        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    };

    // Performance optimization: Debounce scroll events
    function debounce(func, wait) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
    }

    // Apply debounce to scroll handler
    $(window).on('scroll', debounce(function() {
        // Custom scroll events can be added here
    }, 100));

})(jQuery);