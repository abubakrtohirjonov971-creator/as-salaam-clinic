import React, { useState, useMemo, useRef } from 'react';
import { 
  MdSearch, MdAdd, MdRemove, MdDelete, MdPrint, MdFileDownload, 
  MdRefresh, MdCheckCircle, MdCalendarToday, MdPerson, MdSave,
  MdViewList, MdTableChart, MdHelpOutline
} from 'react-icons/md';
import { FaFileExcel, FaBed, FaPills, FaCalculator } from 'react-icons/fa';

// Exceldagi to'liq dorilar ro'yxati (asl tartib va ranglari bilan)
const INITIAL_DORILAR = [
  { id: 1,   nom: 'Живокост Бальзам',                         narx: 100800, highlight: 'red-text' },
  { id: 2,   nom: 'Aloe',                                      narx: 2310 },
  { id: 3,   nom: 'NaHCO3 dentafile',                          narx: 5320 },
  { id: 4,   nom: 'Актовегин 10 мл №5',                        narx: 76160, highlight: 'red-bg' },
  { id: 5,   nom: 'Амброксол р-р д/ин. 7,5мг/2мл №5 (Амбро)', narx: 6249.6 },
  { id: 6,   nom: 'Аналгин',                                   narx: 1568 },
  { id: 7,   nom: 'Артоксан',                                  narx: 56000 },
  { id: 8,   nom: 'Аскорбинова к-та 5% 2мл №10 (Далхим )',      narx: 1278.2 },
  { id: 9,   nom: 'Атф 1 мл №10',                             narx: 23520 },
  { id: 10,  nom: 'Ацц инжект 300 мг/3мл №10',                narx: 18410 },
  { id: 11,  nom: 'Бабочка',                                   narx: 1680 },
  { id: 12,  nom: 'бинт',                                      narx: 0 },
  { id: 13,  nom: 'Бисентол 480',                              narx: 16464, highlight: 'red-bg' },
  { id: 14,  nom: 'больной',                                   narx: 0 },
  { id: 15,  nom: 'Боралгин',                                  narx: 3248 },
  { id: 16,  nom: 'Вазопро р-р 0,5г/5мл №10',                 narx: 19600 },
  { id: 17,  nom: 'ВИТ Б комплекс',                           narx: 17920 },
  { id: 18,  nom: 'ВИТ Б1 1 мл р-р (Тиамин)',                 narx: 840 },
  { id: 19,  nom: 'Вит б6 1мл р-р (Пиродаксин)',              narx: 980 },
  { id: 20,  nom: 'Вит B12 р-р д/ин 500мкг 1мл №5 (Цианокобаламин)', narx: 644 },
  { id: 21,  nom: 'Вито-Д амп. 200000МЕ/мл 1мл №1',          narx: 136750.6 },
  { id: 22,  nom: 'Гембаг р-р д/приёма внутрь 100мг/5мл №20', narx: 205800 },
  { id: 23,  nom: 'Гепарин',                                   narx: 54040 },
  { id: 24,  nom: 'Гептрал 500мг амп №5',                     narx: 122920 },
  { id: 25,  nom: 'Гиалган',                                   narx: 650000 },
  { id: 26,  nom: 'Гидрокортизона ацетат сусп 2,5% 2мл амп №10', narx: 8400 },
  { id: 27,  nom: 'Глиатилин 1000 мг 4мл №3',                 narx: 118720 },
  { id: 28,  nom: 'Глюкоза DF амп. 40% 10мл №10',             narx: 365.4 },
  { id: 29,  nom: 'Глюкоза р-р д/инф 10% 200мл',              narx: 8450.4 },
  { id: 30,  nom: 'глютион 600',                               narx: 61600 },
  { id: 31,  nom: 'Гэк 200 р-р 6% 250 мл',                    narx: 56280, highlight: 'red-bg' },
  { id: 32,  nom: 'Декасан р-р 400мл',                        narx: 129360 },
  { id: 33,  nom: 'Дексаметазон-Эллара р-р д/ин. амп. 4мг/мл 1мл №10', narx: 1400 },
  { id: 34,  nom: 'Дематон Д',                                 narx: 122215.8 },
  { id: 35,  nom: 'Диалипон р-р 3% 20мл',                     narx: 37520 },
  { id: 36,  nom: 'Диалипон турбо р-р д/инф 1.2% 50мл №10',   narx: 56000 },
  { id: 37,  nom: 'ДИБАЗОЛ 1% 2МЛ №50 (МЕРИМЕД)',             narx: 1178.8 },
  { id: 38,  nom: 'Диклофенак натрия амп. 25мг/3мл №10',      narx: 1680 },
  { id: 39,  nom: 'Димедрол',                                  narx: 508.2 },
  { id: 40,  nom: 'Димексид-жфф 50мл',                        narx: 26320 },
  { id: 41,  nom: 'Динапар №5',                               narx: 14518 },
  { id: 42,  nom: 'Динар',                                     narx: 18760 },
  { id: 43,  nom: 'Диоксидин 1% 10 мл амп №10',               narx: 10080 },
  { id: 44,  nom: 'Изо-мик',                                   narx: 110600 },
  { id: 45,  nom: 'Интрафен',                                  narx: 64400, highlight: 'red-bg' },
  { id: 46,  nom: 'Инфулган р-р д/инф. 10мг/мл 100мл',        narx: 57638 },
  { id: 47,  nom: 'Йод 20мл',                                  narx: 4480 },
  { id: 48,  nom: 'Кавинтон р-р д/ин. 10мг 2мл №10',          narx: 8370.6 },
  { id: 49,  nom: 'Кавинтон р-р д/ин. 25мг 5мл №10',          narx: 9800 },
  { id: 50,  nom: 'Калия хлорид амп 4% 10мл №10',             narx: 1680 },
  { id: 51,  nom: 'Кальций глюконат 10% 10мл №10',            narx: 4984 },
  { id: 52,  nom: 'Кейвер р-р 50 мг/2мг 2мл №10',             narx: 12600 },
  { id: 53,  nom: 'Кеналог 40мг/1мл №5',                      narx: 35000 },
  { id: 54,  nom: 'кетап 25 мг таблетка',                     narx: 4130 },
  { id: 55,  nom: 'Кетонал р-р д/ин 100мг/2мл 2мл №10',       narx: 10500 },
  { id: 56,  nom: 'Кеторол р-р д/ин. 30мг/1мл 1мл №50',       narx: 6076 },
  { id: 57,  nom: 'Клинг энема',                               narx: 14000 },
  { id: 58,  nom: 'кма',                                       narx: 0 },
  { id: 59,  nom: 'Кокарбоксилаза 50 мг (ккб)',               narx: 6720 },
  { id: 60,  nom: 'Компрес',                                   narx: 10000.2 },
  { id: 61,  nom: 'Компресс суви',                             narx: 100800 },
  { id: 62,  nom: 'Конвулекс р-р 100мг/мл д/ин. 5мл №5',      narx: 79856 },
  { id: 63,  nom: 'Кофеин 1мл №10',                           narx: 2660 },
  { id: 64,  nom: 'Ксилат р-р 200мл',                         narx: 82600 },
  { id: 65,  nom: 'Ксилат р-р 400 мл',                        narx: 91000 },
  { id: 66,  nom: 'Лартен 200 мл',                             narx: 62440 },
  { id: 67,  nom: 'Левокарнитин 5мл(Элькар-Левонил)',         narx: 36400 },
  { id: 68,  nom: 'Левомеколь мазь 40г',                      narx: 21109.2 },
  { id: 69,  nom: 'Левофлоксоцин DF р-р д/инф. 5мг/мл 100мл', narx: 8120 },
  { id: 70,  nom: 'Лейкопластырь "Мультипласт" 2х500см',       narx: 7700 },
  { id: 71,  nom: 'лидаза 1280 ед №10',                       narx: 21980 },
  { id: 72,  nom: 'лидокаин 2 мл № 10',                       narx: 485.8 },
  { id: 73,  nom: 'Линкомицин р-р д/ин. 300мг/мл 1мл №10',    narx: 1680 },
  { id: 74,  nom: 'Магния сульфат амп. 25% 5мл №10',          narx: 1156.4 },
  { id: 75,  nom: 'Малхам',                                    narx: 30800 },
  { id: 76,  nom: 'Мансур р-р д/инф. 15% 200мл',              narx: 25510 },
  { id: 77,  nom: 'Натрия гидрокарбонат р-р д/инф 40мг/мл 100мл', narx: 29400 },
  { id: 78,  nom: 'Натрия хлорид амп. 0,9% 5мл №10',          narx: 494.2 },
  { id: 79,  nom: 'Натрия хлорид р-р 0,9% 100мл',             narx: 2870 },
  { id: 80,  nom: 'Натрия хлорид р-р 0,9% 200мл',             narx: 3220 },
  { id: 81,  nom: 'Никотиновая кислота амп. 1% 1мл №10',       narx: 546 },
  { id: 82,  nom: 'Новокаин амп. 0,2% 2мл №10',               narx: 609 },
  { id: 83,  nom: 'Новокаин амп. 0,5% 5мл №10',               narx: 438.2 },
  { id: 84,  nom: 'НОЛПАЗА ПОР.40МГ ФЛАКОН №1',               narx: 59500 },
  { id: 85,  nom: 'Нош-па 20 мг Амп 2мл №5',                  narx: 6524 },
  { id: 86,  nom: 'Нулео цмф №3',                             narx: 37800 },
  { id: 87,  nom: 'Осетрон р-р. д/ин 8мг/4мл №5',             narx: 29120 },
  { id: 88,  nom: 'Панангин',                                  narx: 16800, highlight: 'red-bg' },
  { id: 89,  nom: 'Папаверина гидрохлорид 2% 2мл №10',        narx: 1043 },
  { id: 90,  nom: 'Пахта , спирт',                             narx: 10500, highlight: 'yellow-bg' },
  { id: 91,  nom: 'Перекись водорода Aktiv perekis р-р 3% 100мл', narx: 2100 },
  { id: 92,  nom: 'Перчатка нестерил №100 медпро',             narx: 48816.6 },
  { id: 93,  nom: 'Перчатки стер. хир. кауч. латекс неопуд. М р.7,5', narx: 3253.6 },
  { id: 94,  nom: 'Пиколакс таб',                              narx: 1680 },
  { id: 95,  nom: 'Пирацетам ДХФ р-р 200мг/5мл №10',          narx: 1848 },
  { id: 96,  nom: 'Платифиллин амп 0,2% 1мл №10',              narx: 2240 },
  { id: 97,  nom: 'Преднизолон р-р д/ин. 30мг/мл 1мл №10',    narx: 3850 },
  { id: 98,  nom: 'Прозерин 1мл №10',                         narx: 1260 },
  { id: 99,  nom: 'Реосорбилакт р-р д/инф. 200мл',            narx: 79800 },
  { id: 100, nom: 'Реосорбилакт р-р д/инф. 400мл',            narx: 93800 },
  { id: 101, nom: 'Реосорведол р-р д/инф. 200мл',             narx: 11006.8 },
  { id: 102, nom: 'Ретоболил',                                 narx: 399999.6 },
  { id: 103, nom: 'Рибоксин амп. 2% 10мл №10',                narx: 812 },
  { id: 104, nom: 'Рингер 200 мл',                             narx: 4929.4 },
  { id: 105, nom: 'Ротавит кальций',                           narx: 65800 },
  { id: 106, nom: 'Ротадон Адванс р-р д/ин. 200мг/2мл №10',   narx: 19320, highlight: 'red-bg' },
  { id: 107, nom: 'Румалон 1мл',                               narx: 32648 },
  { id: 108, nom: 'Саргин 100мл №1',                          narx: 85400 },
  { id: 109, nom: 'сенадесин',                                  narx: 700 },
  { id: 110, nom: 'Серомин р-р 200мл',                        narx: 100380 },
  { id: 111, nom: 'Серомин 100 мл',                           narx: 81760 },
  { id: 112, nom: 'Синафлан мазь',                             narx: 7000 },
  { id: 113, nom: 'Система инфузионная WEGO №1',               narx: 3276 },
  { id: 114, nom: 'Сода-Буфер 42мг/200 мл',                   narx: 53200, highlight: 'red-bg' },
  { id: 115, nom: 'Спазмалгон 5мл №5(Спазган )',                narx: 10640 },
  { id: 116, nom: 'Спинал игла',                               narx: 23800 },
  { id: 117, nom: 'Стерил салфетка катта',                     narx: 5367.6 },
  { id: 118, nom: 'Стерил салфетка кичкина',                   narx: 3290 },
  { id: 119, nom: 'Супрастин 20мг/мл р-р для ин. 1мл №5',     narx: 10920 },
  { id: 120, nom: 'Тиотриазолин амп. 4мл №10',                narx: 19600 },
  { id: 121, nom: 'Тиоцетам 10 мл',                           narx: 10290 },
  { id: 122, nom: 'Толкимадо 1 мл №5',                        narx: 15218 },
  { id: 123, nom: 'Торсид амп. 4мл №5',                       narx: 20300 },
  { id: 124, nom: 'Трентал',                                   narx: 1097.6 },
  { id: 125, nom: 'Укол хизмати',                             narx: 25200, highlight: 'yellow-bg' },
  { id: 126, nom: 'ФДП порошок 5гр №1',                       narx: 232400 },
  { id: 127, nom: 'Феррофер 5мл №5',                          narx: 84000 },
  { id: 128, nom: 'Флуконазол 100 мл',                        narx: 7000 },
  { id: 129, nom: 'Форкал плюс таб №100 (1 донаси )',          narx: 1920.8 },
  { id: 130, nom: 'Фуросемид амп 2мл №10',                    narx: 1820 },
  { id: 131, nom: 'Церуглан',                                  narx: 672 },
  { id: 132, nom: 'Цефазолин пор. д/пр. р-ра д/ин. 1г №50',   narx: 8904 },
  { id: 133, nom: 'Цефаперазол сульбактам (Никазон-с)',        narx: 22960 },
  { id: 134, nom: 'Цефтриаксон пор. 1г №50',                  narx: 6650 },
  { id: 135, nom: 'Цитиколин Ромфарм р-р. д/ин 1000мг/4мл №5(Навбахор )', narx: 47600 },
  { id: 136, nom: 'Цитофлавин',                               narx: 37100, highlight: 'red-bg' },
  { id: 137, nom: 'шприц 10 мл',                              narx: 635.6 },
  { id: 138, nom: 'шприц 1мл',                                narx: 560 },
  { id: 139, nom: 'шприц 20 мл',                              narx: 1288 },
  { id: 140, nom: 'шприц 2мл',                                narx: 463.4 },
  { id: 141, nom: 'шприц 5 мл',                               narx: 515.2 },
  { id: 142, nom: 'шприц 50 мл',                              narx: 7070 },
  { id: 143, nom: 'Эллезиум р-р. д/ин. 1,0мг/5мл 5мл №10 ( )', narx: 26040 },
  { id: 144, nom: 'Эссенциале Н р-р д/ин. 250мг/5мл 5мл №5',  narx: 54544 },
  { id: 145, nom: 'Эуфиллин амп 2,4% 5мл №10',               narx: 1579.2 },
];

const YOTOQ_NARXI = 220000;
const fmt = (n) => (n || 0).toLocaleString('ru-RU', { maximumFractionDigits: 1 });
const todayStr = () => new Date().toISOString().split('T')[0];

export default function AdminPharmacy() {
  const [activeSheet, setActiveSheet] = useState('Лист1');
  const [sheets, setSheets] = useState(['Лист1', 'Лист2', 'Лист3']);
  
  // Har bir sheet uchun alohida ma'lumotlar saqlanadi
  const [sheetData, setSheetData] = useState({
    'Лист1': {
      quantities: {}, // { [doriId]: number }
      bemor: '',
      sana: todayStr(),
      yotoqKun: 0,
      tuladi: 0
    },
    'Лист2': { quantities: {}, bemor: '', sana: todayStr(), yotoqKun: 0, tuladi: 0 },
    'Лист3': { quantities: {}, bemor: '', sana: todayStr(), yotoqKun: 0, tuladi: 0 }
  });

  const [search, setSearch] = useState('');
  const [onlySelected, setOnlySelected] = useState(false);
  const inputRefs = useRef({});

  const currentSheet = sheetData[activeSheet] || { quantities: {}, bemor: '', sana: todayStr(), yotoqKun: 0, tuladi: 0 };
  const currentQuantities = currentSheet.quantities;

  // Soni o'zgarganda
  const handleQuantityChange = (id, val) => {
    const num = val === '' ? 0 : Math.max(0, parseInt(val) || 0);
    setSheetData(prev => ({
      ...prev,
      [activeSheet]: {
        ...prev[activeSheet],
        quantities: {
          ...prev[activeSheet].quantities,
          [id]: num
        }
      }
    }));
  };

  const incrementQty = (id) => {
    const cur = currentQuantities[id] || 0;
    handleQuantityChange(id, cur + 1);
  };

  const decrementQty = (id) => {
    const cur = currentQuantities[id] || 0;
    if (cur > 0) handleQuantityChange(id, cur - 1);
  };

  const updateSheetField = (field, val) => {
    setSheetData(prev => ({
      ...prev,
      [activeSheet]: {
        ...prev[activeSheet],
        [field]: val
      }
    }));
  };

  const resetCurrentSheet = () => {
    if (window.confirm(`${activeSheet} jadvalini tozalashni xohlaysizmi?`)) {
      setSheetData(prev => ({
        ...prev,
        [activeSheet]: { quantities: {}, bemor: '', sana: todayStr(), yotoqKun: 0, tuladi: 0 }
      }));
    }
  };

  const addNewSheet = () => {
    const nextNum = sheets.length + 1;
    const newName = `Лист${nextNum}`;
    setSheets(prev => [...prev, newName]);
    setSheetData(prev => ({
      ...prev,
      [newName]: { quantities: {}, bemor: '', sana: todayStr(), yotoqKun: 0, tuladi: 0 }
    }));
    setActiveSheet(newName);
  };

  // Enter bosilganda keyingi qatorga o'tish (Excel klaviatura navigatsiyasi)
  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextId = filteredDorilar[index + 1]?.id;
      if (nextId && inputRefs.current[nextId]) {
        inputRefs.current[nextId].focus();
        inputRefs.current[nextId].select();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevId = filteredDorilar[index - 1]?.id;
      if (prevId && inputRefs.current[prevId]) {
        inputRefs.current[prevId].focus();
        inputRefs.current[prevId].select();
      }
    }
  };

  // Hisob-kitoblar (Avtomatik Formula)
  const dorilarJami = useMemo(() => {
    return INITIAL_DORILAR.reduce((sum, dori) => {
      const qty = currentQuantities[dori.id] || 0;
      return sum + (dori.narx * qty);
    }, 0);
  }, [currentQuantities]);

  const yotoqJami = (currentSheet.yotoqKun || 0) * YOTOQ_NARXI;
  const grandTotal = dorilarJami + yotoqJami;
  const qoldi = grandTotal - (currentSheet.tuladi || 0);

  // Tanlangan dorilar ro'yxati (sostav)
  const selectedDorilarList = useMemo(() => {
    return INITIAL_DORILAR
      .filter(d => (currentQuantities[d.id] || 0) > 0)
      .map(d => ({
        ...d,
        qty: currentQuantities[d.id],
        total: d.narx * currentQuantities[d.id]
      }));
  }, [currentQuantities]);

  // Qidiruv va filtr
  const filteredDorilar = useMemo(() => {
    return INITIAL_DORILAR.filter(dori => {
      const matchesSearch = dori.nom.toLowerCase().includes(search.toLowerCase()) || dori.id.toString() === search;
      if (onlySelected) {
        return matchesSearch && (currentQuantities[dori.id] || 0) > 0;
      }
      return matchesSearch;
    });
  }, [search, onlySelected, currentQuantities]);

  return (
    <div className="p-4 bg-[#EAECEF] min-h-screen font-sans">
      
      {/* EXCEL TITLEBAR & TOOLBAR */}
      <div className="bg-[#107C41] text-white px-4 py-2.5 rounded-t-xl shadow flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <FaFileExcel size={24} className="text-white drop-shadow" />
          <div>
            <h1 className="text-base font-bold tracking-wide flex items-center gap-2">
              июн_ойи_учун_хисоб_китоб_калькулятори.xlsx
              <span className="text-[11px] font-normal bg-white/20 px-2 py-0.5 rounded-full">Excel rejimi</span>
            </h1>
            <p className="text-[11px] text-emerald-100">Bemorlar dori-darmon va yotoq hisob-kitob jadvali</p>
          </div>
        </div>

        {/* Toolbar buttons */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded text-xs font-bold shadow-sm transition-all active:scale-95"
          >
            <MdPrint size={15} /> Chop etish / Chek
          </button>
          <button 
            onClick={resetCurrentSheet}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold shadow-sm transition-all"
          >
            <MdRefresh size={15} /> {activeSheet}ni tozalash
          </button>
        </div>
      </div>

      {/* SEARCH, PATIENT INFO & QUICK SUMMARY BAR */}
      <div className="bg-white border-x border-b border-gray-300 p-3 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        
        {/* Search & filters */}
        <div className="flex items-center gap-2 flex-1 min-w-[280px]">
          <div className="relative flex-1">
            <MdSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Dori nomi yoki № bo'yicha tezkor qidiruv..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded focus:bg-white focus:border-[#107C41] focus:ring-1 focus:ring-[#107C41] outline-none"
            />
          </div>
          <button
            onClick={() => setOnlySelected(!onlySelected)}
            className={`px-3 py-1.5 text-xs font-semibold rounded border transition-all ${
              onlySelected 
                ? 'bg-emerald-700 text-white border-emerald-800' 
                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
            }`}
          >
            {onlySelected ? `Faqat tanlanganlar (${selectedDorilarList.length})` : 'Hammasi (145)'}
          </button>
        </div>

        {/* Patient and Date inputs */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-50 border border-gray-300 rounded px-2 py-1">
            <MdPerson className="text-gray-400 mr-1" size={16} />
            <input 
              type="text"
              value={currentSheet.bemor}
              onChange={e => updateSheetField('bemor', e.target.value)}
              placeholder="Bemor F.I.SH."
              className="bg-transparent text-xs text-gray-800 outline-none w-32 font-medium"
            />
          </div>

          <div className="flex items-center bg-gray-50 border border-gray-300 rounded px-2 py-1">
            <MdCalendarToday className="text-gray-400 mr-1" size={14} />
            <input 
              type="date"
              value={currentSheet.sana}
              onChange={e => updateSheetField('sana', e.target.value)}
              className="bg-transparent text-xs text-gray-800 outline-none"
            />
          </div>
        </div>
      </div>

      {/* MAIN EXCEL WORKSPACE: TABLE + RIGHT CALCULATION BOX */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 mt-3">
        
        {/* LEFT & CENTER: EXCEL MAIN TABLE (9 COLS) */}
        <div className="xl:col-span-9 bg-white border border-gray-400 shadow-sm overflow-hidden flex flex-col" style={{ maxHeight: '72vh' }}>
          
          <div className="overflow-auto flex-1 select-none">
            <table className="w-full text-xs border-collapse font-mono">
              <thead className="sticky top-0 bg-[#E1DFDD] text-gray-800 font-bold border-b-2 border-gray-400 z-10 shadow-sm">
                <tr>
                  <th className="border border-gray-400 px-2 py-1.5 w-12 text-center bg-[#D2D0CE]">№</th>
                  <th className="border border-gray-400 px-3 py-1.5 text-left font-sans">Дорилар номи</th>
                  <th className="border border-gray-400 px-3 py-1.5 text-right w-36 font-sans">Сотиладигон Нархи</th>
                  <th className="border border-gray-400 px-2 py-1.5 text-center w-28 bg-[#FFF3C4] text-amber-950 font-sans">Сони [+/-]</th>
                  <th className="border border-gray-400 px-3 py-1.5 text-right w-36 font-sans">Сумма</th>
                </tr>
              </thead>
              <tbody>
                {filteredDorilar.map((dori, idx) => {
                  const qty = currentQuantities[dori.id] || 0;
                  const rowSum = dori.narx * qty;
                  const isSelected = qty > 0;

                  // Maxsus Excel ranglari
                  let rowBgClass = 'hover:bg-blue-50/70';
                  let nameStyle = 'text-gray-900 font-sans';
                  let priceStyle = 'text-red-600 font-bold';

                  if (dori.highlight === 'red-bg') {
                    nameStyle = 'bg-red-600 text-white font-bold font-sans px-1 rounded-sm';
                  } else if (dori.highlight === 'yellow-bg') {
                    nameStyle = 'bg-yellow-300 text-black font-bold font-sans px-1 rounded-sm';
                  }

                  if (isSelected) {
                    rowBgClass = 'bg-emerald-50 hover:bg-emerald-100/70 font-semibold';
                  }

                  return (
                    <tr key={dori.id} className={`border-b border-gray-300 transition-colors ${rowBgClass}`}>
                      
                      {/* № */}
                      <td className="border border-gray-300 px-2 py-1 text-center bg-gray-100/70 text-gray-600 text-[11px]">
                        {dori.id}
                      </td>

                      {/* Dori nomi */}
                      <td className="border border-gray-300 px-3 py-1">
                        <span className={nameStyle}>{dori.nom}</span>
                      </td>

                      {/* Sotiladigan narxi */}
                      <td className={`border border-gray-300 px-3 py-1 text-right ${priceStyle}`}>
                        {dori.narx > 0 ? fmt(dori.narx) : '0'}
                      </td>

                      {/* Soni (Katakka yozish + Enter orqali sakrash) */}
                      <td className={`border border-gray-300 p-0 text-center relative ${qty === 0 ? 'bg-[#990000] text-white' : 'bg-emerald-600 text-white'}`}>
                        <div className="flex items-center justify-between h-full px-1">
                          
                          {/* Minus button */}
                          <button
                            type="button"
                            onClick={() => decrementQty(dori.id)}
                            className="w-5 h-5 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/20 rounded text-xs font-black transition-all"
                            title="Kamaytirish"
                          >
                            -
                          </button>

                          {/* Editable Number Input (Excel cell) */}
                          <input
                            ref={el => inputRefs.current[dori.id] = el}
                            type="number"
                            min="0"
                            value={qty === 0 ? '' : qty}
                            placeholder="0"
                            onChange={e => handleQuantityChange(dori.id, e.target.value)}
                            onKeyDown={e => handleKeyDown(e, idx)}
                            className="w-12 text-center bg-transparent text-white font-bold text-xs outline-none focus:bg-white focus:text-black focus:ring-1 focus:ring-yellow-400 rounded py-0.5"
                          />

                          {/* Plus button */}
                          <button
                            type="button"
                            onClick={() => incrementQty(dori.id)}
                            className="w-5 h-5 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/20 rounded text-xs font-black transition-all"
                            title="Ko'paytirish"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* Summa */}
                      <td className="border border-gray-300 px-3 py-1 text-right font-bold text-gray-900 bg-gray-50/50">
                        {rowSum > 0 ? fmt(rowSum) : '0'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* EXCEL BOTTOM SUMMARY STATUS BAR */}
          <div className="bg-[#F3F2F1] border-t border-gray-400 px-3 py-1.5 flex items-center justify-between text-xs text-gray-700">
            <span className="font-sans">Jami qatorlar: <b>{filteredDorilar.length}</b> ta | Tanlangan: <b className="text-emerald-700">{selectedDorilarList.length}</b> ta</span>
            <span className="font-sans">Katakda <b>Enter</b> yoki <b>↓</b> bosib pastga o'tishingiz mumkin</span>
          </div>
        </div>

        {/* RIGHT: EXCEL NATIVE SUMMARY BOX (Exactly as screenshot!) */}
        <div className="xl:col-span-3 flex flex-col gap-3">
          
          {/* ASL EXCEL KVADRAT HISOB-KITOB JADVALI */}
          <div className="bg-white border-2 border-gray-800 shadow-md">
            <table className="w-full text-xs border-collapse font-sans font-bold">
              <tbody>
                
                {/* 1. Дорилар */}
                <tr className="border-b border-gray-800">
                  <td className="border-r border-gray-800 px-3 py-2 bg-gray-100 w-28">Дорилар</td>
                  <td className="border-r border-gray-800 px-2 py-2 text-center w-16 bg-gray-50">
                    <span className="text-[10px] text-gray-500 font-normal">avto</span>
                  </td>
                  <td className="px-3 py-2 text-right text-gray-900 font-mono text-sm bg-blue-50/50">
                    {fmt(dorilarJami)}
                  </td>
                </tr>

                {/* 2. Ётоқ */}
                <tr className="border-b border-gray-800">
                  <td className="border-r border-gray-800 px-3 py-2 bg-gray-100">Ётоқ (кун)</td>
                  <td className="border-r border-gray-800 p-0 text-center w-20 bg-yellow-50">
                    <div className="flex items-center justify-center">
                      <input 
                        type="number" 
                        min="0"
                        value={currentSheet.yotoqKun || ''} 
                        onChange={e => updateSheetField('yotoqKun', parseInt(e.target.value) || 0)}
                        placeholder="0"
                        className="w-full text-center py-2 text-xs font-bold bg-transparent outline-none focus:bg-white text-purple-800"
                      />
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right text-purple-900 font-mono text-sm bg-purple-50/50">
                    {fmt(yotoqJami)}
                  </td>
                </tr>

                {/* 3. Жами */}
                <tr className="border-b-2 border-gray-900 bg-gray-900 text-white">
                  <td className="border-r border-gray-700 px-3 py-2.5 text-sm uppercase">Жами</td>
                  <td className="border-r border-gray-700 px-2 py-2.5 text-center text-[10px] text-gray-400">
                    {currentSheet.yotoqKun ? `${currentSheet.yotoqKun} k` : '-'}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-base text-yellow-300 font-black">
                    {fmt(grandTotal)}
                  </td>
                </tr>

                {/* 4. Тўлади */}
                <tr className="border-b border-gray-800">
                  <td className="border-r border-gray-800 px-3 py-2 bg-emerald-50 text-emerald-950">Тўлади</td>
                  <td colSpan="2" className="p-0 bg-emerald-50">
                    <input 
                      type="number"
                      value={currentSheet.tuladi || ''}
                      onChange={e => updateSheetField('tuladi', parseInt(e.target.value) || 0)}
                      placeholder="To'langan summa..."
                      className="w-full px-3 py-2 text-right font-mono font-bold text-sm text-emerald-800 bg-transparent outline-none focus:bg-white"
                    />
                  </td>
                </tr>

                {/* 5. Қолди */}
                <tr className="bg-red-50">
                  <td className="border-r border-gray-800 px-3 py-2 text-red-900 font-bold">Қолди</td>
                  <td colSpan="2" className="px-3 py-2 text-right font-mono font-black text-sm text-red-600">
                    {fmt(qoldi)}
                  </td>
                </tr>

              </tbody>
            </table>
          </div>

          {/* TANLANGAN DORILAR SOSTAVI (Xuddi siz aytgan sostav ko'rinishi) */}
          <div className="bg-white border border-gray-300 rounded shadow-sm p-3 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-2 pb-1 border-b border-gray-200">
              <h3 className="text-xs font-bold text-gray-800 flex items-center gap-1.5 uppercase tracking-wide">
                <FaPills className="text-[#107C41]" /> Tanlangan Sostav ({selectedDorilarList.length})
              </h3>
              <span className="text-[11px] text-gray-500">{currentSheet.sana}</span>
            </div>

            {selectedDorilarList.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-xs flex flex-col items-center justify-center">
                <FaCalculator className="text-gray-300 mb-2" size={24} />
                <p>Kataklarga sonini yozing yoki [+] bosing.</p>
                <p className="text-[11px] text-gray-400 mt-1">Dorilar sostavi shu yerda yig'iladi.</p>
              </div>
            ) : (
              <div className="overflow-y-auto space-y-1.5 pr-1" style={{ maxHeight: '280px' }}>
                {selectedDorilarList.map((item, i) => (
                  <div key={item.id} className="flex items-center justify-between text-xs p-1.5 bg-gray-50 hover:bg-gray-100 rounded border border-gray-200">
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="font-semibold text-gray-800 truncate text-[11px]">{i + 1}. {item.nom}</p>
                      <p className="text-[10px] text-gray-500 font-mono">{fmt(item.narx)} × {item.qty} dona</p>
                    </div>
                    <span className="font-mono font-bold text-emerald-800 text-xs whitespace-nowrap">
                      {fmt(item.total)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* EXCEL BOTTOM SHEET TABS (Лист1, Лист2, Лист3...) */}
      <div className="bg-[#E1DFDD] border border-gray-400 mt-2 px-2 py-1 flex items-center gap-1 rounded-b shadow-inner overflow-x-auto">
        <span className="text-[11px] font-bold text-gray-600 px-2 flex items-center gap-1">
          <MdTableChart size={14} /> Varaqlar:
        </span>

        {sheets.map(sheetName => {
          const isActive = activeSheet === sheetName;
          const count = Object.values(sheetData[sheetName]?.quantities || {}).filter(q => q > 0).length;
          
          return (
            <button
              key={sheetName}
              onClick={() => setActiveSheet(sheetName)}
              className={`px-4 py-1.5 text-xs font-bold transition-all border rounded-t flex items-center gap-1.5 ${
                isActive 
                  ? 'bg-white text-[#107C41] border-gray-400 border-b-white shadow-sm -mb-[5px] pb-2' 
                  : 'bg-[#D2D0CE] text-gray-700 border-transparent hover:bg-gray-200'
              }`}
            >
              <span>{sheetName}</span>
              {count > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#107C41] text-white text-[9px] flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
          );
        })}

        <button
          onClick={addNewSheet}
          className="w-7 h-6 flex items-center justify-center bg-[#D2D0CE] hover:bg-white text-gray-700 hover:text-emerald-800 rounded text-sm font-bold border border-gray-400 transition-all ml-1 shadow-sm"
          title="Yangi kun/varaq qo'shish"
        >
          +
        </button>
      </div>

    </div>
  );
}
