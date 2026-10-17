/* ============================================================
   LumiChrom — sursa unică pentru datele experimentului
   ============================================================
   AICI se modifică toate valorile. Paginile Demo și Rezultate
   citesc automat acest fișier, deci nu trebuie editat HTML-ul.

   - startTemp: temperatura de pornire a plăcilor (°C)
   - durationMinutes: durata măsurătorii (minute)
   - final: temperatura măsurată la finalul celor 30 de minute

   Valorile de mai jos sunt IPOTETICE, pentru demonstrație.
   După experiment, înlocuiește-le cu valorile reale măsurate.
   ============================================================ */

window.LUMICHROM_DATA = {
  startTemp: 22,
  durationMinutes: 30,
  isHypothetical: true,
  disclaimer: "Valori ipotetice, nu măsurate",
  disclaimerLong:
    "Numerele sunt exemple pentru a arăta cum va arăta proiectul. Ele nu provin dintr-un experiment realizat.",

  /* Cheia „normala” este afișată implicit pe pagina Rezultate. */
  defaultLight: "normala",

  lights: {
    calda: {
      label: "Lumină caldă",
      shortLabel: "caldă",
      kelvin: 2700,
      tone: "warm",
      description:
        "Galben-portocalie, ca becul cald din sufragerie sau lumina de la apus.",
      plates: [
        { id: "negru", name: "Negru", hex: "#1b1d24", final: 44.0 },
        { id: "albastru", name: "Albastru închis", hex: "#213a66", final: 40.0 },
        { id: "rosu", name: "Roșu", hex: "#c7433c", final: 39.0 },
        { id: "verde", name: "Verde", hex: "#3b8a5a", final: 37.5 },
        { id: "galben", name: "Galben", hex: "#e7bd45", final: 34.0 },
        { id: "alb", name: "Alb", hex: "#f2f0e8", final: 30.0 }
      ]
    },

    normala: {
      label: "Lumină normală",
      shortLabel: "normală",
      kelvin: 4000,
      tone: "neutral",
      description:
        "Alb-crem, neutru, ca lumina unui birou sau a unei săli de clasă.",
      plates: [
        { id: "negru", name: "Negru", hex: "#1b1d24", final: 42.0 },
        { id: "albastru", name: "Albastru închis", hex: "#213a66", final: 39.0 },
        { id: "rosu", name: "Roșu", hex: "#c7433c", final: 37.0 },
        { id: "verde", name: "Verde", hex: "#3b8a5a", final: 36.0 },
        { id: "galben", name: "Galben", hex: "#e7bd45", final: 33.0 },
        { id: "alb", name: "Alb", hex: "#f2f0e8", final: 29.0 }
      ]
    },

    rece: {
      label: "Lumină rece",
      shortLabel: "rece",
      kelvin: 6500,
      tone: "cool",
      description:
        "Alb-albăstrui, ca lumina de la fereastră într-o zi de iarnă.",
      plates: [
        { id: "negru", name: "Negru", hex: "#1b1d24", final: 40.0 },
        { id: "albastru", name: "Albastru închis", hex: "#213a66", final: 37.0 },
        { id: "rosu", name: "Roșu", hex: "#c7433c", final: 35.0 },
        { id: "verde", name: "Verde", hex: "#3b8a5a", final: 34.0 },
        { id: "galben", name: "Galben", hex: "#e7bd45", final: 32.0 },
        { id: "alb", name: "Alb", hex: "#f2f0e8", final: 28.0 }
      ]
    }
  }
};
