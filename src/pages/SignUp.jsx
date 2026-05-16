import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { saveMember, generateMemberId } from '../lib/member'
import { WELCOME_BONUS } from '../data/rewards'
import { CITIES } from '../data/venues'

const REFERRAL_OPTIONS = [
  'Friend or classmate',
  'University notice board',
  'Social media',
  'At a partner venue',
  'Other',
]

const UNIVERSITIES = {
  Paris: ['Sorbonne University', 'Sciences Po', 'HEC Paris', 'ESCP Europe', 'Other'],
  Milan: ['Bocconi University', 'Politecnico di Milano', 'Università degli Studi di Milano', 'Other'],
  Barcelona: ['University of Barcelona', 'Pompeu Fabra', 'IESE Business School', 'Other'],
  Vienna: ['University of Vienna', 'WU Vienna', 'TU Wien', 'Other'],
  Lisbon: ['University of Lisbon', 'NOVA SBE', 'Católica Lisbon', 'Other'],
}

const STEPS = ['Personal', 'Location', 'Preferences', 'Verify ID']

export default function SignUp() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dob: '',
    gender: '',
    city: '',
    university: '',
    referral: '',
    emailOptIn: true,
    smsOptIn: false,
    phone: '',
    docType: '',
    faceIdConsent: false,
    verified: false,
  })
  const [docScanned, setDocScanned] = useState(false)
  const [faceScanned, setFaceScanned] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [errors, setErrors] = useState({})

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: '' }))
  }

  function validateStep0() {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim()) e.lastName = 'Required'
    if (!form.email.includes('@')) e.email = 'Valid email required'
    if (!form.dob) e.dob = 'Required'
    else {
      const age = (Date.now() - new Date(form.dob)) / (1000 * 60 * 60 * 24 * 365.25)
      if (age < 18) e.dob = 'Must be 18 or older'
    }
    if (!form.gender) e.gender = 'Required'
    return e
  }

  function validateStep1() {
    const e = {}
    if (!form.city) e.city = 'Select a city'
    if (!form.university.trim()) e.university = 'Required'
    return e
  }

  function validateStep2() {
    const e = {}
    if (form.smsOptIn && form.phone.replace(/\D/g, '').length < 7) {
      e.phone = 'Enter a valid phone number'
    }
    return e
  }

  function handleNext() {
    const errs = step === 0 ? validateStep0() : step === 1 ? validateStep1() : step === 2 ? validateStep2() : {}
    if (Object.keys(errs).length) { setErrors(errs); return }
    setStep(s => s + 1)
  }

  function simulateScan(type) {
    setScanning(type)
    setTimeout(() => {
      setScanning(false)
      if (type === 'doc') setDocScanned(true)
      if (type === 'face') setFaceScanned(true)
    }, 2000)
  }

  function handleSubmit() {
    const member = {
      ...form,
      verified: docScanned,
      memberId: generateMemberId(),
      signupDate: new Date().toISOString(),
      points: WELCOME_BONUS,
    }
    saveMember(member)
    navigate('/dashboard')
  }

  const inputClass = "w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-colors"
  const inputStyle = {
    backgroundColor: 'var(--surface2)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
  }

  return (
    <div style={{ backgroundColor: 'var(--bg)' }} className="min-h-screen flex flex-col px-4 pt-12 pb-8">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 mb-8">
        <div style={{ backgroundColor: 'var(--accent)' }} className="w-7 h-7 rounded-md flex items-center justify-center">
          <span className="text-white text-xs font-bold">PR</span>
        </div>
        <span style={{ color: 'var(--text)' }} className="font-semibold text-sm">Pernod Network</span>
      </Link>

      {/* Card */}
      <div
        className="w-full rounded-2xl p-5 flex-1"
        style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1 last:flex-none">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    backgroundColor: i <= step ? 'var(--accent)' : 'var(--surface2)',
                    color: i <= step ? 'white' : 'var(--muted)',
                  }}
                >
                  {i < step ? '✓' : i + 1}
                </div>
                <span className="text-xs hidden sm:block" style={{ color: i === step ? 'var(--text)' : 'var(--muted)' }}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-px" style={{ backgroundColor: i < step ? 'var(--accent)' : 'var(--border)' }} />
              )}
            </div>
          ))}
        </div>

        {/* Step 0: Personal */}
        {step === 0 && (
          <div className="flex flex-col gap-4">
            <h2 style={{ color: 'var(--text)' }} className="font-semibold text-lg">Personal details</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={{ color: 'var(--muted)' }} className="text-xs mb-1 block">First name</label>
                <input
                  className={inputClass}
                  style={{ ...inputStyle, borderColor: errors.firstName ? '#f87171' : 'var(--border)' }}
                  value={form.firstName}
                  onChange={e => set('firstName', e.target.value)}
                  placeholder="Aditya"
                />
                {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label style={{ color: 'var(--muted)' }} className="text-xs mb-1 block">Last name</label>
                <input
                  className={inputClass}
                  style={{ ...inputStyle, borderColor: errors.lastName ? '#f87171' : 'var(--border)' }}
                  value={form.lastName}
                  onChange={e => set('lastName', e.target.value)}
                  placeholder="Surve"
                />
                {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label style={{ color: 'var(--muted)' }} className="text-xs mb-1 block">Email address</label>
              <input
                type="email"
                className={inputClass}
                style={{ ...inputStyle, borderColor: errors.email ? '#f87171' : 'var(--border)' }}
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="you@university.edu"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label style={{ color: 'var(--muted)' }} className="text-xs mb-1 block">Date of birth</label>
              <input
                type="date"
                className={inputClass}
                style={{ ...inputStyle, borderColor: errors.dob ? '#f87171' : 'var(--border)' }}
                value={form.dob}
                onChange={e => set('dob', e.target.value)}
                max={new Date(Date.now() - 18 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              />
              {errors.dob && <p className="text-red-400 text-xs mt-1">{errors.dob}</p>}
            </div>

            <div>
              <label style={{ color: 'var(--muted)' }} className="text-xs mb-1 block">Gender</label>
              <select
                className={inputClass}
                style={{ ...inputStyle, borderColor: errors.gender ? '#f87171' : 'var(--border)' }}
                value={form.gender}
                onChange={e => set('gender', e.target.value)}
              >
                <option value="">Select…</option>
                <option>Female</option>
                <option>Male</option>
                <option>Non-binary</option>
                <option>Prefer not to say</option>
              </select>
              {errors.gender && <p className="text-red-400 text-xs mt-1">{errors.gender}</p>}
            </div>
          </div>
        )}

        {/* Step 1: Location */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <h2 style={{ color: 'var(--text)' }} className="font-semibold text-lg">Your city</h2>

            <div>
              <label style={{ color: 'var(--muted)' }} className="text-xs mb-2 block">Select your city</label>
              <div className="grid grid-cols-2 gap-2">
                {CITIES.map(city => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => { set('city', city); set('university', '') }}
                    className="py-2.5 px-3 rounded-lg text-sm font-medium transition-all text-left"
                    style={{
                      backgroundColor: form.city === city ? 'rgba(83,74,183,0.2)' : 'var(--surface2)',
                      border: `1px solid ${form.city === city ? 'var(--accent)' : 'var(--border)'}`,
                      color: form.city === city ? '#9B93E8' : 'var(--muted)',
                    }}
                  >
                    {city}
                  </button>
                ))}
              </div>
              {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
            </div>

            {form.city && (
              <div>
                <label style={{ color: 'var(--muted)' }} className="text-xs mb-1 block">University</label>
                <select
                  className={inputClass}
                  style={{ ...inputStyle, borderColor: errors.university ? '#f87171' : 'var(--border)' }}
                  value={form.university}
                  onChange={e => set('university', e.target.value)}
                >
                  <option value="">Select…</option>
                  {(UNIVERSITIES[form.city] || []).map(u => <option key={u}>{u}</option>)}
                </select>
                {errors.university && <p className="text-red-400 text-xs mt-1">{errors.university}</p>}
              </div>
            )}

            <div>
              <label style={{ color: 'var(--muted)' }} className="text-xs mb-1 block">How did you hear about us?</label>
              <select
                className={inputClass}
                style={inputStyle}
                value={form.referral}
                onChange={e => set('referral', e.target.value)}
              >
                <option value="">Select…</option>
                {REFERRAL_OPTIONS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Step 2: Preferences */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 style={{ color: 'var(--text)' }} className="font-semibold text-lg">Almost there!</h2>
              <p style={{ color: 'var(--muted)' }} className="text-sm mt-1">
                Choose your contact preferences and generate your card.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <label
                className="flex items-center justify-between rounded-lg px-4 py-3 cursor-pointer"
                style={{ backgroundColor: 'var(--surface2)', border: '1px solid var(--border)' }}
              >
                <div>
                  <div style={{ color: 'var(--text)' }} className="text-sm font-medium">Email updates</div>
                  <div style={{ color: 'var(--muted)' }} className="text-xs">Weekly deals and event invites</div>
                </div>
                <input
                  type="checkbox"
                  checked={form.emailOptIn}
                  onChange={e => set('emailOptIn', e.target.checked)}
                  className="w-4 h-4 accent-violet-500"
                />
              </label>

              <label
                className="flex items-center justify-between rounded-lg px-4 py-3 cursor-pointer"
                style={{ backgroundColor: 'var(--surface2)', border: '1px solid var(--border)' }}
              >
                <div>
                  <div style={{ color: 'var(--text)' }} className="text-sm font-medium">SMS alerts</div>
                  <div style={{ color: 'var(--muted)' }} className="text-xs">Flash deals at your nearest venue</div>
                </div>
                <input
                  type="checkbox"
                  checked={form.smsOptIn}
                  onChange={e => set('smsOptIn', e.target.checked)}
                  className="w-4 h-4 accent-violet-500"
                />
              </label>

              {form.smsOptIn && (
                <div>
                  <label style={{ color: 'var(--muted)' }} className="text-xs mb-1 block">
                    Phone number <span className="text-red-400">*</span>
                  </label>
                  <div className="flex">
                    <span
                      className="flex items-center px-3 text-sm rounded-l-lg border-r-0 flex-shrink-0"
                      style={{ backgroundColor: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--muted)' }}
                    >
                      +
                    </span>
                    <input
                      type="tel"
                      className="flex-1 rounded-r-lg px-3 py-2.5 text-sm outline-none"
                      style={{
                        backgroundColor: 'var(--surface2)',
                        border: '1px solid var(--border)',
                        borderLeft: 'none',
                        color: 'var(--text)',
                        borderColor: errors.phone ? '#f87171' : 'var(--border)',
                      }}
                      value={form.phone}
                      onChange={e => set('phone', e.target.value.replace(/[^0-9 +\-()]/g, ''))}
                      placeholder="33 6 12 34 56 78"
                    />
                  </div>
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                </div>
              )}
            </div>

            {/* Welcome bonus info */}
            <div
              className="rounded-xl px-4 py-3 flex items-center gap-3"
              style={{ backgroundColor: 'rgba(83,74,183,0.1)', border: '1px solid rgba(83,74,183,0.25)' }}
            >
              <span className="text-2xl">🎁</span>
              <div>
                <div style={{ color: '#9B93E8' }} className="text-sm font-semibold">{WELCOME_BONUS} welcome points</div>
                <div style={{ color: 'var(--muted)' }} className="text-xs">Credited instantly on sign-up</div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Verify Identity */}
        {step === 3 && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 style={{ color: 'var(--text)' }} className="font-semibold text-lg">Verify your identity</h2>
              <p style={{ color: 'var(--muted)' }} className="text-sm mt-1">
                Required for age-gated access. Your data is processed under GDPR Article 9 with explicit consent.
              </p>
            </div>

            {/* Doc type selector */}
            <div>
              <label style={{ color: 'var(--muted)' }} className="text-xs mb-2 block">Select ID document</label>
              <div className="grid grid-cols-3 gap-2">
                {['Passport', 'National ID', 'Driver\'s Licence'].map(doc => (
                  <button
                    key={doc}
                    type="button"
                    onClick={() => { set('docType', doc); setDocScanned(false) }}
                    className="py-2 px-2 rounded-lg text-xs font-medium transition-all"
                    style={{
                      backgroundColor: form.docType === doc ? 'rgba(83,74,183,0.2)' : 'var(--surface2)',
                      border: `1px solid ${form.docType === doc ? 'var(--accent)' : 'var(--border)'}`,
                      color: form.docType === doc ? '#9B93E8' : 'var(--muted)',
                    }}
                  >
                    {doc === 'Passport' ? '🛂' : doc === 'National ID' ? '🪪' : '🚗'} {doc}
                  </button>
                ))}
              </div>
            </div>

            {/* Document scan */}
            {form.docType && (
              <div
                className="rounded-xl p-4 flex flex-col gap-3"
                style={{
                  backgroundColor: docScanned ? 'rgba(34,197,94,0.08)' : 'var(--surface2)',
                  border: `1px solid ${docScanned ? 'rgba(34,197,94,0.4)' : 'var(--border)'}`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div style={{ color: 'var(--text)' }} className="text-sm font-medium">
                      {docScanned ? '✅ Document verified' : `Scan your ${form.docType}`}
                    </div>
                    <div style={{ color: 'var(--muted)' }} className="text-xs mt-0.5">
                      {docScanned ? 'Age confirmed · Identity authenticated' : 'Hold your document up to the camera'}
                    </div>
                  </div>
                  {!docScanned && (
                    <button
                      type="button"
                      onClick={() => simulateScan('doc')}
                      disabled={scanning === 'doc'}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium flex-shrink-0"
                      style={{ backgroundColor: 'var(--accent)', color: 'white', opacity: scanning === 'doc' ? 0.6 : 1 }}
                    >
                      {scanning === 'doc' ? '⏳ Scanning…' : '📷 Scan'}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Face ID — optional, separate consent */}
            {docScanned && (
              <div
                className="rounded-xl p-4 flex flex-col gap-3"
                style={{
                  backgroundColor: faceScanned ? 'rgba(34,197,94,0.08)' : 'var(--surface2)',
                  border: `1px solid ${faceScanned ? 'rgba(34,197,94,0.4)' : 'var(--border)'}`,
                }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">🪪</span>
                  <div className="flex-1">
                    <div style={{ color: 'var(--text)' }} className="text-sm font-medium">
                      {faceScanned ? '✅ Face matched' : 'Face ID check (optional)'}
                    </div>
                    <div style={{ color: 'var(--muted)' }} className="text-xs mt-0.5 leading-relaxed">
                      Matches your face to the document photo. Biometric data is processed locally and never stored on our servers.
                    </div>
                    {/* Separate biometric consent per GDPR Art. 9 */}
                    {!faceScanned && (
                      <label className="flex items-start gap-2 mt-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.faceIdConsent}
                          onChange={e => set('faceIdConsent', e.target.checked)}
                          className="mt-0.5 w-3.5 h-3.5 accent-violet-500 flex-shrink-0"
                        />
                        <span style={{ color: 'var(--muted)' }} className="text-xs">
                          I explicitly consent to biometric face verification (GDPR Art. 9 — separate from general consent)
                        </span>
                      </label>
                    )}
                  </div>
                  {!faceScanned && form.faceIdConsent && (
                    <button
                      type="button"
                      onClick={() => simulateScan('face')}
                      disabled={scanning === 'face'}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium flex-shrink-0"
                      style={{ backgroundColor: 'var(--accent)', color: 'white', opacity: scanning === 'face' ? 0.6 : 1 }}
                    >
                      {scanning === 'face' ? '⏳ Verifying…' : '🫣 Verify'}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Skip option */}
            {!docScanned && (
              <button
                type="button"
                onClick={handleSubmit}
                className="text-xs text-center py-2"
                style={{ color: 'var(--muted)' }}
              >
                Skip for now — verify later in your profile
              </button>
            )}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-2 mt-6">
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{ border: '1px solid var(--border)', color: 'var(--muted)' }}
            >
              Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--accent)', color: 'white' }}
            >
              Continue →
            </button>
          ) : docScanned ? (
            <button
              onClick={handleSubmit}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#16a34a', color: 'white' }}
            >
              Generate my verified card ✅
            </button>
          ) : null}
        </div>
      </div>

      <p style={{ color: 'var(--muted)' }} className="text-xs mt-4">
        Already a member?{' '}
        <Link to="/dashboard" className="underline" style={{ color: 'var(--accent)' }}>
          View your card
        </Link>
      </p>
    </div>
  )
}
