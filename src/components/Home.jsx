import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "@google/model-viewer";
import "../assets/style/style.css";

import co1 from "../assets/images/co1.png";
import co2 from "../assets/images/co2.png";
import cookieGlb from "../assets/images/cookie.glb?url";
import chBg from "../assets/images/c2.jpg";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Force scroll to top on refresh so the initial animation always starts perfectly in the 'O'
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // Aggressively prevent browser from auto-scrolling down after load
    const forceTop = () => window.scrollTo(0, 0);
    window.addEventListener("load", forceTop);
    setTimeout(forceTop, 50);

    // Force top on unload so the browser saves 0 as the scroll position
    window.onbeforeunload = () => {
      window.scrollTo(0, 0);
    };

    let ctx = gsap.context(() => {

      // 1. Initial State for the fixed cookie
      // Moved inside matchMedia to ensure perfect alignment on refresh for both desktop and mobile!

      // 2. Initial Animation (Scene 1 Load)
      gsap.from(".cookie-title span", {
        y: 100,
        opacity: 0,
        stagger: 0.1,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.2
      });
      gsap.from(".cookie-group", {
        scale: 0,
        rotation: -180,
        duration: 1.5,
        delay: 0.4, // Matches the stagger timing for the second 'o'
        ease: "elastic.out(1, 0.5)"
      });

      let mm = gsap.matchMedia();

      // DESKTOP ANIMATIONS
      mm.add("(min-width: 769px)", () => {
        // Initial State for Desktop
        gsap.set(".cookie-group", {
          transformPerspective: 1000, xPercent: -50, yPercent: -50,
          x: "0vw", y: "1.5vh", rotationX: 0, rotationY: 0, rotation: 0, scale: 0.35
        });

        // 1 -> 2: Move to center
        gsap.fromTo(".cookie-group",
          { x: "0vw", y: "1.5vh", scale: 0.35, rotation: 0 },
          {
            scrollTrigger: { trigger: ".scene-two", start: "top bottom", end: "center center", scrub: 3, immediateRender: false },
            x: "-28vw", y: "0vh", scale: 0.65, rotation: 0, ease: "none"
          }
        );

        gsap.from(".scene-two-content", {
          scrollTrigger: { trigger: ".scene-two", start: "top 70%", end: "center center", scrub: 1 },
          x: 100, opacity: 0, ease: "power2.out"
        });

        // 2 -> 3: Move to cards
        gsap.fromTo(".cookie-group",
          { x: "-28vw", y: "0vh", scale: 0.65, rotation: 0 },
          {
            scrollTrigger: { trigger: ".scene-three", start: "top bottom", end: "center center", scrub: 3, immediateRender: false },
            x: "0vw", y: "-5vh", scale: 0.35, rotation: 360, ease: "none"
          }
        );

        // 3 -> End: Stick to the card and scroll up with the page!
        gsap.fromTo(".cookie-group",
          {
            y: "-5vh",
            scale: 0.35
          },
          {
            scrollTrigger: {
              trigger: ".scene-three",
              start: "center center",
              end: "bottom top",
              scrub: true, // No lag, sticks perfectly
              immediateRender: false,
              invalidateOnRefresh: true
            },
            y: () => {
              const scene = document.querySelector(".scene-three");
              const startY = -0.05 * window.innerHeight;
              const dist = (scene.offsetHeight / 2) + (window.innerHeight / 2);
              return (startY - dist) + "px";
            },
            scale: 0.35,
            ease: "none"
          }
        );

        gsap.from(".card-left", {
          scrollTrigger: { trigger: ".scene-three", start: "top 70%", end: "center center", scrub: 1 },
          y: 100, rotation: -15, opacity: 0, ease: "power2.out"
        });
        gsap.from(".card-center-bg", {
          scrollTrigger: { trigger: ".scene-three", start: "top 70%", end: "center center", scrub: 1 },
          y: 100, opacity: 0, ease: "power2.out"
        });
        gsap.from(".card-right", {
          scrollTrigger: { trigger: ".scene-three", start: "top 70%", end: "center center", scrub: 1 },
          y: 100, rotation: 15, opacity: 0, ease: "power2.out"
        });
      }); // End Desktop

      // MOBILE ANIMATIONS
      mm.add("(max-width: 768px)", () => {
        // Initial State for Mobile
        gsap.set(".cookie-group", {
          transformPerspective: 1000, xPercent: -50, yPercent: -50,
          x: "0vw", y: "1vh", rotationX: 0, rotationY: 0, rotation: 0, scale: 0.35
        });

        // 1 -> 2: Move to center
        gsap.fromTo(".cookie-group",
          { x: "0vw", y: "1vh", scale: 0.35, rotation: 0 },
          {
            scrollTrigger: { trigger: ".scene-two", start: "top bottom", end: "center center", scrub: 3, immediateRender: false },
            x: "0vw", y: "-22vh", scale: 0.5, rotation: 0, ease: "none"
          }
        );

        gsap.from(".scene-two-content", {
          scrollTrigger: { trigger: ".scene-two", start: "top 70%", end: "center center", scrub: 1 },
          y: 100, opacity: 0, ease: "power2.out"
        });

        // 2 -> 3: Move to cards — land cookie at TOP of Choco Heaven card
        const getCookieLandY = () => {
          const scene = document.querySelector(".scene-three");
          const centerCard = document.querySelector(".card-center");
          const cookieGroup = document.querySelector(".cookie-group");
          if (!scene || !centerCard || !cookieGroup) return -0.22 * window.innerHeight;

          const sceneH = scene.offsetHeight;
          const cardOffsetInScene = centerCard.offsetTop;
          const cardHeight = centerCard.offsetHeight || 280;
          const cardBgElement = centerCard.querySelector(".card-bg");
          const cardBgHeight = cardBgElement ? cardBgElement.offsetHeight : 200;
          const cardBgOffsetInCard = cardHeight - cardBgHeight;
          const cardBgTopInScene = cardOffsetInScene + cardBgOffsetInCard;

          // Rendered size of the cookie is 75% of cookie-group's width on landing
          const cookieWidth = cookieGroup.offsetWidth || (0.6 * window.innerWidth);
          const cookieCenterInScene = cardBgTopInScene - (cookieWidth * 0.15);
          return cookieCenterInScene - (sceneH / 2);
        };

        gsap.fromTo(".cookie-group",
          { x: "0vw", y: "-22vh", scale: 0.5, rotation: 0 },
          {
            scrollTrigger: { trigger: ".scene-three", start: "top bottom", end: "center center", scrub: 1, immediateRender: false, invalidateOnRefresh: true },
            x: "0vw",
            y: () => getCookieLandY() + "px",
            scale: 0.75, rotation: 360, ease: "none"
          }
        );

        // 3 -> End: Stick to the card and scroll up with the page!
        gsap.fromTo(".cookie-group",
          {
            y: () => getCookieLandY() + "px",
            scale: 0.75
          },
          {
            scrollTrigger: {
              trigger: ".scene-three",
              start: "center center",
              end: "bottom top",
              scrub: true,
              immediateRender: false,
              invalidateOnRefresh: true
            },
            y: () => {
              const scene = document.querySelector(".scene-three");
              const startY = getCookieLandY();
              const dist = (scene.offsetHeight / 2) + (window.innerHeight / 2);
              return (startY - dist) + "px";
            },
            scale: 0.75,
            ease: "none"
          }
        );

        // Simple fade up for stacked cards
        gsap.from(".cookie-card", {
          scrollTrigger: { trigger: ".scene-three", start: "top 70%", end: "center center", scrub: 1 },
          y: 50, opacity: 0, stagger: 0.2, ease: "power2.out"
        });
      }); // End Mobile

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="app-container" ref={containerRef}>


      {/* FIXED 3D COOKIE (Follows user as they scroll) */}
      <div className="cookie-group">
        <model-viewer
          src={cookieGlb}
          alt="3D Cookie"
          camera-controls={false}
          auto-rotate
          camera-orbit="0deg 0deg auto"
          rotation-per-second="5deg"
          disable-zoom
          disable-tap
          shadow-intensity="1"
          environment-image="neutral"
          className="main-cookie floating"
        >
          <div slot="progress-bar"></div>
        </model-viewer>
      </div>

      {/* SCROLLABLE SECTIONS */}

      {/* SCENE 1 */}
      <section
        className="scene scene-one"
        style={{
          backgroundImage: `url(${chBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <h1 className="cookie-title" style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <span className="title-left" style={{ flex: 1, textAlign: "right", marginRight: "-1vw" }}>Co</span>
          <span className="title-center">o</span>
          <span className="title-right" style={{ flex: 1, textAlign: "left", marginLeft: "-1vw" }}>kie</span>
        </h1>
      </section>

      {/* SCENE 2 */}
      <section className="scene scene-two">
        <div className="scene-two-content">
          <h2>TASTE THE <br /> DIFFERENCE.</h2>
          <p className="subtitle">Real Eggs, Real Butter, Real Sugar.</p>
          <p className="desc">
            Cookie Co. was founded in 2020 during the height of the Covid-19 pandemic by Elise and
            Matt Thomas. Working behind the scenes to open the first Cookie Co. location, Elise baked
            her signature cookie recipes using real eggs, real butter, and real cane sugar in her home,
            preparing hundreds of boxes weekly by hand for driveway pick-up.
          </p>
        </div>
      </section>

      {/* SCENE 3 */}
      <section className="scene scene-three">
        <div className="cards-container">

          <div className="cookie-card card-left">
            <img src={co1} alt="Frosted Sugar" className="card-img" />
            <div className="card-bg">
              <h3>Coffee Cookie</h3>
              <button>Buy Now</button>
            </div>
          </div>

          <div className="cookie-card card-center">
            <div className="card-bg card-center-bg">
              <h3>Choco Heaven</h3>
              <button>Buy Now</button>
            </div>
          </div>

          <div className="cookie-card card-right">
            <img src={co2} alt="Oreo Cookie" className="card-img" />
            <div className="card-bg">
              <h3>Butter Cookie</h3>
              <button>Buy Now</button>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;