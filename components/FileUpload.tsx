import { ChangeEvent, useState } from 'react'
import yaml from 'js-yaml'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Antenna } from '@/lib/types'
import { setAntennaGroups, AntennaGroup } from '@/lib/antennaData'
import { generateVibrantColor } from '@/lib/colorUtils'
import { Upload } from 'lucide-react'

interface FileUploadProps {
  onDataLoaded: () => void;
}

export function FileUpload({ onDataLoaded }: FileUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    try {
      const fileContent = await file.text();
      const data = yaml.load(fileContent) as any;
      const antennasObj = data.platform.stations['s10-3'].antennas;

      const antennas: Antenna[] = Object.entries(antennasObj).map(([id, antennaInfo]: [string, any]) => ({
        id,
        position: antennaInfo.position,
        location_offset: antennaInfo.location_offset,
        eep: antennaInfo.eep,
        smartbox: antennaInfo.smartbox,
        smartbox_port: antennaInfo.smartbox_port,
        tpm: antennaInfo.tpm,
        tpm_fibre_input: antennaInfo.tpm_fibre_input,
        tpm_x_channel: antennaInfo.tpm_x_channel,
        tpm_y_channel: antennaInfo.tpm_y_channel,
        delay: antennaInfo.delay,
        masked: antennaInfo.masked || false,
      }));

      const groupedAntennas = antennas.reduce((acc, antenna) => {
        const group = antenna.id.substring(0, 4);
        if (!acc[group]) {
          acc[group] = [];
        }
        acc[group].push(antenna);
        return acc;
      }, {} as Record<string, Antenna[]>);

      const antennaGroups: AntennaGroup[] = Object.entries(groupedAntennas).map(([groupId, groupAntennas], index) => ({
        id: groupId,
        color: generateVibrantColor(index),
        antennas: groupAntennas,
      }));

      setAntennaGroups(antennaGroups);

      console.log(`Loaded ${antennas.length} antennas from ${antennaGroups.length} groups.`);
      
      onDataLoaded();
      setError(null);
    } catch (err) {
      console.error('Error parsing YAML file:', err);
      setError('Error parsing YAML file. Please check the file format and try again.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Input
          type="file"
          accept=".yaml,.yml"
          onChange={handleFileUpload}
          className="hidden"
          id="yaml-upload"
        />
        <Button asChild variant="outline" className="w-full">
          <label htmlFor="yaml-upload" className="cursor-pointer w-full flex items-center justify-center">
            <Upload className="w-4 h-4 mr-2" />
            Choose YAML File
          </label>
        </Button>
        {fileName && (
          <p className="text-sm text-muted-foreground mt-2">
            Selected file: {fileName}
          </p>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

