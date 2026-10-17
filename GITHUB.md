# Publicarea site-ului LumiChrom pe GitHub Pages

Folderul acesta conține **varianta curată** a site-ului. Doar aceste fișiere trebuie urcate pe GitHub.

> Nu urca folderele `.shots`, `.dev` sau `lumichrom` din folderul părinte. Sunt materiale locale de test și nu fac parte din site.

## 1. Creează contul și repository-ul

1. Intră pe [github.com](https://github.com) și creează-ți un cont (dacă nu ai deja).
2. Apasă **New repository**.
3. Completează:
   - **Repository name:** `lumichrom`
   - **Visibility:** `Public` (necesar pentru GitHub Pages gratuit)
   - **Initialize this repository with:** nu bifa nimic
4. Apasă **Create repository**.

Adresa viitoare a site-ului va fi:

```
https://NUMELE-TĂU.github.io/lumichrom/
```

## 2. Varianta A — GitHub Desktop (recomandată pentru editare locală)

1. Descarcă și instalează [GitHub Desktop](https://desktop.github.com/).
2. Autentifică-te cu contul de GitHub.
3. În GitHub Desktop: **File → Add local repository**.
4. Alege folderul:

   ```
   C:\Users\cazac\Documents\deepseek-harness\default-workspace\LumiChrom-Site
   ```

5. Dacă apare mesajul că folderul nu este încă un repository, alege opțiunea de a crea un repository acolo.
6. Apasă **Publish repository**.
   - Nume: `lumichrom`
   - Debifează **Keep this code private**.
7. Apasă **Publish repository**.

## 2. Varianta B — fără instalare, direct din browser

1. Deschide repository-ul nou creat pe GitHub.
2. Apasă **Add file → Upload files**.
3. Deschide folderul `LumiChrom-Site` în File Explorer, astfel încât să vezi ce este **înăuntru**: cele 8 fișiere `.html`, folderul `assets`, `README.md` și `GITHUB.md`.
4. Selectează **conținutul** folderului, nu folderul `LumiChrom-Site` însuși:
   - apasă `Ctrl + A` în fereastra deschisă;
   - sau ține apăsat `Ctrl` și click pe fiecare fișier + pe folderul `assets`.
5. Trage selecția în zona de încărcare din pagina GitHub. Așteaptă să apară toate numele fișierelor.
6. Derulează în jos, scrie mesajul `Site inițial LumiChrom` și apasă **Commit changes**.
7. Verifică în repository că `index.html` apare direct în rădăcină, nu în folderul `LumiChrom-Site`. Folderul `assets` trebuie să apară și el la fel, lângă fișierele HTML.

> Dacă browserul nu acceptă tragerea folderului `assets`, folosește GitHub Desktop sau încarcă folderul cu opțiunea **choose your files** din pagina de upload. Fără folderul `assets`, site-ul va apărea fără stiluri și fără simulare.

## 3. Activează GitHub Pages

1. În repository, intră la **Settings → Pages**.
2. La **Build and deployment → Source**, alege **Deploy from a branch**.
3. La **Branch**, alege `main` și folderul `/ (root)`.
4. Apasă **Save**.
5. Așteaptă 1–2 minute, apoi reîncarcă pagina **Settings → Pages**. Va apărea linkul public.

## 4. Cum editezi după publicare

### Dacă folosești GitHub Desktop

1. Modifici fișierele local, în folderul `LumiChrom-Site`.
2. Deschizi GitHub Desktop.
3. Scrii un rezumat, de exemplu `Actualizare concluzii`.
4. Apasă **Commit to main**, apoi **Push origin**.
5. GitHub Pages se actualizează automat în aproximativ un minut.

### Dacă editezi direct pe GitHub

1. Deschide repository-ul pe GitHub.
2. Apasă tasta `.` (punct) pentru a deschide editorul online **github.dev**.
3. Modifici fișierele dorite.
4. Din panoul Source Control, scrii mesajul și faci commit.
5. Site-ul public se actualizează automat.

## 5. Fișiere importante

- `index.html` — pagina principală; trebuie să rămână în rădăcină.
- `assets/css/style.css` — designul întregului site.
- `assets/js/data.js` — **singurul loc** unde se schimbă valorile experimentului.
- `despre.html` — aici se schimbă numele echipei și profesorul coordonator.

## 6. Dacă actualizarea nu apare imediat

- Așteaptă 1–2 minute și reîncarcă pagina cu `Ctrl + F5`.
- Verifică la **Actions** dacă publicarea s-a terminat cu bifă verde.
- Verifică la **Settings → Pages** că sunt selectate `main` și `/ (root)`.
