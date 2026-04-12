import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const HeroSection = () => {
  return (
    <section className='flex min-h-[calc(100dvh-4rem)] flex-1 flex-col justify-between gap-12 overflow-x-hidden pt-8 sm:gap-16 sm:pt-16 lg:gap-24 lg:pt-24'>
      {/* Hero Content */}
      <div className='mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 text-center sm:px-6 lg:px-8'>


        <h1 className='text-3xl leading-[1.29167] font-bold text-balance sm:text-4xl lg:text-5xl'>
          🌴 La Doña – Streetfood aus der Dominikanischen Republik
        </h1>

        <p className='text-muted-foreground'>
          Wir sind ein Familienbetrieb mit Wurzeln in der Dominikanischen Republik und bringen den Geschmack der Karibik direkt zu Ihnen. <br />Bei uns wird frisch, hausgemacht und mit viel Liebe gekocht
        </p>

        <Button size='lg' asChild>
          <a href='#popular-dishes'>Unser Angebot</a>
        </Button>
      </div>

      {/* Image */}
      <img
        src='https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/hero/image-19.png'
        alt='Dishes'
        className='min-h-67 w-full object-cover'
      />
    </section>
  )
}

export default HeroSection
