import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Antenna } from '@/lib/types'

interface AntennaPopupProps {
  antenna: Antenna
  onClose: () => void
}

export function AntennaPopup({ antenna, onClose }: AntennaPopupProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Antenna Details: {antenna.id}</CardTitle>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
            <dt className="font-semibold">Latitude:</dt>
            <dd>{antenna.position.latitude}</dd>
            <dt className="font-semibold">Longitude:</dt>
            <dd>{antenna.position.longitude}</dd>
            <dt className="font-semibold">Smartbox:</dt>
            <dd>{antenna.smartbox}</dd>
            <dt className="font-semibold">Smartbox Port:</dt>
            <dd>{antenna.smartbox_port}</dd>
            <dt className="font-semibold">TPM:</dt>
            <dd>{antenna.tpm}</dd>
            <dt className="font-semibold">EEP:</dt>
            <dd>{antenna.eep}</dd>
            <dt className="font-semibold">Delay:</dt>
            <dd>{antenna.delay}</dd>
            <dt className="font-semibold">TPM Fibre Input:</dt>
            <dd>{antenna.tpm_fibre_input}</dd>
            <dt className="font-semibold">TPM X Channel:</dt>
            <dd>{antenna.tpm_x_channel}</dd>
            <dt className="font-semibold">TPM Y Channel:</dt>
            <dd>{antenna.tpm_y_channel}</dd>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}

