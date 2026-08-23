/**
 * @license
 * Proprietary and Confidential - Copyright (c) 2026 Ing. Mario Fantini.
 * All Rights Reserved / Tutti i Diritti Riservati.
 */

import React from 'react';

interface NotulaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  showText?: boolean;
  className?: string;
}

/**
 * Emblema Ufficiale Notula™ ideato dall'Ing. Mario Fantini:
 * - Tavoletta dei Fasti Romani (la pietra incisa del calendario antico con le scanalature del tempo)
 * - L'Uccello Messaggero di Apollo (autentico rapace piumato con 2 sole ali spiegate, becco acuminato dorato, capo fiero e coda piumata a ventaglio)
 * - Le Stelle di Orientamento Astronomico (la stella polare di Apollo e i punti cardinali)
 */
export const NotulaLogo: React.FC<NotulaLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-24 h-24 sm:w-28 sm:h-28',
    '3xl': 'w-32 h-32 sm:w-40 sm:h-40',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Emblema Vettoriale: Fasti Romani + Volatile Messaggero di Apollo (2 ali piumate) + Stelle */}
      <div 
        className={`relative flex items-center justify-center rounded-xl bg-gradient-to-b from-[#1e293b] via-[#0f172a] to-[#020617] text-white shadow-lg shadow-blue-950/40 border border-blue-400/30 shrink-0 ${sizeClasses[size]}`}
        title="Notula™: Fasti Romani, Uccello Messaggero di Apollo (2 ali) & Stelle di Orientamento - Ing. Mario Fantini"
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full p-1"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradiente Tabula Fasti Romani */}
            <linearGradient id="tabulaStoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.08" />
            </linearGradient>

            {/* Gradiente Ali Piumate Volatile di Apollo */}
            <linearGradient id="birdWingGradLeft" x1="100%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#1d4ed8" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#e0f2fe" />
            </linearGradient>

            <linearGradient id="birdWingGradRight" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1d4ed8" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#e0f2fe" />
            </linearGradient>

            {/* Gradiente Dorato Becco & Corona Astrale */}
            <radialGradient id="goldStarGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </radialGradient>
          </defs>

          {/* 1. TAVOLETTA DEI FASTI ROMANI (Tabula del Calendario Antico) */}
          <rect 
            x="13" 
            y="9" 
            width="74" 
            height="82" 
            rx="9" 
            fill="url(#tabulaStoneGrad)" 
            stroke="#60a5fa" 
            strokeWidth="2.2" 
            strokeOpacity="0.75" 
          />

          {/* Scanalature araldiche della pietra del calendario */}
          <line x1="20" y1="18" x2="36" y2="18" stroke="#93c5fd" strokeWidth="1.5" strokeOpacity="0.45" strokeLinecap="round" />
          <line x1="64" y1="18" x2="80" y2="18" stroke="#93c5fd" strokeWidth="1.5" strokeOpacity="0.45" strokeLinecap="round" />
          <line x1="20" y1="84" x2="80" y2="84" stroke="#93c5fd" strokeWidth="1.5" strokeOpacity="0.45" strokeLinecap="round" />

          {/* 2. LE STELLE DI ORIENTAMENTO ASTRONOMICO */}
          {/* Stella Polare / Stella di Apollo a 8 punte */}
          <path 
            d="M50 12 L51.8 17.5 L57.5 19 L51.8 20.5 L50 26 L48.2 20.5 L42.5 19 L48.2 17.5 Z" 
            fill="url(#goldStarGlow)" 
          />
          {/* Punti cardinali minori */}
          <circle cx="28" cy="17" r="1.4" fill="#fde68a" />
          <circle cx="72" cy="17" r="1.4" fill="#fde68a" />

          {/* 3. L'UCCELLO MESSAGGERO DI APOLLO (AUTENTICO VOLATILE CON 2 SOLE ALI PIUMATE SPIEGATE) */}
          
          {/* ALA SINISTRA (Spiegata ad arco verso l'alto con 3 penne remiganti distinte) */}
          <path 
            d="M48 50 C44 42 32 30 14 30 C15 36 19 40 23 43 C18 43 14 47 16 51 C20 53 25 54 29 55 C24 57 20 62 23 64 C29 65 39 61 48 56 Z" 
            fill="url(#birdWingGradLeft)" 
            stroke="#e0f2fe" 
            strokeWidth="0.8" 
          />

          {/* ALA DESTRA (Simmetrica, spiegata verso l'alto con 3 penne remiganti distinte) */}
          <path 
            d="M52 50 C56 42 68 30 86 30 C85 36 81 40 77 43 C82 43 86 47 84 51 C80 53 75 54 71 55 C76 57 80 62 77 64 C71 65 61 61 52 56 Z" 
            fill="url(#birdWingGradRight)" 
            stroke="#e0f2fe" 
            strokeWidth="0.8" 
          />

          {/* CORPO DEL VOLATILE & PETTO PROMINENTE */}
          <path 
            d="M50 36 C45 36 44 44 45 52 C46 58 48 64 50 68 C52 64 54 58 55 52 C56 44 55 36 50 36 Z" 
            fill="#38bdf8" 
            stroke="#e0f2fe" 
            strokeWidth="0.7" 
          />

          {/* TESTA CON COLLO E PROFILO DEL VOLATILE */}
          <circle cx="50" cy="33" r="5" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="0.7" />

          {/* BECCO DORATO ACUMINATO DA RAPACE / MESSAGGERO (Rivolto verso l'alto) */}
          <path 
            d="M50 24 L46.5 32 L53.5 32 Z" 
            fill="url(#goldStarGlow)" 
            stroke="#b45309" 
            strokeWidth="0.5" 
          />

          {/* OCCHI VIGILI DEL VOLATILE */}
          <circle cx="48.2" cy="33.5" r="1.1" fill="#0f172a" />
          <circle cx="48.5" cy="33.2" r="0.4" fill="#ffffff" />
          <circle cx="51.8" cy="33.5" r="1.1" fill="#0f172a" />
          <circle cx="51.5" cy="33.2" r="0.4" fill="#ffffff" />

          {/* CODA PIUMATA A VENTAGLIO (3 penne timoniere chiaramente da uccello) */}
          <path 
            d="M48 67 L42 77 L47 75 L50 78 L53 75 L58 77 L52 67 Z" 
            fill="#1d4ed8" 
            stroke="#60a5fa" 
            strokeWidth="0.8" 
          />
        </svg>
      </div>

      {/* Brand Text: Single Line Pure Branding */}
      {showText && (
        <div className="flex items-center select-none">
          <span className="font-extrabold tracking-tight text-base sm:text-lg text-[var(--text-main)] font-sans leading-none">
            Notula<span className="text-blue-500 font-normal text-xs align-super ml-0.5">™</span>
          </span>
        </div>
      )}
    </div>
  );
};
