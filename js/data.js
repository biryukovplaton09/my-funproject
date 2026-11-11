// ============================================================
//  Данные сайта FC Durum. Чтобы добавить новость, игрока или матч —
//  достаточно дописать объект в нужный массив.
// ============================================================

window.CLUB = {
  name: "FC Durum",
  tagline: "Любительская футбольная команда",
  colors: "Красно-чёрные",
  founded: 2023,
  stadium: "Кулагер Стэдиум",
  captain: 6,          // id игрока
  coach: "Роман Юдин (играющий тренер)",
  rival: "FC Doner Abay",
  about: [
    "FC Durum — любительская футбольная команда, основанная в 2023 году. Название клуб получил в честь настоящего турецкого дюрюма — того самого лаваша с начинкой.",
    "Домашний стадион — «Кулагер Стэдиум». Капитан и тренер команды — Роман Юдин.",
    "За три сезона FC Durum трижды выиграл АПЛ и дважды доходил до финала Лиги чемпионов. Основная форма клуба — красно-чёрная.",
  ],
  // Легендарные матчи в истории клуба
  legends: [
    { title: "Разгром главного соперника", home: "FC Durum", away: "FC Doner Abay", score: "10:1",
      text: "Самая памятная игра в истории клуба: FC Durum разнёс главных соперников — FC Doner Abay." },
  ],
};

// photo: путь к фото, например "images/players/1.jpg". Если фото нет — показывается заглушка с номером.
window.PLAYERS = [
  {
    id: 1, number: 1, name: "Павел Григориади", position: "Вратарь", instagram: "p.grigoriadii", photo: "images/players/1.jpg",
    nickname: "Бургер", born: 2008, foot: "Правая", nationality: "Германия", flag: "de", prevClub: "Бавария",
    favPlayer: "Мануэль Нойер", favClub: "Бавария", trait: "Пенальтист",
    bio: "Пришёл в FC Durum из «Баварии». Вратарём стал случайно: однажды отбил удар лицом — и с тех пор из ворот его уже не выпускали. При этом Павел ещё и штатный пенальтист команды.",
    stats: { goals: 1, assists: 2, note: "Гол — с пенальти" },
  },
  {
    id: 2, number: 6, name: "Тимур Хегай", position: "Защитник", instagram: "xegaii", photo: "images/players/2.jpg",
    nickname: "Кулагерский монстр", born: 2008, foot: "Обе (одинаково плохо)", nationality: "Испания", flag: "es", prevClub: "Барселона",
    favPlayer: "Лионель Месси", favClub: "Барселона", trait: "Финт Зидана",
    bio: "Пришёл в FC Durum из «Барселоны». Амбидекстр: одинаково уверенно — и одинаково плохо — бьёт с обеих ног. Его фирменный приём — финт Зидана. Самая известная история: в финале Тимур «привёз» пенальти в собственные ворота.",
    stats: { goals: 2, assists: 2 },
    awards: [{ title: "Чемпион мира", season: "ЧМ-2026", team: "Испания", flag: "es", medal: "gold" }, { title: "Лучший ассистент мира", season: "2024/25" }],
  },
  {
    id: 3, number: 4, name: "Платон Бирюков", position: "Защитник", instagram: "biriukov_platon", photo: "images/players/3.jpg",
    nickname: "Умный человек в очках", born: 2009, foot: "Правая", nationality: "Франция", flag: "fr", prevClub: "Реал Мадрид",
    favPlayer: "Роналду, Зидан, Мбаппе", favClub: "Реал Мадрид", trait: "Подкат",
    bio: "Пришёл в FC Durum из «Реал Мадрида». Главное оружие — подкат. Самая известная история: в игре против Mambet FC Платон забил ножницами — правда, в свои ворота. Зато красиво.",
    stats: { goals: 4, assists: 1 },
    awards: [{ title: "Лучший защитник мира", season: "2025/26" }, { title: "Лучший защитник ЛЧ", season: "2024/25" }],
  },
  {
    id: 4, number: 11, name: "Везир Мирзоев", position: "Вингер", instagram: "awanteya", photo: "images/players/4.jpg",
    nickname: "Бородатый", born: 2008, foot: "Правая", nationality: "Аргентина, Бразилия", flag: ["ar", "br"], prevClub: "Барселона",
    favPlayer: "Ламин Ямаль", favClub: "Барселона", trait: "Навес",
    bio: "Пришёл в FC Durum из «Барселоны». Главное оружие — навес с фланга. А ещё Везир — мастер симуляции: падает так эффектно, что в команде его часто называют «Плавцом» или «Дельфином».",
    stats: { goals: 6, assists: 2 },
    awards: [{ title: "Финалист чемпионата мира", season: "ЧМ-2026", team: "Аргентина", flag: "ar", medal: "silver" }],
  },
  {
    id: 5, number: 7, name: "Дэниэль Шаламов", position: "Вингер", instagram: "freyah0", photo: "images/players/5.jpg",
    nickname: "Еврей", born: 2008, foot: "Правая", nationality: "Россия, Израиль", flag: ["ru", "il"], prevClub: "Реал Мадрид",
    favPlayer: "Криштиану Роналду", favClub: "Реал Мадрид", trait: "Пушечный удар",
    bio: "Пришёл в FC Durum из «Реал Мадрида». Фирменное оружие — пушечный удар: на одном из тренировочных матчей Дэн сломал брату руку. На игры приезжает на «Гелике» — с видом главной звезды лиги.",
    stats: { goals: 9, assists: 6 },
    awards: [{ title: "Золотой мяч", season: "2023/24", kind: "ball" }, { title: "Золотой мяч", season: "2024/25", kind: "ball" }, { title: "Лучший игрок ЛЧ", season: "2024/25" }, { title: "Лучший бомбардир АПЛ", season: "2024/25" }],
  },
  {
    id: 6, number: 10, name: "Роман Юдин", position: "Центральный атакующий полузащитник", short: "ЦАП", instagram: "yudin_obman", photo: "images/players/6.jpg",
    nickname: "Алкаш", born: 2008, foot: "Обе", nationality: "Англия", flag: "en", prevClub: "Рубин (РПЛ)",
    favPlayer: "Букайо Сака", favClub: "Арсенал", trait: "Может в одиночку обыграть всех 11",
    bio: "Пришёл в FC Durum из «Рубина» — по клубной легенде, оттуда его выгнали за слишком бурные вечеринки. Говорят, однажды Рома выиграл матч после такой ночи в одиночку. А ещё он забил хет-трик «Барселоне», перепутав её с «Локомотивом», и на пресс-конференции выдал: «Это ваша Барса? Бомжи».",
    stats: { goals: 10, assists: 11 },
    awards: [{ title: "Бронзовый призёр чемпионата мира", season: "ЧМ-2026", team: "Англия", flag: "en", medal: "bronze" }, { title: "Золотой мяч", season: "2025/26", kind: "ball" }, { title: "Лучший бомбардир АПЛ", season: "2023/24" }],
  },

  // Академия: academy: true — показываются на вкладке «Академия» в «Составе» (без фото — заглушка-футболка)
  { id: 8,  number: null, name: "Арам",  position: "Вингер",     academy: true, photo: null, bio: "" },
  { id: 9,  number: null, name: "Арут",  position: "Нападающий", short: "ФРВ", academy: true, photo: null, bio: "" },
  { id: 10, number: null, name: "Алиар", position: "Вингер",     academy: true, photo: null, bio: "" },
  { id: 11, number: null, name: "Илья",  position: "Вратарь",    academy: true, photo: null, bio: "" },

  // Анкета (необязательно): nickname, born (год), foot, nationality + flag (код страны: de, es, fr, it, pt, br, ar, gb, en (Англия), ru, il, kz, tr, us; два флага — ["ru", "il"]), prevClub, favPlayer, favClub, trait,
  // stats: { goals, assists } — за текущий сезон во всех турнирах.
  // awards — награды; kind: "ball" — значок Золотого мяча; medal: gold/silver/bronze + team/flag — награды сборной.
  // Бывшие игроки: former: true — показываются отдельным блоком в «Составе»
  {
    id: 7, number: 8, name: "Альмир Дё", position: "Левый вингер", instagram: "alm1r.d", photo: "images/players/7.jpg", former: true,
    transfer: "Шанхай Юнайтед",
    bio: "Лучший бомбардир FC Durum в сезоне 2025/26. В нынешнее трансферное окно перешёл в «Шанхай Юнайтед».",
    honors: ["3× чемпион АПЛ (2023/24, 2024/25, 2025/26)", "2× финалист ЛЧ (2023/24, 2024/25)", "Лучший бомбардир команды 2025/26"],
  },
];

// image: путь к картинке новости, например "images/news/2.jpg". Без картинки — фирменная обложка.
// players: id игроков, о которых новость (покажутся ссылками внизу статьи).
window.NEWS = [
  {
    id: 4,
    title: "Шестеро в сборных! FC Durum отправляет игроков на международную паузу",
    excerpt: "Весь основной состав вызван в национальные команды: Франция, Англия, Германия, Аргентина, Испания и Россия. Кулагер Стэдиум ненадолго пустеет — зато FC Durum теперь представлен на шести флагах.",
    body: [
      "Пока клубные чемпионаты берут паузу, у FC Durum — горячая пора. Все шесть игроков основного состава получили вызовы в свои сборные. Для любительской команды, основанной в 2023 году, это небывалый результат: красно-чёрные теперь играют сразу за шесть стран.",
      "Платон Бирюков, лучший защитник мира сезона 2025/26, отправляется во Францию. Капитан и тренер Роман Юдин, действующий обладатель Золотого мяча, сыграет за Англию. Наш пенальтист и вратарь Павел «Бургер» Григориади встанет в ворота сборной Германии.",
      "Везир «Бородатый» Мирзоев едет в Аргентину, лучший ассистент мира 2024/25 Тимур Хегай — в Испанию, а двукратный обладатель Золотого мяча Дэниэль Шаламов наденет форму сборной России.",
      "Первыми в путь отправились Платон, Павел и Роман — фото из VIP-зала аэропорта перед вылетом уже разлетелось по клубным чатам. Судя по настроению, спор о том, чья сборная сильнее, начался ещё до посадки.",
      "Клуб желает всем удачи и ждёт ребят обратно здоровыми — впереди матчи Лиги чемпионов 31 января. Болейте за наших в каждой сборной!",
    ],
    image: "images/news/4.jpg",
    imageCaption: "Платон Бирюков, Павел Григориади и Роман Юдин перед вылетом к своим сборным",
    callups: [
      { player: 3, team: "Франция", flag: "fr" },
      { player: 6, team: "Англия", flag: "en" },
      { player: 1, team: "Германия", flag: "de" },
      { player: 4, team: "Аргентина", flag: "ar" },
      { player: 2, team: "Испания", flag: "es" },
      { player: 5, team: "Россия", flag: "ru" },
    ],
    date: "2026-11-11T00:32:00",
    players: [3, 6, 1, 4, 2, 5],
  },
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
    date: "2026-11-10T13:00:00",
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
    date: "2026-11-10T11:00:00",
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
    date: "2026-11-10T09:00:00",
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
    { season: "2023/24", stage: "Финал", result: "Поражение", opponent: "Спортик Юнайтед", score: "3:4" },
    { season: "2024/25", stage: "Финал", result: "Поражение", opponent: "Бокс Команд", score: "4:5" },
  ],
  // Ближайший этап. matches — пары; пока соперники не определены, список пуст.
  next: { date: "2027-01-31", title: "Матчи Лиги чемпионов", matches: [] },
};
