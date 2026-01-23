export default {
  header: {
    pickRegion: "ВЫБЕРИТЕ РЕГИОН",
    regionUz: "Узбекистан",
    regionRu: "Россия",

    ariaSearch: "Поиск",
    ariaAccount: "Личный кабинет",
    ariaFavorites: "Избранное",
    ariaCart: "Корзина",
  },
  nav: {
    catalog: "Каталог",
    about: "О компании",
    news: "Новости",
    contacts: "Контакты",
    cooperation: "Сотрудничество",
    sale: "Акции",
  },

  mega: {
    bedrooms: { title: "СПАЛЬНИ" },
    living: { title: "ГОСТИНЫЕ" },
    youth: { title: "МОЛОДЕЖНЫЕ" },
    hallway: { title: "ПРИХОЖИЕ" },
    tablesChairs: { title: "СТОЛЫ И СТУЛЬЯ" },

    collections: {
      amber: "АМБЕР",
      scandi: "СКАНДИ",
      elizabeth: "ЭЛИЗАБЕТ",
      salvador: "САЛЬВАДОР",
      pitti: "ПИТТИ",
      pitti_alt: "ПАТТИ",
      buongiorno: "БОНЖОРНО",
      bergen_white: "BERGEN WHITE",
    },

    common: {
      inProgress: "В РАЗРАБОТКЕ",
    },

    preview: {
      bedrooms: {
        amber: "Спальня «АМБЕР»",
        scandi: "Спальня «СКАНДИ»",
        elizabeth: "Спальня «ЭЛИЗАБЕТ»",
        salvador: "Спальня «САЛЬВАДОР»",
        pitti: "Спальня «ПИТТИ»",
        buongiorno: "Спальня «БОНЖОРНО»",
      },
      living: {
        scandi: "Гостиная «СКАНДИ»",
        pitti: "Гостиная «ПАТТИ»",
        salvador: "Гостиная «САЛЬВАДОР»",
        bergenWhite: "Гостиная «BERGEN WHITE»",
      },
      youth: {
        scandi: "Молодежная «СКАНДИ»",
        elizabeth: "Молодежная «ЭЛИЗАБЕТ»",
      },
    },
  },

  region: {
    uz: {
      label: "Узбекистан",
      addr1: "Rich House Мирзо-Улугбека, 18",
    },
    ru: {
      label: "Россия",
      addr1: "Москва, ул. Тверская, 12",
      addr2: "Москва, Ленинградский просп., 45",
      addr3: "Санкт-Петербург, Невский пр., 28",
    },
  },
} as const;
