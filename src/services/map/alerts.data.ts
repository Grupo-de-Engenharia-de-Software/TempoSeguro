import { AwesomeMarkers } from "leaflet";

export type AlertType = {
  type: string;
  label: string;
  iconMarker: string;
  icon: string;
  /** Marker pin color (red, darkred, orange, green, darkgreen, blue, purple, darkpurple, cadetblue) */
  markerColor?: AwesomeMarkers.AwesomeMarkersIconOptions['markerColor'];
  /** Inner icon color (e.g. 'white', 'black' or any CSS color) */
  iconColor?: AwesomeMarkers.AwesomeMarkersIconOptions['iconColor'];
};


export const ALERT_TYPES: AlertType[] = [
  {
    type: 'flood',
    label: 'Enchente',
    iconMarker: 'water',
    icon: 'fa-water',
    markerColor: 'blue',
    iconColor: 'white',
  },
  {
    type: 'landslide',
    label: 'Deslizamento',
    iconMarker: 'mountain',
    icon: 'fa-mountain',
    markerColor: 'orange',
    iconColor: 'white',
  },
  {
    type: 'fire',
    label: 'Incêndio',
    iconMarker: 'fire',
    icon: 'fa-fire',
    markerColor: 'darkred',
    iconColor: 'white',
  },
  {
    type: 'strongWind',
    label: 'Ventos fortes',
    iconMarker: 'wind',
    icon: 'fa-wind',
    markerColor: 'darkgreen',
    iconColor: 'white',
  },
  {
    type: 'storm',
    label: 'Tempestade',
    iconMarker: 'cloud-showers-heavy',
    icon: 'fa-cloud-showers-heavy',
    markerColor: 'darkpurple',
    iconColor: 'white',
  },
  {
    type: 'lightning',
    label: 'Relâmpago',
    iconMarker: 'bolt',
    icon: 'fa-bolt',
    markerColor: 'orange',
    iconColor: 'white',
  },
  {
    type: 'hail',
    label: 'Granizo',
    iconMarker: 'snowflake',
    icon: 'fa-snowflake',
    markerColor: 'cadetblue',
    iconColor: 'white',
  },
  {
    type: 'heatWave',
    label: 'Onda de calor',
    iconMarker: 'temperature-high',
    icon: 'fa-temperature-high',
    markerColor: 'orange',
    iconColor: 'white',
  },
  {
    type: 'coldWave',
    label: 'Onda de frio',
    iconMarker: 'temperature-low',
    icon: 'fa-temperature-low',
    markerColor: 'blue',
    iconColor: 'white',
  },
  {
    type: 'tornado',
    label: 'Tornado',
    iconMarker: 'tornado',
    icon: 'fa-tornado',
    markerColor: 'darkpurple',
    iconColor: 'white',
  },
  {
    type: 'earthquake',
    label: 'Terremoto',
    iconMarker: 'house-crack',
    icon: 'fa-house-crack',
    markerColor: 'darkred',
    iconColor: 'white',
  },
  {
    type: 'evacuation',
    label: 'Evacuação',
    iconMarker: 'person-running',
    icon: 'fa-person-running',
    markerColor: 'green',
    iconColor: 'white',
  },
  {
    type: 'shelter',
    label: 'Abrigo disponível',
    iconMarker: 'house-chimney-medical',
    icon: 'fa-house-chimney-medical',
    markerColor: 'green',
    iconColor: 'white',
  },
  {
    type: 'blockedRoad',
    label: 'Rua bloqueada',
    iconMarker: 'road-barrier',
    icon: 'fa-road-barrier',
    markerColor: 'orange',
    iconColor: 'white',
  },
  {
    type: 'powerOutage',
    label: 'Queda de energia',
    iconMarker: 'plug-circle-exclamation',
    icon: 'fa-plug-circle-exclamation',
    markerColor: 'purple',
    iconColor: 'white',
  }
];
