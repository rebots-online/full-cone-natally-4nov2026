import React from 'react';
import { createRoot } from 'react-dom/client';
import { NatallyIcon } from '../../src/components/NatallyIcon';
import '../../src/components/natally-icon.css';
createRoot(document.getElementById('root')!).render(<main style={{padding:32}}>
  <h1>Natally’s chart guide</h1><p>Tap the icon or focus it and press Enter or Space.</p>
  <div style={{height:270,padding:20}}><div style={{transform:'scale(3)',transformOrigin:'top left',width:72}}><NatallyIcon size="header" /></div></div>
  <p>The pointing pose and the highlighted chart point animate together, then return to the still icon.</p>
</main>);
