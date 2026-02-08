import { Sector } from '../backend';

export const SECTOR_OPTIONS: { value: Sector; label: string }[] = [
  { value: Sector.marchand, label: 'Merchant' },
  { value: Sector.association, label: 'Association' },
  { value: Sector.professionLiberal, label: 'Liberal Profession' },
  { value: Sector.services, label: 'Professional Services' },
  { value: Sector.fonctionnaire, label: 'Civil Servant' },
  { value: Sector.artiste, label: 'Artist' },
  { value: Sector.sportif, label: 'Athlete' },
  { value: Sector.etudiant, label: 'Student' },
  { value: Sector.aucuneActivite, label: 'No Activity' },
];

export function getSectorLabel(sector: Sector): string {
  const option = SECTOR_OPTIONS.find(opt => opt.value === sector);
  return option?.label || 'Unknown';
}
