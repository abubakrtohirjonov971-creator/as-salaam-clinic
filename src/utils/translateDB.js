export const DB_TRANSLATIONS = {
  // Services Titles
  'UZI (UTT)': 'УЗИ (Ультразвуковое исследование)',
  'EKG': 'ЭКГ',
  'Pediatr': 'Педиатр',
  'Terapevt': 'Терапевт',
  'Nevropatolog': 'Невропатолог',
  'Travmatologiya': 'Травматология',
  'Ortoped': 'Ортопед',
  'Fizioterapiya': 'Физиотерапия',
  
  // Services Descriptions
  'Ichki a\'zolar kasalliklarini ultratovush orqali aniq va ishonchli tashxislash.': 'Точная и надежная ультразвуковая диагностика заболеваний внутренних органов.',
  'Yurak faoliyatini tekshirish va kardiologik kasalliklarni erta aniqlash.': 'Проверка функции сердца и раннее выявление кардиологических заболеваний.',
  'Bolalar kasalliklarini tashxislash, davolash va profilaktikasi.': 'Диагностика, лечение и профилактика детских заболеваний.',
  'Kattalar kasalliklarini umumiy tashxislash va davolash usullari.': 'Общая диагностика и методы лечения заболеваний у взрослых.',
  'Asab tizimi kasalliklarini (bosh og\'rig\'i, nevrozlar) zamonaviy davolash.': 'Современное лечение заболеваний нервной системы (головные боли, неврозы).',
  'Turli xil jarohatlar, sinishlar va chiqishlarni operativ davolash.': 'Оперативное лечение различных травм, переломов и вывихов.',
  'Tayanch-harakat tizimi kasalliklari va deformatsiyalarini davolash.': 'Лечение заболеваний и деформаций опорно-двигательного аппарата.',
  'Tabiiy va sun\'iy fizik omillar yordamida tezkor reabilitatsiya va davolash.': 'Быстрая реабилитация и лечение с помощью природных и искусственных физических факторов.',

  // Doctors Specializations & About
  'Oliy toifali kardiolog. 15 yillik ish tajribasiga ega. Rossiya va Germaniyada malaka oshirgan.': 'Кардиолог высшей категории. Опыт работы 15 лет. Проходил стажировку в России и Германии.',
  'Tajribali pediatr. Bolalar immun tizimi bo\'yicha mutaxassis.': 'Опытный педиатр. Специалист по детской иммунной системе.',
  'Nevropatolog. Asab tizimi va umurtqa kasalliklarini davolash bo\'yicha ekspert.': 'Невропатолог. Эксперт по лечению заболеваний нервной системы и позвоночника.',
  'Kardiolog': 'Кардиолог',
  'Nevrolog': 'Невролог'
};

export const tDB = (text, lang) => {
  if (lang !== 'ru' || !text) return text;
  return DB_TRANSLATIONS[text] || text;
};
