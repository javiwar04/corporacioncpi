"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  onFallback?: () => void;
}
interface State {
  hasError: boolean;
}

// Evita que un fallo al crear el contexto WebGL (límite de contextos del navegador,
// GPU ocupada, etc.) tumbe toda la página. Muestra un aviso y deja usar el plano 2D.
export class Canvas3DErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch() {
    // Silencioso: el mensaje ya se muestra al usuario.
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="grid h-full min-h-[420px] w-full place-items-center rounded-xl2 border border-dashed border-navy/20 bg-white p-6 text-center">
          <div>
            <p className="font-serif text-lg font-medium text-navy">No se pudo iniciar la vista 3D</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-navy/60">
              Tu navegador se quedó sin contextos de gráficos (WebGL). Recarga la página para
              volver a intentarlo. Mientras tanto, el plano 2D funciona con normalidad.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary mt-4"
            >
              Recargar página
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
