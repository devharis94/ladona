'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h3 className='mb-2 font-semibold'>{title}</h3>
    <div className='text-muted-foreground space-y-1.5 text-sm leading-relaxed'>{children}</div>
  </div>
)

export function DatenschutzDialog({ trigger }: { trigger: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='flex max-h-[90vh] max-w-2xl flex-col gap-0 p-0'>
        {/* Fixed header */}
        <DialogHeader className='border-border border-b px-6 py-5'>
          <DialogTitle className='text-xl'>Datenschutzerklärung</DialogTitle>
          <p className='text-muted-foreground text-sm'>Stand: März 2025</p>
        </DialogHeader>

        {/* Scrollable content */}
        <div className='flex-1 space-y-6 overflow-y-auto px-6 py-5'>
          <Section title='1. Verantwortliche Person'>
            <p>
              Verantwortlich für die Datenverarbeitung auf dieser Website ist:
            </p>
            <p className='mt-2 font-medium not-italic text-foreground'>
              La Doña – Karibisches Streetfood<br />
              [Ihr Name]<br />
              [Straße und Hausnummer]<br />
              [PLZ Ort]<br />
              E-Mail: [ihre@email.de]<br />
              Telefon: [+49 ...]
            </p>
          </Section>

          <Section title='2. Welche Daten wir erheben'>
            <p>Bei der Nutzung unseres Kontaktformulars erheben wir folgende personenbezogene Daten:</p>
            <ul className='mt-1.5 list-inside list-disc space-y-1'>
              <li>Name und Vorname</li>
              <li>E-Mail-Adresse</li>
              <li>Telefonnummer</li>
              <li>Veranstaltungsdaten (Datum, Ort, Personenanzahl)</li>
              <li>Von Ihnen freiwillig gemachte Angaben (z. B. Budget, Wünsche, hochgeladene Dateien)</li>
            </ul>
            <p className='mt-2'>
              Beim Besuch unserer Website werden technische Daten (IP-Adresse, Browsertyp, Zugriffszeitpunkt)
              automatisch durch den Hosting-Anbieter erfasst.
            </p>
          </Section>

          <Section title='3. Zweck und Rechtsgrundlage der Verarbeitung'>
            <p>Ihre Daten werden ausschließlich für folgende Zwecke verarbeitet:</p>
            <ul className='mt-1.5 list-inside list-disc space-y-1'>
              <li>
                <strong className='text-foreground'>Bearbeitung Ihrer Anfrage</strong> – Art. 6 Abs. 1 lit. b DSGVO
                (Vertragsanbahnung)
              </li>
              <li>
                <strong className='text-foreground'>Newsletter</strong> (nur bei ausdrücklicher Einwilligung) –
                Art. 6 Abs. 1 lit. a DSGVO
              </li>
              <li>
                <strong className='text-foreground'>Technischer Betrieb der Website</strong> –
                Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)
              </li>
            </ul>
          </Section>

          <Section title='4. Speicherdauer'>
            <p>
              Ihre Anfragedaten werden gelöscht, sobald die Bearbeitung abgeschlossen ist und keine gesetzlichen
              Aufbewahrungspflichten bestehen. Handels- und steuerrechtliche Unterlagen werden gemäß §§ 147 AO,
              257 HGB bis zu 10 Jahre aufbewahrt.
            </p>
            <p className='mt-1.5'>
              Bei Newsletter-Einwilligung werden Ihre Daten bis zum Widerruf gespeichert. Den Newsletter können Sie
              jederzeit abbestellen.
            </p>
          </Section>

          <Section title='5. Weitergabe an Dritte'>
            <p>
              Eine Weitergabe Ihrer Daten an Dritte erfolgt nicht, es sei denn, dies ist zur Vertragserfüllung
              erforderlich (z. B. Hosting-Anbieter) oder gesetzlich vorgeschrieben. Alle eingesetzten
              Dienstleister sind sorgfältig ausgewählt und verarbeiten Daten ausschließlich nach unserer Weisung
              (Auftragsverarbeitungsvertrag).
            </p>
          </Section>

          <Section title='6. Hosting'>
            <p>
              Diese Website wird bei einem in der EU ansässigen Hosting-Anbieter betrieben. Die Übertragung
              erfolgt verschlüsselt über HTTPS.
            </p>
          </Section>

          <Section title='7. Cookies'>
            <p>
              Diese Website verwendet ausschließlich technisch notwendige Cookies, die für den Betrieb der
              Website erforderlich sind. Es werden keine Tracking- oder Analyse-Cookies eingesetzt.
            </p>
          </Section>

          <Section title='8. Ihre Rechte'>
            <p>Sie haben das Recht auf:</p>
            <ul className='mt-1.5 list-inside list-disc space-y-1'>
              <li>
                <strong className='text-foreground'>Auskunft</strong> über Ihre gespeicherten Daten (Art. 15 DSGVO)
              </li>
              <li>
                <strong className='text-foreground'>Berichtigung</strong> unrichtiger Daten (Art. 16 DSGVO)
              </li>
              <li>
                <strong className='text-foreground'>Löschung</strong> Ihrer Daten (Art. 17 DSGVO)
              </li>
              <li>
                <strong className='text-foreground'>Einschränkung</strong> der Verarbeitung (Art. 18 DSGVO)
              </li>
              <li>
                <strong className='text-foreground'>Datenübertragbarkeit</strong> (Art. 20 DSGVO)
              </li>
              <li>
                <strong className='text-foreground'>Widerspruch</strong> gegen die Verarbeitung (Art. 21 DSGVO)
              </li>
              <li>
                <strong className='text-foreground'>Widerruf</strong> einer erteilten Einwilligung jederzeit mit
                Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)
              </li>
            </ul>
            <p className='mt-2'>
              Zur Ausübung Ihrer Rechte wenden Sie sich bitte an die oben genannte E-Mail-Adresse.
            </p>
          </Section>

          <Section title='9. Beschwerderecht'>
            <p>
              Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Die zuständige
              Behörde richtet sich nach Ihrem Wohnsitz oder dem Sitz unseres Unternehmens.
            </p>
          </Section>

          <Section title='10. Kontakt bei Datenschutzfragen'>
            <p>
              Bei Fragen zum Datenschutz erreichen Sie uns unter der oben angegebenen E-Mail-Adresse. Wir
              beantworten Ihre Anfragen schnellstmöglich, spätestens innerhalb eines Monats.
            </p>
          </Section>
        </div>

        {/* Fixed footer */}
        <div className='border-border border-t px-6 py-4'>
          <DialogClose asChild>
            <Button className='w-full sm:w-auto'>Schließen</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
