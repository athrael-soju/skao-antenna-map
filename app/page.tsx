import { AntennaMap } from '@/components/AntennaMap'

export default function Home() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-center text-foreground mb-8">
          Antenna Position Map
        </h1>
        <AntennaMap />
      </div>
    </div>
  )
}

