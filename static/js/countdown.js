/* The Slop Academy — Countdown to the Sealing of the Gates. */
(function () {
  "use strict";

  var root = document.querySelector("[data-countdown]");
  if (!root) return;

  var deadline = Date.parse(root.getAttribute("data-deadline") || "");
  var serverOpen = root.getAttribute("data-open") === "true";
  var status = root.querySelector("[data-countdown-status]");
  var clock = root.querySelector("[data-countdown-clock]");
  var note = root.querySelector("[data-countdown-note]");
  var cta = document.querySelector("[data-countdown-cta]");
  var cfpStatus = document.querySelector("[data-cfp-status]");
  var units = {};
  ["days", "hours", "minutes", "seconds"].forEach(function (u) {
    units[u] = root.querySelector('[data-unit="' + u + '"]');
  });

  // Render the deadline in a suitably ceremonious, locale-aware form.
  if (!isNaN(deadline)) {
    var fmt;
    try {
      fmt = new Intl.DateTimeFormat("en-GB", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
        hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris", timeZoneName: "short"
      });
    } catch (e) { fmt = null; }
    document.querySelectorAll("[data-deadline-text]").forEach(function (el) {
      el.textContent = fmt ? fmt.format(new Date(deadline)) : new Date(deadline).toString();
    });
  }

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  function seal() {
    status.textContent = "The Gates of Submission Are Sealed";
    root.classList.add("is-sealed");
    if (clock) clock.hidden = true;
    if (note) note.textContent = "The period of submission has concluded. The Committee has withdrawn into deliberation and is not to be disturbed.";
    if (cta) cta.hidden = true;
    if (cfpStatus) cfpStatus.textContent = "Sealed";
  }

  if (!serverOpen || isNaN(deadline)) {
    if (!serverOpen) root.classList.add("is-sealed");
    return;
  }

  var timer;
  function tick() {
    var ms = deadline - Date.now();
    if (ms <= 0) {
      clearInterval(timer);
      seal();
      return;
    }
    var s = Math.floor(ms / 1000);
    units.days.textContent = String(Math.floor(s / 86400));
    units.hours.textContent = pad(Math.floor((s % 86400) / 3600));
    units.minutes.textContent = pad(Math.floor((s % 3600) / 60));
    units.seconds.textContent = pad(s % 60);
  }
  clock.hidden = false;
  tick();
  timer = setInterval(tick, 1000);
})();
