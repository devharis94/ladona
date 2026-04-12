import type { ComponentType } from 'react'

import { Badge } from '@/components/ui/badge'

type Stat = {
  icon: ComponentType
  value: string
  description: string[]
}

const AboutUs = ({ stats }: { stats: Stat[] }) => {
  return (
    <section
      id='about-us'
      className='before:bg-muted relative py-8 before:absolute before:inset-0 before:-z-10 before:skew-y-3 sm:py-16 lg:py-24'
    >
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mx-auto mb-12 flex max-w-3xl flex-col items-center justify-center space-y-4 text-center md:mb-16 lg:mb-24'>
          <Badge variant='outline' className='text-sm font-normal'>
            Über uns
          </Badge>
          <h2 className='text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl'>❤️ Was uns ausmacht</h2>
          <p className='text-muted-foreground text-xl'>
            Wir sind ein Familienbetrieb mit Herz – und das schmeckt man. Unsere Gerichte basieren auf authentischen
            dominikanischen Rezepten, werden täglich frisch und hausgemacht zubereitet und mit echter Leidenschaft
            serviert. Egal ob kleines Fest oder großes Event – wir sind flexibel, persönlich und unkompliziert. Bei uns
            bist du nicht einfach ein Kunde, sondern Teil unserer Familie. 🌴
          </p>
        </div>

        {/* Video player and stats */}
        <div className='relative mb-8 h-full w-full sm:mb-16 lg:mb-24'>
          <img src='/images/food-table.jpg' alt='About us illustration' className='h-full w-full object-cover' />

          {/* Stats card overlapping the video section */}
          <div className='bg-background grid gap-10 border p-8 sm:max-lg:grid-cols-2 lg:absolute lg:-bottom-25 lg:left-1/2 lg:w-3/4 lg:-translate-x-1/2 lg:grid-cols-4 lg:px-10'>
            {stats.map((stat, index) => (
              <div key={index} className='flex flex-col items-center justify-center gap-2.5 text-center'>
                <div className='flex size-7 items-center justify-center [&>svg]:size-7'>
                  <stat.icon />
                </div>
                <span className='text-2xl font-semibold'>{stat.value}</span>
                <p className='text-muted-foreground text-lg'>
                  {stat.description[0]} <br /> {stat.description[1]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutUs
