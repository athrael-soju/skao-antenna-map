export interface Antenna {
  id: string;
  position: {
    latitude: number;
    longitude: number;
  };
  location_offset: {
    east: number;
    north: number;
    up: number;
  };
  eep: number;
  smartbox: string;
  smartbox_port: number;
  tpm: string;
  tpm_fibre_input: number;
  tpm_x_channel: number;
  tpm_y_channel: number;
  delay: number;
  masked: boolean;
}

export interface AntennaGroup {
  id: string;
  color: string;
  antennas: Antenna[];
}

declare global {
  interface Window {
    handleAntennaClick: (antenna: Antenna) => void;
  }
}

export interface YAMLData {
  platform: {
    stations: {
      [stationId: string]: {
        antennas: {
          [antennaId: string]: {
            position: {
              latitude: number;
              longitude: number;
            };
            location_offset: {
              east: number;
              north: number;
              up: number;
            };
            eep: number;
            smartbox: string;
            smartbox_port: number;
            tpm: string;
            tpm_fibre_input: number;
            tpm_x_channel: number;
            tpm_y_channel: number;
            delay: number;
            masked?: boolean;
          };
        };
      };
    };
  };
}
