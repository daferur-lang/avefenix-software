# Avefenix Software

Sitio web corporativo de agencia tech española. Construido con Astro 5 + Tailwind v4 + React islands + Sanity CMS. El diseño Dark Ember ES el argumento de venta.

## Comandos

- `pnpm dev` — Servidor de desarrollo (localhost:4321)
- `pnpm build` — Build de producción
- `pnpm preview` — Preview del build antes de deploy

## Tech Stack

Astro 5 + TypeScript strict + Tailwind CSS v4 + React islands + Sanity v3 + Resend + Vercel

## Architecture

### Directory Structure
- `src/pages/` — Rutas del sitio. Cada archivo = una URL.
- `src/components/layout/` — Header, Footer, BaseLayout (wrapper HTML + meta)
- `src/components/sections/` — Secciones de página (Hero, Servicios, Proceso, etc.)
- `src/components/ui/` — Componentes base reutilizables (Button, Card, Badge)
- `src/components/forms/` — ContactForm.tsx (React island)
- `src/lib/` — sanity.ts (cliente + queries), resend.ts (helper email), utils.ts
- `src/styles/` — globals.css (variables CSS + Tailwind), animations.css (keyframes)

### Data Flow
- Blog y portfolio: Sanity → GROQ query en `src/lib/sanity.ts` → componente Astro (build time)
- Formulario: usuario → ContactForm.tsx (RHF+Zod) → POST /api/contact → Resend → email

### Key Patterns
- Astro components por defecto. React islands SOLO para ContactForm (`client:load`).
- Queries de Sanity siempre a través de `src/lib/sanity.ts` — nunca inline.
- Variables de entorno: prefijo `PUBLIC_` para las que necesitan estar en el cliente.
- Imágenes siempre con el componente `<Image>` de Astro — nunca `<img>` raw.

## Design System — Dark Ember

### Variables CSS (en globals.css)
- `--bg-void: #050505` — fondo base
- `--bg-surface: #0E0D0C` — superficies elevadas
- `--bg-card: #1C1917` — cards y paneles
- `--phoenix-fire: #EA580C` — acento primario
- `--phoenix-gold: #D97706` — CTAs y highlights
- `--phoenix-bright: #FCD34D` — glows máximos
- `--text-primary: #F5F4F2` — texto principal
- `--gradient-phoenix: linear-gradient(135deg, #9A3412 0%, #EA580C 40%, #D97706 70%, #FCD34D 100%)`

### Tipografía
- Headlines: Bebas Neue 400 (uppercase, máximo impacto)
- UI/Subtítulos: Outfit 500-700
- Cuerpo/Blog: Source Sans 3 300-400

## Environment Variables

| Variable | Descripción |
|----------|-------------|
| `RESEND_API_KEY` | API key de Resend |
| `SANITY_PROJECT_ID` | ID del proyecto Sanity |
| `SANITY_DATASET` | Dataset (production) |
| `SANITY_API_TOKEN` | Token de lectura Sanity |
| `PUBLIC_SITE_URL` | URL pública del sitio |
| `CONTACT_EMAIL` | Email destino del formulario |

## Reglas No Negociables

1. TypeScript strict. Sin `any`. Sin `// @ts-ignore`.
2. Mobile-first. Todo componente se diseña para 375px primero.
3. Nunca `<img>` raw. Siempre `<Image>` de Astro con width, height y alt.
4. El honeypot del formulario es obligatorio. Campo oculto, si tiene valor → silenciar.
5. Contraste mínimo 4.5:1. Verificar antes de dar una sección por terminada.
6. `prefers-reduced-motion` respetado en todas las animaciones.
7. El design system Dark Ember es no negociable. No sustituir por Tailwind defaults.
