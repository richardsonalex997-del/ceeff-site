const projectsContent = {
  projects: [
    {
      id: 'nizhny-novgorod-metro',
      slug: 'metro',
      title: 'Нижегородское метро',
      category: 'Электролаборатория',
      description:
        'Комплексные испытания электрооборудования метрополитена, проверка РЗА.',
      images: ['/media/projects/metro/metro-1.jpg', '/media/projects/metro/metro-2.jpg'],
    },
    {
      id: 'rostelecom-data-center',
      slug: 'rostelecom-cod',
      title: 'ЦОД Ростелеком',
      category: 'Монтаж и наладка',
      description:
        'Монтаж систем электроснабжения, РЗА и АВР для центра обработки данных.',
      images: [
        '/media/projects/rostelecom-cod/rostelecom-1.jpg',
        '/media/projects/rostelecom-cod/rostelecom-2.jpg',
        '/media/projects/rostelecom-cod/rostelecom-3.jpg',
        '/media/projects/rostelecom-cod/rostelecom-4.jpg',
      ],
    },
    {
      id: 'data-center-structured-cabling',
      slug: 'data-center',
      title: 'Центр обработки данных',
      category: 'Структурированные кабельные системы',
      description:
        'Строительство структурированных кабельных систем для центра обработки данных с монтажом и организацией кабельной инфраструктуры.',
      images: [
        '/media/projects/data-center/data-center-1.jpg',
        '/media/projects/data-center/data-center-2.jpg',
        '/media/projects/data-center/data-center-3.jpg',
      ],
    },
    {
      id: 'niirt',
      slug: 'niirt',
      title: 'НИИРТ',
      category: 'Ремонт и наладка ЩСН РУ-6 кВ',
      description: 'В начале 2026 года выполнялись работы по ремонту и наладке ЩСН РУ-6 кВ.',
      images: ['/media/projects/niirt/niirt-1.jpg', '/media/projects/niirt/niirt-2.jpg'],
    },
    {
      id: 'black-stream-kstovo',
      slug: 'black-stream',
      title: 'Блек Стрим, г. Кстово',
      category: 'Монтаж, испытания и наладка БКТП',
      description:
        'Монтаж оборудования, испытания и наладка БКТП 2*1600/6/0,4кВ для участка по производству битума.',
      images: [
        '/media/projects/black-stream/black-stream-1.jpg',
        '/media/projects/black-stream/black-stream-2.jpg',
        '/media/projects/black-stream/black-stream-3.jpg',
      ],
    },
    {
      id: 'xlpe-cable-testing',
      slug: 'ispytania',
      title: 'Испытания кабеля из сшитого полиэтилена',
      category: 'Испытания кабельных линий',
      description: 'Испытания кабеля из сшитого полиэтилена.',
      images: [
        '/media/projects/ispytania/ispytania-1.jpg',
        '/media/projects/ispytania/ispytania-2.jpg',
      ],
    },
    {
      id: 'transformer-substation-maintenance',
      slug: 'tech-obslh',
      title: 'Тех обслуживание трансформаторной подстанции',
      category: 'Техническое обслуживание',
      description: 'Техническое обслуживание трансформаторной подстанции.',
      images: [
        '/media/projects/tech-obslh/tech-obslh-1.jpg',
        '/media/projects/tech-obslh/tech-obslh-2.jpg',
      ],
    },
    {
      id: 'kvantorium-school',
      slug: 'kvantorium',
      title: 'Школа Кванториум',
      category: 'Электромонтаж',
      description:
        'Проектирование и монтаж систем электроснабжения образовательного комплекса.',
      images: [
        '/media/projects/kvantorium/kvantorium-1.jpg',
        '/media/projects/kvantorium/kvantorium-2.jpg',
        '/media/projects/kvantorium/kvantorium-3.jpg',
      ],
    },
    {
      id: 'electrical-laboratory',
      slug: 'laboratory',
      title: 'Электролаборатория',
      category: 'Оборудование',
      description:
        'Оснащение собственной аккредитованной электролаборатории современным оборудованием.',
      images: [
        '/media/projects/laboratory/laboratory-1.jpg',
        '/media/projects/laboratory/laboratory-2.jpg',
      ],
    },
    {
      id: 'avtozavod-tec',
      slug: 'avtozavod-tec',
      title: 'Автозаводская ТЭЦ',
      category: 'Реконструкция',
      description:
        'Модернизация РУ-110кВ, замена высоковольтного оборудования, испытания РЗА.',
      images: [
        '/media/projects/avtozavod-tec/tec-1.jpg',
        '/media/projects/avtozavod-tec/tec-2.jpg',
        '/media/projects/avtozavod-tec/tec-3.jpg',
      ],
    },
    {
      id: 'lightning-protection-kbo',
      slug: 'lightning',
      title: 'Молниезащита КБО',
      category: 'Молниезащита',
      description:
        'Монтаж системы молниезащиты и заземления, испытания молниезащиты.',
      images: [
        '/media/projects/lightning/lightning-1.jpg',
        '/media/projects/lightning/lightning-2.jpg',
        '/media/projects/lightning/lightning-3.jpg',
      ],
    },
  ],
  featuredClient: {
    eyebrow: 'Ключевой кейс',
    title: 'ПАО Ростелеком',
    description:
      'В том числе работы на объектах ЦОД и инженерной инфраструктуры с монтажом, наладкой и испытаниями.',
  },
  clients: [
    'ПАО Ростелеком',
    'Администрация Нижнего Новгорода',
    'ООО «Дерево РУ»',
    'АО «ОКБМ им.Африкантов»',
    'АО «ЦНИИ Буревестник»',
    'АО «ПМЗ Восход»',
    'АО «НИИРТ»',
    'Kuchenland',
    'ООО «Павловоэнерго»',
    'ННДК',
    'ООО ТД АСКОНА',
    'АО «НПП ПОЛЕТ»',
    'АО «Завод Труд»',
  ],
};

export default projectsContent;
