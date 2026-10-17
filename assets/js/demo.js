/* ============================================================
   LumiChrom — demo interactiv
   Citește valorile din assets/js/data.js și animează șase plăci.
   ============================================================ */

(function () {
  "use strict";

  const data = window.LUMICHROM_DATA;
  const grid = document.querySelector("[data-plates-grid]");
  if (!data || !grid) return;

  const notice = document.querySelector("[data-data-notice]");
  if (notice && data.isHypothetical === false) {
    notice.hidden = true;
  }

  const lightButtons = Array.from(document.querySelectorAll(".light-btn"));
  const replayButton = document.querySelector("[data-demo-replay]");
  const progressFill = document.querySelector("[data-demo-progress]");
  const demoTrack = document.querySelector("[data-demo-track]");
  const minuteLabel = document.querySelector("[data-demo-minutes]");
  const summary = document.querySelector("[data-demo-summary]");
  const description = document.querySelector("[data-light-description]");
  const liveRegion = document.querySelector("[data-demo-live]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const temperatureFormat = new Intl.NumberFormat("ro-RO", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  });

  const deltaFormat = new Intl.NumberFormat("ro-RO", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    signDisplay: "always"
  });

  let activeLightKey = null;
  let animationFrame = null;
  let animationStart = 0;
  let currentRun = 0;
  let temperatureRange = { min: 18, max: 48 };

  /* Calculăm o scală fixă pentru termometre, ca toate plăcile
     să poată fi comparate vizual. */
  function updateTemperatureRange() {
    const allFinalTemps = Object.values(data.lights).flatMap((light) =>
      light.plates.map((plate) => plate.final)
    );
    temperatureRange.min = Math.floor(data.startTemp - 4);
    temperatureRange.max = Math.ceil(Math.max(...allFinalTemps) + 4);
  }

  function thermometerFill(temperature) {
    const ratio =
      (temperature - temperatureRange.min) /
      (temperatureRange.max - temperatureRange.min);
    return Math.max(4, Math.min(100, ratio * 100));
  }

  function createCards() {
    /* Plăcile sunt generate din date, ca numele și culorile
       să rămână sincronizate cu tabelul de rezultate. */
    const baseLight = data.lights[data.defaultLight] || Object.values(data.lights)[0];

    grid.innerHTML = baseLight.plates
      .map(
        (plate) => `
          <article class="plate-card" data-plate="${plate.id}">
            <div class="plate-visual">
              <div class="heat-wisps" aria-hidden="true"><i></i><i></i><i></i></div>
              <div class="plate-disc" style="--plate-color:${plate.hex}" aria-hidden="true"></div>
              <div class="thermo" aria-hidden="true">
                <div class="thermo-track">
                  <div class="thermo-fill" data-thermo-fill style="--fill:${thermometerFill(data.startTemp)}%"></div>
                </div>
                <div class="thermo-bulb"></div>
                <div class="thermo-ticks"><i></i><i></i><i></i><i></i><i></i></div>
              </div>
            </div>
            <div class="plate-meta">
              <div>
                <h3 class="plate-name">${plate.name}</h3>
                <p class="plate-temp">
                  <span data-temperature>${temperatureFormat.format(data.startTemp)}</span><span>°C</span>
                </p>
              </div>
              <span class="plate-delta" data-delta>+0,0 °C</span>
            </div>
          </article>
        `
      )
      .join("");
  }

  function setAllTemperatures(temperature) {
    grid.querySelectorAll("[data-plate]").forEach((card) => {
      const tempElement = card.querySelector("[data-temperature]");
      const deltaElement = card.querySelector("[data-delta]");
      const fillElement = card.querySelector("[data-thermo-fill]");
      const delta = temperature - data.startTemp;

      tempElement.textContent = temperatureFormat.format(temperature);
      deltaElement.textContent = `${deltaFormat.format(delta)} °C`;
      fillElement.style.setProperty("--fill", `${thermometerFill(temperature)}%`);
    });
  }

  function setActiveButton(key) {
    lightButtons.forEach((button) => {
      const isActive = button.dataset.light === key;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  function setProgress(value) {
    if (progressFill) {
      progressFill.style.width = `${Math.min(100, Math.max(0, value))}%`;
    }
    if (demoTrack) {
      demoTrack.setAttribute("aria-valuenow", String(Math.round(value)));
    }
  }

  function setMinute(value) {
    if (minuteLabel) {
      minuteLabel.textContent = String(Math.round(value));
    }
  }

  function setSummary(title, text) {
    if (!summary) return;
    summary.innerHTML = `
      <div class="icon-badge" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 18h6M10 22h4"/>
          <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V18h6v-1.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2Z"/>
        </svg>
      </div>
      <div><strong class="demo-summary-title">${title}</strong>${text}</div>
    `;
  }

  function resetDemo(message) {
    currentRun += 1;
    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }

    activeLightKey = null;
    setActiveButton(null);
    setAllTemperatures(data.startTemp);
    setProgress(0);
    setMinute(0);
    grid.querySelectorAll(".plate-card").forEach((card) => card.classList.remove("is-hot"));
    lightButtons.forEach((button) => button.classList.remove("is-active"));

    if (description) {
      description.textContent =
        "Alege una dintre cele trei lumini. Plăcile pornesc de la temperatura camerei și se încălzesc timp de 30 de minute.";
    }

    setSummary(
      "Alege o lumină pentru a începe",
      message ||
        "Fiecare placă pornește de la 22 °C. Simularea parcurge 30 de minute în câteva secunde."
    );

    if (liveRegion) {
      liveRegion.textContent = "Simulare resetată. Alege o lumină.";
    }
  }

  function finishSimulation(light, runId) {
    if (runId !== currentRun) return;

    const sorted = [...light.plates].sort((a, b) => b.final - a.final);
    const hottest = sorted[0];
    const coolest = sorted[sorted.length - 1];

    setSummary(
      "Simulare finalizată",
      `<strong>${hottest.name}</strong> a ajuns la ${temperatureFormat.format(hottest.final)} °C, iar <strong>${coolest.name}</strong> la ${temperatureFormat.format(coolest.final)} °C. Diferența dintre ele este de ${temperatureFormat.format(hottest.final - coolest.final)} °C.`
    );

    if (liveRegion) {
      liveRegion.textContent = `Simulare finalizată. ${hottest.name} a ajuns la ${temperatureFormat.format(hottest.final)} grade Celsius. ${coolest.name} a ajuns la ${temperatureFormat.format(coolest.final)} grade Celsius.`;
    }
  }

  function runSimulation(key) {
    const light = data.lights[key];
    if (!light) return;

    currentRun += 1;
    const runId = currentRun;

    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }

    activeLightKey = key;
    setActiveButton(key);
    setAllTemperatures(data.startTemp);
    setProgress(0);
    setMinute(0);
    grid.querySelectorAll(".plate-card").forEach((card) => card.classList.remove("is-hot"));

    if (description) {
      description.textContent = `${light.label} (${light.kelvin} K): ${light.description}`;
    }

    setSummary(
      "Se încălzește…",
      `Plăcile sunt expuse la ${light.label.toLowerCase()}, ${light.kelvin} K. Urmărește termometrele timp de 30 de minute simulate.`
    );

    if (liveRegion) {
      liveRegion.textContent = `A început simularea cu ${light.label.toLowerCase()}, ${light.kelvin} kelvin.`;
    }

    animationStart = performance.now();
    const duration = reduceMotion ? 450 : 3800;

    function frame(now) {
      if (runId !== currentRun) return;

      const elapsed = now - animationStart;
      const rawProgress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - rawProgress, 3);
      const simulatedMinutes = rawProgress * data.durationMinutes;

      light.plates.forEach((plate) => {
        const card = grid.querySelector(`[data-plate="${plate.id}"]`);
        if (!card) return;

        const temperature =
          data.startTemp + (plate.final - data.startTemp) * eased;
        const delta = temperature - data.startTemp;
        const tempElement = card.querySelector("[data-temperature]");
        const deltaElement = card.querySelector("[data-delta]");
        const fillElement = card.querySelector("[data-thermo-fill]");

        tempElement.textContent = temperatureFormat.format(temperature);
        deltaElement.textContent = `${deltaFormat.format(delta)} °C`;
        fillElement.style.setProperty("--fill", `${thermometerFill(temperature)}%`);

        if (rawProgress > 0.1) {
          card.classList.add("is-hot");
        }
      });

      setProgress(rawProgress * 100);
      setMinute(simulatedMinutes);

      if (rawProgress < 1) {
        animationFrame = window.requestAnimationFrame(frame);
      } else {
        animationFrame = null;
        setMinute(data.durationMinutes);
        setProgress(100);
        finishSimulation(light, runId);
      }
    }

    animationFrame = window.requestAnimationFrame(frame);
  }

  /* ---------- Legături cu interfața ---------- */
  lightButtons.forEach((button) => {
    button.addEventListener("click", () => {
      runSimulation(button.dataset.light);
    });
  });

  if (replayButton) {
    replayButton.addEventListener("click", () => {
      if (activeLightKey) {
        runSimulation(activeLightKey);
      } else {
        resetDemo();
      }
    });
  }

  /* Pornire directă dintr-un link, de exemplu demo.html?lumina=calda */
  const params = new URLSearchParams(window.location.search);
  const requestedLight = params.get("lumina");
  const initialLight = data.lights[requestedLight] ? requestedLight : null;

  updateTemperatureRange();
  createCards();
  resetDemo();

  if (initialLight) {
    window.setTimeout(() => runSimulation(initialLight), 450);
  }
})();
