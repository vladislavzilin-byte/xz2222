import React from 'react'
declare global { interface Window { google: any } }
function loadPlaces(apiKey: string) {
  return new Promise<void>((resolve, reject) => {
    if (window.google?.maps?.places) return resolve()
    const s = document.createElement('script')
    s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    s.async = true
    s.onload = () => resolve()
    s.onerror = (e) => reject(e)
    document.head.appendChild(s)
  })
}
type Place = { place_id: string; formatted_address: string; lat: number; lng: number }
export default function AddressInput({ value, onChange }: { value: Place | null, onChange: (p: Place | null) => void }) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [ready, setReady] = React.useState(false)
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string
  React.useEffect(() => { loadPlaces(apiKey).then(() => setReady(true)).catch(console.error) }, [apiKey])
  React.useEffect(() => {
    if (!ready || !inputRef.current || !window.google) return
    const ac = new window.google.maps.places.Autocomplete(inputRef.current, { fields: ['place_id','formatted_address','geometry'], types: ['address'] })
    ac.addListener('place_changed', () => {
      const p = ac.getPlace()
      if (!p?.place_id || !p?.formatted_address || !p?.geometry?.location) return
      const loc = p.geometry.location
      onChange({ place_id: p.place_id, formatted_address: p.formatted_address, lat: loc.lat(), lng: loc.lng() })
    })
    return () => window.google.maps.event.clearInstanceListeners(ac)
  }, [ready, onChange])
  return (<div className="flex flex-col gap-1">
    <input ref={inputRef} placeholder="Start typing your address…" className="h-12 w-full rounded-xl bg-white/10 border border-white/20 px-4 outline-none focus:border-white/40" />
    {value?.formatted_address && (<p className="text-xs text-white/60">Verified: {value.formatted_address}</p>)}
  </div>)
}
