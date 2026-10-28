/*
  ДАННЫЕ СЕМЕЙНОГО КАЛЕНДАРЯ
  Это единственный файл, который нужно править. Подробно — в README.md.

  type:      "birthday"    — день рождения
             "anniversary" — годовщина свадьбы
             "memory"      — памятная дата (спокойное оформление, без конфетти)
  name:      как подписать на сайте
  date:      "1972-05-19" (год-месяц-день). Если год неизвестен: "--05-19"
  photo:     "photos/ira.jpg" — файл в папке photos. Пусто — будет кружок с инициалами
             Несколько фото (сменяются в праздник): ["photos/ira.jpg", "photos/ira2.jpg"]
             или просто положите рядом файлы с номером: ira-2.jpg, ira-3.jpg… — сайт найдёт их сам
  relation:  мелкая подпись: «мама», «внук», «двоюродный брат»…
  greeting:  своё поздравление. Пусто — возьмётся случайное из списка GREETINGS
  hideAge:   true — не показывать возраст / число лет

  Только для type: "memory":
  kind:      "passing" — день памяти, "birth" — день рождения ушедшего человека
  years:     годы жизни для подписи, например "1938 — 2015"
*/

window.SITE = {
  title: "Наша большая семья",
};

window.FAMILY = [
  // ——— Дни рождения ———
  { type: "birthday", name: "Людмила", date: "1965-03-05", photo: "", relation: "", hideAge: true  },
  { type: "birthday", name: "Валерий", date: "1963-03-08", photo: ["photos/valera3.jpg","photos/valera2.jpg","photos/valera.jpg"], relation: "", hideAge: true  },
  { type: "birthday", name: "Диана", date: "1989-03-21", photo: "", relation: "", hideAge: true  },
  { type: "birthday", name: "Лена", date: "1989-03-30", photo: ["photos/lena.jpg","photos/lena2.jpg","photos/lena3.jpg"], relation: "", hideAge: true  },
  { type: "birthday", name: "Анжела", date: "1970-04-02", photo: ["photos/angela2.jpg","photos/angela.jpg","photos/angela3.jpg"], relation: "", hideAge: true },
  { type: "birthday", name: "Вадим", date: "1979-04-06", photo: "", relation: "", hideAge: true },
  { type: "birthday", name: "Наталья", date: "1986-04-11", photo: "", relation: "", hideAge: true },
  { type: "birthday", name: "Валентина", date: "1967-04-11", photo: ["photos/valea2.jpg","photos/valea3.jpg","photos/valea5.jpg"], relation: "", hideAge: true  },
  { type: "birthday", name: "Валерия", date: "2018-04-14", photo: ["photos/lera.jpg","photos/lera2.jpg","photos/lera3.jpg"], relation: "" },
  { type: "birthday", name: "Олег", date: "1965-05-11", photo: ["photos/oleg-bol.jpg","photos/oleg-bol2.jpg","photos/oleg-bol3.jpg"], relation: "", hideAge: true  },
  { type: "birthday", name: "Максим", date: "1987-05-26", photo: ["photos/maksim.jpg","photos/maksim2.jpg","photos/maksim3.jpg"], relation: "", hideAge: true  },
  { type: "birthday", name: "Артем", date: "2015-06-24", photo: "", relation: "" },
  { type: "birthday", name: "Лана", date: "1988-07-02", photo: "", relation: "", hideAge: true  },
  { type: "birthday", name: "Вадим", date: "1988-07-04", photo: "", relation: "", hideAge: true  },
  { type: "birthday", name: "Олег", date: "1973-07-12", photo: "", relation: "", hideAge: true  },
  { type: "birthday", name: "Игорь", date: "1973-07-12", photo: "", relation: "", hideAge: true  },
  { type: "birthday", name: "Мария", date: "1973-07-15", photo: "", relation: "", hideAge: true  },
  { type: "birthday", name: "Кристина", date: "2010-07-18", photo: "", relation: "" },
  { type: "birthday", name: "Алина", date: "2010-07-18", photo: "", relation: "" },
  { type: "birthday", name: "Светлана", date: "1974-07-22", photo: "", relation: "", hideAge: true  },
  { type: "birthday", name: "Анюта", date: "2026-07-31", photo: "photos/aniuta.jpg", relation: "", hideAge: true  },
  { type: "birthday", name: "Бабушка Мария", date: "1937-08-28", photo: "photos/babuska-maria.JPG", relation: "Самая мудрая бабушка" },
  { type: "birthday", name: "Злата", date: "2012-09-06", photo: ["photos/zlata.jpg","photos/zlata3.jpg","photos/zlata4.jpg"], relation: "" },
  { type: "birthday", name: "Бабушка Мила", date: "1950-09-09", photo: ["photos/babuska-mila.jpg","photos/babuska-mila2.jpg"], relation: "" },
  { type: "birthday", name: "Сережа", date: "1987-09-22", photo: "photos/sereja.jpg", relation: "", hideAge: true  },
  { type: "birthday", name: "Александра", date: "2010-10-18", photo: ["photos/sasha.jpg","photos/sasha2.jpg","photos/sasha3.jpg"], relation: "" },
  { type: "birthday", name: "Инна", date: "1974-10-28", photo: ["photos/inna.jpg","photos/inna4.jpg","photos/inna5.jpg","photos/inna6.jpg"], relation: "", hideAge: true  },
  { type: "birthday", name: "Андрей", date: "1987-10-28", photo: ["photos/andrei.jpg","photos/andrei2.jpg"], relation: "", hideAge: true  },
  { type: "birthday", name: "Юлия", date: "1997-12-06", photo: ["photos/iulia.jpg","photos/iulia3.jpg","photos/iulia6.jpg"], relation: "", hideAge: true  },
 

  // ——— Годовщины свадеб ———

  { type: "anniversary", name: "Людмила и Валерий", date: "1985-06-15", photo: "", relation: "" },
  { type: "anniversary", name: "Мария и Руслан", date: "2025-07-09", photo: "photos/masharuslan.jpg", relation: "" },
  { type: "anniversary", name: "Светлана и Олег", date: "1998-09-04", photo: "" },
  { type: "anniversary", name: "Наталья и Вадим", date: "2014-09-04", photo: "" },
  

  // ——— Памятные даты ———
  { type: "memory", kind: "birth", name: "Дедушка Илья", date: "1940-04-28", photo: "photos/papa.jpg", years: "1940 — 2000" },
  
];

// Поздравления, если у человека нет своего. Каждый год выбирается новое.
window.GREETINGS = {
  birthday: [
    "С днём рождения! Пусть этот год будет щедрым на радость, здоровье и тёплые встречи с родными.",
    "Поздравляем всей семьёй! Желаем сил, удачи во всём задуманном и поводов улыбаться каждый день.",
    "С праздником! Пусть рядом всегда будут любимые люди, а дома — уют и смех.",
    "Счастья, здоровья и исполнения желаний! Мы тебя очень любим.",
    "Пусть всё задуманное получается легко, а каждый новый день приносит что-то хорошее. С днём рождения!",
  ],
  anniversary: [
    "Поздравляем с годовщиной! Вы — пример того, как беречь друг друга. Любви и тепла на долгие годы.",
    "С годовщиной свадьбы! Пусть ваш дом всегда будет полон радости, а любовь только крепнет.",
    "Сколько уже пройдено вместе — и сколько хорошего ещё впереди. С праздником!",
  ],
  memory: [
    "Помним, любим, храним в сердце.",
    "Светлая память. Мы вспоминаем тебя с любовью.",
  ],
};
