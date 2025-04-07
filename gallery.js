// Improved Gallery Animation JavaScript with Better Transitions
document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.querySelector(".gallery");
  const prevBtn = document.querySelector(".gallery-nav.prev");
  const nextBtn = document.querySelector(".gallery-nav.next");
  const items = document.querySelectorAll(".gallery-item");
  const indicators = document.querySelectorAll(".indicator-dot");

  // Return early if no gallery or items
  if (!gallery || items.length === 0) return;

  // Set initial state
  let currentIndex = 0;
  let autoScrollInterval = null;
  let isManualScrolling = false;
  let touchStartX = 0;
  let touchEndX = 0;

  // Calculate the width of each item plus gap
  const getItemWidth = () => {
    if (items.length === 0) return 0;
    const item = items[0];
    const style = window.getComputedStyle(item);
    const width = item.offsetWidth;
    const marginRight = parseInt(style.marginRight) || 0;
    const gap = 20; // Same as the gap in CSS
    return width + gap;
  };

  // Scroll to a specific item
  const scrollToItem = (index, smooth = true) => {
    // Ensure index is within bounds with wrap-around
    if (index < 0) index = items.length - 1;
    if (index >= items.length) index = 0;

    currentIndex = index;
    const scrollPosition = index * getItemWidth();

    // Add scale effect to current item
    items.forEach((item, idx) => {
      if (idx === currentIndex) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    gallery.scrollTo({
      left: scrollPosition,
      behavior: smooth ? "smooth" : "auto",
    });

    // Update indicators with animation
    updateIndicators();
  };

  // Update the indicator dots
  const updateIndicators = () => {
    if (!indicators.length) return;

    indicators.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });
  };

  // Event listeners for navigation buttons with improved animations
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      // Add button press effect
      prevBtn.style.transform = "translateY(-50%) scale(0.95)";
      setTimeout(() => {
        prevBtn.style.transform = "translateY(-50%) scale(1)";
      }, 150);

      isManualScrolling = true;
      clearAutoScroll();
      scrollToItem(currentIndex - 1);

      // Restart auto-scroll after a delay
      setTimeout(() => {
        isManualScrolling = false;
        startAutoScroll();
      }, 5000);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      // Add button press effect
      nextBtn.style.transform = "translateY(-50%) scale(0.95)";
      setTimeout(() => {
        nextBtn.style.transform = "translateY(-50%) scale(1)";
      }, 150);

      isManualScrolling = true;
      clearAutoScroll();
      scrollToItem(currentIndex + 1);

      // Restart auto-scroll after a delay
      setTimeout(() => {
        isManualScrolling = false;
        startAutoScroll();
      }, 5000);
    });
  }

  // Event listeners for indicator dots with improved feedback
  indicators.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      // Add a small scale effect when clicked
      dot.style.transform = "scale(0.8)";
      setTimeout(() => {
        dot.style.transform = "";
      }, 150);

      isManualScrolling = true;
      clearAutoScroll();
      scrollToItem(index);

      // Restart auto-scroll after a delay
      setTimeout(() => {
        isManualScrolling = false;
        startAutoScroll();
      }, 5000);
    });
  });

  // Handle touch events for mobile swipe
  gallery.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
      clearAutoScroll();
    },
    { passive: true }
  );

  gallery.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();

      setTimeout(() => {
        isManualScrolling = false;
        startAutoScroll();
      }, 5000);
    },
    { passive: true }
  );

  const handleSwipe = () => {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      // Swipe left - go to next
      scrollToItem(currentIndex + 1);
    } else if (touchEndX > touchStartX + swipeThreshold) {
      // Swipe right - go to previous
      scrollToItem(currentIndex - 1);
    }
  };

  // Start auto-scrolling with improved transition between first and last
  const startAutoScroll = () => {
    if (autoScrollInterval) clearInterval(autoScrollInterval);

    // Only start auto-scroll if we have enough items
    if (items.length <= 1) return;

    autoScrollInterval = setInterval(() => {
      if (isManualScrolling) return;

      // Move to next item or loop back to beginning
      let nextIndex = currentIndex + 1;
      if (nextIndex >= items.length) {
        nextIndex = 0;
      }

      scrollToItem(nextIndex);
    }, 5000); // Change slide every 5 seconds
  };

  // Clear auto-scrolling
  const clearAutoScroll = () => {
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval);
      autoScrollInterval = null;
    }
  };

  // Add this function to handle keyboard navigation
  const handleKeyNavigation = (e) => {
    if (e.key === "ArrowLeft") {
      isManualScrolling = true;
      clearAutoScroll();
      scrollToItem(currentIndex - 1);

      setTimeout(() => {
        isManualScrolling = false;
        startAutoScroll();
      }, 5000);
    } else if (e.key === "ArrowRight") {
      isManualScrolling = true;
      clearAutoScroll();
      scrollToItem(currentIndex + 1);

      setTimeout(() => {
        isManualScrolling = false;
        startAutoScroll();
      }, 5000);
    }
  };

  // Add keyboard navigation
  document.addEventListener("keydown", handleKeyNavigation);

  // Mouse enter/leave events for gallery
  gallery.addEventListener("mouseenter", () => {
    clearAutoScroll();
  });

  gallery.addEventListener("mouseleave", () => {
    if (!isManualScrolling) {
      startAutoScroll();
    }
  });

  // Initialize
  updateIndicators();
  startAutoScroll();

  // Add active class to current item
  scrollToItem(0, false);

  // Optional: Pause auto-scroll when tab is not visible
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      clearAutoScroll();
    } else if (!isManualScrolling) {
      startAutoScroll();
    }
  });

  // Optional: Add a small animation to indicators on page load
  indicators.forEach((dot, index) => {
    setTimeout(() => {
      dot.style.transform = "scale(1.2)";
      setTimeout(() => {
        dot.style.transform = "";
      }, 300);
    }, 1000 + index * 100);
  });
});
