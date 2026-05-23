export const clinicLocation = {
  name: 'Parla Dental Ağız ve Diş Sağlığı Polikliniği',
  mapPlaceName: 'Mutludent Ağız ve Diş Sağlığı Polikliniği',
  address: 'Çağlayan Mahallesi, Tıp Fakültesi Caddesi No:254/A, 06630 Mamak / Ankara',
  shortAddress: 'Çağlayan, Mamak / Ankara',
  phone: '0312 456 78 90',
  email: 'info@parladental.com',
  mapsUrl: 'https://maps.app.goo.gl/tEccPQAjQFgCWiNW9?g_st=iw',
  embedQuery: 'Mutludent Ağız ve Diş Sağlığı Polikliniği, Çağlayan, Tıp Fakültesi Cd. 254/a, 06630 Mamak/Ankara',
  workingHours: [
    { day: 'Pazartesi – Cuma', time: '09:00 – 19:00' },
    { day: 'Cumartesi', time: '09:00 – 17:00' },
    { day: 'Pazar', time: 'Kapalı' }
  ]
};

export function getMapsEmbedUrl() {
  return `https://www.google.com/maps?q=${encodeURIComponent(clinicLocation.embedQuery)}&output=embed`;
}
