export const THEME_STORAGE_KEY = "dexta-africa-theme";
export const THEME_COLORS = {
  light: "#eeeae3",
  dark: "#0d0c0b",
  destructive: "#b91c1c",
  destructiveForeground: "#ffffff",
} as const;
export const themeInitializer = `(function(){try{var k='${THEME_STORAGE_KEY}',t=localStorage.getItem(k),p=t==='light'||t==='dark'||t==='system'?t:'system',d=p==='dark'||(p==='system'&&matchMedia('(prefers-color-scheme: dark)').matches),r=document.documentElement;r.classList.toggle('dark',d);r.dataset.theme=d?'dark':'light';r.dataset.themePreference=p;r.style.colorScheme=d?'dark':'light'}catch(e){}})()`;
