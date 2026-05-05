# Sahaba Summer Camp 2026

Cinematic landing page for the 4th Annual Sahaba Summer Camp — three Edmonton mosques, July 6 – August 21, 2026.

## What's inside

- `index.html` — single-page cinematic site (1500 lines, no build step)
- `assets/posters/` — three event posters (Sahaba Youth Centre, Downtown Sahaba Mosque, Al-Faruq Islamic Centre)
- `assets/images/` — 18 cinematic images (mix of real photography and Studio Ghibli–style illustrations) used in 6 chapter sections

## Stack

- Vanilla HTML/CSS/JS (no framework, no build step)
- [GSAP](https://greensock.com/gsap/) + [ScrollTrigger](https://greensock.com/scrolltrigger/) for scroll-driven animations
- [Lenis](https://github.com/darkroomengineering/lenis) for smooth scrolling
- [Fraunces](https://fonts.google.com/specimen/Fraunces) (variable serif) + [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) (geometric sans) + [Reem Kufi](https://fonts.google.com/specimen/Reem+Kufi) (Arabic)
- All images generated with Google Gemini 3.1 Flash Image Preview via [inference.sh](https://inference.sh)

## Local dev

Any static HTTP server. From the project root:

```bash
python3 -m http.server 5555
```

Then open http://localhost:5555.

## Deploy

Auto-deploys to Vercel on push to `main`.
