import { Antenna } from './types';

export interface AntennaGroup {
  id: string;
  color: string;
  antennas: Antenna[];
}

export let antennaGroups: AntennaGroup[] = [];

export function setAntennaGroups(groups: AntennaGroup[]) {
  antennaGroups = groups;
}

