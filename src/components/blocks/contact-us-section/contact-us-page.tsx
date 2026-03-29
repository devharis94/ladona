import type { ComponentType } from 'react'

import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

type ContactInfo = {
  title: string
  icon: ComponentType
  description: string
}[]

const ContactUs = ({ contactInfo }: { contactInfo: ContactInfo }) => {
  return (
    <section
      id='contact-us'
      className='before:bg-muted relative py-8 before:absolute before:inset-0 before:-z-10 before:skew-y-3 sm:py-16 lg:py-24'
    >
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mx-auto mb-12 flex max-w-2xl flex-col items-center justify-center space-y-4 text-center sm:mb-16 lg:mb-24'>
          <Badge variant='outline' className='text-sm font-normal'>
            📩
          </Badge>
          <h2 className='text-2xl font-semibold md:text-3xl lg:text-4xl'>Kontakt</h2>
          <p className='text-muted-foreground text-xl'>
            Haben Sie Lust auf echtes karibisches Streetfood an Ihrem Event? Dann melden Sie sich bei uns – wir freuen
            uns auf Ihre Anfrage!
          </p>
        </div>

        <div className='grid items-center gap-12 lg:grid-cols-2'>
          <img
            src='/images/contact-us-01.jpg'
            alt='Contact illustration'
            className='size-full object-cover max-lg:max-h-70'
          />

          <div>
            <h3 className='mb-2 text-2xl'>Wir sind für Sie da</h3>
            <p className='text-muted-foreground mb-10 text-lg'>
              Wir freuen uns, von Ihnen zu hören. Ob Sie eine Frage haben, eine Reservierung vornehmen möchten oder mehr
              über unser Angebot erfahren wollen – wir helfen Ihnen gerne weiter.
            </p>

            {/* Contact Info Grid */}
            <div className='grid gap-6 sm:grid-cols-2'>
              {contactInfo.map((info, index) => (
                <Card
                  className='bg-background hover:border-primary rounded-none shadow-none transition-colors duration-300'
                  key={index}
                >
                  <CardContent className='flex flex-col items-center gap-4 text-center'>
                    <Avatar className='size-9 border'>
                      <AvatarFallback className='bg-transparent [&>svg]:size-5'>
                        <info.icon />
                      </AvatarFallback>
                    </Avatar>
                    <div className='space-y-3'>
                      <h4 className='text-lg font-semibold'>{info.title}</h4>
                      <div className='text-muted-foreground text-base font-medium'>
                        {info.description.split('\n').map((line, idx) => (
                          <p key={idx}>{line}</p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactUs
