"use client";

import React from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Minus, Square, X, Zap } from "lucide-react";

export default function WindowTitleBar() {
  const appWindow = React.useMemo(() => {
    if (typeof window !== "undefined" && "__TAURI_INTERNALS__" in window) {
      try {
        return getCurrentWindow();
      } catch {
        return null;
      }
    }
    return null;
  }, []);

  const handleMinimize = () => appWindow?.minimize();
  const handleMaximize = () => appWindow?.toggleMaximize();
  const handleClose = () => appWindow?.close();

  return (
    <div 
      data-tauri-drag-region 
      className="h-10 bg-black/40 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 select-none fixed top-0 w-full z-[100] transition-colors hover:bg-black/60"
    >
      <div className="flex items-center gap-2 pointer-events-none">
        <Zap size={14} className="text-accent" fill="currentColor" />
        <span className="text-[10px] font-black tracking-[0.2em] uppercase text-zinc-400">Citiline ERP <span className="opacity-50">2026</span></span>
      </div>

      <div className="flex items-center">
        <button 
          onClick={handleMinimize}
          className="w-10 h-10 flex items-center justify-center hover:bg-white/5 transition-colors group"
        >
          <Minus size={14} className="text-zinc-500 group-hover:text-white" />
        </button>
        <button 
          onClick={handleMaximize}
          className="w-10 h-10 flex items-center justify-center hover:bg-white/5 transition-colors group"
        >
          <Square size={12} className="text-zinc-500 group-hover:text-white" />
        </button>
        <button 
          onClick={handleClose}
          className="w-10 h-10 flex items-center justify-center hover:bg-rose-500/80 transition-colors group"
        >
          <X size={14} className="text-zinc-500 group-hover:text-white" />
        </button>
      </div>
    </div>
  );
}
