export interface MeteorSettings {
  shower: string;
  showers: string;
  curDate: string;
  F: string;
  Lm: string;
  Dec: string;
  RaStartTime: string;
  RaStartValue: string;
  name: string;
}

export const DEFAULT_SETTINGS: MeteorSettings = {
  shower: 'PER',
  showers: '',
  curDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }),
  F: '0',
  Lm: '5.75',
  Dec: '30',
  RaStartTime: '1900',
  RaStartValue: '236',
  name: '',
};
