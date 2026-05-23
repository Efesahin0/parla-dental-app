import dtGonca from '../assets/doctors/dt-gonca-gorgulu.jpg';
import doctorAhmet from '../assets/doctors/doctor-ahmet.svg';
import doctorZeynep from '../assets/doctors/doctor-zeynep.svg';
import doctorMurat from '../assets/doctors/doctor-murat.svg';
import doctorElif from '../assets/doctors/doctor-elif.svg';
import doctorCan from '../assets/doctors/doctor-can.svg';
import doctorDerya from '../assets/doctors/doctor-derya.svg';

export const featuredDoctor = {
  name: 'Dt. Gonca Görgülü',
  displayName: 'Gonca Görgülü',
  specialty: 'Estetik Diş Hekimliği ve Protetik Uygulamalar',
  experience: 'Kurucu Hekim',
  image: dtGonca,
  description:
    'Estetik diş hekimliği, dijital gülüş tasarımı, protetik uygulamalar ve güncel tedavi yaklaşımlarında hasta odaklı tedavi süreçleri yürütür.',
  tags: ['Kurucu Hekim', 'Gülüş Tasarımı', 'Protetik Uygulamalar'],
  bio: [
    '1997 yılında doğan Dt. Gonca Görgülü, lise eğitimini Ankara Atatürk Anadolu Lisesi’nde tamamlamıştır. Lisans eğitimini ise Kırıkkale Üniversitesi Diş Hekimliği Fakültesi’nde başarıyla tamamlayarak diş hekimi unvanını almıştır.',
    'Mesleki gelişimine büyük önem veren Dt. Gonca Görgülü, estetik diş hekimliği, dijital gülüş tasarımı, protetik uygulamalar ve güncel tedavi yaklaşımları üzerine birçok eğitim, kongre ve seminere katılmıştır. Güncel teknolojileri ve modern tedavi yöntemlerini yakından takip ederek hastalarına en doğru ve konforlu tedavi süreçlerini sunmayı hedeflemektedir.',
    'Hasta memnuniyetini ön planda tutan yaklaşımı, güler yüzlü iletişimi ve detaylara verdiği önemle çalışmalarını sürdüren Dt. Gonca Görgülü; tedavi süreçlerinde doğal estetik, fonksiyon ve uzun dönem başarıyı esas almaktadır.',
    'Dt. Gonca Görgülü, aynı zamanda Parla Dental’in kurucularından biri olarak, modern, güvenilir ve hasta odaklı bir klinik anlayışını hayata geçirmeyi amaçlamıştır. Estetik ve fonksiyonel çözümleri bir araya getiren yaklaşımıyla, hastalarına sağlıklı ve özgüvenli gülüşler kazandırmayı hedeflemektedir.'
  ]
};

export const doctors = [
  featuredDoctor,
  {
    name: 'Dr. Ahmet Yılmaz',
    specialty: 'Ağız, Diş ve Çene Cerrahisi',
    experience: '14 yıl deneyim',
    image: doctorAhmet,
    description: 'İmplant cerrahisi, gömülü diş operasyonları ve ileri çene cerrahisi tedavilerinde çalışır.',
    tags: ['İmplant', 'Cerrahi', '3D Planlama']
  },
  {
    name: 'Dr. Zeynep Arslan',
    specialty: 'Ortodonti Uzmanı',
    experience: '10 yıl deneyim',
    image: doctorZeynep,
    description: 'Şeffaf plak, çocuk ortodontisi ve yetişkin ortodonti tedavilerinde hasta odaklı planlama yapar.',
    tags: ['Şeffaf Plak', 'Ortodonti', 'Çocuk']
  },
  {
    name: 'Dr. Murat Kaya',
    specialty: 'Estetik Diş Hekimliği',
    experience: '12 yıl deneyim',
    image: doctorMurat,
    description: 'Gülüş tasarımı, porselen lamina, kompozit bonding ve estetik restorasyon uygulamalarında uzmandır.',
    tags: ['Gülüş Tasarımı', 'Lamina', 'Bonding']
  },
  {
    name: 'Dr. Elif Demir',
    specialty: 'Pedodonti Uzmanı',
    experience: '8 yıl deneyim',
    image: doctorElif,
    description: 'Çocuk hastalarda koruyucu diş hekimliği, fissür örtücü ve travma tedavileriyle ilgilenir.',
    tags: ['Pedodonti', 'Koruyucu Tedavi', 'Çocuk']
  },
  {
    name: 'Dr. Can Özkan',
    specialty: 'Endodonti Uzmanı',
    experience: '9 yıl deneyim',
    image: doctorCan,
    description: 'Kanal tedavisi, mikroskobik endodonti ve ağrı yönetimi alanlarında tedavi süreçlerini yürütür.',
    tags: ['Kanal Tedavisi', 'Endodonti', 'Ağrı Yönetimi']
  },
  {
    name: 'Dr. Derya Şahin',
    specialty: 'Periodontoloji Uzmanı',
    experience: '11 yıl deneyim',
    image: doctorDerya,
    description: 'Diş eti hastalıkları, periodontal bakım ve implant çevresi doku sağlığı üzerine çalışır.',
    tags: ['Diş Eti', 'Periodontoloji', 'Bakım']
  }
];
