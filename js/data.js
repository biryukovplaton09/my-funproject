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
  { id: 6, number: 10, name: "Роман Юдин",        position: "Центральный атакующий полузащитник", short: "ЦАП", photo: "images/players/6.jpg", bio: "" },

  // Бывшие игроки: former: true — показываются отдельным блоком в «Составе»
  {
    id: 7, number: null, name: "Альмир Дё", position: null, photo: "images/players/7.jpg", former: true,
    transfer: "Шанхай Юнайтед",
    bio: "Лучший бомбардир FC Durum в сезоне 2025/26. В нынешнее трансферное окно перешёл в «Шанхай Юнайтед».",
    honors: ["3× чемпион АПЛ (2023/24, 2024/25, 2025/26)", "2× финалист ЛЧ (2023/24, 2024/25)", "Лучший бомбардир команды 2025/26"],
  },
];

// image: путь к картинке новости, например "images/news/2.jpg". Без картинки — фирменная обложка.
// players: id игроков, о которых новость (покажутся ссылками внизу статьи).
window.NEWS = [
  {
    id: 3,
    title: "12:6! FC Durum разгромил FC Lagman и одержал первую победу в сезоне",
    excerpt: "В 4-м туре АПЛ команда забила двенадцать мячей и взяла первые три очка сезона 2026/27.",
    body: [
      "FC Durum наконец открыл счёт победам в новом сезоне. В матче 4-го тура АПЛ команда обыграла FC Lagman со счётом 12:6.",
      "Восемнадцать голов за одну игру — результативный матч даже по меркам нашей лиги. После двух поражений и ничьей на старте чемпионата эта победа особенно важна.",
      "Следующая цель — продолжить серию и подняться в таблице. А 31 января команду ждут матчи Лиги чемпионов.",
    ],
    image: null,
    date: "2026-11-10T20:00:00",
    players: [],
  },
  {
    id: 2,
    title: "Альмир Дё покидает FC Durum и переходит в «Шанхай Юнайтед»",
    excerpt: "Лучший бомбардир сезона 2025/26 продолжит карьеру в новом клубе.",
    body: [
      "В это трансферное окно FC Durum покидает Альмир Дё. Его новым клубом стал «Шанхай Юнайтед».",
      "Альмир стал лучшим бомбардиром команды в сезоне 2025/26. Вместе с FC Durum он трижды выигрывал АПЛ — в сезонах 2023/24, 2024/25 и 2025/26 — и дважды доходил до финала Лиги чемпионов.",
      "Клуб благодарит Альмира за всё, что он сделал для команды, и желает удачи в «Шанхай Юнайтед»!",
    ],
    image: "images/players/7.jpg",
    date: "2026-11-10T16:00:00",
    players: [7],
  },
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

// Ближайшие матчи FC Durum (сыгранные матчи АПЛ берутся из LEAGUE.results автоматически).
// { date: "2026-11-20T18:00:00", tournament: "АПЛ", opponent: "FC Shegly", home: true }
// opponent: null — соперник ещё не определён.
window.MATCHES = [
  { date: "2027-01-31", tournament: "ЛЧ", opponent: null, home: true },
];

// Трофеи клуба
window.TROPHIES = [
  { title: "Чемпион АПЛ", season: "2023/24" },
  { title: "Чемпион АПЛ", season: "2024/25" },
  { title: "Чемпион АПЛ", season: "2025/26" },
];

// Турнирная таблица АПЛ. Очки, места и статистика считаются автоматически из results.
window.LEAGUE = {
  name: "АПЛ",
  season: "2026/27",
  teams: [
    "FC Durum",
    "Mambet FC",
    "FC Doner Abay",
    "FC Shegly",
    "FC Starpery",
    "FC Lagman",
    "Samsa United",
    "FC Plov City",
    "Beshbarmak FC",
    "FC Shaurma",
    "Kurt Rangers",
    "FC Baursak",
    "Kazy Athletic",
    "FC Manty",
    "Chak-Chak FC",
    "FC Airan",
    "Kumis Wanderers",
    "FC Lepeshka",
  ],
  // Сыгранные матчи: home — хозяева, away — гости, score — "голы хозяев:голы гостей"
  results: [
    // 1-й тур
    { round: 1, home: "FC Durum", away: "FC Starpery", score: "1:2" },
    { round: 1, home: "FC Airan", away: "Beshbarmak FC", score: "6:0" },
    { round: 1, home: "Samsa United", away: "FC Shegly", score: "2:2" },
    { round: 1, home: "Kurt Rangers", away: "Mambet FC", score: "2:1" },
    { round: 1, home: "FC Manty", away: "FC Baursak", score: "4:0" },
    { round: 1, home: "FC Plov City", away: "FC Doner Abay", score: "0:1" },
    { round: 1, home: "FC Shaurma", away: "Chak-Chak FC", score: "2:5" },
    { round: 1, home: "Kazy Athletic", away: "FC Lepeshka", score: "1:2" },
    { round: 1, home: "FC Lagman", away: "Kumis Wanderers", score: "1:0" },
    // 2-й тур
    { round: 2, home: "FC Durum", away: "Mambet FC", score: "3:4" },
    { round: 2, home: "Kazy Athletic", away: "FC Shaurma", score: "3:3" },
    { round: 2, home: "FC Baursak", away: "FC Doner Abay", score: "5:0" },
    { round: 2, home: "FC Airan", away: "FC Lagman", score: "3:0" },
    { round: 2, home: "FC Manty", away: "FC Starpery", score: "0:2" },
    { round: 2, home: "FC Lepeshka", away: "FC Shegly", score: "5:2" },
    { round: 2, home: "Chak-Chak FC", away: "FC Plov City", score: "1:0" },
    { round: 2, home: "Kurt Rangers", away: "Beshbarmak FC", score: "2:2" },
    { round: 2, home: "Samsa United", away: "Kumis Wanderers", score: "4:3" },
    // 3-й тур
    { round: 3, home: "FC Durum", away: "FC Doner Abay", score: "2:2" },
    { round: 3, home: "FC Lagman", away: "FC Starpery", score: "2:1" },
    { round: 3, home: "FC Airan", away: "Samsa United", score: "2:1" },
    { round: 3, home: "Chak-Chak FC", away: "Kurt Rangers", score: "2:1" },
    { round: 3, home: "Mambet FC", away: "FC Plov City", score: "3:1" },
    { round: 3, home: "FC Shaurma", away: "Beshbarmak FC", score: "4:1" },
    { round: 3, home: "FC Baursak", away: "Kazy Athletic", score: "1:2" },
    { round: 3, home: "FC Lepeshka", away: "FC Manty", score: "3:1" },
    { round: 3, home: "Kumis Wanderers", away: "FC Shegly", score: "0:1" },
    // 4-й тур
    { round: 4, home: "FC Durum", away: "FC Lagman", score: "12:6" },
    { round: 4, home: "Samsa United", away: "FC Manty", score: "1:0" },
    { round: 4, home: "FC Airan", away: "FC Shaurma", score: "1:1" },
    { round: 4, home: "FC Doner Abay", away: "Chak-Chak FC", score: "1:1" },
    { round: 4, home: "FC Starpery", away: "FC Baursak", score: "5:2" },
    { round: 4, home: "Kumis Wanderers", away: "Kurt Rangers", score: "3:1" },
    { round: 4, home: "FC Lepeshka", away: "Mambet FC", score: "1:2" },
    { round: 4, home: "FC Plov City", away: "Beshbarmak FC", score: "0:0" },
    { round: 4, home: "FC Shegly", away: "Kazy Athletic", score: "0:2" },
  ],
};

// Лига чемпионов (ЛЧ)
window.UCL = {
  name: "Лига чемпионов",
  short: "ЛЧ",
  // История выступлений. season — можно вписать сезон, например "2024/25".
  history: [
    { season: "2023/24", stage: "Финал", result: "Поражение" },
    { season: "2024/25", stage: "Финал", result: "Поражение" },
  ],
  // Ближайший этап. matches — пары; пока соперники не определены, список пуст.
  next: { date: "2027-01-31", title: "Матчи Лиги чемпионов", matches: [] },
};
