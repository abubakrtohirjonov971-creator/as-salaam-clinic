import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  MdSearch, MdAdd, MdRemove, MdDelete, MdPrint, MdFileDownload, 
  MdRefresh, MdCheckCircle, MdCalendarToday, MdPerson, MdSave,
  MdViewList, MdTableChart, MdHelpOutline, MdAddCircle, MdClose,
  MdInventory, MdAttachMoney, MdLocalHospital, MdFilterList,
  MdTrendingUp, MdReceiptLong, MdCheck
} from 'react-icons/md';
import { FaFileExcel, FaBed, FaPills, FaCalculator, FaPlusCircle, FaBoxes } from 'react-icons/fa';

// Standart dorilar bazasi
const DEFAULT_DORILAR = [
  { id: 1,   nom: 'Живокост Бальзам',                         narx: 100800, stock: 45, category: 'Surma' },
  { id: 2,   nom: 'Aloe',                                      narx: 2310,   stock: 120, category: 'Ampula' },
  { id: 3,   nom: 'NaHCO3 dentafile',                          narx: 5320,   stock: 80,  category: 'Eritma' },
  { id: 4,   nom: 'Актовегин 10 мл №5',                        narx: 76160,  stock: 25,  category: 'Ampula', highlight: 'red' },
  { id: 5,   nom: 'Амброксол р-р д/ин. 7,5мг/2мл №5 (Амбро)', narx: 6249.6,stock: 60,  category: 'Eritma' },
  { id: 6,   nom: 'Аналгин',                                   narx: 1568,   stock: 200, category: 'Ampula' },
  { id: 7,   nom: 'Артоксан',                                  narx: 56000,  stock: 30,  category: 'Inyeksiya' },
  { id: 8,   nom: 'Аскорбинова к-та 5% 2мл №10 (Далхим )',      narx: 1278.2, stock: 150, category: 'Vitamin' },
  { id: 9,   nom: 'Атф 1 мл №10',                             narx: 23520,  stock: 40,  category: 'Ampula' },
  { id: 10,  nom: 'Ацц инжект 300 мг/3мл №10',                narx: 18410,  stock: 50,  category: 'Ampula' },
  { id: 11,  nom: 'Бабочка',                                   narx: 1680,   stock: 300, category: 'Sarf' },
  { id: 12,  nom: 'Бинт',                                      narx: 3500,   stock: 180, category: 'Sarf' },
  { id: 13,  nom: 'Бисентол 480',                              narx: 16464,  stock: 35,  category: 'Tabletka', highlight: 'red' },
  { id: 14,  nom: 'Боралгин',                                  narx: 3248,   stock: 90,  category: 'Ampula' },
  { id: 15,  nom: 'Вазопро р-р 0,5г/5мл №10',                 narx: 19600,  stock: 45,  category: 'Eritma' },
  { id: 16,  nom: 'ВИТ Б комплекс',                           narx: 17920,  stock: 75,  category: 'Vitamin' },
  { id: 17,  nom: 'ВИТ Б1 1 мл р-р (Тиамин)',                 narx: 840,    stock: 140, category: 'Vitamin' },
  { id: 18,  nom: 'Вит б6 1мл р-р (Пиродаксин)',              narx: 980,    stock: 130, category: 'Vitamin' },
  { id: 19,  nom: 'Вит B12 р-р д/ин 500мкг 1мл №5',           narx: 644,    stock: 110, category: 'Vitamin' },
  { id: 20,  nom: 'Вито-Д амп. 200000МЕ/мл 1мл №1',          narx: 136750, stock: 20,  category: 'Vitamin' },
  { id: 21,  nom: 'Гембаг р-р д/приёма внутрь 100мг/5мл №20', narx: 205800, stock: 15,  category: 'Ichimlik' },
  { id: 22,  nom: 'Гепарин',                                   narx: 54040,  stock: 40,  category: 'Ampula' },
  { id: 23,  nom: 'Гептрал 500мг амп №5',                     narx: 122920, stock: 22,  category: 'Ampula' },
  { id: 24,  nom: 'Гиалган',                                   narx: 650000, stock: 10,  category: 'Inyeksiya' },
  { id: 25,  nom: 'Гидрокортизона ацетат сусп 2,5% 2мл №10',  narx: 8400,   stock: 65,  category: 'Gormon' },
  { id: 26,  nom: 'Глиатилин 1000 мг 4мл №3',                 narx: 118720, stock: 28,  category: 'Nootrop' },
  { id: 27,  nom: 'Глюкоза DF амп. 40% 10мл №10',             narx: 365.4,  stock: 250, category: 'Ampula' },
  { id: 28,  nom: 'Глюкоза р-р д/инф 10% 200мл',              narx: 8450.4, stock: 95,  category: 'Flakon' },
  { id: 29,  nom: 'Глютион 600',                               narx: 61600,  stock: 35,  category: 'Inyeksiya' },
  { id: 30,  nom: 'Гэк 200 р-р 6% 250 мл',                    narx: 56280,  stock: 40,  category: 'Flakon', highlight: 'red' },
  { id: 31,  nom: 'Декасан р-р 400мл',                        narx: 129360, stock: 18,  category: 'Flakon' },
  { id: 32,  nom: 'Дексаметазон-Эллара амп. 4мг/мл 1мл №10',  narx: 1400,   stock: 180, category: 'Gormon' },
  { id: 33,  nom: 'Дематон Д',                                 narx: 122215, stock: 16,  category: 'Ampula' },
  { id: 34,  nom: 'Диалипон р-р 3% 20мл',                     narx: 37520,  stock: 50,  category: 'Eritma' },
  { id: 35,  nom: 'Диалипон турбо р-р д/инф 1.2% 50мл №10',   narx: 56000,  stock: 32,  category: 'Flakon' },
  { id: 36,  nom: 'ДИБАЗОЛ 1% 2МЛ №50 (МЕРИМЕД)',             narx: 1178.8, stock: 120, category: 'Ampula' },
  { id: 37,  nom: 'Диклофенак натрия амп. 25мг/3мл №10',      narx: 1680,   stock: 210, category: 'Ampula' },
  { id: 38,  nom: 'Димедрол',                                  narx: 508.2,  stock: 190, category: 'Ampula' },
  { id: 39,  nom: 'Димексид-жфф 50мл',                        narx: 26320,  stock: 55,  category: 'Flakon' },
  { id: 40,  nom: 'Динапар №5',                               narx: 14518,  stock: 40,  category: 'Ampula' },
  { id: 41,  nom: 'Динар',                                     narx: 18760,  stock: 35,  category: 'Ampula' },
  { id: 42,  nom: 'Диоксидин 1% 10 мл амп №10',               narx: 10080,  stock: 70,  category: 'Ampula' },
  { id: 43,  nom: 'Изо-мик',                                   narx: 110600, stock: 12,  category: 'Yurak' },
  { id: 44,  nom: 'Интрафен',                                  narx: 64400,  stock: 28,  category: 'Flakon', highlight: 'red' },
  { id: 45,  nom: 'Инфулган р-р д/инф. 10мг/мл 100мл',        narx: 57638,  stock: 44,  category: 'Flakon' },
  { id: 46,  nom: 'Йод 20мл',                                  narx: 4480,   stock: 150, category: 'Sarf' },
  { id: 47,  nom: 'Кавинтон р-р д/ин. 10мг 2мл №10',          narx: 8370.6, stock: 85,  category: 'Ampula' },
  { id: 48,  nom: 'Кавинтон р-р д/ин. 25мг 5мл №10',          narx: 9800,   stock: 75,  category: 'Ampula' },
  { id: 49,  nom: 'Калия хлорид амп 4% 10мл №10',             narx: 1680,   stock: 140, category: 'Ampula' },
  { id: 50,  nom: 'Кальций глюконат 10% 10мл №10',            narx: 4984,   stock: 160, category: 'Ampula' },
  { id: 51,  nom: 'Кейвер р-р 50 мг/2мг 2мл №10',             narx: 12600,  stock: 55,  category: 'Ampula' },
  { id: 52,  nom: 'Кеналог 40мг/1мл №5',                      narx: 35000,  stock: 30,  category: 'Inyeksiya' },
  { id: 53,  nom: 'Кетап 25 мг таблетка',                     narx: 4130,   stock: 90,  category: 'Tabletka' },
  { id: 54,  nom: 'Кетонал р-р д/ин 100мг/2мл 2мл №10',       narx: 10500,  stock: 80,  category: 'Ampula' },
  { id: 55,  nom: 'Кеторол р-р д/ин. 30мг/1мл 1мл №50',       narx: 6076,   stock: 110, category: 'Ampula' },
  { id: 56,  nom: 'Клинг энема',                               narx: 14000,  stock: 45,  category: 'Sarf' },
  { id: 57,  nom: 'Кокарбоксилаза 50 мг (ккб)',               narx: 6720,   stock: 65,  category: 'Ampula' },
  { id: 58,  nom: 'Компрес',                                   narx: 10000.2,stock: 70,  category: 'Sarf' },
  { id: 59,  nom: 'Компресс суви',                             narx: 100800, stock: 25,  category: 'Suyuqlik' },
  { id: 60,  nom: 'Конвулекс р-р 100мг/мл д/ин. 5мл №5',      narx: 79856,  stock: 20,  category: 'Ampula' },
  { id: 61,  nom: 'Кофеин 1мл №10',                           narx: 2660,   stock: 95,  category: 'Ampula' },
  { id: 62,  nom: 'Ксилат р-р 200мл',                         narx: 82600,  stock: 50,  category: 'Flakon' },
  { id: 63,  nom: 'Ксилат р-р 400 мл',                        narx: 91000,  stock: 42,  category: 'Flakon' },
  { id: 64,  nom: 'Лартен 200 мл',                             narx: 62440,  stock: 38,  category: 'Flakon' },
  { id: 65,  nom: 'Левокарнитин 5мл(Элькар-Левонил)',         narx: 36400,  stock: 45,  category: 'Eritma' },
  { id: 66,  nom: 'Левомеколь мазь 40г',                      narx: 21109.2,stock: 60,  category: 'Surma' },
  { id: 67,  nom: 'Левофлоксоцин DF р-р д/инф. 5мг/мл 100мл', narx: 8120,   stock: 80,  category: 'Flakon' },
  { id: 68,  nom: 'Лейкопластырь "Мультипласт" 2х500см',       narx: 7700,   stock: 130, category: 'Sarf' },
  { id: 69,  nom: 'Лидаза 1280 ед №10',                       narx: 21980,  stock: 50,  category: 'Ampula' },
  { id: 70,  nom: 'Лидокаин 2 мл № 10',                       narx: 485.8,  stock: 240, category: 'Anestetik' },
  { id: 71,  nom: 'Линкомицин р-р д/ин. 300мг/мл 1мл №10',    narx: 1680,   stock: 90,  category: 'Antibiotik' },
  { id: 72,  nom: 'Магния сульфат амп. 25% 5мл №10',          narx: 1156.4, stock: 180, category: 'Ampula' },
  { id: 73,  nom: 'Малхам',                                    narx: 30800,  stock: 40,  category: 'Surma' },
  { id: 74,  nom: 'Мансур р-р д/инф. 15% 200мл',              narx: 25510,  stock: 50,  category: 'Flakon' },
  { id: 75,  nom: 'Натрия гидрокарбонат р-р д/инф 40мг/мл',   narx: 29400,  stock: 65,  category: 'Flakon' },
  { id: 76,  nom: 'Натрия хлорид амп. 0,9% 5мл №10',          narx: 494.2,  stock: 350, category: 'Ampula' },
  { id: 77,  nom: 'Натрия хлорид р-р 0,9% 100мл',             narx: 2870,   stock: 220, category: 'Flakon' },
  { id: 78,  nom: 'Натрия хлорид р-р 0,9% 200мл',             narx: 3220,   stock: 200, category: 'Flakon' },
  { id: 79,  nom: 'Никотиновая кислота амп. 1% 1мл №10',       narx: 546,    stock: 140, category: 'Vitamin' },
  { id: 80,  nom: 'Новокаин амп. 0,2% 2мл №10',               narx: 609,    stock: 190, category: 'Anestetik' },
  { id: 81,  nom: 'Новокаин амп. 0,5% 5мл №10',               narx: 438.2,  stock: 180, category: 'Anestetik' },
  { id: 82,  nom: 'НОЛПАЗА ПОР.40МГ ФЛАКОН №1',               narx: 59500,  stock: 35,  category: 'Flakon' },
  { id: 83,  nom: 'Нош-па 20 мг Амп 2мл №5',                  narx: 6524,   stock: 120, category: 'Spazmolitik' },
  { id: 84,  nom: 'Нулео цмф №3',                             narx: 37800,  stock: 25,  category: 'Ampula' },
  { id: 85,  nom: 'Осетрон р-р. д/ин 8мг/4мл №5',             narx: 29120,  stock: 40,  category: 'Ampula' },
  { id: 86,  nom: 'Панангин',                                  narx: 16800,  stock: 80,  category: 'Ampula', highlight: 'red' },
  { id: 87,  nom: 'Папаверина гидрохлорид 2% 2мл №10',        narx: 1043,   stock: 130, category: 'Spazmolitik' },
  { id: 88,  nom: 'Пахта , спирт',                             narx: 10500,  stock: 200, category: 'Sarf', highlight: 'yellow' },
  { id: 89,  nom: 'Перекись водорода 3% 100мл',                narx: 2100,   stock: 150, category: 'Antiseptik' },
  { id: 90,  nom: 'Перчатка нестерил №100 медпро',             narx: 48816.6,stock: 45,  category: 'Sarf' },
  { id: 91,  nom: 'Перчатки стер. хир. кауч. латекс',         narx: 3253.6, stock: 110, category: 'Sarf' },
  { id: 92,  nom: 'Пиколакс таб',                              narx: 1680,   stock: 80,  category: 'Tabletka' },
  { id: 93,  nom: 'Пирацетам ДХФ р-р 200мг/5мл №10',          narx: 1848,   stock: 140, category: 'Nootrop' },
  { id: 94,  nom: 'Платифиллин амп 0,2% 1мл №10',              narx: 2240,   stock: 90,  category: 'Ampula' },
  { id: 95,  nom: 'Преднизолон р-р д/ин. 30мг/мл 1мл №10',    narx: 3850,   stock: 120, category: 'Gormon' },
  { id: 96,  nom: 'Прозерин 1мл №10',                         narx: 1260,   stock: 85,  category: 'Ampula' },
  { id: 97,  nom: 'Реосорбилакт р-р д/инф. 200мл',            narx: 79800,  stock: 65,  category: 'Flakon' },
  { id: 98,  nom: 'Реосорбилакт р-р д/инф. 400мл',            narx: 93800,  stock: 45,  category: 'Flakon' },
  { id: 99,  nom: 'Реосорведол р-р д/инф. 200мл',             narx: 11006.8,stock: 50,  category: 'Flakon' },
  { id: 100, nom: 'Ретоболил',                                 narx: 399999, stock: 12,  category: 'Inyeksiya' },
  { id: 101, nom: 'Рибоксин амп. 2% 10мл №10',                narx: 812,    stock: 160, category: 'Ampula' },
  { id: 102, nom: 'Рингер 200 мл',                             narx: 4929.4, stock: 180, category: 'Flakon' },
  { id: 103, nom: 'Ротавит кальций',                           narx: 65800,  stock: 35,  category: 'Vitamin' },
  { id: 104, nom: 'Ротадон Адванс р-р д/ин. 200мг/2мл №10',   narx: 19320,  stock: 45,  category: 'Ampula', highlight: 'red' },
  { id: 105, nom: 'Румалон 1мл',                               narx: 32648,  stock: 40,  category: 'Ampula' },
  { id: 106, nom: 'Саргин 100мл №1',                          narx: 85400,  stock: 30,  category: 'Flakon' },
  { id: 107, nom: 'Сенадесин',                                  narx: 700,    stock: 150, category: 'Tabletka' },
  { id: 108, nom: 'Серомин р-р 200мл',                        narx: 100380, stock: 25,  category: 'Flakon' },
  { id: 109, nom: 'Серомин 100 мл',                           narx: 81760,  stock: 30,  category: 'Flakon' },
  { id: 110, nom: 'Синафлан мазь',                             narx: 7000,   stock: 75,  category: 'Surma' },
  { id: 111, nom: 'Система инфузионная WEGO №1',               narx: 3276,   stock: 300, category: 'Sarf' },
  { id: 112, nom: 'Сода-Буфер 42мг/200 мл',                   narx: 53200,  stock: 45,  category: 'Flakon', highlight: 'red' },
  { id: 113, nom: 'Спазмалгон 5мл №5',                        narx: 10640,  stock: 85,  category: 'Ampula' },
  { id: 114, nom: 'Спинал игла',                               narx: 23800,  stock: 60,  category: 'Sarf' },
  { id: 115, nom: 'Стерил салфетка катта',                     narx: 5367.6, stock: 140, category: 'Sarf' },
  { id: 116, nom: 'Стерил салфетка кичкина',                   narx: 3290,   stock: 160, category: 'Sarf' },
  { id: 117, nom: 'Супрастин 20мг/мл р-р для ин. 1мл №5',     narx: 10920,  stock: 95,  category: 'Antiallergik' },
  { id: 118, nom: 'Тиотриазолин амп. 4мл №10',                narx: 19600,  stock: 50,  category: 'Ampula' },
  { id: 119, nom: 'Тиоцетам 10 мл',                           narx: 10290,  stock: 60,  category: 'Ampula' },
  { id: 120, nom: 'Толкимадо 1 мл №5',                        narx: 15218,  stock: 40,  category: 'Ampula' },
  { id: 121, nom: 'Торсид амп. 4мл №5',                       narx: 20300,  stock: 55,  category: 'Diuretik' },
  { id: 122, nom: 'Трентал',                                   narx: 1097.6, stock: 110, category: 'Ampula' },
  { id: 123, nom: 'Укол хизмати',                             narx: 25200,  stock: 999, category: 'Xizmat', highlight: 'yellow' },
  { id: 124, nom: 'ФДП порошок 5гр №1',                       narx: 232400, stock: 18,  category: 'Flakon' },
  { id: 125, nom: 'Феррофер 5мл №5',                          narx: 84000,  stock: 35,  category: 'Ampula' },
  { id: 126, nom: 'Флуконазол 100 мл',                        narx: 7000,   stock: 90,  category: 'Flakon' },
  { id: 127, nom: 'Форкал плюс таб №100 (1 донаси )',          narx: 1920.8, stock: 150, category: 'Tabletka' },
  { id: 128, nom: 'Фуросемид амп 2мл №10',                    narx: 1820,   stock: 140, category: 'Diuretik' },
  { id: 129, nom: 'Церуглан',                                  narx: 672,    stock: 160, category: 'Ampula' },
  { id: 130, nom: 'Цефазолин пор. д/пр. р-ра д/ин. 1г №50',   narx: 8904,   stock: 120, category: 'Antibiotik' },
  { id: 131, nom: 'Цефаперазол сульбактам (Никазон-с)',        narx: 22960,  stock: 65,  category: 'Antibiotik' },
  { id: 132, nom: 'Цефтриаксон пор. 1г №50',                  narx: 6650,   stock: 130, category: 'Antibiotik' },
  { id: 133, nom: 'Цитиколин Ромфарм р-р. д/ин 1000мг/4мл №5', narx: 47600,  stock: 45,  category: 'Nootrop' },
  { id: 134, nom: 'Цитофлавин',                               narx: 37100,  stock: 55,  category: 'Flakon', highlight: 'red' },
  { id: 135, nom: 'Шприц 10 мл',                              narx: 635.6,  stock: 500, category: 'Sarf' },
  { id: 136, nom: 'Шприц 1мл',                                narx: 560,    stock: 450, category: 'Sarf' },
  { id: 137, nom: 'Шприц 20 мл',                              narx: 1288,   stock: 400, category: 'Sarf' },
  { id: 138, nom: 'Шприц 2мл',                                narx: 463.4,  stock: 600, category: 'Sarf' },
  { id: 139, nom: 'Шприц 5 мл',                               narx: 515.2,  stock: 550, category: 'Sarf' },
  { id: 140, nom: 'Шприц 50 мл',                              narx: 7070,   stock: 120, category: 'Sarf' },
  { id: 141, nom: 'Эллезиум р-р. д/ин. 1,0мг/5мл 5мл №10',   narx: 26040,  stock: 35,  category: 'Ampula' },
  { id: 142, nom: 'Эссенциале Н р-р д/ин. 250мг/5мл 5мл №5',  narx: 54544,  stock: 40,  category: 'Ampula' },
  { id: 143, nom: 'Эуфиллин амп 2,4% 5мл №10',               narx: 1579.2, stock: 120, category: 'Ampula' },
];

const YOTOQ_NARXI = 220000;
const fmt = (n) => (Math.round(n || 0)).toLocaleString('uz-UZ');
const todayStr = () => new Date().toISOString().split('T')[0];

export default function AdminPharmacy() {
  // LocalStorage dan dorilar ro'yxatini yuklash yoki default qo'yish
  const [dorilar, setDorilar] = useState(() => {
    try {
      const saved = localStorage.getItem('assalam_dorilar_list');
      return saved ? JSON.parse(saved) : DEFAULT_DORILAR;
    } catch {
      return DEFAULT_DORILAR;
    }
  });

  const [activeSheet, setActiveSheet] = useState('Лист1');
  const [sheets, setSheets] = useState(['Лист1', 'Лист2', 'Лист3']);
  
  const [sheetData, setSheetData] = useState({
    'Лист1': { quantities: {}, bemor: '', sana: todayStr(), yotoqKun: 0, tuladi: 0 },
    'Лист2': { quantities: {}, bemor: '', sana: todayStr(), yotoqKun: 0, tuladi: 0 },
    'Лист3': { quantities: {}, bemor: '', sana: todayStr(), yotoqKun: 0, tuladi: 0 }
  });

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Barchasi');
  const [onlySelected, setOnlySelected] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Yangi dori qo'shish formasi
  const [newDrug, setNewDrug] = useState({
    nom: '',
    narx: '',
    stock: 50,
    category: 'Ampula'
  });

  const inputRefs = useRef({});

  // Dorilar o'zgarganda LocalStorage ga yozish
  useEffect(() => {
    localStorage.setItem('assalam_dorilar_list', JSON.stringify(dorilar));
  }, [dorilar]);

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

  // Yangi dori qo'shish
  const handleAddDrug = (e) => {
    e.preventDefault();
    if (!newDrug.nom.trim() || !newDrug.narx) return;

    const newId = dorilar.length > 0 ? Math.max(...dorilar.map(d => d.id)) + 1 : 1;
    const added = {
      id: newId,
      nom: newDrug.nom.trim(),
      narx: parseFloat(newDrug.narx),
      stock: parseInt(newDrug.stock) || 50,
      category: newDrug.category || 'Boshqa'
    };

    setDorilar([added, ...dorilar]);
    setNewDrug({ nom: '', narx: '', stock: 50, category: 'Ampula' });
    setIsAddModalOpen(false);
  };

  // Varaq qo'shish
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

  // Enter/ArrowDown bilan navigatsiya
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

  // Kategoriyalar
  const categories = useMemo(() => {
    const list = new Set(dorilar.map(d => d.category || 'Boshqa'));
    return ['Barchasi', ...Array.from(list)];
  }, [dorilar]);

  // Hisob-kitoblar
  const dorilarJami = useMemo(() => {
    return dorilar.reduce((sum, dori) => {
      const qty = currentQuantities[dori.id] || 0;
      return sum + (dori.narx * qty);
    }, 0);
  }, [dorilar, currentQuantities]);

  const yotoqJami = (currentSheet.yotoqKun || 0) * YOTOQ_NARXI;
  const grandTotal = dorilarJami + yotoqJami;
  const qoldi = grandTotal - (currentSheet.tuladi || 0);

  // Tanlangan dorilar (sostav)
  const selectedDorilarList = useMemo(() => {
    return dorilar
      .filter(d => (currentQuantities[d.id] || 0) > 0)
      .map(d => ({
        ...d,
        qty: currentQuantities[d.id],
        total: d.narx * currentQuantities[d.id],
        remainingStock: Math.max(0, (d.stock || 50) - (currentQuantities[d.id] || 0))
      }));
  }, [dorilar, currentQuantities]);

  // Qidiruv va filtr
  const filteredDorilar = useMemo(() => {
    return dorilar.filter(dori => {
      const matchesSearch = dori.nom.toLowerCase().includes(search.toLowerCase()) || dori.id.toString() === search;
      const matchesCat = selectedCategory === 'Barchasi' || dori.category === selectedCategory;
      if (onlySelected) {
        return matchesSearch && matchesCat && (currentQuantities[dori.id] || 0) > 0;
      }
      return matchesSearch && matchesCat;
    });
  }, [dorilar, search, selectedCategory, onlySelected, currentQuantities]);

  return (
    <div className="p-4 md:p-6 bg-[#F8FAFC] min-h-screen font-sans text-slate-800">
      
      {/* ── TOP STATS BAR (PREMIUM SAAS DASHBOARD CARDS) ────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-5">
        
        {/* Card 1: Jami dorilar bazada */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <FaBoxes size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Dorilar Bazasi</p>
            <p className="text-xl font-extrabold text-slate-800">{dorilar.length} <span className="text-xs font-medium text-slate-400">tur</span></p>
          </div>
        </div>

        {/* Card 2: Tanlangan dorilar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <FaPills size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tanlangan Sostav</p>
            <p className="text-xl font-extrabold text-emerald-600">{selectedDorilarList.length} <span className="text-xs font-medium text-slate-400">ta dori</span></p>
          </div>
        </div>

        {/* Card 3: Dorilar summasi */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <MdAttachMoney size={24} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Dorilar Summasi</p>
            <p className="text-lg font-extrabold text-slate-800 truncate font-mono">{fmt(dorilarJami)} <span className="text-xs font-normal">so'm</span></p>
          </div>
        </div>

        {/* Card 4: Yotoq summasi */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <FaBed size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Yotoq ({currentSheet.yotoqKun || 0} kun)</p>
            <p className="text-lg font-extrabold text-purple-700 truncate font-mono">{fmt(yotoqJami)} <span className="text-xs font-normal">so'm</span></p>
          </div>
        </div>

        {/* Card 5: JAMI hisob */}
        <div className="col-span-2 lg:col-span-1 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-4 rounded-2xl shadow-md border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-blue-300 uppercase tracking-wider">Umumiy Jami</p>
            <p className="text-xl font-black text-amber-300 font-mono leading-tight">{fmt(grandTotal)}</p>
            <p className="text-[10px] text-slate-300">Qoldiq: <b className={qoldi > 0 ? 'text-red-400' : 'text-emerald-400'}>{fmt(qoldi)}</b></p>
          </div>
          <button 
            onClick={() => setIsReceiptModalOpen(true)}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all shadow"
            title="Chek ko'rish"
          >
            <MdReceiptLong size={18} />
          </button>
        </div>

      </div>

      {/* ── EXCEL HEADER BAR (PREMIUM GREEN TOOLBAR) ────────────────────── */}
      <div className="bg-gradient-to-r from-[#107C41] via-[#0E6C38] to-[#0B5A2E] text-white px-5 py-3 rounded-t-2xl shadow-sm flex flex-wrap items-center justify-between gap-3 border border-emerald-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/15 rounded-xl backdrop-blur-sm shadow-inner">
            <FaFileExcel size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm md:text-base font-bold tracking-wide flex items-center gap-2">
              As-salaam_Dori_va_Hisob_Kalkulyatori.xlsx
              <span className="text-[10px] font-bold bg-emerald-400/25 text-emerald-100 border border-emerald-300/30 px-2 py-0.5 rounded-full uppercase">
                Smart Excel
              </span>
            </h1>
            <p className="text-[11px] text-emerald-100/80">Real-vaqtda ombor qoldig'i, soni va yotoq hisobi</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
          >
            <MdAddCircle size={16} /> Yangi Dori Qo'shish
          </button>

          <button 
            onClick={() => setIsReceiptModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
          >
            <MdPrint size={16} /> Chek / Chop etish
          </button>
        </div>
      </div>

      {/* ── FILTER & PATIENT CONTROLS ───────────────────────────────────── */}
      <div className="bg-white border-x border-b border-slate-200 p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        
        {/* Search input */}
        <div className="flex items-center gap-2 flex-1 min-w-[260px] max-w-md">
          <div className="relative w-full">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Dori nomi yoki № bo'yicha qidiruv..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition-all font-medium"
            />
          </div>
        </div>

        {/* Category badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {categories.slice(0, 7).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat 
                  ? 'bg-emerald-700 text-white font-semibold shadow-sm' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
          
          <button
            onClick={() => setOnlySelected(!onlySelected)}
            className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
              onlySelected 
                ? 'bg-blue-600 text-white border-blue-700 shadow-sm' 
                : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
            }`}
          >
            Faqat tanlanganlar ({selectedDorilarList.length})
          </button>
        </div>

        {/* Patient and Date */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus-within:bg-white focus-within:border-emerald-600 transition-all">
            <MdPerson className="text-slate-400 mr-1.5" size={16} />
            <input 
              type="text"
              value={currentSheet.bemor}
              onChange={e => updateSheetField('bemor', e.target.value)}
              placeholder="Bemor F.I.SH."
              className="bg-transparent text-xs text-slate-800 outline-none w-32 font-semibold"
            />
          </div>

          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus-within:bg-white focus-within:border-emerald-600 transition-all">
            <MdCalendarToday className="text-slate-400 mr-1.5" size={15} />
            <input 
              type="date"
              value={currentSheet.sana}
              onChange={e => updateSheetField('sana', e.target.value)}
              className="bg-transparent text-xs text-slate-800 outline-none font-medium"
            />
          </div>
        </div>
      </div>

      {/* ── MAIN WORKSPACE (TABLE + CALCULATION PANEL) ───────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 mt-3">
        
        {/* TABLE SECTION (8.5 COLS) */}
        <div className="xl:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col" style={{ maxHeight: '72vh' }}>
          
          <div className="overflow-auto flex-1 select-none">
            <table className="w-full text-xs border-collapse">
              <thead className="sticky top-0 bg-slate-100 text-slate-700 font-bold border-b border-slate-300 z-10 shadow-sm font-sans">
                <tr>
                  <th className="border border-slate-200 px-2.5 py-2.5 w-12 text-center bg-slate-200/70">№</th>
                  <th className="border border-slate-200 px-3.5 py-2.5 text-left">Дорилар номи</th>
                  <th className="border border-slate-200 px-3 py-2.5 text-center w-28">Ombor (Qoldiq)</th>
                  <th className="border border-slate-200 px-3.5 py-2.5 text-right w-32">Нархи</th>
                  <th className="border border-slate-200 px-2.5 py-2.5 text-center w-32 bg-amber-100/70 text-amber-950">Сони [+/-]</th>
                  <th className="border border-slate-200 px-3.5 py-2.5 text-right w-36">Сумма</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {filteredDorilar.map((dori, idx) => {
                  const qty = currentQuantities[dori.id] || 0;
                  const rowSum = dori.narx * qty;
                  const isSelected = qty > 0;
                  const remainingStock = Math.max(0, (dori.stock || 50) - qty);

                  let rowBgClass = 'hover:bg-slate-50 transition-colors';
                  let nameStyle = 'text-slate-800 font-medium font-sans';
                  let priceStyle = 'text-red-600 font-bold';

                  if (dori.highlight === 'red') {
                    nameStyle = 'bg-red-500 text-white font-bold font-sans px-2 py-0.5 rounded shadow-sm inline-block';
                  } else if (dori.highlight === 'yellow') {
                    nameStyle = 'bg-amber-300 text-amber-950 font-bold font-sans px-2 py-0.5 rounded shadow-sm inline-block';
                  }

                  if (isSelected) {
                    rowBgClass = 'bg-emerald-50/70 hover:bg-emerald-100/70 font-semibold';
                  }

                  return (
                    <tr key={dori.id} className={`border-b border-slate-200 ${rowBgClass}`}>
                      
                      {/* № */}
                      <td className="border border-slate-200 px-2 py-1.5 text-center bg-slate-50 text-slate-500 text-[11px] font-sans">
                        {dori.id}
                      </td>

                      {/* Dori nomi */}
                      <td className="border border-slate-200 px-3 py-1.5">
                        <span className={nameStyle}>{dori.nom}</span>
                        {dori.category && (
                          <span className="ml-2 text-[10px] text-slate-400 font-sans">({dori.category})</span>
                        )}
                      </td>

                      {/* Ombordagi Qoldiq */}
                      <td className="border border-slate-200 px-2 py-1.5 text-center font-sans">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          remainingStock <= 5 
                            ? 'bg-red-100 text-red-700 animate-pulse' 
                            : remainingStock <= 15 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {remainingStock} ta qoldi
                        </span>
                      </td>

                      {/* Sotilish narxi */}
                      <td className={`border border-slate-200 px-3 py-1.5 text-right ${priceStyle}`}>
                        {dori.narx > 0 ? fmt(dori.narx) : '0'}
                      </td>

                      {/* Soni (Katakka yozish + Enter/Arrow navigatsiyasi) */}
                      <td className={`border border-slate-200 p-0 text-center relative ${qty === 0 ? 'bg-[#990000] text-white' : 'bg-[#107C41] text-white'}`}>
                        <div className="flex items-center justify-between h-full px-1.5 py-1">
                          
                          {/* Minus button */}
                          <button
                            type="button"
                            onClick={() => decrementQty(dori.id)}
                            className="w-5 h-5 flex items-center justify-center text-white/90 hover:text-white hover:bg-black/20 rounded text-xs font-black transition-all active:scale-90"
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
                            className="w-12 text-center bg-transparent text-white font-black text-xs outline-none focus:bg-white focus:text-slate-900 focus:ring-2 focus:ring-yellow-400 rounded py-0.5 shadow-inner"
                          />

                          {/* Plus button */}
                          <button
                            type="button"
                            onClick={() => incrementQty(dori.id)}
                            className="w-5 h-5 flex items-center justify-center text-white/90 hover:text-white hover:bg-black/20 rounded text-xs font-black transition-all active:scale-90"
                            title="Ko'paytirish"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* Summa */}
                      <td className="border border-slate-200 px-3.5 py-1.5 text-right font-black text-slate-800 bg-slate-50/50">
                        {rowSum > 0 ? fmt(rowSum) : '0'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer status bar */}
          <div className="bg-slate-50 border-t border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-600">
            <span>Ko'rsatilmoqda: <b>{filteredDorilar.length}</b> ta dori | Tanlangan: <b className="text-emerald-700">{selectedDorilarList.length}</b> ta</span>
            <span className="text-[11px] text-slate-500">💡 <b>Enter</b> yoki <b>↓</b> bosib tezda keyingi doriga o'tishingiz mumkin</span>
          </div>
        </div>

        {/* RIGHT CALCULATION & SUMMARY PANEL (4 COLS) */}
        <div className="xl:col-span-4 flex flex-col gap-3.5">
          
          {/* ASL EXCEL KVADRAT HISOB-KITOB JADVALI (PREMIUM GLASS STYLING) */}
          <div className="bg-white border-2 border-slate-900 rounded-2xl shadow-md overflow-hidden">
            <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <FaCalculator className="text-amber-400" /> Bemor Hisob-Kalkulyatori
              </span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono font-bold">{activeSheet}</span>
            </div>

            <table className="w-full text-xs border-collapse font-sans font-bold">
              <tbody>
                
                {/* 1. Дорилар */}
                <tr className="border-b border-slate-300">
                  <td className="border-r border-slate-300 px-3.5 py-2.5 bg-slate-100 text-slate-700 w-32">
                    Дорилар (жами)
                  </td>
                  <td className="border-r border-slate-300 px-2 py-2 text-center w-16 bg-slate-50 text-[10px] text-slate-400 font-mono">
                    {selectedDorilarList.length} ta
                  </td>
                  <td className="px-3.5 py-2.5 text-right text-slate-900 font-mono text-sm bg-blue-50/40">
                    {fmt(dorilarJami)} <span className="text-[10px] font-normal text-slate-500">so'm</span>
                  </td>
                </tr>

                {/* 2. Ётоқ */}
                <tr className="border-b border-slate-300">
                  <td className="border-r border-slate-300 px-3.5 py-2.5 bg-slate-100 text-slate-700">
                    Ётоқ (220 000 x kun)
                  </td>
                  <td className="border-r border-slate-300 p-0 text-center w-20 bg-amber-50">
                    <input 
                      type="number" 
                      min="0"
                      value={currentSheet.yotoqKun || ''} 
                      onChange={e => updateSheetField('yotoqKun', parseInt(e.target.value) || 0)}
                      placeholder="0 kun"
                      className="w-full text-center py-2 text-xs font-black bg-transparent outline-none focus:bg-white text-purple-900 font-mono"
                    />
                  </td>
                  <td className="px-3.5 py-2.5 text-right text-purple-900 font-mono text-sm bg-purple-50/40">
                    {fmt(yotoqJami)} <span className="text-[10px] font-normal text-slate-500">so'm</span>
                  </td>
                </tr>

                {/* 3. Жами */}
                <tr className="border-b-2 border-slate-900 bg-slate-900 text-white">
                  <td className="border-r border-slate-700 px-3.5 py-3 text-sm uppercase">ЖАМИ ТЎЛОВ</td>
                  <td className="border-r border-slate-700 px-2 py-3 text-center text-[11px] text-slate-400 font-mono">
                    {currentSheet.yotoqKun ? `${currentSheet.yotoqKun} kun` : '-'}
                  </td>
                  <td className="px-3.5 py-3 text-right font-mono text-base text-amber-300 font-black">
                    {fmt(grandTotal)} <span className="text-xs text-amber-200 font-normal">so'm</span>
                  </td>
                </tr>

                {/* 4. Тўлади */}
                <tr className="border-b border-slate-300">
                  <td className="border-r border-slate-300 px-3.5 py-2.5 bg-emerald-50 text-emerald-950">
                    Тўланди (Kassa)
                  </td>
                  <td colSpan="2" className="p-0 bg-emerald-50">
                    <input 
                      type="number"
                      value={currentSheet.tuladi || ''}
                      onChange={e => updateSheetField('tuladi', parseInt(e.target.value) || 0)}
                      placeholder="To'langan summani kiriting..."
                      className="w-full px-3.5 py-2 text-right font-mono font-black text-sm text-emerald-800 bg-transparent outline-none focus:bg-white"
                    />
                  </td>
                </tr>

                {/* 5. Қолди */}
                <tr className="bg-red-50">
                  <td className="border-r border-slate-300 px-3.5 py-2.5 text-red-900 font-black">
                    Қолди (Қарз)
                  </td>
                  <td colSpan="2" className="px-3.5 py-2.5 text-right font-mono font-black text-base text-red-600">
                    {fmt(qoldi)} <span className="text-xs font-normal">so'm</span>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>

          {/* TANLANGAN DORILAR SOSTAVI */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <h3 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
                <FaPills className="text-emerald-600" /> Tanlangan Sostav ({selectedDorilarList.length})
              </h3>
              <span className="text-[11px] font-bold text-slate-400 font-mono">{currentSheet.sana}</span>
            </div>

            {selectedDorilarList.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-xs flex flex-col items-center justify-center flex-1">
                <FaPills className="text-slate-200 mb-2.5" size={28} />
                <p className="font-semibold text-slate-600">Hozircha dori tanlanmadi</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs">Jadvaldagi katakka sonini yozing yoki [+] tugmasini bosing.</p>
              </div>
            ) : (
              <div className="overflow-y-auto space-y-2 pr-1 flex-1" style={{ maxHeight: '230px' }}>
                {selectedDorilarList.map((item, i) => (
                  <div key={item.id} className="flex items-center justify-between text-xs p-2 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 transition-all">
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="font-bold text-slate-800 truncate text-[11px]">{i + 1}. {item.nom}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{fmt(item.narx)} × {item.qty} dona (Qoldi: {item.remainingStock})</p>
                    </div>
                    <span className="font-mono font-black text-emerald-800 text-xs whitespace-nowrap">
                      {fmt(item.total)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ── EXCEL BOTTOM SHEET TABS (Лист1, Лист2, Лист3...) ─────────────── */}
      <div className="bg-slate-200 border border-slate-300 mt-3 px-3 py-1.5 flex items-center gap-1.5 rounded-2xl shadow-inner overflow-x-auto">
        <span className="text-[11px] font-bold text-slate-600 px-2 flex items-center gap-1">
          <MdTableChart size={15} /> Varaqlar (Kunlar):
        </span>

        {sheets.map(sheetName => {
          const isActive = activeSheet === sheetName;
          const count = Object.values(sheetData[sheetName]?.quantities || {}).filter(q => q > 0).length;
          
          return (
            <button
              key={sheetName}
              onClick={() => setActiveSheet(sheetName)}
              className={`px-4 py-1.5 text-xs font-bold transition-all border rounded-xl flex items-center gap-2 ${
                isActive 
                  ? 'bg-white text-emerald-800 border-slate-300 shadow-sm' 
                  : 'bg-slate-300/80 text-slate-700 border-transparent hover:bg-slate-300'
              }`}
            >
              <span>{sheetName}</span>
              {count > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-600 text-white text-[9px] font-mono">
                  {count}
                </span>
              )}
            </button>
          );
        })}

        <button
          onClick={addNewSheet}
          className="px-3 py-1.5 flex items-center gap-1 bg-white hover:bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-slate-300 shadow-sm transition-all ml-1"
          title="Yangi kun/varaq ochish"
        >
          <MdAdd size={15} /> Yangi varaq
        </button>
      </div>

      {/* ── MODAL: YANGI DORI QO'SHISH ──────────────────────────────────── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
            
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/20 rounded-xl">
                  <FaPlusCircle size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-base">Yangi Dori Qo'shish</h3>
                  <p className="text-xs text-emerald-100">Bazaga yangi dori va narx kiritish</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <MdClose size={18} />
              </button>
            </div>

            <form onSubmit={handleAddDrug} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dori nomi *</label>
                <input 
                  type="text"
                  required
                  value={newDrug.nom}
                  onChange={e => setNewDrug({ ...newDrug, nom: e.target.value })}
                  placeholder="Masalan: Актовегин 10 мл №5"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sotilish Narxi (so'm) *</label>
                  <input 
                    type="number"
                    required
                    min="0"
                    value={newDrug.narx}
                    onChange={e => setNewDrug({ ...newDrug, narx: e.target.value })}
                    placeholder="76000"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ombordagi Soni (dona)</label>
                  <input 
                    type="number"
                    min="0"
                    value={newDrug.stock}
                    onChange={e => setNewDrug({ ...newDrug, stock: e.target.value })}
                    placeholder="50"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kategoriyasi</label>
                <select
                  value={newDrug.category}
                  onChange={e => setNewDrug({ ...newDrug, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none font-medium"
                >
                  <option value="Ampula">Ampula</option>
                  <option value="Flakon">Flakon / Eritma</option>
                  <option value="Tabletka">Tabletka</option>
                  <option value="Vitamin">Vitamin</option>
                  <option value="Surma">Surma / Maz</option>
                  <option value="Sarf">Sarf material (Shprits, spirt...)</option>
                  <option value="Xizmat">Xizmat</option>
                  <option value="Boshqa">Boshqa</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-600/30 transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <MdCheck size={16} /> Bazaga Qo'shish
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ── MODAL: CHEK CHIQARISH / CHOP ETISH ──────────────────────────── */}
      {isReceiptModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100">
            
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <MdReceiptLong className="text-emerald-600" size={20} /> Bemor Hisob Cheki
              </h3>
              <button 
                onClick={() => setIsReceiptModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center"
              >
                <MdClose size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 font-mono text-xs">
              <div className="text-center pb-3 border-b border-dashed border-slate-300 font-sans">
                <h4 className="font-extrabold text-sm text-slate-900">AS-SALAAM CLINIC</h4>
                <p className="text-[11px] text-slate-500">Andijon sh., Shifoxona hisob-fakturasi</p>
                <p className="text-[10px] text-slate-400 mt-1">Sana: {currentSheet.sana} | Bemor: <b>{currentSheet.bemor || 'Noma\'lum'}</b></p>
              </div>

              {/* Items */}
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {selectedDorilarList.map((item, i) => (
                  <div key={item.id} className="flex justify-between py-1 border-b border-slate-100">
                    <span className="flex-1 pr-2 truncate">{i + 1}. {item.nom} ({item.qty} dona)</span>
                    <span className="font-bold">{fmt(item.total)}</span>
                  </div>
                ))}
                {currentSheet.yotoqKun > 0 && (
                  <div className="flex justify-between py-1 border-b border-slate-100 text-purple-700 font-bold">
                    <span>Yotoq ({currentSheet.yotoqKun} kun)</span>
                    <span>{fmt(yotoqJami)}</span>
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="pt-2 border-t-2 border-slate-900 space-y-1 font-bold text-sm">
                <div className="flex justify-between">
                  <span>JAMI:</span>
                  <span className="text-emerald-700">{fmt(grandTotal)} so'm</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>To'landi:</span>
                  <span>{fmt(currentSheet.tuladi || 0)} so'm</span>
                </div>
                <div className="flex justify-between text-xs text-red-600 font-black">
                  <span>Qoldiq:</span>
                  <span>{fmt(qoldi)} so'm</span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 font-sans">
                <button
                  onClick={() => setIsReceiptModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Yopish
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow flex items-center gap-1.5"
                >
                  <MdPrint size={16} /> Chop etish
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
