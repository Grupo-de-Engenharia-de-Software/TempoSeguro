import { CONFIG } from 'src/config-global';
import { MapView } from 'src/sections/map';

export const metadata = { title: `Mapa | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <MapView />;
}
