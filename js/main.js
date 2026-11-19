// SINE Lab website: navigation, scroll reveal and gallery viewer.
(function () {
  "use strict";

  // Mobile menu
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Highlight the current section in the menu
  var links = Array.prototype.slice.call(document.querySelectorAll(".site-nav a[href^='#']"));
  var sections = links.map(function (a) { return document.querySelector(a.getAttribute("href")); }).filter(Boolean);
  if ("IntersectionObserver" in window) {
    var navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (a) {
            a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { navObs.observe(s); });

    // Gentle reveal of cards as they scroll into view
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) {
      var items = document.querySelectorAll(".r-card, .p-step, .tb-panel, .member, .gallery li, .pi-card, .join-card, .why-card, .planned");
      var revObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            revObs.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px" });
      Array.prototype.forEach.call(items, function (el) {
        el.classList.add("reveal");
        revObs.observe(el);
      });
    }
  }

  // Gallery lightbox
  var buttons = Array.prototype.slice.call(document.querySelectorAll(".g-item"));
  var box = document.getElementById("lightbox");
  var img = document.getElementById("lb-img");
  var cap = document.getElementById("lb-cap");
  var current = 0;
  var lastFocus = null;

  function show(i) {
    current = (i + buttons.length) % buttons.length;
    var source = buttons[current].querySelector("img");
    img.src = source.getAttribute("src");
    img.alt = source.getAttribute("alt");
    cap.textContent = buttons[current].querySelector(".g-cap").textContent;
  }
  function open(i) {
    lastFocus = document.activeElement;
    show(i);
    box.hidden = false;
    document.body.style.overflow = "hidden";
    box.querySelector(".lb-close").focus();
  }
  function close() {
    box.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  if (box) {
    buttons.forEach(function (b, i) { b.addEventListener("click", function () { open(i); }); });
    box.querySelector(".lb-close").addEventListener("click", close);
    box.querySelector(".lb-prev").addEventListener("click", function () { show(current - 1); });
    box.querySelector(".lb-next").addEventListener("click", function () { show(current + 1); });
    box.addEventListener("click", function (e) { if (e.target === box) close(); });
    document.addEventListener("keydown", function (e) {
      if (box.hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(current - 1);
      if (e.key === "ArrowRight") show(current + 1);
    });
  }


  // Testbed network: tap or hover a node to read what it does
  var NODES = {
      "f1": {
        "t": "F1 · Sensors",
        "h": "13 Pico boards · 26 temperature and gas sensors",
        "b": "Periodic sensing over MQTT."
      },
      "f2": {
        "t": "F2 · RFID access",
        "h": "3 Pico boards · 5 RFID readers",
        "b": "Event-driven: sends a message only when an experimental card or fob is scanned."
      },
      "f3": {
        "t": "F3 · LED actuators",
        "h": "3 Pico boards · 15 LEDs",
        "b": "Command-response: receives a command and replies with its status."
      },
      "f4": {
        "t": "F4 · Smart bulbs",
        "h": "1 controller Pi · 4 smart bulbs",
        "b": "Command-response."
      },
      "l3": {
        "t": "L3 · Cameras",
        "h": "1 Pi · 2 cameras",
        "b": "Motion levels only; no images are stored."
      },
      "l1": {
        "t": "L1 · Modbus · CoAP · MQTTS",
        "h": "1 Pi running simulated industrial services",
        "b": "Polled: Modbus, CoAP; secure MQTT over TLS"
      },
      "agg": {
        "t": "Aggregator Pi",
        "h": "MQTT broker, per-cluster aggregators, Modbus/CoAP/MQTTS pollers",
        "b": "Collects every message from the six device clusters and forwards it to the edge server."
      },
      "edge": {
        "t": "Edge server Pi",
        "h": "Storage, Zeek flow logging and packet capture",
        "b": "Records each message and the network traffic around it, with all clocks NTP-synchronised."
      },
      "data": {
        "t": "Labelled data",
        "h": "Identity, timing, intent, sensor and protocol fields + flow logs",
        
      }
    };
  var net = document.getElementById("net");
  if (net) {
    var tipBox = document.getElementById("net-tip");
    var nodes = Array.prototype.slice.call(net.querySelectorAll(".node"));
    var pick = function (el) {
      var d = NODES[el.getAttribute("data-node")];
      if (!d) return;
      nodes.forEach(function (n) { n.classList.toggle("on", n === el); });
      tipBox.innerHTML = "";
      var b = document.createElement("b"); b.textContent = d.t;
      var hw = document.createElement("span"); hw.className = "hw"; hw.textContent = d.h;
      var p = document.createElement("span"); p.textContent = d.b;
      tipBox.appendChild(b); tipBox.appendChild(hw); tipBox.appendChild(p);
    };
    nodes.forEach(function (n) {
      n.addEventListener("click", function () { pick(n); });
      n.addEventListener("mouseenter", function () { pick(n); });
      n.addEventListener("focus", function () { pick(n); });
      n.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(n); } });
    });
  }

  // Footer year
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
