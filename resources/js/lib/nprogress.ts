import NProgress from "nprogress"
import "nprogress/nprogress.css"

NProgress.configure({
  showSpinner: false,      // ✅ Spinner visual biasanya dianggap "norak"
  trickleSpeed: 200,       // ✅ Lebih pelan agar terasa smooth
  minimum: 0.1,           // ✅ Start lebih lembut (kurang dari 0.2)
  speed: 500,              // ✅ Waktu animasi selesai lebih terasa (default: 200)
  easing: "ease",          // ✅ Transisi halus
})

let timeout: ReturnType<typeof setTimeout> | null = null

export const startProgress = () => {
  timeout = setTimeout(() => {
    NProgress.start()
  }, 150) // ⏱ muncul hanya jika loading > 150ms
}

export const stopProgress = () => {
  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }
  NProgress.done()
}
