"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { profile } from "@/content/profile";
import { useSkin } from "@/lib/useSkin";
import { useChatLauncher } from "@/components/chat/ChatProvider";
import { useTyped } from "@/components/terminal/useTyped";
import { TermHeroFx } from "@/components/terminal/TermHeroFx";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

type PanelTab = "portfolio.sh" | "stack.json" | "deploy.yml";
const PANEL_TABS: PanelTab[] = ["portfolio.sh", "stack.json", "deploy.yml"];

function PanelBody({ tab, onChat }: { tab: PanelTab; onChat: () => void }) {
  if (tab === "stack.json") {
    return (
      <pre className="term-panel__code" aria-label="Stack en formato JSON">
        <code>
          {"{\n"}
          {"  "}<span className="tk-key">&quot;design&quot;</span>:{" "}
          [<span className="tk-str">&quot;Figma&quot;</span>,{" "}
          <span className="tk-str">&quot;FigJam&quot;</span>,{" "}
          <span className="tk-str">&quot;Storybook&quot;</span>],{"\n"}
          {"  "}<span className="tk-key">&quot;codigo&quot;</span>:{" "}
          [<span className="tk-str">&quot;React&quot;</span>,{" "}
          <span className="tk-str">&quot;Next.js&quot;</span>,{" "}
          <span className="tk-str">&quot;TypeScript&quot;</span>],{"\n"}
          {"  "}<span className="tk-key">&quot;ai&quot;</span>:{" "}
          [<span className="tk-str">&quot;Claude Code&quot;</span>,{" "}
          <span className="tk-str">&quot;prototipos vivos&quot;</span>]{"\n"}
          {"}"}
        </code>
      </pre>
    );
  }

  if (tab === "deploy.yml") {
    return (
      <div className="term-panel__session" aria-label="Proceso de trabajo">
        <p className="term-line term-line--cmd">
          <span className="term-prompt">$</span> cat deploy.yml
        </p>
        <p className="term-line">
          <span className="tk-key">pipeline</span>: <span className="tk-str">producto</span>
        </p>
        <p className="term-line term-line--ok">research — evidencia antes que opinión</p>
        <p className="term-line term-line--ok">prototipo — código real, no promesas</p>
        <p className="term-line term-line--ok">handoff — tokens, specs y QA</p>
        <p className="term-line term-line--run">
          <span className="term-led" aria-hidden="true" /> producción — midiendo impacto
        </p>
      </div>
    );
  }

  return (
    <div className="term-panel__session">
      <p className="term-line term-line--cmd">
        <span className="term-prompt">$</span> ./portfolio --resumen
      </p>
      <p className="term-line term-line--ok">5+ años diseñando producto fintech</p>
      <p className="term-line term-line--ok">4 empresas · 3 mercados LATAM</p>
      <p className="term-line term-line--ok">design systems shippeados a producción</p>
      <p className="term-line term-line--dim">➜ ejecuta un comando:</p>
      <div className="term-panel__chips">
        <Link href="/#proyectos-term" className="term-chip">
          &gt; proyectos
        </Link>
        <Link href="/#sobre-mi-term" className="term-chip">
          &gt; sobre-mí
        </Link>
        <Link href="/#contacto-term" className="term-chip">
          &gt; contacto
        </Link>
        <button type="button" className="term-chip term-chip--accent" onClick={onChat}>
          &gt; ia --chat
        </button>
      </div>
    </div>
  );
}

/**
 * Hero del skin Terminal v2 ("dev mode"): domo dither 3D al fondo, prompt
 * tipeado, titular display y una ventana de terminal interactiva con tabs.
 */
export function TermHero() {
  const skin = useSkin();
  const { openChat } = useChatLauncher();
  const [tab, setTab] = useState<PanelTab>("portfolio.sh");

  const prompt = useTyped("whoami", { active: skin === "terminal", delay: 500 });
  const answer = useTyped("product designer × frontend developer", {
    active: prompt.done,
    speed: 24,
    delay: 260,
  });

  return (
    <section className="term-hero" id="home-term" aria-label="Presentación — dev mode">
      <TermHeroFx />
      <div className="term-hero__glow" aria-hidden="true" />
      <div className="term-hero__scan" aria-hidden="true" />

      <motion.div
        className="container term-hero__inner"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div className="term-hero__bar" variants={item}>
          <span className="term-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="term-hero__path">mateo@bogota — ~/portfolio</span>
          <span className="term-hero__branch">⎇ main</span>
          <span className="term-hero__led">
            <span className="term-led" aria-hidden="true" />
            {profile.availability}
          </span>
        </motion.div>

        <motion.p className="term-hero__prompt" variants={item} aria-hidden="true">
          <span className="term-prompt">mateo@bogota:~$</span> {prompt.typed}
          {prompt.done ? null : <span className="term-caret" />}
          {prompt.done ? (
            <>
              <br />
              <span className="term-hero__answer">
                {answer.typed}
                <span className="term-caret" />
              </span>
            </>
          ) : null}
        </motion.p>

        <h1 className="term-hero__title">
          <motion.span variants={item}>Diseño producto.</motion.span>
          <motion.span variants={item}>
            Lo llevo a <em>producción.</em>
          </motion.span>
        </h1>

        <motion.p className="term-hero__sub" variants={item}>
          Product Designer senior en Bogotá. Convierto flujos complejos de fintech y banca
          B2B en experiencias claras y medibles — y salto al código cuando acelera el ship.
        </motion.p>

        <motion.div className="term-hero__cta" variants={item}>
          <Link href="/#proyectos-term" className="term-btn term-btn--solid">
            ver proyectos
            <kbd aria-hidden="true">⏎</kbd>
          </Link>
          <button
            type="button"
            className="term-btn term-btn--ghost"
            onClick={() => openChat()}
          >
            hablar con mi IA
            <kbd aria-hidden="true">⌘K</kbd>
          </button>
        </motion.div>

        <motion.aside
          className="term-hero__panel term-window"
          variants={item}
          aria-label="Terminal interactiva del portafolio"
        >
          <header className="term-window__chrome">
            <span className="term-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <div className="term-window__tabs" role="tablist" aria-label="Archivos">
              {PANEL_TABS.map((name) => (
                <button
                  key={name}
                  type="button"
                  role="tab"
                  aria-selected={tab === name}
                  className={`term-window__tab${tab === name ? " is-active" : ""}`}
                  onClick={() => setTab(name)}
                >
                  {name}
                </button>
              ))}
            </div>
            <span className="term-window__hint">zsh</span>
          </header>
          <div className="term-window__body" role="tabpanel">
            <PanelBody tab={tab} onChat={() => openChat()} />
          </div>
        </motion.aside>

        <motion.ul className="term-hero__stats" variants={item} aria-label="Métricas">
          {profile.stats.map((stat) => (
            <li key={stat.label}>
              <span className="term-stat__num">
                {String(stat.value).padStart(2, "0")}
                {stat.plus ? "+" : ""}
              </span>
              <span className="term-stat__label">{stat.label}</span>
            </li>
          ))}
        </motion.ul>
      </motion.div>

      <Link className="term-hero__scrollhint" href="/#proyectos-term">
        <span aria-hidden="true">▾</span> scroll --to proyectos
      </Link>
    </section>
  );
}
