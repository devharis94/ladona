'use client'

import { useState } from 'react'
import { CheckCircleIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { DatenschutzDialog } from '@/components/blocks/datenschutz/datenschutz-dialog'

type FormData = {
  // Basics
  name: string
  email: string
  phone: string
  eventDate: string
  eventLocation: string
  guestCount: string
  // Event Details
  eventType: string
  eventDuration: string
  menuPreference: string
  budget: string
  // Logistics
  powerSupply: string
  truckAccess: string
  indoorOutdoor: string
  parking: string
  // Special Requests
  notes: string
  // Optional
  file: File | null
  referralSource: string
  // Privacy
  privacyAccepted: boolean
  newsletterOptIn: boolean
}

const emptyFormData: FormData = {
  name: '',
  email: '',
  phone: '',
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
  phone: '+41 79 123 45 67',
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

const labelClass = 'block text-sm font-medium mb-1.5'
const inputClass =
  'border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]'
const selectClass =
  'border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] cursor-pointer'
const textareaClass =
  'border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-md border px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] min-h-28 resize-y'

const sectionHeadingClass = 'text-base font-semibold mb-4 flex items-center gap-2'
const gridTwoClass = 'grid gap-4 sm:grid-cols-2'

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
    if (!formData.phone.trim()) newErrors.phone = 'Bitte geben Sie Ihre Telefonnummer ein.'
    if (!formData.eventDate) newErrors.eventDate = 'Bitte wählen Sie ein Datum.'
    if (!formData.eventLocation.trim()) newErrors.eventLocation = 'Bitte geben Sie den Veranstaltungsort an.'
    if (!formData.guestCount) newErrors.guestCount = 'Bitte geben Sie die Personenanzahl an.'
    if (!formData.privacyAccepted) newErrors.privacyAccepted = 'Bitte stimmen Sie der Datenschutzerklärung zu.'
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setLoading(true)

    try {
      const body = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && key !== 'file') body.append(key, String(value))
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
            wie möglich bei Ihnen unter{' '}
            <strong>{formData.email}</strong>.
          </p>
          <div className='mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center'>
            <Button
              onClick={() => {
                setShowSuccess(false)
                setFormData(initialFormData)
              }}
              variant='outline'
            >
              Neue Anfrage senden
            </Button>
            <Button onClick={() => setShowSuccess(false)}>Schließen</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mx-auto mb-12 flex max-w-2xl flex-col items-center justify-center space-y-4 text-center sm:mb-16'>
          <Badge variant='outline' className='text-sm font-normal'>
            📋
          </Badge>
          <h2 className='text-2xl font-semibold md:text-3xl lg:text-4xl'>Anfrage stellen</h2>
          <p className='text-muted-foreground text-xl'>
            Füllen Sie das Formular aus und wir erstellen Ihnen ein unverbindliches Angebot für Ihr Event.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className='space-y-10'>
          {/* 1 — Basics */}
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
                <div>
                  <label className={labelClass} htmlFor='phone'>
                    Telefonnummer <span className='text-destructive'>*</span>
                  </label>
                  <Input
                    id='phone'
                    type='tel'
                    placeholder='+49 123 456789'
                    value={formData.phone}
                    onChange={e => set('phone', e.target.value)}
                    aria-invalid={!!errors.phone}
                  />
                  {errors.phone && <p className='text-destructive mt-1 text-xs'>{errors.phone}</p>}
                </div>
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
                    className={cn(inputClass, errors.eventDate && 'border-destructive')}
                    value={formData.eventDate}
                    onChange={e => set('eventDate', e.target.value)}
                  />
                  {errors.eventDate && <p className='text-destructive mt-1 text-xs'>{errors.eventDate}</p>}
                </div>
                <div>
                  <label className={labelClass} htmlFor='eventLocation'>
                    Ort der Veranstaltung <span className='text-destructive'>*</span>
                  </label>
                  <Input
                    id='eventLocation'
                    placeholder='z. B. Berlin Mitte'
                    value={formData.eventLocation}
                    onChange={e => set('eventLocation', e.target.value)}
                    aria-invalid={!!errors.eventLocation}
                  />
                  {errors.eventLocation && (
                    <p className='text-destructive mt-1 text-xs'>{errors.eventLocation}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className='border-border border-t' />

          {/* 2 — Event Details */}
          <div>
            <h3 className={sectionHeadingClass}>
              <span className='text-primary'>02</span> Event-Details
            </h3>
            <div className='space-y-4'>
              <div className={gridTwoClass}>
                <div>
                  <label className={labelClass} htmlFor='eventType'>
                    Art der Veranstaltung
                  </label>
                  <select
                    id='eventType'
                    className={selectClass}
                    value={formData.eventType}
                    onChange={e => set('eventType', e.target.value)}
                  >
                    <option value=''>Bitte wählen…</option>
                    <option value='Hochzeit'>Hochzeit</option>
                    <option value='Geburtstag'>Geburtstag</option>
                    <option value='Firmenfeier'>Firmenfeier</option>
                    <option value='Festival'>Festival</option>
                    <option value='Jubiläum'>Jubiläum</option>
                    <option value='Sonstige'>Sonstige</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass} htmlFor='eventDuration'>
                    Dauer / Uhrzeit
                  </label>
                  <Input
                    id='eventDuration'
                    placeholder='z. B. 18:00 – 22:00 Uhr'
                    value={formData.eventDuration}
                    onChange={e => set('eventDuration', e.target.value)}
                  />
                </div>
              </div>
              <div className={gridTwoClass}>
                <div>
                  <label className={labelClass} htmlFor='menuPreference'>
                    Gewünschtes Angebot
                  </label>
                  <select
                    id='menuPreference'
                    className={selectClass}
                    value={formData.menuPreference}
                    onChange={e => set('menuPreference', e.target.value)}
                  >
                    <option value=''>Bitte wählen…</option>
                    <option value='Burger-Menü'>Burger-Menü</option>
                    <option value='Vegetarisch / Vegan'>Vegetarisch / Vegan</option>
                    <option value='Gemischtes Menü'>Gemischtes Menü</option>
                    <option value='Spezielles Menü'>Spezielles Menü</option>
                    <option value='Noch offen'>Noch offen</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass} htmlFor='budget'>
                    Budget{' '}
                    <span className='text-muted-foreground font-normal'>(optional)</span>
                  </label>
                  <Input
                    id='budget'
                    placeholder='z. B. 1.500 €'
                    value={formData.budget}
                    onChange={e => set('budget', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='border-border border-t' />

          {/* 3 — Logistik */}
          <div>
            <h3 className={sectionHeadingClass}>
              <span className='text-primary'>03</span> Logistik & Rahmenbedingungen
            </h3>
            <div className='space-y-5'>
              <div className={gridTwoClass}>
                <div>
                  <p className={labelClass}>Stromanschluss vor Ort?</p>
                  <RadioGroup
                    name='powerSupply'
                    value={formData.powerSupply}
                    onChange={val => set('powerSupply', val)}
                    options={[
                      { label: 'Ja', value: 'Ja' },
                      { label: 'Nein', value: 'Nein' },
                      { label: 'Unbekannt', value: 'Unbekannt' }
                    ]}
                  />
                </div>
                <div>
                  <p className={labelClass}>Zufahrt für Foodtruck möglich?</p>
                  <RadioGroup
                    name='truckAccess'
                    value={formData.truckAccess}
                    onChange={val => set('truckAccess', val)}
                    options={[
                      { label: 'Ja', value: 'Ja' },
                      { label: 'Nein', value: 'Nein' },
                      { label: 'Unbekannt', value: 'Unbekannt' }
                    ]}
                  />
                </div>
              </div>
              <div className={gridTwoClass}>
                <div>
                  <p className={labelClass}>Indoor oder Outdoor?</p>
                  <RadioGroup
                    name='indoorOutdoor'
                    value={formData.indoorOutdoor}
                    onChange={val => set('indoorOutdoor', val)}
                    options={[
                      { label: 'Indoor', value: 'Indoor' },
                      { label: 'Outdoor', value: 'Outdoor' },
                      { label: 'Beides', value: 'Beides' }
                    ]}
                  />
                </div>
                <div>
                  <p className={labelClass}>Parkmöglichkeiten vorhanden?</p>
                  <RadioGroup
                    name='parking'
                    value={formData.parking}
                    onChange={val => set('parking', val)}
                    options={[
                      { label: 'Ja', value: 'Ja' },
                      { label: 'Nein', value: 'Nein' },
                      { label: 'Unbekannt', value: 'Unbekannt' }
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='border-border border-t' />

          {/* 4 — Spezielle Wünsche */}
          <div>
            <h3 className={sectionHeadingClass}>
              <span className='text-primary'>04</span> Weitere Informationen & Wünsche
            </h3>
            <textarea
              id='notes'
              className={textareaClass}
              placeholder='z. B. Allergien, Motto der Feier, besondere Anforderungen …'
              value={formData.notes}
              onChange={e => set('notes', e.target.value)}
            />
          </div>

          <div className='border-border border-t' />

          {/* 5 — Optional */}
          <div>
            <h3 className={sectionHeadingClass}>
              <span className='text-primary'>05</span> Optionale Angaben
            </h3>
            <div className='space-y-4'>
              <div className={gridTwoClass}>
                <div>
                  <label className={labelClass} htmlFor='file'>
                    Datei-Upload{' '}
                    <span className='text-muted-foreground font-normal'>(Lageplan, Details …)</span>
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
                  <label className={labelClass} htmlFor='referralSource'>
                    Wie haben Sie uns gefunden?
                  </label>
                  <select
                    id='referralSource'
                    className={selectClass}
                    value={formData.referralSource}
                    onChange={e => set('referralSource', e.target.value)}
                  >
                    <option value=''>Bitte wählen…</option>
                    <option value='Google'>Google</option>
                    <option value='Instagram'>Instagram</option>
                    <option value='Facebook'>Facebook</option>
                    <option value='Empfehlung'>Empfehlung</option>
                    <option value='Flyer / Plakat'>Flyer / Plakat</option>
                    <option value='Event gesehen'>Event gesehen</option>
                    <option value='Sonstiges'>Sonstiges</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className='border-border border-t' />

          {/* 6 — Datenschutz */}
          <div className='space-y-3'>
            <label
              className={cn(
                'flex cursor-pointer items-start gap-3',
                errors.privacyAccepted && 'text-destructive'
              )}
            >
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
                    <button type='button' className='text-primary underline underline-offset-2 cursor-pointer'>
                      Datenschutzerklärung
                    </button>
                  }
                />{' '}
                zu. <span className='text-destructive'>*</span>
              </span>
            </label>
            {errors.privacyAccepted && (
              <p className='text-destructive text-xs'>{errors.privacyAccepted}</p>
            )}

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
