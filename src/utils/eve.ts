// src/utils/eve.ts
import eve from 'eve';

declare global {
  interface Window {
    eve: typeof eve;
  }
}

window.eve = eve;
