import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  uz: {
    translation: {
      // Navbar
      nav: {
        home: 'Bosh sahifa',
        services: 'Xizmatlar',
        doctors: 'Shifokorlar',
        about: 'Biz haqimizda',
        contact: 'Bog\'lanish',
        booking: 'Qabulga yozilish',
        phone: '+998 90 544 77 07',
      },
      // Hero
      hero: {
        badge: 'Professional Tibbiyot Markazi',
        title1: 'As-salaam',
        title2: 'klinikasi',
        desc: 'Sizning salomatligingiz — bizning oliy maqsadimiz. Zamonaviy texnologiyalar va tajribali mutaxassislar xizmatidan foydalaning.',
        btn_booking: 'Qabulga yozilish',
        btn_more: 'Batafsil',
      },
      // About section on Home
      about: {
        badge: 'Biz haqimizda',
        title: 'Yuqori malakali tibbiy yordam',
        desc: 'As-salaam klinikasi ko\'p yillik tajribaga ega shifokorlar va eng so\'nggi rusumdagi tibbiy uskunalar bilan jihozlangan. Biz har bir mijozga alohida e\'tibor beramiz.',
        feat1: 'Tajribali shifokorlar',
        feat2: 'Zamonaviy uskunalar',
        feat3: 'Individual yondashuv',
        feat4: 'Sifatli xizmat',
      },
      // Services
      services: {
        title: 'Bizning xizmatlar',
        desc: 'Sizga va oilangizga eng yaxshi tibbiy xizmatlarni taqdim etamiz.',
        all: 'Hammasi →',
      },
      // Methods
      methods: {
        title: 'Davolash usullari',
        diag_title: 'Diagnostika',
        diag_desc: 'Zamonaviy MRI va KT tahlillari',
        therapy_title: 'Terapiya',
        therapy_desc: 'Dori-darmonsiz davolash usullari',
        rehab_title: 'Reabilitatsiya',
        rehab_desc: 'Tezkor tiklanish dasturlari',
      },
      // Doctors
      doctors: {
        title: 'Bizning shifokorlar',
        desc: 'O\'z sohasining haqiqiy ustalari.',
      },
      // CTA
      cta: {
        title: 'Salomatligingizni bugundan boshlab yaxshilang',
        desc: 'Biz bilan bog\'laning va birinchi konsultatsiyaga yoziling.',
        btn: 'Qabulga yoziling',
      },
      // Footer
      footer: {
        desc: 'Bizning klinikamiz zamonaviy texnologiyalar va tajribali mutaxassislar yordamida sizning salomatligingizni himoya qiladi.',
        links: 'Tezkor havolalar',
        info: 'Ma\'lumotlar',
        address_title: 'Manzilimiz',
        address: 'Andijon shahri, Andijon davlat tibbiyot instituti qarshisida',
        rights: 'Barcha huquqlar himoyalangan.',
      },
      // About page
      about_page: {
        badge: 'As-salaam Clinic haqida',
        title: 'Sizning sog\'lig\'ingiz — bizning oliy maqsadimiz',
        desc: '10 yildan ortiq muddat davomida Andijon shahrida zamonaviy tibbiyot standartlari asosida yuqori sifatli tibbiy xizmatlar taqdim etib kelmoqdamiz.',
        btn_contact: 'Bog\'lanish',
        btn_video: 'Video tanishtiruv',
        stat1: 'Yillik tajriba',
        stat2: 'Mutaxassis shifokor',
        stat3: 'Mamnun mijozlar',
        stat4: 'Tezkor xizmat',
        history_title: 'Bizning Tariximiz',
        history_desc: 'As-salaam klinikasi 2014-yilda o\'z faoliyatini kichik bir tibbiyot markazi sifatida boshlagan. Yillar davomida xalqimizga halol va sifatli xizmat ko\'rsatib, bugungi kunda Andijon viloyatining eng yirik va zamonaviy xususiy klinikalaridan biriga aylandik.',
        mission_title: 'Bizning Missiyamiz',
        mission_desc: 'Har bir bemorga mehr va e\'tibor bilan yondashgan holda, eng zamonaviy diagnostika va davolash usullarini qo\'llab, ularning hayot sifatini yaxshilash va salomatligini tiklashdir.',
        why_title: 'Nega aynan bizni tanlashadi?',
        why_desc: 'Zamonaviy uskunalar va tajribali mutaxassislar',
        gallery_title: 'Klinikamiz galeriyasi',
        feat1_title: 'Eng so\'nggi texnologiyalar',
        feat1_desc: 'Jahon standartlariga javob beradigan zamonaviy diagnostika va davolash uskunalari.',
        feat2_title: 'Tajribali jamoa',
        feat2_desc: 'Xorijda malaka oshirgan, o\'z ishining ustasi bo\'lgan professional shifokorlar.',
        feat3_title: 'Kafolatlangan xavfsizlik',
        feat3_desc: 'Bemorlar xavfsizligi va yuqori gigiena qoidalari qat\'iy nazorat ostida.',
        feat4_title: 'Vaqtingizni qadrlaymiz',
        feat4_desc: 'Navbatsiz qabul va tezkor tibbiy xizmat kafolatlanadi.',
      },
      // Doctor detail
      doctor: {
        contact: 'Aloqa ma\'lumotlari',
        about: 'Mutaxassis haqida',
        education: 'Ta\'lim va ixtisoslashuv',
        methods: 'Davolash usullari va yutuqlar',
        services: 'Ko\'rsatadigan xizmatlari',
        view: 'Batafsil ko\'rish',
      },
    }
  },
  ru: {
    translation: {
      // Navbar
      nav: {
        home: 'Главная',
        services: 'Услуги',
        doctors: 'Врачи',
        about: 'О нас',
        contact: 'Контакты',
        booking: 'Записаться',
        phone: '+998 90 544 77 07',
      },
      // Hero
      hero: {
        badge: 'Профессиональный Медицинский Центр',
        title1: 'As-salaam',
        title2: 'клиника',
        desc: 'Ваше здоровье — наша главная цель. Воспользуйтесь услугами современных технологий и опытных специалистов.',
        btn_booking: 'Записаться на приём',
        btn_more: 'Подробнее',
      },
      // About section on Home
      about: {
        badge: 'О нас',
        title: 'Высококвалифицированная медицинская помощь',
        desc: 'Клиника As-salaam оснащена опытными врачами и новейшим медицинским оборудованием. Мы уделяем индивидуальное внимание каждому пациенту.',
        feat1: 'Опытные врачи',
        feat2: 'Современное оборудование',
        feat3: 'Индивидуальный подход',
        feat4: 'Качественный сервис',
      },
      // Services
      services: {
        title: 'Наши услуги',
        desc: 'Предоставляем лучшие медицинские услуги для вас и вашей семьи.',
        all: 'Все услуги →',
      },
      // Methods
      methods: {
        title: 'Методы лечения',
        diag_title: 'Диагностика',
        diag_desc: 'Современные МРТ и КТ исследования',
        therapy_title: 'Терапия',
        therapy_desc: 'Методы лечения без лекарств',
        rehab_title: 'Реабилитация',
        rehab_desc: 'Программы быстрого восстановления',
      },
      // Doctors
      doctors: {
        title: 'Наши врачи',
        desc: 'Настоящие мастера своего дела.',
      },
      // CTA
      cta: {
        title: 'Начните заботиться о своём здоровье сегодня',
        desc: 'Свяжитесь с нами и запишитесь на первую консультацию.',
        btn: 'Записаться',
      },
      // Footer
      footer: {
        desc: 'Наша клиника защищает ваше здоровье с помощью современных технологий и опытных специалистов.',
        links: 'Быстрые ссылки',
        info: 'Информация',
        address_title: 'Наш адрес',
        address: 'г. Андижан, напротив Андижанского государственного медицинского института',
        rights: 'Все права защищены.',
      },
      // About page
      about_page: {
        badge: 'О клинике As-salaam',
        title: 'Ваше здоровье — наша главная цель',
        desc: 'Более 10 лет мы предоставляем высококачественные медицинские услуги в г. Андижан на основе современных стандартов медицины.',
        btn_contact: 'Связаться',
        btn_video: 'Видео-обзор',
        stat1: 'Лет опыта',
        stat2: 'Врачей-специалистов',
        stat3: 'Довольных пациентов',
        stat4: 'Быстрый сервис',
        history_title: 'Наша история',
        history_desc: 'Клиника As-salaam начала свою деятельность в 2014 году как небольшой медицинский центр. За годы честной и качественной работы мы стали одной из крупнейших и наиболее современных частных клиник Андижанской области.',
        mission_title: 'Наша миссия',
        mission_desc: 'Применяя новейшие методы диагностики и лечения с заботой и вниманием к каждому пациенту, улучшать качество их жизни и восстанавливать здоровье.',
        why_title: 'Почему выбирают нас?',
        why_desc: 'Современное оборудование и опытные специалисты',
        gallery_title: 'Галерея клиники',
        feat1_title: 'Новейшие технологии',
        feat1_desc: 'Современное диагностическое и лечебное оборудование, соответствующее мировым стандартам.',
        feat2_title: 'Опытная команда',
        feat2_desc: 'Профессиональные врачи, повысившие квалификацию за рубежом.',
        feat3_title: 'Гарантированная безопасность',
        feat3_desc: 'Безопасность пациентов и строгий контроль санитарных норм.',
        feat4_title: 'Ценим ваше время',
        feat4_desc: 'Гарантируется приём без очереди и быстрое медицинское обслуживание.',
      },
      // Doctor detail
      doctor: {
        contact: 'Контактные данные',
        about: 'О специалисте',
        education: 'Образование и специализация',
        methods: 'Методы лечения и достижения',
        services: 'Оказываемые услуги',
        view: 'Подробнее',
      },
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'uz',
    fallbackLng: 'uz',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
