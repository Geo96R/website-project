'use client';

import { useEffect, useState } from 'react';

export default function KeyboardVisualizer({ command }) {
  const [highlightedKey, setHighlightedKey] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!command) {
      setHighlightedKey(null);
      setCurrentIndex(0);
      return;
    }

    let index = 0;

    const interval = setInterval(() => {
      if (index < command.length) {
        const char = command[index];
        const key = getKeyForChar(char);
        setHighlightedKey(key);
        index++;
        setCurrentIndex(index);
      } else {
        clearInterval(interval);
        // Clear highlight after a delay
        setTimeout(() => {
          setHighlightedKey(null);
          setCurrentIndex(0);
        }, 1000);
      }
    }, 50); // faster keyboard

    return () => clearInterval(interval);
  }, [command]);

  const getKeyForChar = (char) => {
    const keyMap = {
      'a': 'k-65', 'b': 'k-66', 'c': 'k-67', 'd': 'k-68', 'e': 'k-69', 'f': 'k-70',
      'g': 'k-71', 'h': 'k-72', 'i': 'k-73', 'j': 'k-74', 'k': 'k-75', 'l': 'k-76',
      'm': 'k-77', 'n': 'k-78', 'o': 'k-79', 'p': 'k-80', 'q': 'k-81', 'r': 'k-82',
      's': 'k-83', 't': 'k-84', 'u': 'k-85', 'v': 'k-86', 'w': 'k-87', 'x': 'k-88',
      'y': 'k-89', 'z': 'k-90',
      '0': 'k-48', '1': 'k-49', '2': 'k-50', '3': 'k-51', '4': 'k-52',
      '5': 'k-53', '6': 'k-54', '7': 'k-55', '8': 'k-56', '9': 'k-57',
      '.': 'k-190', '/': 'k-191', '-': 'k-189', '_': 'k-189', ' ': 'k-32'
    };
    return keyMap[char.toLowerCase()] || null;
  };

  return (
    <div id="lt-keyboard" className="w-full">
      {/* ESC and numbers row */}
      <div id="k-27" className={`key ${highlightedKey === 'k-27' ? 'highlighted' : ''}`}>ESC</div>
      <div id="k-49" className={`key ${highlightedKey === 'k-49' ? 'highlighted' : ''}`}>1</div>
      <div id="k-50" className={`key ${highlightedKey === 'k-50' ? 'highlighted' : ''}`}>2</div>
      <div id="k-51" className={`key ${highlightedKey === 'k-51' ? 'highlighted' : ''}`}>3</div>
      <div id="k-52" className={`key ${highlightedKey === 'k-52' ? 'highlighted' : ''}`}>4</div>
      <div id="k-53" className={`key ${highlightedKey === 'k-53' ? 'highlighted' : ''}`}>5</div>
      <div id="k-54" className={`key ${highlightedKey === 'k-54' ? 'highlighted' : ''}`}>6</div>
      <div id="k-55" className={`key ${highlightedKey === 'k-55' ? 'highlighted' : ''}`}>7</div>
      <div id="k-56" className={`key ${highlightedKey === 'k-56' ? 'highlighted' : ''}`}>8</div>
      <div id="k-57" className={`key ${highlightedKey === 'k-57' ? 'highlighted' : ''}`}>9</div>
      <div id="k-48" className={`key ${highlightedKey === 'k-48' ? 'highlighted' : ''}`}>0</div>
      <div id="k-189" className={`key ${highlightedKey === 'k-189' ? 'highlighted' : ''}`}>_</div>
      <div id="k-8" className={`key ${highlightedKey === 'k-8' ? 'highlighted' : ''}`}>BACK</div>

      {/* QWERTY row */}
      <div id="k-9" className={`key ${highlightedKey === 'k-9' ? 'highlighted' : ''}`}>TAB</div>
      <div id="k-81" className={`key ${highlightedKey === 'k-81' ? 'highlighted' : ''}`}>q</div>
      <div id="k-87" className={`key ${highlightedKey === 'k-87' ? 'highlighted' : ''}`}>w</div>
      <div id="k-69" className={`key ${highlightedKey === 'k-69' ? 'highlighted' : ''}`}>e</div>
      <div id="k-82" className={`key ${highlightedKey === 'k-82' ? 'highlighted' : ''}`}>r</div>
      <div id="k-84" className={`key ${highlightedKey === 'k-84' ? 'highlighted' : ''}`}>t</div>
      <div id="k-89" className={`key ${highlightedKey === 'k-89' ? 'highlighted' : ''}`}>y</div>
      <div id="k-85" className={`key ${highlightedKey === 'k-85' ? 'highlighted' : ''}`}>u</div>
      <div id="k-73" className={`key ${highlightedKey === 'k-73' ? 'highlighted' : ''}`}>i</div>
      <div id="k-79" className={`key ${highlightedKey === 'k-79' ? 'highlighted' : ''}`}>o</div>
      <div id="k-80" className={`key ${highlightedKey === 'k-80' ? 'highlighted' : ''}`}>p</div>
      <div id="k-219" className={`key ${highlightedKey === 'k-219' ? 'highlighted' : ''}`}>()</div>

      {/* ASDF row */}
      <div id="k-500" className={`key ${highlightedKey === 'k-500' ? 'highlighted' : ''}`}>CAPS</div>
      <div id="k-65" className={`key ${highlightedKey === 'k-65' ? 'highlighted' : ''}`}>a</div>
      <div id="k-83" className={`key ${highlightedKey === 'k-83' ? 'highlighted' : ''}`}>s</div>
      <div id="k-68" className={`key ${highlightedKey === 'k-68' ? 'highlighted' : ''}`}>d</div>
      <div id="k-70" className={`key ${highlightedKey === 'k-70' ? 'highlighted' : ''}`}>f</div>
      <div id="k-71" className={`key ${highlightedKey === 'k-71' ? 'highlighted' : ''}`}>g</div>
      <div id="k-72" className={`key ${highlightedKey === 'k-72' ? 'highlighted' : ''}`}>h</div>
      <div id="k-74" className={`key ${highlightedKey === 'k-74' ? 'highlighted' : ''}`}>j</div>
      <div id="k-75" className={`key ${highlightedKey === 'k-75' ? 'highlighted' : ''}`}>k</div>
      <div id="k-76" className={`key ${highlightedKey === 'k-76' ? 'highlighted' : ''}`}>l</div>
      <div id="k-186" className={`key ${highlightedKey === 'k-186' ? 'highlighted' : ''}`}>;</div>
      <div id="k-13" className={`key ${highlightedKey === 'k-13' ? 'highlighted' : ''}`}>ENTER</div>

      {/* ZXCV row */}
      <div id="k-16" className={`key ${highlightedKey === 'k-16' ? 'highlighted' : ''}`}>SHIFT</div>
      <div id="k-90" className={`key ${highlightedKey === 'k-90' ? 'highlighted' : ''}`}>z</div>
      <div id="k-88" className={`key ${highlightedKey === 'k-88' ? 'highlighted' : ''}`}>x</div>
      <div id="k-67" className={`key ${highlightedKey === 'k-67' ? 'highlighted' : ''}`}>c</div>
      <div id="k-86" className={`key ${highlightedKey === 'k-86' ? 'highlighted' : ''}`}>v</div>
      <div id="k-66" className={`key ${highlightedKey === 'k-66' ? 'highlighted' : ''}`}>b</div>
      <div id="k-78" className={`key ${highlightedKey === 'k-78' ? 'highlighted' : ''}`}>n</div>
      <div id="k-77" className={`key ${highlightedKey === 'k-77' ? 'highlighted' : ''}`}>m</div>
      <div id="k-188" className={`key ${highlightedKey === 'k-188' ? 'highlighted' : ''}`}>,</div>
      <div id="k-190" className={`key ${highlightedKey === 'k-190' ? 'highlighted' : ''}`}>.</div>
      <div id="k-191" className={`key ${highlightedKey === 'k-191' ? 'highlighted' : ''}`}>/</div>
      <div id="k-0" className={`key ${highlightedKey === 'k-0' ? 'highlighted' : ''}`}>SHIFT</div>

      {/* Space bar */}
      <div id="k-32" className={`key space ${highlightedKey === 'k-32' ? 'highlighted' : ''}`}></div>
    </div>
  );
}
