export type AlertType = {
  type: string;
  label: string;
  icon: string;
};

export const ALERT_TYPES: AlertType[] = [
  {
    type: 'Flood',
    label: 'Enchente',
    icon: 'fa-water',
  },
  {
    type: 'Landslide',
    label: 'Deslizamento',
    icon: 'fa-mountain',
  },
  {
    type: 'Fire',
    label: 'Incêndio',
    icon: 'fa-fire',
  },
  {
    type: 'StrongWind',
    label: 'Ventos fortes',
    icon: 'fa-wind',
  },
  {
    type: 'Storm',
    label: 'Tempestade',
    icon: 'fa-cloud-showers-heavy',
  },
  {
    type: 'Lightning',
    label: 'Relâmpago',
    icon: 'fa-bolt',
  },
  {
    type: 'Hail',
    label: 'Granizo',
    icon: 'fa-snowflake',
  },
  {
    type: 'HeatWave',
    label: 'Onda de calor',
    icon: 'fa-temperature-high',
  },
  {
    type: 'ColdWave',
    label: 'Onda de frio',
    icon: 'fa-temperature-low',
  },
  {
    type: 'Tornado',
    label: 'Tornado',
    icon: 'fa-tornado',
  },
  {
    type: 'Earthquake',
    label: 'Terremoto',
    icon: 'fa-house-crack',
  },
  {
    type: 'Evacuation',
    label: 'Evacuação',
    icon: 'fa-person-running',
  },
  {
    type: 'Shelter',
    label: 'Abrigo disponível',
    icon: 'fa-house-chimney-medical',
  },
  {
    type: 'BlockedRoad',
    label: 'Rua bloqueada',
    icon: 'fa-road-barrier',
  },
  {
    type: 'PowerOutage',
    label: 'Queda de energia',
    icon: 'fa-plug-circle-exclamation',
  }
];
