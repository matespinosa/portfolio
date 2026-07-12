import type { ReactNode } from "react";

type TermWindowProps = {
  /** Texto del título en la barra de la ventana (path, comando, archivo…) */
  title: string;
  /** Etiqueta secundaria a la derecha del chrome (proceso, lenguaje…) */
  meta?: string;
  className?: string;
  children: ReactNode;
};

/** Ventana de terminal reutilizable: chrome con semáforo + título + cuerpo. */
export function TermWindow({ title, meta, className = "", children }: TermWindowProps) {
  return (
    <div className={`term-window ${className}`.trim()}>
      <header className="term-window__chrome">
        <span className="term-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="term-window__title">{title}</span>
        {meta ? <span className="term-window__hint">{meta}</span> : null}
      </header>
      <div className="term-window__body">{children}</div>
    </div>
  );
}
