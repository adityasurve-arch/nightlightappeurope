import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { VENUES } from '../data/venues'
import { useLang } from '../lib/i18n'

const PARIS_CENTER = [48.8625, 2.3490]

function distanceKm(a, b) {
  const R = 6371
  const dLat = ((b[0] - a[0]) * Math.PI) / 180
  const dLng = ((b[1] - a[1]) * Math.PI) / 180
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a[0] * Math.PI) / 180) * Math.cos((b[0] * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s))
}

export default function VenueMap() {
  const mapEl = useRef(null)
  const mapRef = useRef(null)
  const userMarkerRef = useRef(null)
  const navigate = useNavigate()
  const [locating, setLocating] = useState(false)
  const [locError, setLocError] = useState(null)
  const [nearest, setNearest] = useState(null)
  const { t } = useLang()

  useEffect(() => {
    if (mapRef.current) return

    const map = L.map(mapEl.current, { zoomControl: false, attributionControl: true })
      .setView(PARIS_CENTER, 13)
    mapRef.current = map

    // Dark tiles to match the app theme
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 19,
    }).addTo(map)

    L.control.zoom({ position: 'bottomright' }).addTo(map)

    // Venue markers — purple pins matching the brand
    VENUES.forEach(v => {
      const icon = L.divIcon({
        className: '',
        html: `<div style="
          width:34px;height:34px;border-radius:50% 50% 50% 0;
          background:#C8922A;transform:rotate(-45deg);
          border:2px solid #DBA84E;box-shadow:0 2px 10px rgba(200,146,42,0.6);
          display:flex;align-items:center;justify-content:center;">
          <span style="transform:rotate(45deg);font-size:15px;">🍸</span>
        </div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
        popupAnchor: [0, -34],
      })

      const marker = L.marker([v.lat, v.lng], { icon }).addTo(map)
      marker.bindPopup(
        `<div style="font-family:Inter,sans-serif;min-width:170px;">
          <img src="${v.photos[0]}" style="width:100%;height:70px;object-fit:cover;border-radius:8px;margin-bottom:6px;" />
          <div style="font-weight:700;font-size:13px;margin-bottom:2px;">${v.name}</div>
          <div style="font-size:11px;color:#666;margin-bottom:6px;">${v.type}</div>
          <button id="go-${v.id}" style="
            width:100%;background:#C8922A;color:white;border:none;border-radius:8px;
            padding:7px 0;font-size:12px;font-weight:700;cursor:pointer;">
            View venue →
          </button>
        </div>`,
        { closeButton: false }
      )
      marker.on('popupopen', () => {
        document.getElementById(`go-${v.id}`)?.addEventListener('click', () => navigate(`/venues/${v.id}`))
      })
    })

    return () => { map.remove(); mapRef.current = null }
  }, [])

  function locateMe() {
    if (!navigator.geolocation) {
      setLocError('Location not supported on this device')
      return
    }
    setLocating(true)
    setLocError(null)

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const here = [coords.latitude, coords.longitude]
        const map = mapRef.current

        if (userMarkerRef.current) userMarkerRef.current.remove()
        userMarkerRef.current = L.marker(here, {
          icon: L.divIcon({
            className: '',
            html: `<div style="
              width:18px;height:18px;border-radius:50%;background:#4ADE80;
              border:3px solid white;box-shadow:0 0 0 6px rgba(74,222,128,0.25);"></div>`,
            iconSize: [18, 18],
            iconAnchor: [9, 9],
          }),
        }).addTo(map)

        // Find nearest venue and fit both in view
        const sorted = [...VENUES].sort(
          (a, b) => distanceKm(here, [a.lat, a.lng]) - distanceKm(here, [b.lat, b.lng])
        )
        const closest = sorted[0]
        const km = distanceKm(here, [closest.lat, closest.lng])
        setNearest({ venue: closest, km })

        map.fitBounds(L.latLngBounds([here, [closest.lat, closest.lng]]).pad(0.4))
        setLocating(false)
      },
      () => {
        setLocError("Couldn't get your location — check permissions")
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }

  return (
    <div className="relative" style={{ height: 'calc(100vh - 220px)', minHeight: 380 }}>
      <div ref={mapEl} className="w-full h-full rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }} />

      {/* Locate me */}
      <button
        onClick={locateMe}
        className="absolute top-3 left-3 z-[1000] flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold nl-press"
        style={{ backgroundColor: 'var(--accent)', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}
      >
        {locating ? t('venues.locating') : t('venues.nearMe')}
      </button>

      {/* Error toast */}
      {locError && (
        <div
          className="absolute top-14 left-3 right-3 z-[1000] px-3 py-2 rounded-lg text-xs nl-slide-up"
          style={{ backgroundColor: 'rgba(239,68,68,0.95)', color: 'white' }}
        >
          {locError}
        </div>
      )}

      {/* Nearest venue card */}
      {nearest && (
        <button
          onClick={() => navigate(`/venues/${nearest.venue.id}`)}
          className="absolute bottom-3 left-3 right-3 z-[1000] flex items-center gap-3 p-3 rounded-xl text-left nl-slide-up nl-press"
          style={{ backgroundColor: 'rgba(14,14,16,0.95)', border: '1px solid var(--accent)', cursor: 'pointer', backdropFilter: 'blur(8px)' }}
        >
          <img src={nearest.venue.photos[0]} alt={nearest.venue.name} className="w-11 h-11 rounded-lg object-cover flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div style={{ color: 'var(--accent-light)', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Closest to you · {nearest.km < 1 ? `${Math.round(nearest.km * 1000)}m` : `${nearest.km.toFixed(1)}km`}
            </div>
            <div style={{ color: 'var(--text)' }} className="text-sm font-bold truncate">{nearest.venue.name}</div>
          </div>
          <span style={{ color: 'var(--muted)' }}>→</span>
        </button>
      )}
    </div>
  )
}
