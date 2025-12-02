import React from 'react';

// Type3D: split `text` into per-character spans and animate them in with a slight
// translateZ + rotateX to create a 3D typing entrance. Includes an optional caret.
// Usage: <Type3D text="Hello" delay={36} depth={36} className="text-3xl"/>

export default function Type3D({ text = '', delay = 36, depth = 36, className = '', caret = true }){
  // ensure text is a string
  const s = String(text || '');
  return (
    <span className={`typer-3d ${className}`} aria-hidden="false">
      {Array.from(s).map((ch, i) => (
        <span key={i}
          className="typer-char"
          style={{ animationDelay: `${i * delay}ms`, ['--depth']: `${depth}px` }}
        >{ch}</span>
      ))}
      {caret && <span className="typer-caret" aria-hidden="true">&nbsp;</span>}
    </span>
  );
}
