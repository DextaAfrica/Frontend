export const THEME_STORAGE_KEY = "dexta-africa-theme";

/**
 * Flat colour mirror for contexts that render outside `globals.css` and so
 * cannot read its custom properties: the `<meta name="theme-color">` tags in
 * `layout.tsx` and the `global-error.tsx` crash screen.
 *
 * `light` / `dark` must track `--background` in `src/app/globals.css`.
 * `destructive` is a self-contained error red (Tailwind red-700) for the crash
 * screen, which has no design tokens available.
 */
export const THEME_COLORS = {
  light: "#ffffff",
  dark: "#0d0c0b",
  destructive: "#b91c1c",
  destructiveForeground: "#ffffff",
} as const;
export const themeInitializer = `(function(){try{var k='${THEME_STORAGE_KEY}',t=localStorage.getItem(k),p=t==='light'||t==='dark'||t==='system'?t:'system',d=p==='dark'||(p==='system'&&matchMedia('(prefers-color-scheme: dark)').matches),r=document.documentElement;r.classList.toggle('dark',d);r.dataset.theme=d?'dark':'light';r.dataset.themePreference=p;r.style.colorScheme=d?'dark':'light'}catch(e){}})()`;
