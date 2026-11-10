// ============================================================
//  Данные сайта FC Durum. Чтобы добавить новость, игрока или матч —
//  достаточно дописать объект в нужный массив.
// ============================================================

window.CLUB = {
  name: "FC Durum",
  tagline: "Любительская футбольная команда",
  colors: "Красно-чёрные",
  about: [
    "FC Durum — любительская футбольная команда. Мы играем ради игры, команды и побед.",
    "Основная форма клуба — красно-чёрная. На этом сайте публикуются новости команды, состав и результаты матчей.",
  ],
};

// photo: путь к фото, например "images/players/1.jpg". Если фото нет — показывается заглушка с номером.
window.PLAYERS = [
  { id: 1, number: 1,  name: "Павел Григориади",  position: "Вратарь",  photo: "images/players/1.jpg", bio: "" },
  { id: 2, number: 6,  name: "Тимур Хегай",       position: "Защитник", photo: "images/players/2.jpg", bio: "" },
  { id: 3, number: 4,  name: "Платон Бирюков",    position: "Защитник", photo: "images/players/3.jpg", bio: "" },
  { id: 4, number: 11, name: "Везир Мирзоев",     position: "Вингер",   photo: "images/players/4.jpg", bio: "" },
  { id: 5, number: 7,  name: "Дэниэль Шаламов",   position: "Вингер",   photo: "images/players/5.jpg", bio: "" },
  { id: 6, number: 10, name: "Роман Юдин",        position: "Центральный атакующий полузащитник", short: "ЦАП", photo: null, bio: "" },
];

// image: путь к картинке новости, например "images/news/2.jpg". Без картинки — фирменная обложка.
// players: id игроков, о которых новость (покажутся ссылками внизу статьи).
window.NEWS = [
  {
    id: 1,
    title: "Запущен официальный сайт FC Durum",
    excerpt: "У команды появился свой сайт: здесь будут новости клуба, состав и результаты матчей.",
    body: [
      "FC Durum открывает официальный сайт. Теперь все новости команды будут собраны в одном месте.",
      "В разделе «Состав» — игроки команды. В разделе «Матчи» будут появляться результаты и ближайшие игры.",
      "Следите за обновлениями и делитесь ссылкой с друзьями!",
    ],
    image: null,
    date: "2026-11-10T12:00:00",
    players: [],
  },
];

// status: "played" (сыгран) или "upcoming" (предстоит). score — для сыгранных, например "3:1".
window.MATCHES = [];

// Трофеи клуба
window.TROPHIES = [
  { title: "Чемпион АПЛ", season: "2023/24" },
  { title: "Чемпион АПЛ", season: "2024/25" },
  { title: "Чемпион АПЛ", season: "2025/26" },
];

// Турнирная таблица. Очки и порядок считаются автоматически:
// и — игры, в — победы, н — ничьи, п — поражения, zab — забито, prop — пропущено.
window.LEAGUE = {
  name: "АПЛ",
  season: "2026/27",
  teams: [
    "FC Durum", "Mambet FC", "FC Doner Abay", "FC Shegly", "FC Starpery", "FC Lagman",
    "Samsa United", "FC Plov City", "Beshbarmak FC", "FC Shaurma", "Kurt Rangers", "FC Baursak",
    "Kazy Athletic", "FC Manty", "Chak-Chak FC", "FC Airan", "Kumis Wanderers", "FC Lepeshka",
  ].map((name) => ({ name, w: 0, d: 0, l: 0, zab: 0, prop: 0 })),
};
