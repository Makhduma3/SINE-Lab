// SINE Lab beetle: a little yellow bug that wanders the page, runs from the cursor,
// and goes home to rest. Drag its house anywhere; the header button sends it home or lets it out.
/* ===== Beetle home: draggable, remembers where you put it ===== */
(function(){
  const home = document.getElementById("bugHome"); if (!home) return;
  const size = () => [home.offsetWidth || 56, home.offsetHeight || 52];
  let fx = null, fy = null;                    // position as a fraction of the screen, so it survives resizing
  try { const v = JSON.parse(localStorage.getItem("beetle-home") || "null"); if (v && isFinite(v.x) && isFinite(v.y)) { fx = v.x; fy = v.y; } } catch(e){}
  function place(px, py){
    const [w, h] = size();
    px = Math.max(4, Math.min(innerWidth - w - 4, px)); py = Math.max(4, Math.min(innerHeight - h - 4, py));
    home.style.setProperty("--hx", px + "px"); home.style.setProperty("--hy", py + "px");
    return [px, py];
  }
  function fromFractions(){
    const [w, h] = size();
    if (fx === null) place(14, innerHeight - h - 18);
    else place(fx * innerWidth, fy * innerHeight);
  }
  fromFractions(); addEventListener("resize", fromFractions);
  let drag = null;
  home.addEventListener("pointerdown", e => {
    if (e.button !== 0) return;
    const r = home.getBoundingClientRect();
    drag = { dx: e.clientX - r.left, dy: e.clientY - r.top, moved: false };
    home.setPointerCapture(e.pointerId); home.classList.add("dragging"); e.preventDefault();
  });
  home.addEventListener("pointermove", e => {
    if (!drag) return;
    drag.moved = true;
    place(e.clientX - drag.dx, e.clientY - drag.dy);
  });
  const end = e => {
    if (!drag) return;
    home.classList.remove("dragging");
    const r = home.getBoundingClientRect();
    fx = r.left / innerWidth; fy = r.top / innerHeight;
    try { localStorage.setItem("beetle-home", JSON.stringify({ x: fx, y: fy })); } catch(err){}
    drag = null;
  };
  home.addEventListener("pointerup", end); home.addEventListener("pointercancel", end);
})();

/* ===== Yellow bug: wanders the page, runs from the cursor, and goes home (left side) to rest ===== */
(function(){
  const el = document.getElementById("roamer"), home = document.getElementById("bugHome");
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) { el.remove(); home.remove(); return; }
  let W = innerWidth, H = innerHeight;
  addEventListener("resize", () => { W = innerWidth; H = innerHeight; });
  const door = () => { const r = home.getBoundingClientRect(); return [r.left + r.width * .5, r.top + r.height * .92]; };
  // start: step out of the front door
  let [x, y] = door(); let ang = -0.2;
  let speed = 0, mode = "wander", pauseUntil = 0, fleeUntil = 0, restUntil = 0, nextTrip = performance.now() + 25000 + Math.random() * 20000;
  let scares = 0, scareReset = 0, last = 0, mx = -999, my = -999;
  addEventListener("pointermove", e => { mx = e.clientX; my = e.clientY; }, { passive: true });
  const turnTo = (a, k) => { ang += Math.atan2(Math.sin(a - ang), Math.cos(a - ang)) * k; };
  function goHome(now){ mode = "home"; pauseUntil = 0; }
  let stayIn = false;
  const notify = () => window.dispatchEvent(new CustomEvent("beetle", { detail: { home: mode === "inside" || mode === "home", inside: mode === "inside", stayIn } }));
  window.labBeetle = {
    sendHome(){ stayIn = true; if (mode === "wander") { goHome(performance.now()); scares = 3; } notify(); },
    letOut(){ stayIn = false; if (mode === "inside") restUntil = 0; else if (mode === "home") mode = "wander"; notify(); },
    get state(){ return { mode, stayIn }; }
  };
  function frame(now){
    requestAnimationFrame(frame);
    if (document.hidden) { last = now; return; }
    const dt = Math.min(.05, (now - (last || now)) / 1000); last = now;

    if (mode === "inside") {
      if (!stayIn && now > restUntil) {          // come back out
        [x, y] = door(); ang = -0.15 + (Math.random() - .5) * .6; mode = "wander"; speed = 30;
        el.classList.remove("inside"); home.classList.remove("home");
        nextTrip = now + 25000 + Math.random() * 25000; notify();
      } else return;
    }

    // run from the cursor; get scared three times and it heads home
    const dxm = x - mx, dym = y - my, dm = Math.hypot(dxm, dym);
    if (dm < 110) {
      if (now > fleeUntil) { scares++; scareReset = now + 6000; }
      fleeUntil = now + 700; pauseUntil = 0;
      if (scares >= 3) goHome(now);
      if (mode !== "home") turnTo(Math.atan2(dym, dxm), .35);
    }
    if (now > scareReset) scares = 0;
    if (mode === "wander" && now > nextTrip) { goHome(now); notify(); }
    const fleeing = now < fleeUntil;

    if (mode === "home") {
      const [hx, hy] = door(), dh = Math.hypot(hx - x, hy - y);
      turnTo(Math.atan2(hy - y, hx - x), Math.min(1, dt * 7));
      speed += ((fleeing || scares >= 3 ? 240 : 120) - speed) * Math.min(1, dt * 5);
      if (dh < 10) {                               // in through the door
        mode = "inside"; scares = 0; restUntil = now + 3000 + Math.random() * 4000;
        el.classList.add("inside"); el.classList.remove("walk", "run");
        home.classList.add("home"); home.classList.remove("knock"); void home.offsetWidth; home.classList.add("knock");
        notify();
        return;
      }
    } else {
      if (!fleeing && now > pauseUntil && Math.random() < .004) pauseUntil = now + 500 + Math.random() * 1600;
      const paused = !fleeing && now < pauseUntil;
      const target = paused ? 0 : fleeing ? 230 : 55;
      speed += (target - speed) * Math.min(1, dt * 6);
      ang += paused ? (Math.random() - .5) * 1.5 * dt : (Math.random() - .5) * 3.2 * dt + (fleeing ? 0 : Math.sin(now / 900) * .4 * dt);
      const m = 40;
      { const [hx, hy] = door(); if (Math.hypot(x - hx, y - hy) < 75) turnTo(Math.atan2(y - hy, x - hx), dt * 5); }   // keep clear of the house while wandering
      if (x < m) turnTo(0, dt * 4);
      if (x > W - m) turnTo(Math.PI, dt * 4);
      if (y < m + 60) turnTo(Math.PI / 2, dt * 4);
      if (y > H - m) turnTo(-Math.PI / 2, dt * 4);
    }
    x += Math.cos(ang) * speed * dt; y += Math.sin(ang) * speed * dt;
    x = Math.max(8, Math.min(W - 8, x)); y = Math.max(8, Math.min(H - 8, y));
    el.classList.toggle("walk", speed > 6); el.classList.toggle("run", fleeing || (mode === "home" && speed > 150));
    el.style.transform = "translate(" + (x - 13).toFixed(1) + "px," + (y - 13).toFixed(1) + "px) rotate(" + (ang * 57.2958 + 90).toFixed(1) + "deg)";
  }
  requestAnimationFrame(frame);
})();

/* ===== Header button ===== */
(function(){
  const bb = document.getElementById("beetleBtn"); if (!bb) return;
  // Beetle button: send home / let out
  function paint(){
    const b = window.labBeetle; if (!b) { bb.hidden = true; return; }
    const st = b.state, out = !(st.stayIn || st.mode === "inside");
    const label = out ? "Send the beetle home" : "Let the beetle out";
    bb.setAttribute("aria-label", label); bb.title = label; bb.classList.toggle("is-home", !out);
  }
  window.addEventListener("beetle", paint);
  bb.addEventListener("click", () => { const b = window.labBeetle; if (!b) return; const st = b.state; if (st.stayIn || st.mode === "inside") b.letOut(); else b.sendHome(); paint(); });
  setTimeout(paint, 0);
})();

/* ===== Beetle cursor: a little yellow pop where you click ===== */
(function(){
  if (!(window.matchMedia && matchMedia("(pointer:fine)").matches)) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.addEventListener("pointerdown", e => {
    if (e.pointerType !== "mouse") return;
    const d = document.createElement("span"); d.className = "click-pop";
    d.style.setProperty("--p", "translate(" + e.clientX + "px," + e.clientY + "px)");
    document.body.append(d); setTimeout(() => d.remove(), 480);
  }, { passive: true });
})();
