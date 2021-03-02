export default function encodeB64(value) {
  return window.btoa(unescape(encodeURIComponent(value)))
}
