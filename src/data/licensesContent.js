const licensesContent = {
  seoTitle: 'Лицензии и свидетельства электролаборатории | ООО ЦЭФ',
  seoDescription:
    'Официальные документы компании ЦЭФ: свидетельство о регистрации в Ростехнадзоре, сертификаты и допуски СРО.',
  pageBadge: 'Документы',
  pageTitle: 'Лицензии и сертификаты',
  pageSubtitle:
    'Все работы выполняются на основании действующих лицензий, свидетельств и допусков.',
  categories: [
    { id: 'all', label: 'Все документы' },
    { id: 'lab', label: 'Электролаборатория' },
    { id: 'construction', label: 'Строительство' },
    { id: 'design', label: 'Проектирование' },
    { id: 'quality', label: 'Качество' },
  ],
  items: [
    {
      id: 'etl-registration',
      title: 'Свидетельство о регистрации электролаборатории',
      issuer: 'Ростехнадзор',
      number: '№ ЭТЛ-1428',
      validUntil: '2027',
      image: '/media/about/etl-1428-page-1.jpg',
      category: 'lab',
    },
    {
      id: 'build-license',
      title: 'Лицензия на строительство объектов I и II уровня',
      issuer: 'Минстрой России',
      number: '№ ГС-2-000-00000',
      validUntil: '2027',
      image: '/media/licenses/build-license.jpg',
      category: 'construction',
    },
    {
      id: 'design-sro',
      title: 'Допуск СРО на проектирование',
      issuer: 'СРО "Энергопроект"',
      number: '№ СРО-П-000-0000',
      validUntil: '2026',
      image: '/media/licenses/design-sro.jpg',
      category: 'design',
    },
    {
      id: 'construction-sro',
      title: 'Допуск СРО на строительство',
      issuer: 'СРО "ЭнергоСтрой"',
      number: '№ СРО-С-000-0000',
      validUntil: '2026',
      image: '/media/licenses/construction-sro.jpg',
      category: 'construction',
    },
    {
      id: 'iso-9001',
      title: 'Сертификат ISO 9001:2015',
      issuer: 'TUV SUD',
      number: '№ ISO-9001-0000',
      validUntil: '2025',
      previewImage: '/media/licenses/iso-9001-1-thumb.jpg',
      images: [
        '/media/licenses/iso-9001-1.jpg',
        '/media/licenses/iso-9001-2.jpg',
        '/media/licenses/iso-9001-3.jpg',
      ],
      category: 'quality',
    },
    {
      id: 'lab-accreditation',
      title: 'Аттестат аккредитации лаборатории',
      issuer: 'Росаккредитация',
      number: '№ RA.RU.000000',
      validUntil: '2027',
      image: '/media/licenses/lab-accreditation.jpg',
      category: 'lab',
    },
  ],
};

export default licensesContent;
