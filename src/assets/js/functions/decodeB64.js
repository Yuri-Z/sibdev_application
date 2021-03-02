export default function decodeB64(value) {
  return decodeURIComponent(escape(window.atob(value)))
}
