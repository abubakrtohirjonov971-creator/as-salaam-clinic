import React, { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaChevronDown, FaChevronUp, FaStethoscope, FaPhoneAlt, FaCalendarAlt, FaClock } from 'react-icons/fa';

// ===================== BARCHA XIZMATLAR BO'YICHA TO'LIQ MA'LUMOTLAR =====================
const SERVICE_CONTENT = {
  'UZI (UTT)': {
    fullDesc: `UZI (Ultratovush Tekshiruvi) — zamonaviy, og'riqsiz va xavfsiz diagnostika usuli bo'lib, ichki a'zolar, qon tomirlari va to'qimalarni real vaqtda ko'rish imkonini beradi. As-salaam klinikasida eng zamonaviy Nemis ishlab chiqarishidagi UZI apparatlari mavjud bo'lib, yuqori aniqlikdagi tasvirlar olinadi.`,
    symptoms: [
      "Qorin sohasida og'riq yoki noqulaylik",
      "Siydik yo'llari kasalliklari shubhasi",
      "Jigar, buyrak, o't pufagi kasalliklari",
      "Homiladorlik kuzatuvi va monitoring",
      "Qalqonsimon bez tekshiruvi",
      "Limfa tugunlarining kattalashishi",
      "Qon tomir kasalliklari (Doppler)",
      "Bachadon va tuxumdon kasalliklari"
    ],
    treatments: [
      { title: "Qorin bo'shlig'i a'zolari UZI", desc: "Jigar, o't pufagi, me'da osti bezi, taloq va buyraklarni tekshirish." },
      { title: "Kichik Chanoq UZI", desc: "Bachadon, tuxumdonlar, siydik pufagini batafsil ko'rish." },
      { title: "Qalqonsimon bez UZI", desc: "Bez o'lchamlarini, tugunlarni va qon aylanishini tekshirish." },
      { title: "Doppler UZI", desc: "Qon tomirlar (arteriya va venalar) holatini baholash." },
      { title: "Homiladorlik UZI", desc: "Homila rivojlanishini kuzatish, anomaliyalarni erta aniqlash." }
    ],
    advantages: [
      "Og'riqsiz va xavfsiz",
      "10-15 daqiqada natija",
      "Radiatsiya yo'q",
      "Yuqori aniqlik",
      "Tajribali shifokorlar",
      "Zamonaviy apparat"
    ],
    faqs: [
      { q: "UZI tekshiruviga qanday tayyorgarlik ko'rish kerak?", a: "Qorin bo'shlig'i UZI uchun tekshiruvdan 3-4 soat oldin ovqat yemang, ko'proq suv iching. Kichik chanoq UZI uchun siydik pufagi to'la bo'lishi kerak." },
      { q: "UZI qancha vaqt davom etadi?", a: "Oddiy UZI 10-20 daqiqa, murakkab tekshiruvlar 30-40 daqiqagacha davom etadi." },
      { q: "UZI natijasi qachon tayyir bo'ladi?", a: "Natijalar tekshiruv tugaganidan so'ng darhol beriladi." },
      { q: "UZI xavfsizmi?", a: "Ha, UZI ultratovush to'lqinlaridan foydalanadi, radiatsiyasi yo'q, homilador ayollar uchun ham mutlaqo xavfsiz." }
    ]
  },

  'EKG': {
    fullDesc: `EKG (Elektrokardiografiya) — yurak elektriki faoliyatini qayd etuvchi tezkor va og'riqsiz tekshiruv usulidir. Yurak urishi ritmi, yurak mushagi holati va qon ta'minotini aniqlashda beqiyos ahamiyatga ega. Klinikamizda zamonaviy 12-kanalli EKG apparatlari mavjud bo'lib, natijalar darhol tahlil qilinadi.`,
    symptoms: [
      "Ko'krak sohasida og'riq yoki siqish hissi",
      "Yurak urishi tartibsizligi (aritmiya)",
      "Nafas qisishi va holsizlik",
      "Bosh aylanishi va hushini yo'qotish",
      "Profilaktik tekshiruv (45 yoshdan so'ng)",
      "Yuqori qon bosimi (gipertenziya)",
      "Operatsiyadan oldingi tayyorgarlik",
      "Qandli diabet bilan og'rigan bemorlar"
    ],
    treatments: [
      { title: "Standart 12-kanalli EKG", desc: "Ko'krak va oyoq-qo'llarga elektrodlar qo'yib yurak faoliyati qayd etiladi." },
      { title: "Holter monitoring", desc: "24-48 soat davomida yurak faoliyati uzluksiz kuzatiladi." },
      { title: "Stress-EKG (Veloergometriya)", desc: "Jismoniy yuklamada yurak reaktsiyasi tekshiriladi." },
      { title: "EKG natijalarini tahlil qilish", desc: "Tajribali kardiolog tomonidan to'liq sharhlash va xulosа." }
    ],
    advantages: [
      "3-5 daqiqada natija",
      "Mutlaqo og'riqsiz",
      "12-kanalli zamonaviy apparat",
      "Darhol kardiolog xulosasi",
      "Arzon narx",
      "Har qanday yoshda"
    ],
    faqs: [
      { q: "EKG ga qanday tayyorgarlik kerak?", a: "Maxsus tayyorgarlik talab etilmaydi. Tekshiruvdan 2-3 soat oldin choy, qahva, chekishdan saqlaning." },
      { q: "EKG qancha vaqt oladi?", a: "Standart EKG atigi 5-10 daqiqa davom etadi." },
      { q: "EKG da nima aniqlanadi?", a: "Aritmiya, infarkt izlari, yurak blokadasi, miokard ishemiyasi va boshqa kasalliklar aniqlanadi." },
      { q: "Necha yoshdan EKG qilish kerak?", a: "40-45 yoshdan boshlab har yili profilaktik EKG qilish tavsiya etiladi." }
    ]
  },

  'Pediatr': {
    fullDesc: `Pediatriya — bolalar salomatligi va kasalliklarini davolash sohasidir. As-salaam klinikasida bolalar sog'liqqa oid barcha masalalar bo'yicha malakali pediatr shifokorlar qabul qiladi. Bolaning tug'ilgan kunidan boshlab to 18 yoshgacha bo'lgan davrda barcha kasalliklarning oldini olish, erta aniqlash va davolash bo'yicha kompleks yordam ko'rsatiladi.`,
    symptoms: [
      "Harorat ko'tarilishi va isitma",
      "Yo'tal, tumin va nafas yo'llari kasalliklari",
      "Ich ketishi, qusish, ovqatdan bosh tortish",
      "Teri toshmasi va allergik reaktsiyalar",
      "Bola rivojlanishida kechikish",
      "Tez-tez kasal bo'lib turish",
      "Bosh og'rig'i va qorin og'rig'i",
      "Profilaktik ko'rik va emlash"
    ],
    treatments: [
      { title: "Profilaktik ko'rik", desc: "Bolaning o'sishi, og'irligi va rivojlanishini muntazam kuzatib borish." },
      { title: "Emlash (Vaksinatsiya)", desc: "Milliy emlash jadvali bo'yicha zaruriy emlashlarni o'tkazish." },
      { title: "Kasalliklarni davolash", desc: "ARVI, bronxit, angina, gastrit va boshqa kasalliklarni davolash." },
      { title: "Allergologiya", desc: "Bolalarda allergiyaning sababini aniqlash va davolash." },
      { title: "Nevropsixologik baholash", desc: "Bolaning psixomotor rivojlanishini baholash." }
    ],
    advantages: [
      "Bolalarga mehribon shifokorlar",
      "Qulay va xavfsiz muhit",
      "Tez qabul (navbatsiz)",
      "Emlash xizmati",
      "Ota-onalar uchun maslahat",
      "Profilaktik kuzatuv"
    ],
    faqs: [
      { q: "Necha yoshgacha pediatrga murojaat qilish kerak?", a: "Pediatr 0 yoshdan 18 yoshgacha bo'lgan bolalarni qabul qiladi." },
      { q: "Sog'lom bola qanchalik tez-tez ko'rikdan o'tishi kerak?", a: "Birinchi yili har oyda, 1-3 yoshda har 3 oyda, 3 yoshdan keyin yiliga bir marta." },
      { q: "Emlash xavfsizmi?", a: "Ha, barcha emlashlar WHO standartlariga mos va bolalar uchun mutlaqo xavfsiz." },
      { q: "Bolani doktorga keltirish uchun oldindan yozilish kerakmi?", a: "Yo'q, klinikamizga oldindan yozilmasdan ham kelishingiz mumkin." }
    ]
  },

  'Terapevt': {
    fullDesc: `Terapevt — ichki kasalliklarni davolash bo'yicha mutaxassis shifokor. U barcha a'zolar tizimiga oid kasalliklarni dastlabki baholaydi, zarur tahlillarni tayinlaydi va davolash rejasini tuzadi. As-salaam klinikasidagi tajribali terapevtlar har qanday murakkab holatda ham to'g'ri yo'nalish ko'rsatib beradi.`,
    symptoms: [
      "Uzluksiz holsizlik va charchash hissi",
      "Ko'krak yoki qorin sohasidagi og'riqlar",
      "Harorat ko'tarilishi va isitma",
      "Qon bosimi ko'tarilishi yoki tushishi",
      "Yo'tal, tumin, nafas qisishi",
      "Ishtahaning yo'qolishi va vazn kamayishi",
      "Tez-tez bosh og'rig'i",
      "Uyqusizlik va asabiylashish"
    ],
    treatments: [
      { title: "Dastlabki ko'rik va anamnez", desc: "Shifokor bilan to'liq suhbat, kasallik tarixi va shikoyatlar tahlili." },
      { title: "Fiziksel tekshiruv", desc: "Bosim o'lchash, yurak va o'pka tinglash, qorin paypaslash." },
      { title: "Tahlillar tayinlash", desc: "Qon, siydik tahlillari, EKG, UZI va boshqa kerakli tekshiruvlar." },
      { title: "Davolash rejasi", desc: "Kasallikka qarab individual davolash dasturi tuzish." },
      { title: "Profil shifokorlarga yo'llash", desc: "Zarur bo'lganda kardiolog, nevropatolog va boshqa mutaxassislarga yo'naltirish." }
    ],
    advantages: [
      "Keng qamrovli ko'rik",
      "Tajribali shifokor",
      "Tez aniqlik",
      "Individual yondashuv",
      "Kompleks davolash",
      "Kuzatib borish"
    ],
    faqs: [
      { q: "Terapevt qanday kasalliklarni davolaydi?", a: "Yurak-qon tomir, nafas, hazm qilish, buyrak, qon kasalliklari va boshqa ichki kasalliklarni." },
      { q: "Terapevtga murojaat qilishdan oldin tahlil topshirish kerakmi?", a: "Yo'q, shifokor zarur tahlillarni ko'rik paytida o'zi tayinlaydi." },
      { q: "Qabul qancha davom etadi?", a: "Dastlabki qabul 20-30 daqiqa, takroriy qabul 10-15 daqiqa." },
      { q: "Retsept olish mumkinmi?", a: "Ha, shifokor kerakli dori-darmonlarga retsept yozib beradi." }
    ]
  },

  'Nevropatolog': {
    fullDesc: `Nevrologiya (Nevropatologiya) — markaziy va periferik asab tizimi kasalliklarini o'rganadigan tibbiyot sohasidir. Miya, orqa miya va nervlar bilan bog'liq kasalliklarni tashxis qilish va davolash nevropatolog vakolati doirasiga kiradi. Klinikamizda eng zamonaviy diagnostika usullari qo'llaniladi.`,
    symptoms: [
      "Tez-tez va kuchli bosh og'rig'i (migren)",
      "Bosh aylanishi va muvozanat buzilishi",
      "Qo'l-oyoqlarning uvishishi va titroq",
      "Yodlash va diqqat muammolari",
      "Uyqusizlik yoki haddan tashqari uyquchanlik",
      "Orqa va bo'yin og'rig'i (osteoxondroz)",
      "Ko'rish va nutq buzilishi",
      "Epilepsiya tutqanoqlari"
    ],
    treatments: [
      { title: "Nevrologik ko'rik", desc: "Reflekslar, sezgi, muvozanat va kognitiv funksiyalarni tekshirish." },
      { title: "Miya MRI/KT tekshiruvi", desc: "Miya va orqa miyaning batafsil tasvirini olish." },
      { title: "Dori bilan davolash", desc: "Kasallikka mos ravishda analgetiklar, nootroplar, sedativlar tayinlash." },
      { title: "Fizioterapiya kursi", desc: "Osteoxondroz, nevralgiyada fizioterapiya va massaj kursi." },
      { title: "Psixoterapiya", desc: "Stress, depressiya va asab kasalliklarida psixoterapevtik yordam." }
    ],
    advantages: [
      "Tajribali nevropatolog",
      "Zamonaviy diagnostika",
      "Kompleks yondashuv",
      "Tez tashxis",
      "Individual davolash",
      "Doimiy kuzatuv"
    ],
    faqs: [
      { q: "Qachon nevropatologga borish kerak?", a: "Tez-tez bosh og'rig'i, bosh aylanishi, qo'l-oyoq uvishishi, yodlash muammolari bo'lganda darhol murojaat qiling." },
      { q: "Migren davolanishi mumkinmi?", a: "Ha, to'g'ri davolash bilan migren hujumlari soni va kuchi sezilarli kamayadi." },
      { q: "Osteoxondroz qancha vaqtda davolanadi?", a: "Kasallikning darajasiga qarab 2 haftadan 3 oygacha davolash kursi kerak bo'ladi." },
      { q: "Nevropatologga yozilish kerakmi?", a: "Oldindan yozilish tavsiya etiladi, lekin shoshilinch holatlarda kutmasdan qabul qilinadi." }
    ]
  },

  'Travmatolog': {
    fullDesc: `Travmatologiya va ortopediya — suyaklar, bo'g'imlar, paylar va mushaklarning shikastlanishi hamda kasalliklarini davolash sohasidir. As-salaam klinikasida tajribali travmatologlar har qanday murakkablikdagi shikastlanishlarni tezda aniqlaydi va to'g'ri davolash rejasini belgilaydi.`,
    symptoms: [
      "Suyak sinishi va yorilishi",
      "Bo'g'im chiqishi (vyvix)",
      "Pay va mushaklarning cho'zilishi",
      "Sport jarohatlari",
      "Orqa miya va bo'yin jarohatlari",
      "Bo'g'im og'rig'i va shishishi",
      "Harakatda cheklanish",
      "Tizza, yelka, tirsak bo'g'im muammolari"
    ],
    treatments: [
      { title: "Rentgen diagnostika", desc: "Suyak sinishi va bo'g'im kasalliklarini aniq aniqlash." },
      { title: "Gips qo'yish", desc: "Suyak sinishida to'g'ri fiksatsiya va immobilizatsiya." },
      { title: "Bandaj va tayanch vositalar", desc: "Bo'g'imlarni qo'llab-quvvatlash uchun maxsus bandajlar." },
      { title: "Fizioterapiya", desc: "Jarohatdan keyin tiklash kursi, massaj va LFK." },
      { title: "Operatsiya (kerak bo'lganda)", desc: "Murakkab sinishlarda operativ davolash." }
    ],
    advantages: [
      "Tezkor yordam",
      "Rentgen tekshiruvi",
      "Tajribali jarroхlar",
      "Gips va bandaj",
      "Reabilitatsiya",
      "Sport tibbiyoti"
    ],
    faqs: [
      { q: "Suyak sinsa nima qilish kerak?", a: "Shikastlangan joyni harakatlantiirmang, muzli narsa qo'ying va darhol klinikaga keling." },
      { q: "Gips qancha vaqt taqiladi?", a: "Sinishning joyi va murakkabligiga qarab 3 haftadan 3 oygacha." },
      { q: "Suyak qancha vaqtda bitadi?", a: "Odatda 4-8 hafta, katta suyaklarda 3-6 oy." },
      { q: "Sportchi bo'lsam tezroq davolana olamanmi?", a: "Maxsus reabilitatsiya kursi bilan tiklanish vaqtini qisqartirish mumkin." }
    ]
  },

  'Ortoped': {
    fullDesc: `Ortopediya — tayanch-harakat tizimining (suyaklar, bo'g'imlar, paylar, mushaklarning) tug'ma yoki orttirilgan deformatsiyalarini davolash sohasidir. As-salaam klinikasida ortoped shifokorlar holat diagnostikasini to'liq o'tkazib, kerakli davolash yoki profilaktika usullarini belgilaydi.`,
    symptoms: [
      "Oyoq kaftining tekisligi (yassi tabonlik)",
      "Tizza bo'g'imi deformatsiyasi (X yoki O-shakl oyoqlar)",
      "Orqa miya egriligi (skolioz)",
      "Bo'g'imlarda og'riq va qisirlash",
      "Yurish va harakatda muammo",
      "Tug'ma bo'g'im kasalliklari",
      "Artrit va artroz",
      "Umurtqa pog'onasi kasalliklari"
    ],
    treatments: [
      { title: "Rentgen va diagnostika", desc: "Tayanch-harakat tizimini to'liq tekshirish va baholash." },
      { title: "Ortopedik asboblar", desc: "Maxsus taglik (Стелька), korsет, bandaj va protetikа vositаlari." },
      { title: "LFK (Davolovchi gimnastika)", desc: "Moslashtirilgan mashqlar orqali harakatni tiklash." },
      { title: "Massaj kursi", desc: "Mushaklarni mustahkamlash va qon aylanishini yaxshilash." },
      { title: "Operatsiya (kerak bo'lganda)", desc: "Og'ir deformatsiyalarda operativ korreksiya." }
    ],
    advantages: [
      "Bolalar va kattalarga",
      "Ortopedik taglik",
      "Skolioz davolash",
      "Artrit va artroz",
      "Sport ortopediyasi",
      "Reabilitatsiya"
    ],
    faqs: [
      { q: "Yassi tabonlikni davolash mumkinmi?", a: "Ha, ayniqsa bolalarda erta murojaat qilsa, maxsus taglik va gimnastika bilan to'liq davolash mumkin." },
      { q: "Artrozda operatsiya qilmasdan davolash mumkinmi?", a: "1-2 darajali artrozda dori, fizioterapiya va LFK bilan yaxshi natijaga erishiladi." },
      { q: "Bolada orqa miya egriligi bo'lsa nima qilish kerak?", a: "Darhol ortopedga keling. Erta aniqlik va davolash egrilikni to'liq yo'q qiladi." },
      { q: "Qanday yoshda ortopedga borish kerak?", a: "Bolalarni 1 yoshida profilaktik ko'rikka olib kelish tavsiya etiladi." }
    ]
  },

  'Fizioterapiya': {
    fullDesc: `Fizioterapiya — dori-darmonsiz, tabiiy omillar (issiqlik, elektr toki, magnitli maydon, ultratovush va boshqalar) yordamida kasalliklarni davolash usuli. As-salaam klinikasida zamonaviy fizioterapiya apparatlari mavjud bo'lib, tajribali mutaxassislar har bir bemor uchun individual kurs tuzadi.`,
    symptoms: [
      "Osteoxondroz va umurtqa pog'onasi og'rig'i",
      "Bo'g'im kasalliklari (artrit, artroz)",
      "Mushaklarning tarangligi va spazmi",
      "Sport jarohatlari va ulardan tiklash",
      "Nevrologik kasalliklar (nevralgiya, radikulit)",
      "Jarohatlarda reabilitatsiya",
      "Surunkali og'riq sindromlari",
      "Operatsiyadan keyingi tiklash"
    ],
    treatments: [
      { title: "Elektroforez", desc: "Dori moddalarini elektr toki yordamida teri orqali yuborish." },
      { title: "UHF terapiya", desc: "Yuqori chastotali elektromagnit maydon bilan yallig'lanishni bartaraf etish." },
      { title: "Magnit terapiyasi", desc: "Magnitli maydon ta'sirida og'riqni kamaytirish va tiklash." },
      { title: "Ultratovush terapiyasi", desc: "To'qimalar chuqurligiga ultratovush ta'siri orqali davolash." },
      { title: "Darsonval", desc: "Teri va yuzaki to'qimalarni davolash uchun yuqori chastotali tok." }
    ],
    advantages: [
      "Dori-darmonsiz davolash",
      "Og'riqsiz jarayon",
      "Yon ta'siri yo'q",
      "Tez natija",
      "Zamonaviy apparatlar",
      "Individual kurs"
    ],
    faqs: [
      { q: "Fizioterapiya necha seans bo'ladi?", a: "Odatda 7-10 seans, murakkab holatlarda 15-20 seansdan iborat kurs tavsiya etiladi." },
      { q: "Fizioterapiyaning yon ta'sirlari bormi?", a: "Deyarli yo'q. Faqat shifokor ko'rigidan so'ng va ko'rsatmalar asosida o'tkaziladi." },
      { q: "Fizioterapiya qachon tavsiya etilmaydi?", a: "Onkologik kasalliklar, homiladorlik, qon ketishi va yuqori harorat paytida." },
      { q: "Bitta seans qancha davom etadi?", a: "Usulga qarab 10-30 daqiqa." }
    ]
  }
};

const ServiceDetail = () => {
  const { id } = useParams();
  const service = useSelector(state => state.services.items.find(s => s.id === id));

  const [activeFaq, setActiveFaq] = useState(null);

  if (!service) {
    return <Navigate to="/services" />;
  }

  const content = SERVICE_CONTENT[service.title] || {
    fullDesc: service.desc,
    symptoms: [],
    treatments: [],
    advantages: [],
    faqs: []
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* HERO */}
      <section className="relative h-[55vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-white pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Link to="/services" className="inline-flex items-center gap-2 text-blue-300 hover:text-white mb-4 text-sm font-medium transition-colors">
              ← Barcha xizmatlar
            </Link>
            <h1 className="text-4xl md:text-6xl font-bold mb-3">{service.title}</h1>
            <p className="text-lg text-gray-300 max-w-2xl">{service.desc}</p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 mt-12">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* MAIN CONTENT */}
          <div className="lg:w-2/3 space-y-12">

            {/* Xizmat haqida */}
            <motion.section
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Xizmat haqida</h2>
              <p className="text-gray-600 leading-relaxed text-lg">{content.fullDesc}</p>
            </motion.section>

            {/* Qachon murojaat qilish kerak */}
            {content.symptoms.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              >
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Qachon murojaat qilish kerak?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {content.symptoms.map((symptom, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:border-blue-200 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                      </div>
                      <span className="text-gray-700 font-medium">{symptom}</span>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Davolash usullari */}
            {content.treatments.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              >
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Davolash usullari</h2>
                <div className="space-y-4">
                  {content.treatments.map((treatment, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-5 hover:border-blue-200 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0 text-lg">
                        {idx + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">{treatment.title}</h3>
                        <p className="text-gray-600">{treatment.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Afzalliklar */}
            {content.advantages.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              >
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Nega bizni tanlashadi?</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {content.advantages.map((adv, idx) => (
                    <div key={idx} className="bg-blue-50 border border-blue-100 p-5 rounded-2xl flex flex-col items-center gap-3 text-center">
                      <FaCheckCircle className="text-3xl text-blue-600" />
                      <span className="font-semibold text-gray-800 text-sm">{adv}</span>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* FAQ */}
            {content.faqs.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              >
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Ko'p so'raladigan savollar</h2>
                <div className="space-y-3">
                  {content.faqs.map((faq, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                      <button
                        onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                        className="w-full text-left p-6 flex justify-between items-center focus:outline-none hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-bold text-gray-900 pr-4">{faq.q}</span>
                        {activeFaq === idx
                          ? <FaChevronUp className="text-blue-600 flex-shrink-0" />
                          : <FaChevronDown className="text-gray-400 flex-shrink-0" />}
                      </button>
                      <AnimatePresence>
                        {activeFaq === idx && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-6 pb-6 text-gray-600 border-t border-gray-100 pt-4 leading-relaxed"
                          >
                            {faq.a}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="lg:w-1/3">
            <div className="sticky top-24 space-y-6">
              {/* Qabulga yozilish */}
              <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl">
                <h3 className="text-xl font-bold mb-2">Qabulga yozilish</h3>
                <p className="text-blue-100 text-sm mb-6">{service.title} bo'yicha mutaxassis shifokor bilan uchrashing</p>
                <Link
                  to="/booking"
                  className="w-full bg-white text-blue-600 font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors"
                >
                  <FaCalendarAlt /> Yozilish
                </Link>
                <a
                  href="tel:+998905447707"
                  className="w-full mt-3 border-2 border-white/30 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                >
                  <FaPhoneAlt /> +998 90 544 77 07
                </a>
              </div>

              {/* Ish vaqti */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaClock className="text-blue-600" /> Ish vaqti
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Dushanba - Juma</span>
                    <span className="font-semibold text-gray-800">08:00 – 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Shanba</span>
                    <span className="font-semibold text-gray-800">09:00 – 15:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Yakshanba</span>
                    <span className="font-semibold text-red-500">Dam olish kuni</span>
                  </div>
                </div>
              </div>

              {/* Manzil */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-2">📍 Manzil</h3>
                <p className="text-gray-600 text-sm">Andijon shahri, Andijon davlat tibbiyot instituti qarshisida.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
