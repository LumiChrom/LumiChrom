# LumiChrom

Site de prezentare pentru proiectul școlar de fizică **LumiChrom**.
Tema: felul în care culoarea unei suprafețe influențează absorbția luminii și încălzirea, sub lumină caldă (2700 K), normală (4000 K) și rece (6500 K).

> Pentru publicarea pe GitHub Pages, urmează pașii din [GITHUB.md](GITHUB.md).

## Cum se deschide

Nu este nevoie de instalare sau de un pas de build.

1. Deschide fișierul `index.html` într-un browser modern.
2. Meniul de sus duce către toate cele opt pagini.

Pentru cea mai stabilă experiență (inclusiv salvarea temei în browser), fișierele pot fi servite și cu un server local simplu, de exemplu:

```bash
python -m http.server 8000
```

Apoi deschide `http://localhost:8000`.

## Paginile site-ului

| Fișier | Conținut |
| --- | --- |
| `index.html` | Acasă: hero, buton „Începe experimentul” și trei carduri-previzualizare |
| `despre.html` | Observația, întrebarea de cercetare, ipotezele și echipa |
| `teorie.html` | Schema animată a razei de lumină și explicația celor trei temperaturi de culoare |
| `experiment.html` | Variabile, materiale și procedura pe axa timpului |
| `demo.html` | Simulare interactivă cu 6 plăci și 3 tipuri de lumină |
| `rezultate.html` | Tabel, statistici și grafic cu bare animate |
| `concluzii.html` | Ce am învățat, surse de eroare și îmbunătățiri |
| `intrebari.html` | Întrebări frecvente în stil acordeon |

## Unde se modifică datele experimentului

Toate valorile numerice ale simulării și ale rezultatelor sunt într-un singur fișier:

```
assets/js/data.js
```

Acolo se schimbă:

- `startTemp` — temperatura de pornire;
- `durationMinutes` — durata măsurătorii;
- `final` — temperatura măsurată la final, pentru fiecare culoare și fiecare lumină.

Valorile actuale sunt **ipotetice, nu măsurate**. După experiment:

1. deschide `assets/js/data.js`;
2. înlocuiește valorile `final` cu cele reale;
3. setează `isHypothetical: false` dacă datele devin măsurători reale;
4. reîncarcă paginile Demo și Rezultate — tabelul, statisticile și graficul se actualizează automat.

> Pagina Rezultate folosește implicit lumina normală (4000 K). Celelalte două lumini se văd selectând taburile de deasupra tabelului.

## Unde se modifică numele echipei

În `despre.html`, în secțiunea „Echipa LumiChrom”, sunt trei carduri cu nume, clasă și rol. Numele actuale sunt exemple și pot fi înlocuite direct în HTML.

## Structura tehnică

```
.
├── index.html
├── despre.html
├── teorie.html
├── experiment.html
├── demo.html
├── rezultate.html
├── concluzii.html
├── intrebari.html
└── assets
    ├── css/style.css      # design, temă, responsive, animații
    ├── img/favicon.svg    # pictograma site-ului
    └── js
        ├── data.js        # SURSA UNICĂ pentru valori
        ├── main.js        # meniu, temă, progres, parallax, reveal, contoare
        ├── demo.js        # simularea interactivă
        └── results.js     # tabelul, statisticile și graficul
```

## Funcționalități

- design responsive pentru telefon, tabletă și calculator;
- mod luminos / întunecat, cu memorarea preferinței în `localStorage`;
- bară de progres la derulare;
- apariții fade-in / slide-up cu întârzieri;
- parallax discret pe fundal și pe formele decorative;
- contoare animate și grafic cu bare animate;
- meniu fix, cu pagina curentă evidențiată;
- acordeon accesibil pentru întrebări;
- tranziție fade între pagini;
- animații dezactivate automat dacă utilizatorul preferă mișcare redusă (`prefers-reduced-motion`).

## Tehnologii

HTML5, CSS3 și JavaScript simplu, fără framework sau dependențe de build.
Fontul Poppins este încărcat din Google Fonts, cu fonturi de rezervă locale.
