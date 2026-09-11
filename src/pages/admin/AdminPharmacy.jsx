import React, { useState, useMemo } from 'react';
import { MdSearch, MdAdd, MdRemove, MdDelete, MdMedication, MdCalendarToday, MdCheck, MdBed } from 'react-icons/md';
import { FaPills } from 'react-icons/fa';

const DORILAR = [
  { id: 1,   nom: 'Живокост Бальзам',                         narx: 100800 },
  { id: 2,   nom: 'Aloe',                                      narx: 2310 },
  { id: 3,   nom: 'NaHCO3 dentafile',                          narx: 5320 },
  { id: 4,   nom: 'Актовегин 10 мл №5',                        narx: 76160 },
  { id: 5,   nom: 'Амброксол р-р д/ин. 7,5мг/2мл №5',         narx: 6249 },
  { id: 6,   nom: 'Аналгин',                                   narx: 1568 },
  { id: 7,   nom: 'Артоксан',                                  narx: 56000 },
  { id: 8,   nom: 'Аскорбинова к-та 5% 2мл №10',              narx: 1278 },
  { id: 9,   nom: 'Атф 1 мл №10',                             narx: 23520 },
  { id: 10,  nom: 'Ацц инжект 300 мг/3мл №10',                narx: 18410 },
  { id: 11,  nom: 'Бабочка',                                   narx: 1680 },
  { id: 12,  nom: 'Бисентол 480',                              narx: 16464 },
  { id: 13,  nom: 'Боралгин',                                  narx: 3248 },
  { id: 14,  nom: 'Вазопро р-р 0,5г/5мл №10',                 narx: 19600 },
  { id: 15,  nom: 'ВИТ Б комплекс',                           narx: 17920 },
  { id: 16,  nom: 'ВИТ Б1 1 мл р-р (Тиамин)',                 narx: 840 },
  { id: 17,  nom: 'Вит Б6 1мл р-р (Пиридаксин)',              narx: 980 },
  { id: 18,  nom: 'Вит B12 р-р д/ин 500мкг 1мл №5',           narx: 644 },
  { id: 19,  nom: 'Вито-Д амп. 200000МЕ/мл 1мл №1',          narx: 136750 },
  { id: 20,  nom: 'Гембаг р-р д/приёма 100мг/5мл №20',        narx: 205800 },
  { id: 21,  nom: 'Гепарин',                                   narx: 54040 },
  { id: 22,  nom: 'Гептрал 500мг амп №5',                     narx: 122920 },
  { id: 23,  nom: 'Гиалган',                                   narx: 650000 },
  { id: 24,  nom: 'Гидрокортизона ацетат 2,5% 2мл амп №10',   narx: 8400 },
  { id: 25,  nom: 'Глиатилин 1000 мг 4мл №3',                 narx: 118720 },
  { id: 26,  nom: 'Глюкоза DF амп. 40% 10мл №10',             narx: 365 },
  { id: 27,  nom: 'Глюкоза р-р д/инф 10% 200мл',              narx: 8450 },
  { id: 28,  nom: 'Глютион 600',                               narx: 61600 },
  { id: 29,  nom: 'Гэк 200 р-р 6% 250 мл',                    narx: 56280 },
  { id: 30,  nom: 'Декасан р-р 400мл',                        narx: 129360 },
  { id: 31,  nom: 'Дексаметазон-Эллара амп. 4мг/мл 1мл №10',  narx: 1400 },
  { id: 32,  nom: 'Дематон Д',                                 narx: 122215 },
  { id: 33,  nom: 'Диалипон р-р 3% 20мл',                     narx: 37520 },
  { id: 34,  nom: 'Диалипон турбо р-р д/инф 1.2% 50мл №10',   narx: 56000 },
  { id: 35,  nom: 'ДИБАЗОЛ 1% 2МЛ №50',                       narx: 1178 },
  { id: 36,  nom: 'Диклофенак натрия амп. 25мг/3мл №10',      narx: 1680 },
  { id: 37,  nom: 'Димедрол',                                  narx: 508 },
  { id: 38,  nom: 'Димексид-жфф 50мл',                        narx: 26320 },
  { id: 39,  nom: 'Динапар №5',                               narx: 14518 },
  { id: 40,  nom: 'Динар',                                     narx: 18760 },
  { id: 41,  nom: 'Диоксидин 1% 10 мл амп №10',               narx: 10080 },
  { id: 42,  nom: 'Изо-мик',                                   narx: 110600 },
  { id: 43,  nom: 'Интрафен',                                  narx: 64400 },
  { id: 44,  nom: 'Инфулган р-р д/инф. 10мг/мл 100мл',        narx: 57638 },
  { id: 45,  nom: 'Йод 20мл',                                  narx: 4480 },
  { id: 46,  nom: 'Кавинтон р-р д/ин. 10мг 2мл №10',          narx: 8370 },
  { id: 47,  nom: 'Кавинтон р-р д/ин. 25мг 5мл №10',          narx: 9800 },
  { id: 48,  nom: 'Калия хлорид амп 4% 10мл №10',             narx: 1680 },
  { id: 49,  nom: 'Кальций глюконат 10% 10мл №10',            narx: 4984 },
  { id: 50,  nom: 'Кейвер р-р 50 мг/2мг 2мл №10',             narx: 12600 },
  { id: 51,  nom: 'Кеналог 40мг/1мл №5',                      narx: 35000 },
  { id: 52,  nom: 'Кетап 25 мг таблетка',                     narx: 4130 },
  { id: 53,  nom: 'Кетонал р-р д/ин 100мг/2мл 2мл №10',       narx: 10500 },
  { id: 54,  nom: 'Кеторол р-р д/ин. 30мг/1мл 1мл №50',       narx: 6076 },
  { id: 55,  nom: 'Клинг энема',                               narx: 14000 },
  { id: 56,  nom: 'Кокарбоксилаза 50 мг',                     narx: 6720 },
  { id: 57,  nom: 'Компрес',                                   narx: 10000 },
  { id: 58,  nom: 'Компресс суви',                             narx: 100800 },
  { id: 59,  nom: 'Конвулекс р-р 100мг/мл д/ин. 5мл №5',      narx: 79856 },
  { id: 60,  nom: 'Кофеин 1мл №10',                           narx: 2660 },
  { id: 61,  nom: 'Ксилат р-р 200мл',                         narx: 82600 },
  { id: 62,  nom: 'Ксилат р-р 400 мл',                        narx: 91000 },
  { id: 63,  nom: 'Лартен 200 мл',                             narx: 62440 },
  { id: 64,  nom: 'Левокарнитин 5мл (Элькар-Левонил)',         narx: 36400 },
  { id: 65,  nom: 'Левомеколь мазь 40г',                      narx: 21109 },
  { id: 66,  nom: 'Левофлоксоцин DF р-р д/инф. 5мг/мл 100мл', narx: 8120 },
  { id: 67,  nom: 'Лейкопластырь Мультипласт 2х500см',         narx: 7700 },
  { id: 68,  nom: 'Лидаза 1280 ед №10',                       narx: 21980 },
  { id: 69,  nom: 'Лидокаин 2 мл № 10',                       narx: 485 },
  { id: 70,  nom: 'Линкомицин р-р д/ин. 300мг/мл 1мл №10',    narx: 1680 },
  { id: 71,  nom: 'Магния сульфат амп. 25% 5мл №10',          narx: 1156 },
  { id: 72,  nom: 'Малхам',                                    narx: 30800 },
  { id: 73,  nom: 'Мансур р-р д/инф. 15% 200мл',              narx: 25510 },
  { id: 74,  nom: 'Натрия гидрокарбонат р-р д/инф 40мг/мл',   narx: 29400 },
  { id: 75,  nom: 'Натрия хлорид амп. 0,9% 5мл №10',          narx: 494 },
  { id: 76,  nom: 'Натрия хлорид р-р 0,9% 100мл',             narx: 2870 },
  { id: 77,  nom: 'Натрия хлорид р-р 0,9% 200мл',             narx: 3220 },
  { id: 78,  nom: 'Никотиновая кислота амп. 1% 1мл №10',       narx: 546 },
  { id: 79,  nom: 'Новокаин амп. 0,2% 2мл №10',               narx: 609 },
  { id: 80,  nom: 'Новокаин амп. 0,5% 5мл №10',               narx: 438 },
  { id: 81,  nom: 'НОЛПАЗА ПОР.40МГ ФЛАКОН №1',               narx: 59500 },
  { id: 82,  nom: 'Нош-па 20 мг Амп 2мл №5',                  narx: 6524 },
  { id: 83,  nom: 'Нулео цмф №3',                             narx: 37800 },
  { id: 84,  nom: 'Осетрон р-р. д/ин 8мг/4мл №5',             narx: 29120 },
  { id: 85,  nom: 'Панангин',                                  narx: 16800 },
  { id: 86,  nom: 'Папаверина гидрохлорид 2% 2мл №10',        narx: 1043 },
  { id: 87,  nom: 'Пахта, спирт',                              narx: 10500 },
  { id: 88,  nom: 'Перекись водорода 3% 100мл',                narx: 2100 },
  { id: 89,  nom: 'Перчатка нестерил №100 медпро',             narx: 48816 },
  { id: 90,  nom: 'Перчатки стер. хир. кауч. латекс',         narx: 3253 },
  { id: 91,  nom: 'Пиколакс таб',                              narx: 1680 },
  { id: 92,  nom: 'Пирацетам ДХФ р-р 200мг/5мл №10',          narx: 1848 },
  { id: 93,  nom: 'Платифиллин амп 0,2% 1мл №10',              narx: 2240 },
  { id: 94,  nom: 'Преднизолон р-р д/ин. 30мг/мл 1мл №10',    narx: 3850 },
  { id: 95,  nom: 'Прозерин 1мл №10',                         narx: 1260 },
  { id: 96,  nom: 'Реосорбилакт р-р д/инф. 200мл',            narx: 79800 },
  { id: 97,  nom: 'Реосорбилакт р-р д/инф. 400мл',            narx: 93800 },
  { id: 98,  nom: 'Реосорведол р-р д/инф. 200мл',             narx: 11006 },
  { id: 99,  nom: 'Ретоболил',                                 narx: 399999 },
  { id: 100, nom: 'Рибоксин амп. 2% 10мл №10',                narx: 812 },
  { id: 101, nom: 'Рингер 200 мл',                             narx: 4929 },
  { id: 102, nom: 'Ротавит кальций',                           narx: 65800 },
  { id: 103, nom: 'Ротадон Адваис р-р д/ин. 200мг/2мл №10',   narx: 19320 },
  { id: 104, nom: 'Румалон 1мл',                               narx: 32648 },
  { id: 105, nom: 'Саргин 100мл №1',                          narx: 85400 },
  { id: 106, nom: 'Сенадесин',                                  narx: 700 },
  { id: 107, nom: 'Серомин р-р 200мл',                        narx: 100380 },
  { id: 108, nom: 'Серомин 100 мл',                           narx: 81760 },
  { id: 109, nom: 'Синафлан мазь',                             narx: 7000 },
  { id: 110, nom: 'Система инфузионная WEGO №1',               narx: 3276 },
  { id: 111, nom: 'Сода-Буфер 42мг/200 мл',                   narx: 53200 },
  { id: 112, nom: 'Спазмалгон 5мл №5',                        narx: 10640 },
  { id: 113, nom: 'Спинал игла',                               narx: 23800 },
  { id: 114, nom: 'Стерил салфетка катта',                     narx: 5367 },
  { id: 115, nom: 'Стерил салфетка кичкина',                   narx: 3290 },
  { id: 116, nom: 'Супрастин 20мг/мл р-р для ин. 1мл №5',     narx: 10920 },
  { id: 117, nom: 'Тиотриазолин амп. 4мл №10',                narx: 19600 },
  { id: 118, nom: 'Тиоцетам 10 мл',                           narx: 10290 },
  { id: 119, nom: 'Толкимадо 1 мл №5',                        narx: 15218 },
  { id: 120, nom: 'Торсид амп. 4мл №5',                       narx: 20300 },
  { id: 121, nom: 'Трентал',                                   narx: 1097 },
  { id: 122, nom: 'Укол хизмати',                             narx: 25200 },
  { id: 123, nom: 'ФДП порошок 5гр №1',                       narx: 232400 },
  { id: 124, nom: 'Феррофер 5мл №5',                          narx: 84000 },
  { id: 125, nom: 'Флуконазол 100 мл',                        narx: 7000 },
  { id: 126, nom: 'Форкал плюс таб №100 (1 донаси)',           narx: 1920 },
  { id: 127, nom: 'Фуросемид амп 2мл №10',                    narx: 1820 },
  { id: 128, nom: 'Церуглан',                                  narx: 672 },
  { id: 129, nom: 'Цефазолин пор. д/пр. р-ра д/ин. 1г №50',   narx: 8904 },
  { id: 130, nom: 'Цефаперазол сульбактам (Никазон-с)',        narx: 22960 },
  { id: 131, nom: 'Цефтриаксон пор. 1г №50',                  narx: 6650 },
  { id: 132, nom: 'Цитиколин Ромфарм р-р. д/ин 1000мг/4мл №5', narx: 47600 },
  { id: 133, nom: 'Цитофлавин',                               narx: 37100 },
  { id: 134, nom: 'Шприц 10 мл',                              narx: 635 },
  { id: 135, nom: 'Шприц 1мл',                                narx: 560 },
  { id: 136, nom: 'Шприц 20 мл',                              narx: 1288 },
  { id: 137, nom: 'Шприц 2мл',                                narx: 463 },
  { id: 138, nom: 'Шприц 5 мл',                               narx: 515 },
  { id: 139, nom: 'Шприц 50 мл',                              narx: 7070 },
  { id: 140, nom: 'Эллезиум р-р. д/ин. 1,0мг/5мл 5мл №10',   narx: 26040 },
  { id: 141, nom: 'Эссенциале Н р-р д/ин. 250мг/5мл 5мл №5',  narx: 54544 },
  { id: 142, nom: 'Эуфиллин амп 2,4% 5мл №10',               narx: 1579 },
];

const YOTOQ_NARXI = 220000;
const fmt = (n) => Math.round(n).toLocaleString('uz-UZ') + " so'm";
const todayStr = () => new Date().toISOString().split('T')[0];

export default function AdminPharmacy() {
  const [qidiruv, setQidiruv] = useState('');
  const [tanlangan, setTanlangan] = useState({});
  const [sana, setSana] = useState(todayStr());
  const [bemorNom, setBemorNom] = useState('');
  const [retseptlar, setRetseptlar] = useState([]);
  const [yotoqKun, setYotoqKun] = useState(1);
  const [activeTab, setActiveTab] = useState('yangi');

  const filtrlangan = useMemo(() =>
    DORILAR.filter(d => d.nom.toLowerCase().includes(qidiruv.toLowerCase())), [qidiruv]);

  const qosh = (id) => setTanlangan(p => ({ ...p, [id]: (p[id] || 0) + 1 }));
  const kamayt = (id) => setTanlangan(p => {
    const y = { ...p };
    if ((y[id] || 0) <= 1) delete y[id]; else y[id]--;
    return y;
  });
  const ochir = (id) => setTanlangan(p => { const y = { ...p }; delete y[id]; return y; });
  const tozala = () => setTanlangan({});

  const tanlanganList = DORILAR.filter(d => tanlangan[d.id]);
  const doriNarx = tanlanganList.reduce((s, d) => s + d.narx * (tanlangan[d.id] || 0), 0);
  const yotoqJami = YOTOQ_NARXI * yotoqKun;
  const umumiy = doriNarx + yotoqJami;

  const saqlash = () => {
    if (!tanlanganList.length) return;
    setRetseptlar(prev => [{
      id: Date.now(), sana, bemor: bemorNom || "Noma'lum bemor",
      dorilar: tanlanganList.map(d => ({ nom: d.nom, narx: d.narx, miqdor: tanlangan[d.id], jami: d.narx * tanlangan[d.id] })),
      doriNarx, yotoqKun, yotoqJami, umumiy
    }, ...prev]);
    tozala(); setBemorNom(''); setActiveTab('tarix');
  };

  return (
    <div className="p-6 bg-[#F5F7FB] min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-600 text-white p-2.5 rounded-xl"><MdMedication size={26} /></div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dorilar va Retsept</h1>
          <p className="text-sm text-gray-500">Dori tanlang, miqdor belgilang va retsept tuzing</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {[{ key: 'yangi', label: 'Yangi Retsept' }, { key: 'tarix', label: 'Retseptlar tarixi (' + retseptlar.length + ')' }].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={'px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ' + (activeTab === t.key ? 'bg-blue-600 text-white shadow' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50')}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'yangi' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col" style={{ maxHeight: '80vh' }}>
            <div className="p-4 border-b border-gray-100 bg-white rounded-t-2xl sticky top-0 z-10">
              <div className="relative">
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input value={qidiruv} onChange={e => setQidiruv(e.target.value)} placeholder="Dori nomini qidiring..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400" />
              </div>
              <p className="text-xs text-gray-400 mt-2">{filtrlangan.length} ta dori</p>
            </div>
            <div className="overflow-y-auto flex-1 divide-y divide-gray-50">
              {filtrlangan.map(dori => {
                const miq = tanlangan[dori.id] || 0;
                return (
                  <div key={dori.id} className={'flex items-center justify-between px-4 py-3 transition-colors ' + (miq > 0 ? 'bg-blue-50' : 'hover:bg-gray-50')}>
                    <div className="flex-1 min-w-0 mr-3">
                      <p className={'text-sm font-medium truncate ' + (miq > 0 ? 'text-blue-700' : 'text-gray-800')}>{dori.nom}</p>
                      <p className="text-xs text-gray-400">{fmt(dori.narx)}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => kamayt(dori.id)} disabled={!miq}
                        className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 disabled:opacity-30 flex items-center justify-center"><MdRemove size={18} /></button>
                      <span className={'w-7 text-center text-sm font-bold ' + (miq > 0 ? 'text-blue-700' : 'text-gray-300')}>{miq}</span>
                      <button onClick={() => qosh(dori.id)}
                        className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center"><MdAdd size={18} /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3">
              <h3 className="font-semibold text-gray-800 text-sm">Bemor ma'lumoti</h3>
              <input value={bemorNom} onChange={e => setBemorNom(e.target.value)} placeholder="Bemor ismi..."
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-200" />
              <div className="flex items-center gap-2">
                <MdCalendarToday className="text-gray-400" size={18} />
                <input type="date" value={sana} onChange={e => setSana(e.target.value)}
                  className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-200" />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-3">
                <MdBed className="text-purple-500" size={20} />
                <h3 className="font-semibold text-gray-800 text-sm">Yotoq xona</h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 flex-1">220,000 x kun:</span>
                <button onClick={() => setYotoqKun(k => Math.max(1, k - 1))}
                  className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 flex items-center justify-center"><MdRemove size={18} /></button>
                <span className="w-8 text-center font-bold text-purple-700">{yotoqKun}</span>
                <button onClick={() => setYotoqKun(k => k + 1)}
                  className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 flex items-center justify-center"><MdAdd size={18} /></button>
              </div>
              <div className="mt-2 text-right text-sm font-bold text-purple-700">= {fmt(yotoqJami)}</div>
            </div>

            {tanlanganList.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800 text-sm">Tanlangan ({tanlanganList.length})</h3>
                  <button onClick={tozala} className="text-xs text-red-400 hover:text-red-600">Hammasini o'chir</button>
                </div>
                <div className="space-y-2 max-h-52 overflow-y-auto">
                  {tanlanganList.map(d => (
                    <div key={d.id} className="flex items-start justify-between gap-2 text-xs">
                      <div className="flex-1">
                        <p className="font-medium text-gray-700 leading-tight">{d.nom}</p>
                        <p className="text-gray-400">{tanlangan[d.id]} x {fmt(d.narx)}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-blue-700">{fmt(d.narx * tanlangan[d.id])}</p>
                        <button onClick={() => ochir(d.id)} className="text-red-400 hover:text-red-600 mt-0.5"><MdDelete size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl p-4 shadow-md">
              <div className="space-y-2 text-sm mb-3">
                <div className="flex justify-between">
                  <span className="text-blue-200">Dorilar:</span>
                  <span className="font-semibold">{fmt(doriNarx)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Yotoq ({yotoqKun} kun):</span>
                  <span className="font-semibold">{fmt(yotoqJami)}</span>
                </div>
                <div className="border-t border-blue-500 pt-2 flex justify-between text-base font-bold">
                  <span>JAMI:</span>
                  <span>{fmt(umumiy)}</span>
                </div>
              </div>
              <button onClick={saqlash} disabled={!tanlanganList.length}
                className="w-full py-3 bg-white text-blue-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 shadow">
                <MdCheck size={20} /> Retseptni Saqlash
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {retseptlar.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
              <FaPills className="text-gray-300 mx-auto mb-3" size={40} />
              <p className="text-gray-400 font-medium">Hali retsept yo'q</p>
              <button onClick={() => setActiveTab('yangi')} className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold">Yangi retsept tuzing</button>
            </div>
          ) : (
            retseptlar.map(r => (
              <div key={r.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-100">
                  <div>
                    <p className="font-bold text-gray-800">{r.bemor}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5"><MdCalendarToday size={13} /> {r.sana}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Umumiy jami</p>
                    <p className="text-lg font-bold text-blue-700">{fmt(r.umumiy)}</p>
                  </div>
                </div>
                <div className="px-6 py-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Dorilar sostavı ({r.dorilar.length} ta)</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {r.dorilar.map((d, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-100">
                        {d.nom} x{d.miqdor}
                      </span>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-3 bg-gray-50 rounded-xl p-3 text-center text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Dorilar</p>
                      <p className="font-bold text-gray-800">{fmt(r.doriNarx)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Yotoq ({r.yotoqKun} kun)</p>
                      <p className="font-bold text-purple-700">{fmt(r.yotoqJami)}</p>
                    </div>
                    <div className="bg-blue-600 text-white rounded-lg py-1">
                      <p className="text-blue-200 text-xs">JAMI</p>
                      <p className="font-bold">{fmt(r.umumiy)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
