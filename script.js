
document.addEventListener('DOMContentLoaded', () => {

  // =========================================
  // GENERAL SETTINGS
  // =========================================

  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  const entry = document.getElementById('entry');
  const enterButton = document.getElementById('enter-button');
  const typewriter = document.getElementById('typewriter');
  const attribution = document.getElementById('entry-attribution');


  // =========================================
  // 1. TWO-LINE NATURAL TYPEWRITER ANIMATION
  // =========================================

  if (entry && enterButton && typewriter) {

    const returningToSection = window.location.hash !== '';

    if (returningToSection) {
      document.body.classList.add('entered');
      entry.remove();
    } else {
      document.body.style.overflow = 'hidden';

      // Read the existing quotation from index.html.
      // Split it into two lines after the comma.
      const quote = typewriter.dataset.text || '';
      const commaPosition = quote.indexOf(',');

      const firstLine = commaPosition === -1
        ? quote
        : quote.slice(0, commaPosition + 1);

      const secondLine = commaPosition === -1
        ? ''
        : quote.slice(commaPosition + 1).trim();

      // Keep each line together on desktop and mobile.
      const statement = typewriter.closest('.entry-statement');

      statement.style.fontSize = 'clamp(12px, 2.55vw, 35px)';
      statement.style.lineHeight = '1.55';

      typewriter.style.display = 'inline-block';
      typewriter.style.maxWidth = '100%';
      typewriter.textContent = '';

      const lineOneElement = document.createElement('span');
      const lineTwoElement = document.createElement('span');

      [lineOneElement, lineTwoElement].forEach(line => {
        line.style.display = 'block';
        line.style.whiteSpace = 'nowrap';
      });

      const lineOneText = document.createTextNode('');
      const lineTwoText = document.createTextNode('');

      lineOneElement.appendChild(lineOneText);
      lineTwoElement.appendChild(lineTwoText);

      // Move the blinking cursor to whichever line is typing.
      const cursor = statement.querySelector('.cursor');

      if (cursor) {
        lineOneElement.appendChild(cursor);
      }

      typewriter.append(lineOneElement, lineTwoElement);

      const showAttributionAndEnter = () => {

        if (attribution) {
          attribution.classList.add('is-visible');
        }

        window.setTimeout(() => {
          enterButton.classList.add('is-visible');
        }, reducedMotion ? 0 : 650);
      };

      if (reducedMotion) {

        lineOneText.textContent = firstLine;
        lineTwoText.textContent = secondLine;

        if (cursor) {
          lineTwoElement.appendChild(cursor);
        }

        showAttributionAndEnter();

      } else {

        const lines = [firstLine, secondLine];
        const textNodes = [lineOneText, lineTwoText];

        let currentLine = 0;
        let characterIndex = 0;

        const typeNextLetter = () => {

          const currentText = lines[currentLine];

          if (characterIndex >= currentText.length) {

            if (currentLine === 0 && secondLine) {

              // Pause, move the cursor, and start line two.
              currentLine = 1;
              characterIndex = 0;

              if (cursor) {
                lineTwoElement.appendChild(cursor);
              }

              window.setTimeout(typeNextLetter, 500);
              return;
            }

            // Finish the animation.
            window.setTimeout(showAttributionAndEnter, 550);
            return;
          }

          const character = currentText.charAt(characterIndex);

          textNodes[currentLine].textContent += character;
          characterIndex++;

          // Human-like typing rhythm.
          let delay = 65 + Math.random() * 75;

          if (character === ' ') {
            delay = 90 + Math.random() * 65;
          }

          if (character === ',') {
            delay = 200 + Math.random() * 150;
          }

          if (character === '.') {
            delay = 400 + Math.random() * 150;
          }

          // Occasional hesitation.
          if (
            characterIndex % 13 === 0 &&
            character !== ' ' &&
            character !== '.'
          ) {
            delay += 110 + Math.random() * 120;
          }

          window.setTimeout(typeNextLetter, delay);
        };

        // Initial pause before typing.
        window.setTimeout(typeNextLetter, 700);
      }

      // =========================================
      // ENTER THE WEBSITE
      // =========================================

      enterButton.addEventListener('click', () => {

        document.body.style.overflow = '';
        document.body.classList.add('entered');

        window.setTimeout(() => {
          if (entry.isConnected) {
            entry.remove();
          }
        }, reducedMotion ? 0 : 750);

      });
    }
  }


  // =========================================
  // 2. SCROLL FADE-IN ANIMATIONS
  // =========================================

  const revealElements = document.querySelectorAll('.reveal');

  if (
    reducedMotion ||
    !('IntersectionObserver' in window)
  ) {

    revealElements.forEach(element => {
      element.classList.add('visible');
    });

  } else {

    const observer = new IntersectionObserver(entries => {

      entries.forEach(entryItem => {

        if (entryItem.isIntersecting) {
          entryItem.target.classList.add('visible');
          observer.unobserve(entryItem.target);
        }

      });

    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -45px 0px'
    });

    revealElements.forEach(element => {
      observer.observe(element);
    });
  }


  // =========================================
  // 3. NAME DROP WHEN SCROLLING UP
  // =========================================

  const heroName = document.querySelector('.hero h1');

  if (heroName) {

    let previousScrollPosition = window.scrollY;
    let scrollScheduled = false;

    const header = document.querySelector('.topbar');

    const nameIsVisible = () => {

      const rectangle = heroName.getBoundingClientRect();

      const headerHeight = header
        ? header.getBoundingClientRect().height
        : 80;

      return (
        rectangle.bottom > headerHeight + 10 &&
        rectangle.top < window.innerHeight - 50
      );
    };

    let wasNameVisible = nameIsVisible();

    if (!wasNameVisible && !reducedMotion) {
      heroName.style.opacity = '0';
    }

    const dropName = () => {

      if (reducedMotion) {
        heroName.style.opacity = '1';
        return;
      }

      // Cancel any earlier animation.
      heroName.getAnimations().forEach(animation => {
        animation.cancel();
      });

      heroName.style.opacity = '1';

      // Drop the name from above its normal position.
      heroName.animate([

        {
          opacity: 0,
          transform: 'translateY(-55px)',
          offset: 0
        },

        {
          opacity: 0,
          transform: 'translateY(-55px)',
          offset: 0.28
        },

        {
          opacity: 1,
          transform: 'translateY(10px)',
          offset: 0.76
        },

        {
          opacity: 1,
          transform: 'translateY(-4px)',
          offset: 0.90
        },

        {
          opacity: 1,
          transform: 'translateY(0px)',
          offset: 1
        }

      ], {
        duration: 1100,
        easing: 'cubic-bezier(0.22, 0.68, 0.18, 1)',
        fill: 'none'
      });
    };

    const checkNamePosition = () => {

      const currentPosition = window.scrollY;

      const scrollingUp =
        currentPosition < previousScrollPosition - 1;

      const visibleNow = nameIsVisible();

      if (document.body.classList.contains('entered')) {

        // Hide the name after it leaves the screen.
        if (
          !visibleNow &&
          wasNameVisible &&
          !reducedMotion
        ) {
          heroName.style.opacity = '0';
        }

        // Animate when it returns into view.
        if (visibleNow && !wasNameVisible) {

          if (scrollingUp) {
            dropName();
          } else {
            heroName.style.opacity = '1';
          }
        }
      }

      wasNameVisible = visibleNow;
      previousScrollPosition = currentPosition;
      scrollScheduled = false;
    };

    window.addEventListener('scroll', () => {

      if (!scrollScheduled) {
        scrollScheduled = true;
        window.requestAnimationFrame(checkNamePosition);
      }

    }, { passive: true });

    window.addEventListener('resize', () => {

      wasNameVisible = nameIsVisible();

      if (wasNameVisible) {
        heroName.style.opacity = '1';
      }

    });

  }


  // =========================================
  // 4. NAVIGATION MENU
  // =========================================

  const menu = document.getElementById('menu');

  if (menu) {

    menu.querySelectorAll('a').forEach(link => {

      link.addEventListener('click', () => {
        menu.open = false;
      });

    });

  }

});
