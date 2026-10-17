/* ============================================================
   LumiChrom — pagina Rezultate
   Generează tabelul, statisticile și graficul direct din
   assets/js/data.js. Schimbă doar fișierul de date.
   ============================================================ */

(function () {
  "use strict";

  const data = window.LUMICHROM_DATA;
  const tableBody = document.querySelector("[data-results-body]");
  if (!data || !tableBody) return;

  const tabs = Array.from(document.querySelectorAll("[data-result-light]"));
  const chartPlot = document.querySelector("[data-chart-plot]");
  const chartAxis = document.querySelector("[data-chart-axis]");
  const chartPanel = document.querySelector(".chart-panel");
  const statsGrid = document.querySelector(".stats-grid");
  const chartSource = document.querySelector("[data-chart-source]");
  const tableLightLabel = document.querySelector("[data-table-light]");
  const chartLightLabel = document.querySelector("[data-chart-light]");
  const notice = document.querySelector("[data-data-notice]");
  const statValues = {
    hottest: document.querySelector('[data-stat="hottest"]'),
    hottestNote: document.querySelector('[data-stat="hottest-note"]'),
    coolest: document.querySelector('[data-stat="coolest"]'),
    coolestNote: document.querySelector('[data-stat="coolest-note"]'),
    spread: document.querySelector('[data-stat="spread"]'),
    spreadNote: document.querySelector('[data-stat="spread-note"]')
  };

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const numberFormat = new Intl.NumberFormat("ro-RO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1
  });
  const deltaFormat = new Intl.NumberFormat("ro-RO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
    signDisplay: "always"
  });

  let activeKey = data.defaultLight;
  let chartVisible = false;
  let statsVisible = false;

  if (!data.lights[activeKey]) {
    activeKey = Object.keys(data.lights)[0];
  }

  if (notice && data.isHypothetical === false) {
    notice.hidden = true;
  }

  function formatTemperature(value) {
    return `${numberFormat.format(value)}°C`;
  }

  function animateStat(element, target, suffix) {
    if (!element) return;

    if (reduceMotion) {
      element.textContent = `${numberFormat.format(target)}${suffix}`;
      return;
    }

    const start = performance.now();
    const duration = 500;

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = `${numberFormat.format(target * eased)}${suffix}`;

      if (progress < 1) {
        window.requestAnimationFrame(frame);
      } else {
        element.textContent = `${numberFormat.format(target)}${suffix}`;
      }
    }

    window.requestAnimationFrame(frame);
  }

  function buildTable(light) {
    tableBody.innerHTML = light.plates
      .map((plate) => {
        const delta = plate.final - data.startTemp;
        return `
          <tr>
            <td><span class="color-cell"><span class="color-swatch" style="--swatch:${plate.hex}"></span>${plate.name}</span></td>
            <td>${numberFormat.format(data.startTemp)} °C</td>
            <td>${numberFormat.format(plate.final)} °C</td>
            <td><span class="delta-badge">${deltaFormat.format(delta)} °C</span></td>
          </tr>
        `;
      })
      .join("");
  }

  function getAxisMaximum(light) {
    const maxDelta = Math.max(
      ...light.plates.map((plate) => plate.final - data.startTemp)
    );
    return Math.max(5, Math.ceil(maxDelta / 5) * 5);
  }

  function buildChart(light) {
    if (!chartPlot || !chartAxis) return;

    const axisMax = getAxisMaximum(light);
    const tickCount = 5;

    chartAxis.innerHTML = Array.from({ length: tickCount + 1 }, (_, index) => {
      const value = axisMax - (axisMax / tickCount) * index;
      return `<span>${numberFormat.format(value)}</span>`;
    }).join("");

    chartPlot.innerHTML = light.plates
      .map((plate, index) => {
        const delta = plate.final - data.startTemp;
        const height = Math.max((delta / axisMax) * 100, 2);
        return `
          <div class="bar-column">
            <div class="bar-visual">
              <div class="bar-fill" data-bar style="--bar-color:${plate.hex}; --bar-delay:${index * 0.08}s; height:0">
                <span class="bar-delta">${deltaFormat.format(delta)}°</span>
                <span class="bar-temp">${numberFormat.format(plate.final)}°C</span>
              </div>
            </div>
            <span class="bar-label"><span class="color-swatch" style="--swatch:${plate.hex}"></span>${plate.name.replace(" închis", "")}</span>
          </div>
        `;
      })
      .join("");

    chartPlot.setAttribute(
      "aria-label",
      `Grafic cu bare pentru ${light.label.toLowerCase()} (${light.kelvin} K). ` +
        light.plates
          .map(
            (plate) =>
              `${plate.name}: ${deltaFormat.format(plate.final - data.startTemp)} grade Celsius, până la ${numberFormat.format(plate.final)} grade`
          )
          .join(". ")
    );
  }

  function animateBars() {
    if (!chartPlot || !chartVisible) return;

    const light = data.lights[activeKey];
    chartPlot.querySelectorAll("[data-bar]").forEach((bar, index) => {
      const plate = light.plates[index];
      const axisMax = getAxisMaximum(light);
      const delta = plate.final - data.startTemp;
      const targetHeight = Math.max((delta / axisMax) * 100, 2);

      bar.style.transitionDelay = `${index * 0.08}s`;
      bar.style.height = "0%";

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          bar.style.height = `${targetHeight}%`;
        });
      });
    });
  }

  function updateStats(light, animate) {
    const sorted = [...light.plates].sort((a, b) => b.final - a.final);
    const hottest = sorted[0];
    const coolest = sorted[sorted.length - 1];
    const spread = hottest.final - coolest.final;

    if (animate) {
      animateStat(statValues.hottest, hottest.final, " °C");
      animateStat(statValues.coolest, coolest.final, " °C");
      animateStat(statValues.spread, spread, " °C");
    } else {
      if (statValues.hottest) statValues.hottest.textContent = `${numberFormat.format(hottest.final)} °C`;
      if (statValues.coolest) statValues.coolest.textContent = `${numberFormat.format(coolest.final)} °C`;
      if (statValues.spread) statValues.spread.textContent = `${numberFormat.format(spread)} °C`;
    }

    if (statValues.hottestNote) statValues.hottestNote.textContent = hottest.name;
    if (statValues.coolestNote) statValues.coolestNote.textContent = coolest.name;
    if (statValues.spreadNote) {
      statValues.spreadNote.textContent = `între ${hottest.name.toLowerCase()} și ${coolest.name.toLowerCase()}`;
    }
  }

  function setActiveTab(key) {
    tabs.forEach((tab) => {
      const isActive = tab.dataset.resultLight === key;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
      tab.setAttribute("tabindex", isActive ? "0" : "-1");
    });
  }

  function renderLight(key, animate) {
    const light = data.lights[key];
    if (!light) return;

    activeKey = key;
    setActiveTab(key);
    buildTable(light);
    buildChart(light);
    updateStats(light, statsVisible && animate);

    if (tableLightLabel) {
      tableLightLabel.textContent = `${light.label} · ${light.kelvin} K`;
    }

    if (chartLightLabel) {
      chartLightLabel.textContent = `${light.label} · ${light.kelvin} K`;
    }

    if (chartSource) {
      chartSource.textContent =
        `Creșterea temperaturii față de ${numberFormat.format(data.startTemp)} °C, după ${data.durationMinutes} de minute. ` +
        (data.isHypothetical ? "Valori ipotetice, pentru demonstrație." : "Valori măsurate.");
    }

    if (animate && chartVisible) {
      animateBars();
    }
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      renderLight(tab.dataset.resultLight, true);
    });

    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const nextIndex = (index + direction + tabs.length) % tabs.length;
      tabs[nextIndex].focus();
      tabs[nextIndex].click();
    });
  });

  /* Parametru opțional: rezultate.html?lumina=calda */
  const requested = new URLSearchParams(window.location.search).get("lumina");
  if (requested && data.lights[requested]) {
    activeKey = requested;
  }

  renderLight(activeKey, false);

  if (statsGrid && "IntersectionObserver" in window) {
    const statsObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          statsVisible = true;
          updateStats(data.lights[activeKey], true);
          observer.disconnect();
        });
      },
      { threshold: 0.35 }
    );

    statsObserver.observe(statsGrid);
  } else {
    statsVisible = true;
  }

  if (chartPanel && "IntersectionObserver" in window && !reduceMotion) {
    const chartObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          chartVisible = true;
          animateBars();
          observer.disconnect();
        });
      },
      { threshold: 0.2 }
    );

    chartObserver.observe(chartPanel);
  } else {
    chartVisible = true;
    animateBars();
  }
})();
