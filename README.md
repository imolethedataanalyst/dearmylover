# DearLover by V'Macdel — Website

A luxury editorial bridal-styling **single-page** website, in the brand's deep-wine / blush /
ivory palette, built around the client's real wedding photos and footage.

## View it locally
Serve the folder (so CSS/JS/media load):

```bash
python3 -m http.server 8777
```

Then visit `http://localhost:8777`.

## Structure — lean landing + dedicated pages
| File | Page |
|------|------|
| `index.html` | **Landing** — hero → The Experience → Packages → Gallery (slider) → "She chose to be herself" |
| `about.html` | Why DearLover Exists (incl. the "Your wedding is more than a day" intro) |
| `faq.html` | FAQ accordion |
| `consultation.html` | Book a Consultation (booking form) |
| `bride-naza.html` | Naza's bride story — real quotes (was `bride-augusta.html`; "Augusta" was a placeholder name) |
| `bride-ehmi-soji.html` | Ehmi & Soji's bride story — 3 looks (Traditional / White / Reception) + film, real quotes |
| `bride-oge.html` | Oge's bride story — 2 looks (Traditional / White), films, real quotes |

- The landing is deliberately short so it doesn't overload the visitor. Heavier content
  (About, FAQ, the consultation form, bride stories) lives on its own real page — each a
  distinct URL, which is clean for analytics.
- **Hero background alternates** every 6.5s between the film (`clip-1.mp4`) and `augusta-5.jpg`.
- **Gallery is a one-line slider** (`#sliderTrack`) with prev/next arrows + swipe/scroll; contents
  are the `GALLERY` array in `script.js`.
- Landing nav uses in-page anchors (`#experience`, `#packages`, `#gallery`, `#brides`); About / FAQ /
  Consultation are page links.

## Media (`assets/media/`)
- **Photos** — `augusta-1…6.jpg` (optimised from the PNG/JPGs you added in `Assets/Photo's and
  videos/`). Used in the gallery, the "Augusta" bride card, the story modal, and the final CTA.
- **Films** — `clip-1…9.mp4` + `clip-augusta.mp4`. Used in the hero and gallery; they play only
  while on-screen.
- **Gallery contents & categories** live in the `GALLERY` array at the top of `script.js`
  (`type: 'img'|'video'`, `file`, `cat`, `cap`). Add, reorder or recategorise freely.

### Case studies
- **Augusta** — `augusta-1…6.jpg`.
- **Oge** — the wine/burgundy traditional + ivory films `clip-1…9.mp4` (originally the WhatsApp clips).
- **Ehmi & Soji** — 4 looks: Traditional (`es-trad-*.jpg` + `clip-ehmi-trad.mp4`), Edo/red-coral
  (`es-trad2-01…06.jpg`), White Wedding (`es-white-10…24`), After Party/mint (`es-white-01…09`).
- **Ehmi & Soji (legacy names)** — `es-trad-01…16.jpg`, `es-white-01…31.jpg`, and `clip-ehmi-trad.mp4`
  (a 16s web highlight trimmed + compressed from the 197 MB / 3-min raw `EMHI & SOJI (TRAD).mp4`
  via macOS `avconvert`). The raw original stays in `Assets/Photo's and videos/` and is *not*
  served by the site. To use a different segment: `avconvert --preset Preset960x540 --start <s>
  --duration <s> --source "<raw>" --output assets/media/clip-ehmi-trad.mp4`.

## Adding / swapping media
Drop new files into `assets/media/` and reference them:
- **Gallery**: add an entry to the `GALLERY` array in `script.js`.
- **Bride card / story modal**: edit the `<img>`s in the `#brides` section and the `#story-augusta`
  modal in `index.html`.
- **Hero**: swap the `<video>`'s `src`, or replace it with an `<img>`.

## To edit copy / details
- **Prices & all copy** — directly in `index.html`.
- **Bride name & story** — the bride is labelled **"Augusta"** (from your photo filenames) with
  clearly-marked *sample* story text; replace with the real name and her own words.
- **FAQ answers** — sensible drafts; edit to your voice.
- **Colours / fonts** — CSS variables at the top of `styles.css` (`:root`); wine = `--wine`.
- **Contact links** — footer Instagram / WhatsApp / Email are placeholders (`#`).

## Not built yet (larger phase)
- **Live booking calendar + payment** — the consultation form confirms in-page and is ready to
  connect to a form/email service (Formspree, etc.) or a booking tool (Calendly / Paystack) with
  your credentials.
- More bride case studies, Journal articles, video testimonials (awaiting content).

## Notes
- Fully responsive, slide-in mobile menu, sticky mobile "Book" bar, honours `prefers-reduced-motion`.
- No build step, no dependencies — host anywhere (Netlify, Vercel, GitHub Pages, cPanel).
