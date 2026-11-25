/**
 * Shared Framer Motion animation tokens and reusable variants for Havenly.
 * Timing is calibrated for a calm, architectural, high-luxury editorial feel.
 */

export const LUXURY_EASE = [0.22, 1, 0.36, 1];

export const LUXURY_SPRING = {
  type: 'spring',
  stiffness: 260,
  damping: 28,
  mass: 0.9,
};

export const MICRO_SPRING = {
  type: 'spring',
  stiffness: 420,
  damping: 32,
};

export const VIEWPORT_ONCE = {
  once: true,
  amount: 0.16,
};

export const VIEWPORT_CARD = {
  once: true,
  amount: 0.1,
};

// Portal / page-level crossfade transition
export const pageTransitionVariants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: LUXURY_EASE },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.25, ease: LUXURY_EASE },
  },
};

// Hero staggered entrance
export const heroContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.11,
      delayChildren: 0.12,
    },
  },
};

export const heroItemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: LUXURY_EASE },
  },
};

export const heroImageVariants = {
  hidden: { opacity: 0, scale: 1.08 },
  visible: {
    opacity: 1,
    scale: 1.02,
    transition: { duration: 1.25, ease: LUXURY_EASE },
  },
};

// Section headers scroll reveal
export const sectionHeaderVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.09,
    },
  },
};

export const sectionHeaderItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: LUXURY_EASE },
  },
};

// Generic stagger container factory
export const createStaggerContainer = (staggerChildren = 0.08, delayChildren = 0.05) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

// Standard card fade-up reveal
export const fadeUpCardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: LUXURY_EASE },
  },
};

// Subtle slide + fade for asymmetric editorial property cards
export const slideFadeVariants = (direction = 'up') => {
  const offset = {
    up: { y: 28, x: 0 },
    left: { y: 0, x: -24 },
    right: { y: 0, x: 24 },
  }[direction] || { y: 24, x: 0 };

  return {
    hidden: { opacity: 0, ...offset },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.72, ease: LUXURY_EASE },
    },
  };
};

// Timeline line draw & step reveal
export const timelineLineVariants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.95, delay: 0.2, ease: LUXURY_EASE },
  },
};

export const timelineStepVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: LUXURY_EASE },
  },
};

// Modals & Overlays
export const modalBackdropVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.26, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

export const modalPanelVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: LUXURY_SPRING,
  },
  exit: {
    opacity: 0,
    y: 12,
    scale: 0.98,
    transition: { duration: 0.18, ease: 'easeIn' },
  },
};

// Expandable drawer / accordion
export const drawerVariants = {
  hidden: { opacity: 0, height: 0, overflow: 'hidden' },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: {
      height: { duration: 0.36, ease: LUXURY_EASE },
      opacity: { duration: 0.26, delay: 0.06 },
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    overflow: 'hidden',
    transition: {
      height: { duration: 0.28, ease: LUXURY_EASE },
      opacity: { duration: 0.18 },
    },
  },
};

// Dropdown popover
export const dropdownVariants = {
  hidden: { opacity: 0, y: -6, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: LUXURY_EASE },
  },
  exit: {
    opacity: 0,
    y: -4,
    scale: 0.97,
    transition: { duration: 0.15, ease: 'easeIn' },
  },
};

// Dashboard tab switch
export const tabContentVariants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: LUXURY_EASE },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.2, ease: LUXURY_EASE },
  },
};

// Reusable hover/tap props
export const cardHoverLift = {
  y: -5,
  transition: LUXURY_SPRING,
};

export const buttonTapScale = {
  scale: 0.97,
  transition: MICRO_SPRING,
};

export const buttonHoverScale = {
  scale: 1.02,
  transition: MICRO_SPRING,
};
