# Antigravity Portfolio

A highly interactive, premium portfolio website built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- **Premium Animations**: Magnetic buttons, 3D tilt cards, text reveals, and smooth scrolling (Lenis).
- **Core Interactions**: Command Palette (`Cmd+K`), Theme Toggle (Dark/Light), Page Transitions.
- **Performance**: Optimized for high Lighthouse scores, lazy loading, and reduced motion support.
- **Content Management**: Data-driven architecture (`src/data/*.ts`) for easy updates.

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) + `clsx` + `tailwind-merge`
- **Animation**: [Framer Motion](https://www.framer.com/motion/) + [GSAP](https://greensock.com) (optional)
- **Smooth Scroll**: [Lenis](https://lenis.studiofreight.com/)
- **Icons**: [Lucide React](https://lucide.dev)

## Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/antigravity-portfolio.git
    cd antigravity-portfolio
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## managing Content

### Adding Projects
Edit `src/data/projects.ts`.
Add a new object to the `projects` array:
```typescript
{
  title: "New Project",
  slug: "new-project",
  year: "2025",
  tags: ["Next.js", "AI"],
  description: "Description...",
  role: "Lead Developer",
  tools: ["React", "Python"],
  links: { demo: "...", repo: "..." },
  image: "/path/to/image.jpg",
  featured: true
}
```

### Updating Skills & Experience
- **Skills**: Edit `src/data/skills.ts`
- **Timeline**: Edit `src/data/timeline.ts`

## Deployment

The easiest way to deploy is to use the [Vercel Platform](https://vercel.com/new).

1.Push your code to a Git repository (GitHub, GitLab, BitBucket).
2. Import the project into Vercel.
3. Vercel will auto-detect Next.js and deploy.

## License

MIT
