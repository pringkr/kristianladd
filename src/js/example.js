$(() => {

  const magnetic = (el, magText = false) => {
    let target;
    let span;
    if (el.nodeType) {
      target = el;
    } else {
      target = document.querySelector(el);
    }
  
    if (magText) {
      span = document.createElement("span");
      span.innerText = target.innerText;
      target.innerHTML = "";
      target.insertAdjacentElement("afterbegin", span);
      gsap.set(span, {
        pointerEvents: "none",
        display: "block"
      });
    }
  
    const { left, top, height, width } = target.getBoundingClientRect();
  
    const magnetize = (val) => {
      const dist = gsap.utils.normalize(0, width, Math.abs(val));
      const interp = gsap.utils.interpolate([1, 0.4, 0], dist);
      return interp;
    };
  
    const enterEvent = (e) => {
      const mousePosition = { x: e.pageX, y: e.pageY };
      target.addEventListener("mousemove", moveEvent);
      target.addEventListener("mouseleave", leaveEvent);
    };
  
    const moveEvent = (e) => {
      const mousePosition = { x: e.pageX, y: e.pageY };
      const relX = mousePosition.x - left - width / 2;
      const relY = mousePosition.y - top - height / 2;
      const moveX = magnetize(relX);
      const moveY = magnetize(relY);
      gsap.to(target, {
        x: moveX * relX,
        y: moveY * relY
      });
  
      if (magText) {
        gsap.to(target.querySelector("span"), {
          x: moveX * relX * 0.3,
          y: moveY * relY * 0.2
        });
      }
    };
  
    const leaveEvent = (e) => {
      const mousePosition = { x: e.pageX, y: e.pageY };
      const relX = mousePosition.x - left - width / 2;
      const relY = mousePosition.y - top - height / 2;
  
      const dist = Math.sqrt(Math.pow(relX, 2) + Math.pow(relY, 2));
  
      const calcFactor = gsap.utils.pipe(
        gsap.utils.clamp(10, 170),
        gsap.utils.mapRange(10, 170, 0.8, 1.75)
      );
      const factor = calcFactor(dist);
      target.removeEventListener("mousemove", moveEvent);
      target.removeEventListener("mouseleave", leaveEvent);
      gsap.to(target, {
        x: 0,
        y: 0,
        ease: `elastic.out(${factor}, 0.5)`,
        duration: 1
      });
  
      if (magText) {
        gsap.to(target.querySelector("span"), {
          x: 0,
          y: 0,
          ease: `elastic.out(${factor}, 0.5)`,
          duration: 1
        });
      }
    };
  
    target.addEventListener("mouseenter", enterEvent);
  };

});