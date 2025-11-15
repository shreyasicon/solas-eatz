"use client"

import { useState } from "react"
import { Sparkles, UtensilsCrossed, Coffee, Pizza } from "lucide-react"

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true)

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(onComplete, 500) // Wait for fade out animation
  }

  if (!isVisible) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-950 via-cyan-950 to-orange-950 cursor-pointer overflow-hidden"
      onClick={handleDismiss}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* Floating food icons */}
      <div className="absolute top-1/4 left-1/4 animate-float-slow">
        <Pizza className="w-12 h-12 text-orange-400/40 animate-spin-slow" />
      </div>
      <div className="absolute top-1/3 right-1/4 animate-float-delayed">
        <Coffee className="w-10 h-10 text-cyan-400/40 animate-bounce-slow" />
      </div>
      <div className="absolute bottom-1/4 left-1/3 animate-float">
        <UtensilsCrossed className="w-14 h-14 text-orange-400/40 animate-spin-reverse" />
      </div>
      <div className="absolute bottom-1/3 right-1/3 animate-float-slow">
        <Sparkles className="w-8 h-8 text-cyan-400/40 animate-pulse" />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center space-y-8 px-4">
        {/* 3D Logo */}
        <div className="relative inline-block animate-scale-in">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-orange-500 blur-3xl opacity-50 animate-pulse-slow" />
          <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-cyan-500 via-orange-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl transform hover:rotate-12 transition-transform duration-500 animate-float">
            <div className="absolute inset-2 bg-gradient-to-br from-cyan-400 to-orange-400 rounded-2xl animate-pulse-slow" />
            <Sparkles className="relative w-16 h-16 text-white drop-shadow-2xl animate-spin-slow" />
          </div>
        </div>

        {/* 3D Text */}
        <div className="space-y-4 animate-fade-in-up">
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-black tracking-tight">
            <span className="inline-block animate-text-3d bg-gradient-to-r from-cyan-400 via-orange-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl [text-shadow:_0_4px_8px_rgb(0_0_0_/_40%),_0_8px_16px_rgb(6_182_212_/_30%),_0_12px_24px_rgb(249_115_22_/_20%)]">
              Solas
            </span>
            <br />
            <span className="inline-block animate-text-3d-delayed bg-gradient-to-r from-orange-400 via-cyan-400 to-orange-400 bg-clip-text text-transparent drop-shadow-2xl [text-shadow:_0_4px_8px_rgb(0_0_0_/_40%),_0_8px_16px_rgb(249_115_22_/_30%),_0_12px_24px_rgb(6_182_212_/_20%)]">
              Eatz
            </span>
          </h1>

          <p className="text-2xl md:text-3xl font-semibold text-white/90 animate-fade-in-delayed drop-shadow-lg">
            Eat. Earn. Explore.
          </p>
        </div>

        {/* Tap to continue hint */}
        <div className="animate-bounce-slow animate-fade-in-delayed-2">
          <p className="text-white/60 text-sm md:text-base">Tap anywhere to continue</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-5deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-15px) scale(1.05); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        @keyframes scale-in {
          from { transform: scale(0) rotate(-180deg); opacity: 0; }
          to { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes fade-in-up {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fade-in-delayed {
          0% { opacity: 0; }
          50% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes fade-in-delayed-2 {
          0% { opacity: 0; }
          70% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes text-3d {
          0%, 100% { 
            transform: perspective(1000px) rotateY(-5deg) rotateX(5deg);
          }
          50% { 
            transform: perspective(1000px) rotateY(5deg) rotateX(-5deg);
          }
        }
        @keyframes text-3d-delayed {
          0%, 100% { 
            transform: perspective(1000px) rotateY(5deg) rotateX(-5deg);
          }
          50% { 
            transform: perspective(1000px) rotateY(-5deg) rotateX(5deg);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 7s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 15s linear infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-scale-in {
          animation: scale-in 1s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out 0.5s both;
        }
        .animate-fade-in-delayed {
          animation: fade-in-delayed 2s ease-out;
        }
        .animate-fade-in-delayed-2 {
          animation: fade-in-delayed-2 3s ease-out;
        }
        .animate-text-3d {
          animation: text-3d 4s ease-in-out infinite;
          transform-style: preserve-3d;
        }
        .animate-text-3d-delayed {
          animation: text-3d-delayed 4s ease-in-out infinite;
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  )
}
