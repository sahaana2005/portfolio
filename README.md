<div align="center">

# 🌸 Sahaana's Portfolio

**A portfolio you walk through, not just scroll past.**

</div>

---

##  About This Project

This is my personal portfolio, built to feel like an **experience** rather than a list of projects on a page. Cinematic transitions, a 3D room you can explore, and a warm, personal aesthetic tie it all together.

The entire site was built through **prompt engineering** and **loop engineering** with Claude: tight feedback loops with AI to iterate on every piece, from layout and transitions to 3D integration and responsiveness. I didn't just ask for code and paste it in. I shaped it, broke it, fixed it, and rebuilt sections dozens of times until every interaction felt intentional.

---

##  Highlights

###  Interactive 3D Room (Spline)
I learnt 3D modelling in Spline and built a fully interactive room scene you can orbit around and explore.

- Loads **lazily in the background** while the hero is visible, so there is no loading screen
- By the time the transition plays, the scene is already ready
- The Spline render loop **pauses and resumes** based on visibility to save resources

###  Canva Website Integration
The About section embeds my Canva portfolio website directly into the page.

- Lazy-loads with **IntersectionObserver**, so the iframe activates only when scrolled into view
- Clears itself when you scroll away, so Canva animations **replay fresh** every time you return
- Adds a different visual layer without rebuilding everything from scratch

### Aesthetic & Theme
A soft, warm, intentionally feminine design language:

| Element | Style |
|---|---|
| **Base palette** | Soft pink and rose, `#eea3a1` |
| **Interactive elements** | Deep magenta accents |
| **About section** | Purple highlights |
| **Projects desktop** | Dark, moody scheme |
| **Effects** | Glassmorphism, frosted blur, scroll-triggered animations, cinematic section transitions |

---

##  Tech Stack

| Category | Tools |
|---|---|
| **Framework** | React 19 + TypeScript |
| **Build tool** | Vite 8 |
| **Styling** | Tailwind CSS 4 |
| **Animation** | Framer Motion, GSAP |
| **3D** | Spline (`react-spline`) |
| **Smooth scroll** | Lenis |
| **Icons** | Lucide React |
| **Hosting** | Netlify |

---

##  What I Learnt

- **Prompt engineering and loop engineering** with Claude for building interactive websites through iterative, AI-assisted development
- **3D modelling in Spline**, and integrating Spline scenes into a React app
- **Embedding a Canva website** as part of an interactive experience
- Canvas rendering, CSS transitions, and **accessible modal patterns**
- Animation with **Framer Motion** and **GSAP**
- **Deploying through Netlify**

---

## Running Locally

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

Build for production:

```bash
npm run build
```

---

<div align="center">

Built with 🌸 by **Sahaana Raajkumar**

</div>
