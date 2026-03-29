'use client'

import { useState, useEffect, useRef } from 'react'
import { CheckCircleIcon, MapPinIcon, ChevronDownIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { DatenschutzDialog } from '@/components/blocks/datenschutz/datenschutz-dialog'

// ─── Types ────────────────────────────────────────────────────────────────────

type FormData = {
  name: string
  email: string
  phoneCode: string
  phoneNumber: string
  eventDate: string
  eventLocation: string
  guestCount: string
  eventType: string
  eventDuration: string
  menuPreference: string
  budget: string
  powerSupply: string
  truckAccess: string
  indoorOutdoor: string
  parking: string
  notes: string
  file: File | null
  referralSource: string
  privacyAccepted: boolean
  newsletterOptIn: boolean
}

// ─── Initial data ─────────────────────────────────────────────────────────────

const emptyFormData: FormData = {
  name: '',
  email: '',
  phoneCode: '+41',
  phoneNumber: '',
  eventDate: '',
  eventLocation: '',
  guestCount: '',
  eventType: '',
  eventDuration: '',
  menuPreference: '',
  budget: '',
  powerSupply: '',
  truckAccess: '',
  indoorOutdoor: '',
  parking: '',
  notes: '',
  file: null,
  referralSource: '',
  privacyAccepted: false,
  newsletterOptIn: false
}

const demoFormData: FormData = {
  name: 'Haris Bjelic',
  email: 'haris.bjelic@outlook.com',
  phoneCode: '+41',
  phoneNumber: '79 123 45 67',
  eventDate: '2025-08-15',
  eventLocation: 'Zürich, Altstadthalle',
  guestCount: '80',
  eventType: 'Geburtstag',
  eventDuration: '18:00 – 22:00 Uhr',
  menuPreference: 'Burger-Menü',
  budget: '2.000 CHF',
  powerSupply: 'Ja',
  truckAccess: 'Ja',
  indoorOutdoor: 'Outdoor',
  parking: 'Ja',
  notes: 'Bitte vegetarische Option bereitstellen. Motto: Tropical Vibes. Nussallergie bei 3 Gästen.',
  file: null,
  referralSource: 'Instagram',
  privacyAccepted: false,
  newsletterOptIn: true
}

const initialFormData = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' ? demoFormData : emptyFormData

// ─── Style constants ──────────────────────────────────────────────────────────

const labelClass = 'block text-sm font-medium mb-1.5'
const selectClass =
  'border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] cursor-pointer'
const textareaClass =
  'border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-md border px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] min-h-28 resize-y'
const sectionHeadingClass = 'text-base font-semibold mb-4 flex items-center gap-2'
const gridTwoClass = 'grid gap-4 sm:grid-cols-2'

// ─── Country codes ────────────────────────────────────────────────────────────

const COUNTRY_CODES = [
  { flag: '🇨🇭', code: '+41', label: 'CH' },
  { flag: '🇩🇪', code: '+49', label: 'DE' },
  { flag: '🇦🇹', code: '+43', label: 'AT' },
  { flag: '🇱🇮', code: '+423', label: 'LI' },
  { flag: '🇫🇷', code: '+33', label: 'FR' },
  { flag: '🇮🇹', code: '+39', label: 'IT' },
  { flag: '🇬🇧', code: '+44', label: 'GB' },
  { flag: '🇺🇸', code: '+1', label: 'US' },
  { flag: '🇳🇱', code: '+31', label: 'NL' },
  { flag: '🇧🇪', code: '+32', label: 'BE' },
  { flag: '🇪🇸', code: '+34', label: 'ES' },
  { flag: '🇵🇱', code: '+48', label: 'PL' },
  { flag: '🇵🇹', code: '+351', label: 'PT' },
  { flag: '🇹🇷', code: '+90', label: 'TR' },
]

// ─── PhoneInput ───────────────────────────────────────────────────────────────

type PhoneInputProps = {
  code: string
  number: string
  onCodeChange: (v: string) => void
  onNumberChange: (v: string) => void
  error?: string
}

function PhoneInput({ code, number, onCodeChange, onNumberChange, error }: PhoneInputProps) {
  return (
    <div>
      <label className={labelClass} htmlFor='phoneNumber'>
        Telefonnummer <span className='text-destructive'>*</span>
      </label>
      <div className='flex gap-2'>
        <div className='relative w-28 shrink-0'>
          <select
            value={code}
            onChange={e => onCodeChange(e.target.value)}
            className={cn(
              'border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full appearance-none rounded-md border pl-2 pr-6 text-sm shadow-xs outline-none focus-visible:ring-[3px] cursor-pointer',
              error && 'border-destructive'
            )}
          >
            {COUNTRY_CODES.map(c => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.code}
              </option>
            ))}
          </select>
          <ChevronDownIcon className='text-muted-foreground pointer-events-none absolute top-2.5 right-1.5 size-3.5' />
        </div>
        <Input
          id='phoneNumber'
          type='tel'
          placeholder='79 123 45 67'
          value={number}
          onChange={e => onNumberChange(e.target.value)}
          aria-invalid={!!error}
          className='flex-1'
        />
      </div>
      {error && <p className='text-destructive mt-1 text-xs'>{error}</p>}
    </div>
  )
}

// ─── AddressAutocomplete ──────────────────────────────────────────────────────

type NominatimResult = { place_id: number; display_name: string }

type AddressAutocompleteProps = {
  value: string
  onChange: (v: string) => void
  error?: string
}

function AddressAutocomplete({ value, onChange, error }: AddressAutocompleteProps) {
  const [query, setQuery] = useState(value)
  const [results, setResults] = useState<NominatimResult[]>([])
  const [open, setOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Sync external value resets (e.g. form reset)
  useEffect(() => {
    setQuery(value)
  }, [value])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleChange = (val: string) => {
    setQuery(val)
    onChange(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (val.length < 3) { setResults([]); setOpen(false); return }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val)}&format=json&limit=6&addressdetails=0`,
          { headers: { 'Accept-Language': 'de' } }
        )
        const data: NominatimResult[] = await res.json()
        setResults(data)
        setOpen(data.length > 0)
      } catch {
        setResults([])
      }
    }, 450)
  }

  const handleSelect = (display: string) => {
    setQuery(display)
    onChange(display)
    setResults([])
    setOpen(false)
  }

  return (
    <div ref={containerRef} className='relative'>
      <label className={labelClass} htmlFor='eventLocation'>
        Ort der Veranstaltung <span className='text-destructive'>*</span>
      </label>
      <div className='relative'>
        <MapPinIcon className='text-muted-foreground absolute top-2.5 left-2.5 size-4 pointer-events-none' />
        <Input
          id='eventLocation'
          placeholder='Adresse oder Ort suchen…'
          value={query}
          onChange={e => handleChange(e.target.value)}
          aria-invalid={!!error}
          className='pl-8'
          autoComplete='off'
        />
      </div>
      {error && <p className='text-destructive mt-1 text-xs'>{error}</p>}
      {open && (
        <ul className='bg-background border-border absolute z-50 mt-1 w-full rounded-md border shadow-md'>
          {results.map(r => (
            <li
              key={r.place_id}
              onMouseDown={() => handleSelect(r.display_name)}
              className='hover:bg-accent flex cursor-pointer items-start gap-2 px-3 py-2 text-sm'
            >
              <MapPinIcon className='text-muted-foreground mt-0.5 size-3.5 shrink-0' />
              <span className='line-clamp-2'>{r.display_name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ─── RadioGroup ───────────────────────────────────────────────────────────────

type RadioGroupProps = {
  name: string
  value: string
  onChange: (val: string) => void
  options: { label: string; value: string }[]
}

function RadioGroup({ name, value, onChange, options }: RadioGroupProps) {
  return (
    <div className='flex flex-wrap gap-3'>
      {options.map(opt => (
        <label
          key={opt.value}
          className={cn(
            'border-input flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition-colors',
            value === opt.value ? 'border-primary bg-primary/10 font-medium' : 'hover:bg-accent'
          )}
        >
          <input
            type='radio'
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className='accent-primary'
          />
          {opt.label}
        </label>
      ))}
    </div>
  )
}

// ─── ContactForm ──────────────────────────────────────────────────────────────

const ContactForm = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [showSuccess, setShowSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  const set = (field: keyof FormData, value: string | boolean | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const validate = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}
    if (!formData.name.trim()) newErrors.name = 'Bitte geben Sie Ihren Namen ein.'
    if (!formData.email.trim()) newErrors.email = 'Bitte geben Sie Ihre E-Mail-Adresse ein.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.'
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Bitte geben Sie Ihre Telefonnummer ein.'
    if (!formData.eventDate) newErrors.eventDate = 'Bitte wählen Sie ein Datum.'
    if (!formData.eventLocation.trim()) newErrors.eventLocation = 'Bitte geben Sie den Veranstaltungsort an.'
    if (!formData.guestCount) newErrors.guestCount = 'Bitte geben Sie die Personenanzahl an.'
    if (!formData.privacyAccepted) newErrors.privacyAccepted = 'Bitte stimmen Sie der Datenschutzerklärung zu.'
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    setLoading(true)
    try {
      const body = new FormData()
      // Combine phone code + number into single field for the API
      body.append('phone', `${formData.phoneCode} ${formData.phoneNumber}`)
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && key !== 'file' && key !== 'phoneCode' && key !== 'phoneNumber')
          body.append(key, String(value))
      })
      if (formData.file) body.append('file', formData.file)

      const res = await fetch('/api/contact', { method: 'POST', body })
      if (!res.ok) {
        const { error } = await res.json()
        setErrors({ name: error ?? 'Senden fehlgeschlagen. Bitte versuchen Sie es erneut.' })
        return
      }
      setShowSuccess(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id='anfrage' className='py-8 sm:py-16 lg:py-24'>
      {/* Success Modal */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className='max-w-md text-center'>
          <DialogHeader className='items-center'>
            <div className='bg-primary/10 text-primary mx-auto mb-2 flex size-16 items-center justify-center rounded-full'>
              <CheckCircleIcon className='size-8' />
            </div>
            <DialogTitle className='text-xl'>Anfrage erfolgreich gesendet!</DialogTitle>
          </DialogHeader>
          <p className='text-muted-foreground mt-1 text-sm'>
            Vielen Dank, <strong>{formData.name}</strong>. Wir haben Ihre Anfrage erhalten und melden uns so schnell
            wie möglich bei Ihnen unter <strong>{formData.email}</strong>.
          </p>
          <div className='mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center'>
            <Button onClick={() => { setShowSuccess(false); setFormData(initialFormData) }} variant='outline'>
              Neue Anfrage senden
            </Button>
            <Button onClick={() => setShowSuccess(false)}>Schließen</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mx-auto mb-12 flex max-w-2xl flex-col items-center justify-center space-y-4 text-center sm:mb-16'>
          <Badge variant='outline' className='text-sm font-normal'>📋</Badge>
          <h2 className='text-2xl font-semibold md:text-3xl lg:text-4xl'>Anfrage stellen</h2>
          <p className='text-muted-foreground text-xl'>
            Füllen Sie das Formular aus und wir erstellen Ihnen ein unverbindliches Angebot für Ihr Event.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className='space-y-10'>
          {/* 01 — Kontaktdaten */}
          <div>
            <h3 className={sectionHeadingClass}>
              <span className='text-primary'>01</span> Kontaktdaten
            </h3>
            <div className='space-y-4'>
              <div className={gridTwoClass}>
                <div>
                  <label className={labelClass} htmlFor='name'>
                    Name <span className='text-destructive'>*</span>
                  </label>
                  <Input
                    id='name'
                    placeholder='Max Mustermann'
                    value={formData.name}
                    onChange={e => set('name', e.target.value)}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && <p className='text-destructive mt-1 text-xs'>{errors.name}</p>}
                </div>
                <div>
                  <label className={labelClass} htmlFor='email'>
                    E-Mail-Adresse <span className='text-destructive'>*</span>
                  </label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='max@beispiel.de'
                    value={formData.email}
                    onChange={e => set('email', e.target.value)}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && <p className='text-destructive mt-1 text-xs'>{errors.email}</p>}
                </div>
              </div>

              <div className={gridTwoClass}>
                <PhoneInput
                  code={formData.phoneCode}
                  number={formData.phoneNumber}
                  onCodeChange={v => set('phoneCode', v)}
                  onNumberChange={v => set('phoneNumber', v)}
                  error={errors.phoneNumber}
                />
                <div>
                  <label className={labelClass} htmlFor='guestCount'>
                    Anzahl Personen <span className='text-destructive'>*</span>
                  </label>
                  <Input
                    id='guestCount'
                    type='number'
                    min='1'
                    placeholder='z. B. 80'
                    value={formData.guestCount}
                    onChange={e => set('guestCount', e.target.value)}
                    aria-invalid={!!errors.guestCount}
                  />
                  {errors.guestCount && <p className='text-destructive mt-1 text-xs'>{errors.guestCount}</p>}
                </div>
              </div>

              <div className={gridTwoClass}>
                <div>
                  <label className={labelClass} htmlFor='eventDate'>
                    Datum der Veranstaltung <span className='text-destructive'>*</span>
                  </label>
                  <input
                    id='eventDate'
                    type='date'
                    className={cn(
                      'border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-[3px]',
                      errors.eventDate && 'border-destructive'
                    )}
                    value={formData.eventDate}
                    onChange={e => set('eventDate', e.target.value)}
                  />
                  {errors.eventDate && <p className='text-destructive mt-1 text-xs'>{errors.eventDate}</p>}
                </div>
                <AddressAutocomplete
                  value={formData.eventLocation}
                  onChange={v => set('eventLocation', v)}
                  error={errors.eventLocation}
                />
              </div>
            </div>
          </div>

          <div className='border-border border-t' />

          {/* 02 — Event-Details */}
          <div>
            <h3 className={sectionHeadingClass}>
              <span className='text-primary'>02</span> Event-Details
            </h3>
            <div className='space-y-4'>
              <div className={gridTwoClass}>
                <div>
                  <label className={labelClass} htmlFor='eventType'>Art der Veranstaltung</label>
                  <select id='eventType' className={selectClass} value={formData.eventType} onChange={e => set('eventType', e.target.value)}>
                    <option value=''>Bitte wählen…</option>
                    <option>Hochzeit</option>
                    <option>Geburtstag</option>
                    <option>Firmenfeier</option>
                    <option>Festival</option>
                    <option>Jubiläum</option>
                    <option>Sonstige</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass} htmlFor='eventDuration'>Dauer / Uhrzeit</label>
                  <Input id='eventDuration' placeholder='z. B. 18:00 – 22:00 Uhr' value={formData.eventDuration} onChange={e => set('eventDuration', e.target.value)} />
                </div>
              </div>
              <div className={gridTwoClass}>
                <div>
                  <label className={labelClass} htmlFor='menuPreference'>Gewünschtes Angebot</label>
                  <select id='menuPreference' className={selectClass} value={formData.menuPreference} onChange={e => set('menuPreference', e.target.value)}>
                    <option value=''>Bitte wählen…</option>
                    <option>Burger-Menü</option>
                    <option>Vegetarisch / Vegan</option>
                    <option>Gemischtes Menü</option>
                    <option>Spezielles Menü</option>
                    <option>Noch offen</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass} htmlFor='budget'>
                    Budget <span className='text-muted-foreground font-normal'>(optional)</span>
                  </label>
                  <Input id='budget' placeholder='z. B. 1.500 CHF' value={formData.budget} onChange={e => set('budget', e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          <div className='border-border border-t' />

          {/* 03 — Logistik */}
          <div>
            <h3 className={sectionHeadingClass}>
              <span className='text-primary'>03</span> Logistik & Rahmenbedingungen
            </h3>
            <div className='space-y-5'>
              <div className={gridTwoClass}>
                <div>
                  <p className={labelClass}>Stromanschluss vor Ort?</p>
                  <RadioGroup name='powerSupply' value={formData.powerSupply} onChange={v => set('powerSupply', v)}
                    options={[{ label: 'Ja', value: 'Ja' }, { label: 'Nein', value: 'Nein' }, { label: 'Unbekannt', value: 'Unbekannt' }]} />
                </div>
                <div>
                  <p className={labelClass}>Zufahrt für Foodtruck möglich?</p>
                  <RadioGroup name='truckAccess' value={formData.truckAccess} onChange={v => set('truckAccess', v)}
                    options={[{ label: 'Ja', value: 'Ja' }, { label: 'Nein', value: 'Nein' }, { label: 'Unbekannt', value: 'Unbekannt' }]} />
                </div>
              </div>
              <div className={gridTwoClass}>
                <div>
                  <p className={labelClass}>Indoor oder Outdoor?</p>
                  <RadioGroup name='indoorOutdoor' value={formData.indoorOutdoor} onChange={v => set('indoorOutdoor', v)}
                    options={[{ label: 'Indoor', value: 'Indoor' }, { label: 'Outdoor', value: 'Outdoor' }, { label: 'Beides', value: 'Beides' }]} />
                </div>
                <div>
                  <p className={labelClass}>Parkmöglichkeiten vorhanden?</p>
                  <RadioGroup name='parking' value={formData.parking} onChange={v => set('parking', v)}
                    options={[{ label: 'Ja', value: 'Ja' }, { label: 'Nein', value: 'Nein' }, { label: 'Unbekannt', value: 'Unbekannt' }]} />
                </div>
              </div>
            </div>
          </div>

          <div className='border-border border-t' />

          {/* 04 — Wünsche */}
          <div>
            <h3 className={sectionHeadingClass}>
              <span className='text-primary'>04</span> Weitere Informationen & Wünsche
            </h3>
            <textarea
              className={textareaClass}
              placeholder='z. B. Allergien, Motto der Feier, besondere Anforderungen …'
              value={formData.notes}
              onChange={e => set('notes', e.target.value)}
            />
          </div>

          <div className='border-border border-t' />

          {/* 05 — Optional */}
          <div>
            <h3 className={sectionHeadingClass}>
              <span className='text-primary'>05</span> Optionale Angaben
            </h3>
            <div className={gridTwoClass}>
              <div>
                <label className={labelClass} htmlFor='file'>
                  Datei-Upload <span className='text-muted-foreground font-normal'>(Lageplan, Details …)</span>
                </label>
                <input
                  id='file'
                  type='file'
                  accept='.pdf,.jpg,.jpeg,.png,.webp'
                  className='border-input bg-background text-muted-foreground file:text-foreground h-9 w-full cursor-pointer rounded-md border px-3 py-1 text-sm shadow-xs file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-medium'
                  onChange={e => set('file', e.target.files?.[0] ?? null)}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor='referralSource'>Wie haben Sie uns gefunden?</label>
                <select id='referralSource' className={selectClass} value={formData.referralSource} onChange={e => set('referralSource', e.target.value)}>
                  <option value=''>Bitte wählen…</option>
                  <option>Google</option>
                  <option>Instagram</option>
                  <option>Facebook</option>
                  <option>Empfehlung</option>
                  <option>Flyer / Plakat</option>
                  <option>Event gesehen</option>
                  <option>Sonstiges</option>
                </select>
              </div>
            </div>
          </div>

          <div className='border-border border-t' />

          {/* 06 — Datenschutz */}
          <div className='space-y-3'>
            <label className={cn('flex cursor-pointer items-start gap-3', errors.privacyAccepted && 'text-destructive')}>
              <input
                type='checkbox'
                className='accent-primary mt-0.5 size-4 shrink-0 cursor-pointer'
                checked={formData.privacyAccepted}
                onChange={e => set('privacyAccepted', e.target.checked)}
              />
              <span className='text-sm'>
                Ich stimme der{' '}
                <DatenschutzDialog
                  trigger={
                    <button type='button' className='text-primary cursor-pointer underline underline-offset-2'>
                      Datenschutzerklärung
                    </button>
                  }
                />{' '}
                zu. <span className='text-destructive'>*</span>
              </span>
            </label>
            {errors.privacyAccepted && <p className='text-destructive text-xs'>{errors.privacyAccepted}</p>}

            <label className='flex cursor-pointer items-start gap-3'>
              <input
                type='checkbox'
                className='accent-primary mt-0.5 size-4 shrink-0 cursor-pointer'
                checked={formData.newsletterOptIn}
                onChange={e => set('newsletterOptIn', e.target.checked)}
              />
              <span className='text-muted-foreground text-sm'>
                Ja, ich möchte den Newsletter erhalten und über Neuigkeiten & Angebote informiert werden.
              </span>
            </label>
          </div>

          <Button type='submit' size='lg' className='w-full sm:w-auto' disabled={loading}>
            {loading ? 'Wird gesendet…' : 'Anfrage absenden'}
          </Button>
        </form>
      </div>
    </section>
  )
}

export default ContactForm
