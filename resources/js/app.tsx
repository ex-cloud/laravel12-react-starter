import '../css/app.css';
import { Toaster } from "sonner";
import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { startProgress, stopProgress } from './lib/nprogress';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Hanya untuk navigate antar halaman
let prevPath = window.location.pathname

router.on("start", (event) => {
  const nextPath = new URL(event.detail.visit.url).pathname
  if (nextPath !== prevPath) {
    startProgress()
  }
})

router.on("finish", (event) => {
  const nextPath = new URL(event.detail.visit.url).pathname
  if (nextPath !== prevPath) {
    stopProgress()
    prevPath = nextPath
  }
})

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) =>
    resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
  setup({ el, App, props }) {
    const root = createRoot(el);

    root.render(
      <>
        <App {...props} />
        <Toaster richColors position="top-center" />
      </>
    );
  },
//   progress: {
//     color: '#4B5563',
//   },
});

initializeTheme();
