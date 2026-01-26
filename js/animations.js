/**
 * SM art Power Yoga - Scroll Animations
 * Handles scroll-triggered animations using jQuery and Intersection Observer
 */

(function($) {
    'use strict';

    $(document).ready(function() {
        // Initialize scroll animations
        initScrollAnimations();
        
        // Initialize parallax effects
        initParallaxEffect();
        
        // Initialize number counters
        initNumberCounters();
        
        // Initialize typing effect
        initTypingEffect();
    });

    /**
     * Scroll-triggered animations using Intersection Observer
     */
    function initScrollAnimations() {
        // Check if IntersectionObserver is supported
        if ('IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            // Add 'animated' class when element is in viewport
                            $(entry.target).addClass('animated');
                            
                            // Unobserve after animation to prevent re-triggering
                            animationObserver.unobserve(entry.target);
                        }
                    });
                },
                {
                    threshold: 0.15, // Trigger when 15% of element is visible
                    rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters viewport
                }
            );

            // Observe all elements with animation classes
            const animatedElements = document.querySelectorAll(
                '.fade-in-up, .fade-in-left, .fade-in-right, .fade-in-down, .zoom-in, .rotate-in'
            );

            animatedElements.forEach(element => {
                animationObserver.observe(element);
            });

        } else {
            // Fallback for browsers without IntersectionObserver
            scrollAnimationFallback();
        }
    }

    /**
     * Fallback animation using jQuery scroll events
     */
    function scrollAnimationFallback() {
        function checkAnimation() {
            const windowHeight = $(window).height();
            const scrollTop = $(window).scrollTop();

            $('.fade-in-up, .fade-in-left, .fade-in-right, .fade-in-down, .zoom-in, .rotate-in').each(function() {
                const elementTop = $(this).offset().top;
                
                if (scrollTop + windowHeight > elementTop + 100) {
                    $(this).addClass('animated');
                }
            });
        }

        // Check on scroll
        $(window).on('scroll', $.throttle(100, checkAnimation));
        
        // Check on load
        checkAnimation();
    }

    /**
     * Parallax scrolling effect
     */
    function initParallaxEffect() {
        $(window).scroll(function() {
            const scrolled = $(window).scrollTop();
            
            // Parallax for hero section
            $('.hero-section').css('background-position', 'center ' + (scrolled * 0.5) + 'px');
            
            // Parallax for images with data-parallax attribute
            $('[data-parallax]').each(function() {
                const speed = $(this).data('parallax') || 0.5;
                const yPos = -(scrolled * speed);
                $(this).css('transform', `translateY(${yPos}px)`);
            });
        });
    }

    /**
     * Animated number counters
     */
    function initNumberCounters() {
        const counterObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const $counter = $(entry.target);
                        const targetValue = parseInt($counter.data('count')) || 0;
                        const duration = parseInt($counter.data('duration')) || 2000;
                        const prefix = $counter.data('prefix') || '';
                        const suffix = $counter.data('suffix') || '';
                        
                        animateCounter($counter, targetValue, duration, prefix, suffix);
                        counterObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        // Observe all counter elements
        $('.counter[data-count]').each(function() {
            counterObserver.observe(this);
        });
    }

    /**
     * Animate single counter
     */
    function animateCounter($element, targetValue, duration, prefix, suffix) {
        $({ countNum: 0 }).animate(
            { countNum: targetValue },
            {
                duration: duration,
                easing: 'swing',
                step: function() {
                    $element.text(prefix + Math.floor(this.countNum).toLocaleString() + suffix);
                },
                complete: function() {
                    $element.text(prefix + targetValue.toLocaleString() + suffix);
                }
            }
        );
    }

    /**
     * Typing effect for headings
     */
    function initTypingEffect() {
        $('.typing-effect').each(function() {
            const $element = $(this);
            const text = $element.text();
            const speed = $element.data('typing-speed') || 50;
            
            $element.text('');
            $element.css('display', 'inline-block');
            
            let index = 0;
            const typeWriter = setInterval(function() {
                if (index < text.length) {
                    $element.text($element.text() + text.charAt(index));
                    index++;
                } else {
                    clearInterval(typeWriter);
                    $element.css('border-right', 'none');
                }
            }, speed);
        });
    }

    /**
     * Stagger animation for child elements
     */
    window.staggerAnimation = function(parentSelector, childSelector, delay = 100) {
        const $parent = $(parentSelector);
        const $children = $parent.find(childSelector);
        
        const staggerObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        $children.each(function(index) {
                            setTimeout(() => {
                                $(this).addClass('animated');
                            }, index * delay);
                        });
                        staggerObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );

        staggerObserver.observe($parent[0]);
    };

    /**
     * Progress bar animation
     */
    function initProgressBars() {
        const progressObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const $bar = $(entry.target);
                        const width = $bar.data('width') || 0;
                        
                        $bar.css('width', '0%').animate({
                            width: width + '%'
                        }, 1500, 'swing');
                        
                        progressObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        $('.progress-bar[data-width]').each(function() {
            progressObserver.observe(this);
        });
    }

    // Initialize progress bars
    initProgressBars();

    /**
     * Text reveal animation
     */
    function initTextReveal() {
        $('.reveal-text').each(function() {
            const text = $(this).text();
            const words = text.split(' ');
            
            $(this).empty();
            
            words.forEach((word, index) => {
                const $span = $('<span>')
                    .text(word + ' ')
                    .css({
                        opacity: 0,
                        display: 'inline-block'
                    });
                
                $(this).append($span);
                
                setTimeout(() => {
                    $span.animate({ opacity: 1 }, 300);
                }, index * 100);
            });
        });
    }

    /**
     * Hover tilt effect
     */
    $('.tilt-effect').on('mousemove', function(e) {
        const $this = $(this);
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        $this.css({
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`,
            transition: 'transform 0.1s'
        });
    });

    $('.tilt-effect').on('mouseleave', function() {
        $(this).css({
            transform: 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)',
            transition: 'transform 0.5s'
        });
    });

    /**
     * Ripple effect on click
     */
    $('.ripple-effect').on('click', function(e) {
        const $ripple = $('<span class="ripple"></span>');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        $ripple.css({
            width: size,
            height: size,
            top: y,
            left: x
        });
        
        $(this).append($ripple);
        
        setTimeout(() => {
            $ripple.remove();
        }, 600);
    });

    // Add ripple CSS dynamically
    $('<style>')
        .text(`
            .ripple-effect { position: relative; overflow: hidden; }
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple-animation 0.6s ease-out;
                pointer-events: none;
            }
            @keyframes ripple-animation {
                to { transform: scale(2); opacity: 0; }
            }
        `)
        .appendTo('head');

    /**
     * Image fade-in on load
     */
    $('img').on('load', function() {
        $(this).addClass('img-loaded');
    }).each(function() {
        if (this.complete) {
            $(this).trigger('load');
        }
    });

    /**
     * Scroll progress indicator
     */
    function updateScrollProgress() {
        const windowHeight = $(window).height();
        const documentHeight = $(document).height();
        const scrollTop = $(window).scrollTop();
        const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
        
        $('.scroll-progress').css('width', scrollPercent + '%');
    }

    // Add scroll progress bar if element exists
    if ($('.scroll-progress').length) {
        $(window).on('scroll', $.throttle(50, updateScrollProgress));
    }

    /**
     * jQuery throttle function (for performance)
     */
    $.throttle = function(delay, fn) {
        let lastCall = 0;
        return function(...args) {
            const now = new Date().getTime();
            if (now - lastCall < delay) {
                return;
            }
            lastCall = now;
            return fn(...args);
        };
    };

    /**
     * Entrance animation on page load
     */
    $(window).on('load', function() {
        $('body').addClass('page-loaded');
        
        // Animate main elements
        $('.hero-section h1').addClass('animated');
        $('.hero-section p').addClass('animated');
        $('.hero-section .btn').addClass('animated');
    });

})(jQuery);