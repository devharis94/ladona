import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  })
}

function formatDate(iso: string): string {
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return iso
  return `${match[3]}.${match[2]}.${match[1]}`
}

function buildHtml(fields: Record<string, string>): string {
  const row = (label: string, value: string) =>
    value
      ? `<tr>
          <td style="padding:6px 12px;font-weight:600;white-space:nowrap;vertical-align:top;color:#555">${label}</td>
          <td style="padding:6px 12px;color:#222">${value}</td>
        </tr>`
      : ''

  return `
    <html><head><meta charset="utf-8"></head>
    <body>
    <div style="font-family:sans-serif;max-width:640px;margin:0 auto">
      <h2 style="background:#c0392b;color:#fff;margin:0;padding:20px 24px;font-size:20px">
        Neue Eventanfrage – La Doña
      </h2>
      <table style="width:100%;border-collapse:collapse;margin-top:0">
        <tbody style="background:#fafafa">
          <tr><td colspan="2" style="padding:10px 12px;font-weight:700;background:#eee;color:#333">Kontaktdaten</td></tr>
          ${row('Name', fields.name)}
          ${row('E-Mail', fields.email)}
          ${row('Telefon', fields.phone)}
          ${row('Personenanzahl', fields.guestCount)}

          <tr><td colspan="2" style="padding:10px 12px;font-weight:700;background:#eee;color:#333">Event-Details</td></tr>
          ${row('Datum', formatDate(fields.eventDate))}
          ${row('Ort', fields.eventLocation)}
          ${row('Art der Veranstaltung', fields.eventType)}
          ${row('Dauer / Uhrzeit', fields.eventDuration)}
          ${row('Gewünschtes Angebot', fields.menuPreference)}
          ${row('Budget', fields.budget)}

          <tr><td colspan="2" style="padding:10px 12px;font-weight:700;background:#eee;color:#333">Logistik</td></tr>
          ${row('Stromanschluss', fields.powerSupply)}
          ${row('Zufahrt für Foodtruck', fields.truckAccess)}
          ${row('Indoor / Outdoor', fields.indoorOutdoor)}
          ${row('Parkmöglichkeiten', fields.parking)}

          <tr><td colspan="2" style="padding:10px 12px;font-weight:700;background:#eee;color:#333">Weitere Informationen</td></tr>
          ${row('Wünsche / Hinweise', fields.notes?.replace(/\n/g, '<br>'))}
          ${row('Wie gefunden', fields.referralSource)}
          ${row('Newsletter', fields.newsletterOptIn === 'true' ? 'Ja' : 'Nein')}
        </tbody>
      </table>
      <p style="padding:16px 12px;font-size:12px;color:#999;border-top:1px solid #ddd">
        Diese Anfrage wurde über das Kontaktformular auf Ihrer Website gesendet.
      </p>
    </div>
    </body></html>
  `
}

export async function POST(request: Request) {
  const formData = await request.formData()

  const fields: Record<string, string> = {}
  for (const [key, value] of formData.entries()) {
    if (typeof value === 'string') fields[key] = value
  }

  // Validate required fields
  const required = ['name', 'email', 'phone', 'eventDate', 'eventLocation', 'guestCount']
  for (const field of required) {
    if (!fields[field]?.trim()) {
      return NextResponse.json({ error: `Pflichtfeld fehlt: ${field}` }, { status: 400 })
    }
  }

  // Handle optional file attachment
  const file = formData.get('file') as File | null
  const attachments: nodemailer.SendMailOptions['attachments'] = []

  if (file && file.size > 0) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Ungültiger Dateityp. Erlaubt: PDF, JPG, PNG, WEBP.' },
        { status: 400 }
      )
    }
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: 'Datei zu groß. Maximal 10 MB.' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    attachments.push({
      filename: file.name,
      content: buffer,
      contentType: file.type
    })
  }

  // Log env config (redact password)
  console.log('[contact] ENV check:', {
    SMTP_HOST: process.env.SMTP_HOST || '⚠️  not set',
    SMTP_PORT: process.env.SMTP_PORT || '⚠️  not set',
    SMTP_SECURE: process.env.SMTP_SECURE || '⚠️  not set',
    SMTP_USER: process.env.SMTP_USER || '⚠️  not set',
    SMTP_PASSWORD: process.env.SMTP_PASSWORD ? '✓ set' : '⚠️  not set',
    SMTP_FROM: process.env.SMTP_FROM || '⚠️  not set',
    CONTACT_EMAIL: process.env.CONTACT_EMAIL || '⚠️  not set',
  })
  console.log('[contact] Sending from:', `"La Doña Anfragen" <${process.env.SMTP_FROM}>`)
  console.log('[contact] Sending to:', process.env.CONTACT_EMAIL)
  console.log('[contact] Reply-to:', fields.email)

  const transporter = createTransporter()

  // Verify SMTP connection before attempting to send
  try {
    await transporter.verify()
    console.log('[contact] SMTP connection verified OK')
  } catch (err) {
    console.error('[contact] SMTP verify failed:', err)
    return NextResponse.json(
      { error: 'SMTP-Verbindung fehlgeschlagen.', detail: String(err) },
      { status: 500 }
    )
  }

  try {
    const info = await transporter.sendMail({
      from: `"La Doña Anfragen" <${process.env.SMTP_FROM}>`,
      to: process.env.CONTACT_EMAIL,
      replyTo: fields.email,
      subject: `Neue Eventanfrage von ${fields.name} – ${formatDate(fields.eventDate)}`,
      html: buildHtml(fields),
      attachments
    })
    console.log('[contact] Mail sent:', info.messageId, info.response)
  } catch (err) {
    console.error('[contact] sendMail failed:', err)
    return NextResponse.json(
      { error: 'E-Mail konnte nicht gesendet werden.', detail: String(err) },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
