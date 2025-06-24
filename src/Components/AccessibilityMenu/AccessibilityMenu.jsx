import React, { useEffect, useState } from 'react';
import './AccessibilityMenu.css';

export default function Accessibilitymenu() {
  const [open, setOpen] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [contrast, setContrast] = useState(false);
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [hideImages, setHideImages] = useState(false);
  const [spacing, setSpacing] = useState(false);

  useEffect(() => {
    document.body.style.fontSize = fontSize + 'px';
    document.body.classList.toggle('high-contrast', contrast);
    document.body.classList.toggle('highlight-links', highlightLinks);
    document.body.classList.toggle('hide-images', hideImages);
    document.body.classList.toggle('spacing', spacing);
  }, [fontSize, contrast, highlightLinks, hideImages, spacing]);

  const resetAll = () => {
    setFontSize(16);
    setContrast(false);
    setHighlightLinks(false);
    setHideImages(false);
    setSpacing(false);
  };

  return (
    <div className="accessibility-wrapper">
      <button className="accessibility-toggle" onClick={() => setOpen(!open)}>
        🧑‍🦽
      </button>
      {open && (
        <div className="accessibility-panel">
          <h2>תפריט נגישות</h2>
          <button onClick={() => setFontSize(f => f + 2)}>הגדלת טקסט</button>
          <button onClick={() => setFontSize(f => Math.max(12, f - 2))}>הקטנת טקסט</button>
          <button onClick={() => setContrast(prev => !prev)}>
            ניגודיות גבוהה {contrast ? '✅' : ''}
          </button>
          <button onClick={() => setHighlightLinks(prev => !prev)}>
            הדגשת קישורים {highlightLinks ? '✅' : ''}
          </button>
          <button onClick={() => setHideImages(prev => !prev)}>
            הסתרת תמונות {hideImages ? '✅' : ''}
          </button>
          <button onClick={() => setSpacing(prev => !prev)}>
            ריווח בין מילים {spacing ? '✅' : ''}
          </button>
          <button onClick={resetAll}>איפוס</button>
          <a href="/accessibility">הצהרת נגישות</a>
        </div>
      )}
    </div>
  );
}