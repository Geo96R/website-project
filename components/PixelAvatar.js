import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function PixelCVAvatar({
  spriteUrl = "__placeholder__",
  frameW = 96, // single frame width in PX
  frameH = 96, // single frame height in PX
  rows = { idle: 0, typing: 1, glance: 2 },
  frames = { idle: 12, typing: 16, glance: 10 },
  fps = 12, // default 12 for chunky vibes
  className = "", // optional extra classes for the outer window
  windowTitle = "// cv-avatar",
  accent = "cyan", // "cyan" | "magenta" | "lime" | "violet" | "amber"
}) {
  const [state, setState] = useState("typing");
  const [iterationKey, setIterationKey] = useState(0); // force restart CSS anim when state changes
  const containerRef = useRef(null);

  const ACCENT_MAP = {
    cyan: "from-cyan-400/60 to-blue-500/30",
    magenta: "from-fuchsia-400/60 to-pink-500/30",
    lime: "from-lime-400/60 to-emerald-500/30",
    violet: "from-violet-400/60 to-indigo-500/30",
    amber: "from-amber-400/60 to-orange-500/30",
  };

  // Animation durations derived from frames and fps
  const durations = useMemo(
    () => ({
      idle: Math.max(0.001, frames.idle / fps),
      typing: Math.max(0.001, frames.typing / fps),
      glance: Math.max(0.001, frames.glance / fps),
    }),
    [frames, fps]
  );

  // State machine: mostly typing; sometimes glance at camera; occasional idle/blink
  useEffect(() => {
    let mounted = true;

    const scheduleNext = () => {
      const rand = Math.random();
      // every 3–6 seconds, maybe glance; otherwise keep typing; rarely idle
      const nextIn = 3 + Math.random() * 3;
      const t = setTimeout(() => {
        if (!mounted) return;
        if (rand < 0.15) {
          // 15% chance: idle blink cycle
          setState("idle");
          setIterationKey((k) => k + 1);
          setTimeout(() => {
            if (!mounted) return;
            setState("typing");
            setIterationKey((k) => k + 1);
            scheduleNext();
          }, durations.idle * 1000);
          return;
        }
        if (rand < 0.55) {
          // 40% chance: glance at camera
          setState("glance");
          setIterationKey((k) => k + 1);
          setTimeout(() => {
            if (!mounted) return;
            setState("typing");
            setIterationKey((k) => k + 1);
            scheduleNext();
          }, durations.glance * 1000);
          return;
        }
        // otherwise keep typing and reschedule
        setState("typing");
        setIterationKey((k) => k + 1);
        scheduleNext();
      }, nextIn * 1000);
      return t;
    };

    const id = scheduleNext();
    return () => {
      mounted = false;
      clearTimeout(id);
    };
  }, [durations]);

  const rowIndex = state === "idle" ? rows.idle : state === "glance" ? rows.glance : rows.typing;
  const frameCount = Math.max(1, state === "idle" ? frames.idle : state === "glance" ? frames.glance : frames.typing);
  const duration = durations[state];

  // Build a unique animation name per state so we can switch rows without colliding keyframes.
  // unique animation name per state+iteration to avoid keyframe collisions
  const animName = useMemo(() => `sprite-${state}-${iterationKey}-kf`, [state, iterationKey]);

  // Build a placeholder sprite sheet if requested so the canvas preview animates
  const [resolvedUrl, setResolvedUrl] = useState(spriteUrl);
  useEffect(() => {
    if (spriteUrl !== "__placeholder__") { setResolvedUrl(spriteUrl); return; }
    const maxFrames = Math.max(frames.idle, frames.typing, frames.glance);
    const sheetW = frameW * maxFrames;
    const sheetH = frameH * 3; // 3 rows
    const cvs = document.createElement("canvas");
    cvs.width = sheetW; cvs.height = sheetH;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    // helper to draw pixel blocks
    const px = (x,y,w,h,fill) => { ctx.fillStyle = fill; ctx.fillRect(x, y, w, h); };
    const drawChar = (row, col, kind, f) => {
      const ox = col * frameW; const oy = row * frameH;
      // background - BLACK
      px(ox, oy, frameW, frameH, "#000000");

      // CENTERED LAYOUT - Remove dead space
      
      // === DESK (centered) ===
      px(ox + 8, oy + 70, 80, 16, "#5d4a3a");
      px(ox + 8, oy + 86, 80, 4, "#3d2a1a"); // shadow
      
      // === PERSON (RIGHT SIDE, CENTERED) ===
      
      // Shirt/body
      px(ox + 50, oy + 55, 36, 28, "#2a2540"); // dark navy shirt
      
      // Neck
      px(ox + 60, oy + 47, 16, 8, "#f5d5b5");
      
      // Head shape
      px(ox + 56, oy + 25, 24, 22, "#f5d5b5");
      
      // Hair (brown)
      px(ox + 55, oy + 21, 26, 10, "#4a3428");
      px(ox + 54, oy + 25, 28, 8, "#4a3428");
      // Hair strands
      px(ox + 53, oy + 27, 6, 6, "#5a4438");
      px(ox + 75, oy + 25, 6, 8, "#5a4438");
      
      // Ear
      px(ox + 80, oy + 35, 4, 6, "#e5c5a5");
      
      // Eyes
      const eyeY = oy + 35;
      if (kind === "glance") {
        // Looking at viewer
        px(ox + 61, eyeY, 6, 6, "#ffffff");
        px(ox + 62, eyeY + 1, 4, 4, "#8b4545");
        px(ox + 63, eyeY + 1, 2, 4, "#000000");
        px(ox + 69, eyeY, 6, 6, "#ffffff");
        px(ox + 70, eyeY + 1, 4, 4, "#8b4545");
        px(ox + 71, eyeY + 1, 2, 4, "#000000");
      } else {
        // Looking left at monitor
        px(ox + 60, eyeY, 6, 6, "#ffffff");
        px(ox + 60, eyeY + 1, 4, 4, "#8b4545");
        px(ox + 60, eyeY + 1, 2, 4, "#000000");
        px(ox + 68, eyeY, 6, 6, "#ffffff");
        px(ox + 68, eyeY + 1, 4, 4, "#8b4545");
        px(ox + 68, eyeY + 1, 2, 4, "#000000");
      }
      
      // Eyebrows
      px(ox + 61, eyeY - 3, 6, 2, "#3a2418");
      px(ox + 69, eyeY - 3, 6, 2, "#3a2418");
      
      // Nose
      px(ox + 64, oy + 40, 3, 4, "#e5c5a5");
      px(ox + 65, oy + 42, 3, 2, "#d5b595");
      
      // Mouth (slight smile)
      px(ox + 62, oy + 43, 8, 2, "#c5856a");
      px(ox + 63, oy + 44, 6, 1, "#8b4545");
      
      // TYPING ANIMATION - Hands actually touching keyboard
      const typingOffset = (kind === "typing" && f % 2 === 0) ? 1 : 0;
      
      // Arms reaching to keyboard
      // Left arm
      px(ox + 44, oy + 60 + typingOffset, 12, 18, "#2a2540");
      px(ox + 40, oy + 70 + typingOffset, 10, 8, "#f5d5b5"); // hand
      
      // Right arm - MOVED MORE LEFT to be on keyboard
      px(ox + 70, oy + 60 + typingOffset, 12, 18, "#2a2540");
      px(ox + 74, oy + 70 + typingOffset, 10, 8, "#f5d5b5"); // hand - on keyboard
      
      // KEYBOARD - Lowered to hand height, extended length
      px(ox + 35, oy + 72, 50, 8, "#3a3a3a"); // Extended keyboard
      px(ox + 36, oy + 73, 48, 6, "#2a2a2a");
      
      // Keyboard keys (hands touching them)
      if (kind === "typing") {
        // Highlight keys being pressed
        const keyOffset = f % 8;
        for (let i = 0; i < 16; i++) {
          const keyX = ox + 37 + (i * 3);
          const keyY = oy + 74;
          if ((i + keyOffset) % 4 === 0) {
            px(keyX, keyY, 2, 2, "#6a6a6a"); // highlighted key
          } else {
            px(keyX, keyY, 2, 2, "#4a4a4a"); // normal key
          }
        }
      } else {
        // Normal keyboard keys
        for (let i = 0; i < 16; i++) {
          const keyX = ox + 37 + (i * 3);
          const keyY = oy + 74;
          px(keyX, keyY, 2, 2, "#4a4a4a");
        }
      }
      
      // Screen glow on face (from monitor)
      ctx.globalAlpha = 0.2;
      px(ox + 52, oy + 30, 12, 20, "#4a9aca");
      ctx.globalAlpha = 1;
      
      // === MONITOR (DRAWN LAST SO IT APPEARS IN FRONT) ===
      // Width: 45, Height: 42, moved UP
      const monW = 45;
      const monH = 42;
      const monX = ox + 5;
      const monY = oy + 32; // MOVED UP (was 38)
      
      // Monitor stand legs - 2 vertical sticks from bottom center to desk
      const standCenterX = monX + (monW / 2);
      px(standCenterX - 6, monY + monH, 4, 8, "#2a2a2a"); // left leg
      px(standCenterX + 2, monY + monH, 4, 8, "#2a2a2a"); // right leg
      // Stand base on desk
      px(standCenterX - 8, oy + 70, 16, 3, "#3a3a3a");
      
      // Monitor frame
      px(monX, monY, monW, monH, "#2a2a2a");
      px(monX + 2, monY + 2, monW - 4, monH - 4, "#000000");
      
      // MONITOR GLOW LINES - adjusted for new dimensions
      const glowIntensity = 0.4 + (Math.sin(f * 0.3) * 0.2);
      ctx.globalAlpha = glowIntensity;
      
      // Glow lines from screen towards person
      px(monX + 2, monY + 2, 1, 1, "#ffffff");
      px(monX + 3, monY + 3, 1, 1, "#ffffff");
      px(monX + 4, monY + 4, 1, 1, "#ffffff");
      px(monX + 5, monY + 5, 1, 1, "#ffffff");
      px(monX + 6, monY + 6, 1, 1, "#ffffff");
      px(monX + 7, monY + 7, 1, 1, "#ffffff");
      px(monX + 8, monY + 8, 1, 1, "#ffffff");
      px(monX + 9, monY + 9, 1, 1, "#ffffff");
      px(monX + 10, monY + 10, 1, 1, "#ffffff");
      px(monX + 11, monY + 11, 1, 1, "#ffffff");
      
      // Another glow line
      px(monX + 5, monY + 2, 1, 1, "#ffffff");
      px(monX + 6, monY + 3, 1, 1, "#ffffff");
      px(monX + 7, monY + 4, 1, 1, "#ffffff");
      px(monX + 8, monY + 5, 1, 1, "#ffffff");
      px(monX + 9, monY + 6, 1, 1, "#ffffff");
      px(monX + 10, monY + 7, 1, 1, "#ffffff");
      px(monX + 11, monY + 8, 1, 1, "#ffffff");
      px(monX + 12, monY + 9, 1, 1, "#ffffff");
      px(monX + 13, monY + 10, 1, 1, "#ffffff");
      px(monX + 14, monY + 11, 1, 1, "#ffffff");
      
      // Monitor border glow (adjusted for new taller dimensions)
      px(monX, monY, 1, monH, "#00ffff"); // left border
      px(monX + monW - 1, monY, 1, monH, "#00ffff"); // right border
      px(monX, monY, monW, 1, "#00ffff"); // top border
      px(monX, monY + monH - 1, monW, 1, "#00ffff"); // bottom border
      
      ctx.globalAlpha = 1;
    };

    // draw each row with its frame count
    const kinds = ["idle","typing","glance"];
    kinds.forEach((k, rowIdx) => {
      const fc = frames[k];
      for (let f=0; f<maxFrames; f++) {
        const within = f < fc;
        if (within) drawChar(rowIdx, f, k, f);
        else { // pad empty frames so all rows have same width
          const ox = f*frameW, oy=rowIdx*frameH; ctx.fillStyle="#000000"; ctx.fillRect(ox, oy, frameW, frameH);
        }
      }
    });

    setResolvedUrl(cvs.toDataURL("image/png"));
  }, [spriteUrl, frameW, frameH, frames]);

  return (
    <div
      ref={containerRef}
      className={[
        "relative w-full h-full select-none",
        "rounded-lg border border-white/20 bg-gradient-to-br",
        ACCENT_MAP[accent],
        "shadow-[0_0_20px_-5px_rgba(0,255,255,0.2)] backdrop-blur-sm",
        className,
      ].join(" ")}
      style={{ imageRendering: "pixelated" }}
    >
      {/* Character sprite */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url(${resolvedUrl})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: `0px -${rowIndex * frameH}px`, // select row
          backgroundSize: "auto",
          imageRendering: "pixelated",
          animation: `${animName} ${duration}s steps(${frameCount}) infinite`,
          filter: "saturate(1.2)",
        }}
      />

      {/* Monitor glow towards face */}
      <motion.div
        className="pointer-events-none absolute -inset-2 rounded-lg"
        initial={{ opacity: 0.25 }}
        animate={{ opacity: [0.15, 0.35, 0.15] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(60% 60% at 30% 40%, rgba(0,255,255,0.25) 0%, rgba(0,160,255,0.12) 35%, rgba(0,0,0,0) 70%)",
          mixBlendMode: "screen",
        }}
      />

      {/* Dynamic keyframes for the current row/state */}
      <style>
        {`
        @keyframes ${animName} {
          from { background-position-x: 0px; }
          to { background-position-x: -${frameW * frameCount}px; }
        }
        `}
      </style>
    </div>
  );
}
