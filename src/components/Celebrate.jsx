import { useEffect, useRef } from 'react'

// Pluie de confettis aux couleurs de la marque (canvas, sans dépendance).
// Deux canons latéraux + une pluie depuis le haut, ~4 s.
const COLORS = ['#003197', '#DE1C1A', '#ffffff', '#3d6bdc', '#f5b400']

export function Confetti({ duration = 4200 }) {
  const ref = useRef(null)
  useEffect(() => {
    const cv = ref.current
    const ctx = cv.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => { cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0) }
    resize(); addEventListener('resize', resize)
    const W = () => innerWidth, H = () => innerHeight
    const parts = []
    const make = (x, y, angle, speed) => ({
      x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      w: 6 + Math.random() * 7, h: 8 + Math.random() * 10, r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.35,
      c: COLORS[(Math.random() * COLORS.length) | 0], shape: Math.random() < 0.25 ? 'circle' : 'rect', tilt: Math.random() * 10,
    })
    const burst = () => {
      for (let i = 0; i < 90; i++) {
        parts.push(make(0, H() * 0.75, -Math.PI / 3 + (Math.random() - 0.5) * 0.8, 9 + Math.random() * 9))
        parts.push(make(W(), H() * 0.75, -Math.PI * 2 / 3 + (Math.random() - 0.5) * 0.8, 9 + Math.random() * 9))
      }
    }
    burst()
    const t2 = setTimeout(burst, 650)
    let rain = 0
    const start = performance.now()
    let raf
    const tick = (now) => {
      const t = now - start
      ctx.clearRect(0, 0, W(), H())
      if (t < duration * 0.6 && rain++ % 2 === 0) parts.push(make(Math.random() * W(), -20, Math.PI / 2, 2 + Math.random() * 2))
      for (const p of parts) {
        p.vy += 0.22; p.vx *= 0.985; p.vy *= 0.985
        p.x += p.vx + Math.sin((t / 300) + p.tilt) * 0.6; p.y += p.vy; p.r += p.vr
        const fade = t > duration - 900 ? Math.max(0, (duration - t) / 900) : 1
        ctx.save(); ctx.globalAlpha = fade; ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c
        if (p.c === '#ffffff') { ctx.strokeStyle = '#003197'; ctx.lineWidth = 0.6 }
        if (p.shape === 'circle') { ctx.beginPath(); ctx.arc(0, 0, p.w / 2.4, 0, Math.PI * 2); ctx.fill() }
        else { ctx.scale(1, Math.cos(t / 120 + p.tilt)); ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); if (p.c === '#ffffff') ctx.strokeRect(-p.w / 2, -p.h / 2, p.w, p.h) }
        ctx.restore()
      }
      if (t < duration) raf = requestAnimationFrame(tick)
      else ctx.clearRect(0, 0, W(), H())
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); clearTimeout(t2); removeEventListener('resize', resize) }
  }, [duration])
  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-[60] h-full w-full" />
}
