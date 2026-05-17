# Haoquan Chen Personal Site

Source for Haoquan Chen's portfolio-style personal homepage and writing archive.

## Local Preview

```sh
jekyll build
cd _site
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173/`.

## Structure

- `index.html`: main CV-style homepage.
- `_posts/`: writing entries used by the homepage modal and standalone post pages.
- `_layouts/post.html`: standalone article layout using the same visual language as the homepage.
- `assets/css/cv-home.css`: shared homepage, modal, tag, and post styles.
- `assets/js/cv-home.js`: homepage motion and writing modal behavior.
- `assets/files/Resume-Haoquan_Chen-202605.pdf`: downloadable resume.

## Build

This site is built with Jekyll through the GitHub Pages gem.
