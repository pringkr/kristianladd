// Test import of a JavaScript module
// import { example } from '@/js/example'

// Test import of an asset
// import webpackLogo from '@/images/webpack-logo.svg'

// Test import of styles
import '@/styles/index.scss'
import $ from "expose-loader?exposes=$,jQuery!jquery";
import { gsap, ScrollTrigger } from 'gsap/all'
import SplitType from 'split-type'
import Lenis from 'lenis';


$(() => {

  document.addEventListener('readystatechange', event => {
    $('html').css('opacity', 1);
  })

  gsap.registerPlugin(ScrollTrigger);

  initLenis()
  entrance()
  profile()
  projects()
  closing()
  footer()

});

function initLenis() {

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  })

  function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  
  requestAnimationFrame(raf)

  $('footer .scroll-to-top').on('click', function() {
    lenis.scrollTo('.hero');
  })

}

function entrance() {

  let preloaderTextLines = gsap.utils.toArray('.preloader .preloader-text .line');

  gsap.to(preloaderTextLines, {
    y: 0,
    ease: 'power4.in',
  });


  document.addEventListener('readystatechange', event => { 
    if (event.target.readyState === "complete") {

      // Hero Heading
      const profileEntryText = new SplitType('.hero h1');
      $('.hero h1 .char').wrap('<div class="char-wrapper"></div>');

      // Hero Nav
      const navItems = new SplitType('header.nav li');
      $('header.nav li .line').wrap('<div class="line-wrapper"></div>');

      // Timeline
      const tl = gsap.timeline();

      tl
      .set('.preloader .preloader-wrap .preloader-text .line-wrapper', {
        overflow: 'initial',
      })
      .to(preloaderTextLines, {
        y: -100,
        opacity: 0,
        ease: 'power4.inOut',
        duration: 2,
      })
      .to('.preloader-wrap', {
        yPercent: -100,
        rotation: 0.01,
        ease: "expo.inOut",
        duration: 1.5,
      }, '-=1.8')
      .to('.circ .shape', {
        height: 0,
        delay: 0.8,
        ease: "expo.inOut",
      }, '<')
      .from(profileEntryText.chars, {
        yPercent: 100,
        ease: 'power4.inOut',
        stagger: 0.03,
        duration: .5,
      }, '-=1.4')
      .to('.hero .hero-image .mask', {
        width: 0,
        ease: 'power4.inOut',
        duration: .7,
        delay: .2,
      }, '<')
      .from(navItems.lines, {
        yPercent: -100,
        ease: 'power4.inOut',
        duration: .5,
        delay: .4,
      }, '<')
      .to('.hero .hero-image .circleText', {
        opacity: 1,
        ease: 'power4.inOut',
      });

    }
  });

  const heroTl = gsap.timeline({
    ease: 'power4.out',
    scrollTrigger: {
      trigger: '.hero',
      start: '0% 0%',
      scrub: true,
    }
  });

  heroTl
  .to('.hero h1', {
    x: -100 * 2,
    yPercent: -50,
  });

}

function projects() {

  const projectsIntroText = new SplitType('.projects-intro h2 span');

  $('.projects-intro h2 .line').wrap('<div class="line-wrapper"></div>');

  gsap.from(projectsIntroText.lines, {
    yPercent: 100,
    ease: 'power4',
    stagger: 0.2,
    scrollTrigger: {
      trigger: '.projects-intro',
      start: '-=300',
    }
  });

  let mm = gsap.matchMedia();

  mm.add({
    isDesktop: '(min-width: 992px)',
    isTablet: '(max-width: 991px)',
  }, (context) => {
    let { isDesktop, isTablet } = context.conditions;

    let projects = gsap.utils.toArray('.projects .project');

    if ( isDesktop ) {
      let works_section_timeline = gsap.timeline({
        scrollTrigger: {
          trigger: '.projects',
          start: '0% 0%',
          end: '+=5000',
          pin: '.projects',
          scrub: true,
        }
      });

      // hover
      $('.projects .project').each(function() {

        $(this).find('.video-holder').on('mouseenter', function() {
          $(this).find('video').get(0).play();
        })

        $(this).find('.video-holder').on('mouseleave', function() {
          $(this).find('video').get(0).pause();
        })

      })

      let depth_multiplier = 1;
      projects.forEach((project) => {
    
        gsap.set(project, {
          opacity: 0,
          z: -1800 * depth_multiplier,
        })
    
        works_section_timeline.to(project, {
          opacity: 1.5,
          z: 1000,
        }, '-=.35')
    
        depth_multiplier = depth_multiplier + 1;
    
      });
    }
    else if ( isTablet ) {      
      const spacer = 50, minScale = 0.8;
      const distributor = gsap.utils.distribute({ base: minScale, amount: 0.2 });

      projects.forEach((project, index) => {

        const scaleVal = distributor(index, projects[index], projects);

        gsap.to(project, {
          scrollTrigger: {
            trigger: project,
            start: 'top top',
            scrub: true,
            invalidateOnRefresh: true
          },
          ease: 'none',
          scale: scaleVal,
        })

        gsap.to(project, {
          scrollTrigger: {
            trigger: project,
            start: `top-=${50 + (index * 10)}%`,
            end: `bottom-=${50 + (index * 10)}%`,
            scrub: true,
            invalidateOnRefresh: true,
            id: 'video-play',
          },
          ease: 'none',
          onStart: () => {
            project.querySelector('video').play();
            project.classList.add('active');
          },
          onComplete: () => {
            project.querySelector('video').pause();
            project.classList.remove('active');
          },
        });

        ScrollTrigger.create({
          trigger: project,
          start: `top-=${index * spacer} top+=50px`,
          endTrigger: '.projects .list',
          end: `bottom top-=${200 + projects.length * spacer}`,
          pin: true,
          pinSpacing: false,
          invalidateOnRefresh: true
        });
      });
    }

  });

}

function profile() {

  function profileIntro() {

    // Entrance animation
    const profileEntryText = new SplitType('.profile-entry h2', {
      type: 'lines',
    });

    $('.profile-entry h2 .line').wrap('<div class="line-wrapper"></div>');

    const rootconfig = {
      root: null,
      rootMargin: '0px 0px -50% 0px',
    };

    profileEntryText.lines.forEach((el) => {
      gsap.set(el, {
        yPercent: 200,
      });
    })

    const observerbuttons = document.querySelectorAll('.profile-entry');

    const Observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.intersectionRatio > 0) {
            gsap.to(profileEntryText.lines, {
              yPercent: 0,
              ease: "power4",
              stagger: 0.2,
            });
            Observer.unobserve(entry.target);
          }
        });
      }, 
      rootconfig
    );
    
    observerbuttons.forEach(el => {
      Observer.observe(el);
    });

    let mm = gsap.matchMedia(),
        breakpoint = 992;

    mm.add({
      isDesktop: `(min-width: ${breakpoint}px)`,
      isMobile: `(max-width: ${breakpoint - 1}px)`,
      
    }, (context) => {
      let { isDesktop, isMobile } = context.conditions;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.profile-entry',
          start: 'top top',
          end:  isDesktop ? '+=3000' : '+=1000',
          scrub: true,
          pin: '.profile-entry',
          id: 'profile-entry',
        }
      });
      
      tl.to('.profile-entry h2', {
        '--profile-entry-text-size': 2.5,
        ease: 'none',
        smoothOrigin: true
      })
      .from(
        '.profile-entry .catcher', {
        scaleX: 0,
        ease: 'none'
      }, isDesktop ? '-=45%' : '-=90%' );

    });


  }

  function profileMainText() {

    document.addEventListener('readystatechange', event => {
      const profileMainText = new SplitType('.profile-main .intro', {
        type: 'lines',
      });

      $('.profile-main .intro .line').wrap('<div class="line-wrapper"></div>');

      let mm = gsap.matchMedia(),
      breakpoint = 992;
  
      mm.add({
        isDesktop: `(min-width: ${breakpoint}px)`,
        isMobile: `(max-width: ${breakpoint - 1}px)`,
        
      }, (context) => {
        let { isDesktop, isMobile } = context.conditions;
  
        gsap.from(profileMainText.lines, {
          yPercent: 100,
          ease: 'power4',
          stagger: 0.2,
          scrollTrigger: {
            trigger: '.profile-main',
            start:  isDesktop ? '-=500' : '-=700',
            id: 'profile-main-text'
          }
        });
  
      });

    });

  }

  function profileAccordion() {

    let items = gsap.utils.toArray('.profile-main .services .service .service-content');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.services',
        start: "top top",
        end: "+=" + 100 * items.length + "%",
        pin: '.services',
        scrub: true,
      }
    });

    gsap.set('.profile-main .services .service:not(:first-child) .service-content', { height: 0 });

    items.forEach((item, i) => {
      if (items[i + 1]) {
        tl
        .to(item, {
          height: 0
        })
        .to(items[i + 1], {
          height: "auto"
        }, "<")
        .to(item.previousElementSibling.querySelector('svg'), {
          rotate: 360,
        }, "<");
      }
    });

    gsap.set('.services-wrap', { autoAlpha: 1 });

  }

  profileIntro()
  profileMainText()
  profileAccordion()

}

function closing() {
  document.addEventListener('readystatechange', event => {
    const closingText = new SplitType('.closing h2', {
      type: 'lines',
    });

    $('.closing h2 .line').wrap('<div class="line-wrapper"></div>');

    gsap.from(closingText.lines, {
      yPercent: 100,
      ease: 'power4',
      stagger: 0.2,
      scrollTrigger: {
        trigger: '.closing',
        start: '-=250',
      }
    });
  });
}

function footer() {

  function marquee() {
    let currentScroll = 0;
    let isScrollingDown = true;

    gsap.set('.marquee-text svg', {
      yPercent: -50,
      y: 0,
      top: '50%',
    });
  
    let marquee = gsap.to('.marquee-text', {
      xPercent: -100,
      repeat: -1,
      duration: 10,
      ease: "linear"
    }).totalProgress(0.5);

    let symbols = gsap.to('.marquee-text svg', {
      rotate: 360,
      repeat: -1,
      duration: 10,
      ease: "linear"
    }).totalProgress(0.5);
  
    gsap.set('.marquee-inner-wrapper',{
      xPercent: -50
    });
  
    window.addEventListener("scroll", function(){
      
      if ( window.pageYOffset > currentScroll ) {
        isScrollingDown = true;
      } else {
        isScrollingDown = false;
      }
      
      gsap.to(marquee, {
        timeScale: isScrollingDown ? 1 : -1
      });

      gsap.to(symbols, {
        timeScale: isScrollingDown ? 1 : -1
      });
      
      currentScroll = window.pageYOffset
    });
  }

  marquee()
}

// import sageLogo from '@/images/sage.svg'
// const logo = document.createElement('img')
// logo.src = sageLogo

// Appending to the DOM
// const logo = document.createElement('img')
// logo.src = webpackLogo

// const heading = document.createElement('h1')
// heading.textContent = example()

// // Test a background image url in CSS
// const imageBackground = document.createElement('div')
// imageBackground.classList.add('image')

// // Test a public folder asset
// const imagePublic = document.createElement('img')
// imagePublic.src = '/assets/example.png'

// const app = document.querySelector('#root')
// app.append(logo, heading, imageBackground, imagePublic)
