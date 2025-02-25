import BaseComponent from './BaseComponent';
import { debounce } from '../utils/utils';
const { computePosition, flip, shift } = window.FloatingUIDOM;

const dropdownSelector = '[data-dropdown]';

class Dropdown extends BaseComponent {
  selectors = {
    button: '[data-dropdown-button]',
    container: '[data-dropdown-container]',
  };

  stateClasses = {
    isVisible: 'is-visible',
  };

  stateAttributes = {
    ariaExpanded: 'aria-expanded',
    dropdownHover: 'data-dropdown-hover',
  };

  static openDropdowns = [];
  static globalClickListener = false;
  static hoverableMQ = window.matchMedia('(min-width: 960px)');
  static hoverSupport = Dropdown.evaluateHoverSupport();

  constructor(rootElement) {
    super();
    this.rootElement = rootElement;
    this.rootElement.dropdown = this;
    this.button = this.rootElement.querySelector(this.selectors.button);
    this.container = this.rootElement.querySelector(this.selectors.container);
    this.isHoverable = this.rootElement.hasAttribute(this.stateAttributes.dropdownHover);
    this.hoverListeners = null;
    this.state = this.getProxyState({ isOpen: false });

    this.bindEvents();
  }

  updateUI() {
    const { isOpen } = this.state;
    const { isVisible } = this.stateClasses;
    const { ariaExpanded } = this.stateAttributes;
    const isSubDropdown = this.rootElement.parentElement.closest(dropdownSelector);

    if (Dropdown.openDropdowns.length && !isSubDropdown) {
      Dropdown.closeAll();
    }

    this.button.setAttribute(ariaExpanded, isOpen);

    if (isOpen) {
      // Floating UI
      computePosition(this.button, this.container, {
        middleware: [flip(), shift({ padding: 10 })],
        placement: isSubDropdown ? 'right' : 'bottom',
      }).then(({ x, y }) => {
        Object.assign(this.container.style, {
          left: `${x}px`,
          top: `${y}px`,
        });
      });
      this.container.classList.add(isVisible);
      Dropdown.openDropdowns.push(this);
    } else {
      this.container.classList.remove(isVisible);
      Dropdown.openDropdowns.splice(Dropdown.openDropdowns.indexOf(this), 1);
    }
  }

  toggle() {
    this.state.isOpen = !this.state.isOpen;
  }

  open() {
    this.state.isOpen = true;
  }

  close() {
    this.state.isOpen = false;
  }

  static closeAll() {
    Dropdown.openDropdowns.forEach((dropdown) => {
      dropdown.close();
    });
  }

  addHoverListeners() {
    this.rootElement.addEventListener('mouseenter', () => {
      Dropdown.hoverSupport && this.open();
    });
    this.rootElement.addEventListener('mouseleave', () => {
      Dropdown.hoverSupport && this.close();
    });
    this.hoverListeners = true;
  }

  static evaluateHoverSupport() {
    return (
      Dropdown.hoverableMQ.matches &&
      (window.matchMedia('(any-hover: hover)').matches || !('ontouchstart' in window || navigator.maxTouchPoints > 0))
    );
  }

  bindEvents() {
    if (this.isHoverable) {
      Dropdown.hoverSupport && this.addHoverListeners();

      this.button.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggle();
      });

      return;
    }

    if (Dropdown.globalClickListener) return;

    document.addEventListener('click', (e) => {
      if (e.target.closest(this.selectors.button)) {
        const parent = e.target.closest(dropdownSelector);
        e.preventDefault();
        !parent.hasAttribute(this.stateAttributes.dropdownHover) && parent.dropdown.toggle();
        return;
      }
      if (Dropdown.openDropdowns.length && !e.target.closest(this.selectors.container)) {
        Dropdown.closeAll();
      }
    });

    Dropdown.globalClickListener = true;
  }
}

export default class initDropdown {
  constructor() {
    this.init();
  }

  init() {
    const dropdowns = document.querySelectorAll(dropdownSelector);
    dropdowns.forEach((dropdown) => new Dropdown(dropdown));

    const handleResize = debounce(() => {
      const currentHoverSupport = Dropdown.evaluateHoverSupport();

      if (Dropdown.hoverSupport !== currentHoverSupport) {
        Dropdown.hoverSupport = currentHoverSupport;

        dropdowns.forEach((dropdown) => {
          const instance = dropdown.dropdown;
          if (instance.isHoverable && !instance.hoverListeners) {
            Dropdown.hoverSupport && instance.addHoverListeners();
          }
        });
      }
    }, 300);

    window.addEventListener('resize', () => {
      handleResize();
      Dropdown.openDropdowns.length && Dropdown.closeAll();
    });
  }
}
