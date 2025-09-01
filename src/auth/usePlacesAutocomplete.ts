
import * as React from 'react'
export function usePlacesAutocomplete(inputRef: React.RefObject<HTMLInputElement>) {
  React.useEffect(() => {
    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    if (!key || !inputRef.current) return
    const id = 'gmaps-places'
    if (!document.getElementById(id)) {
      const s = document.createElement('script')
      s.id = id
      s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places&language=en`
      s.async = true
      document.head.appendChild(s)
    }
    const init = () => {
      // @ts-ignore
      if (window.google?.maps?.places && inputRef.current) {
        // @ts-ignore
        const ac = new window.google.maps.places.Autocomplete(inputRef.current, { fields: ['formatted_address'] })
        ac.addListener('place_changed', () => {
          const p = ac.getPlace()
          if (p?.formatted_address && inputRef.current) inputRef.current.value = p.formatted_address
        })
      } else {
        setTimeout(init, 400)
      }
    }
    init()
  }, [inputRef])
}
