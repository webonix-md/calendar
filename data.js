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

  newborn:   только что родившийся малыш — первые 10 дней на главной «Встречайте!»
             с разрывающейся обёрткой и мультяшной мордашкой, потом обычный день рождения.
             newborn: { weight: "3 450 г", height: "52 см" }  (можно newborn: {} без веса и роста)
             Посмотреть заранее: допишите к адресу сайта ?demo=baby

  Только для type: "memory":
  kind:      "passing" — день памяти, "birth" — день рождения ушедшего человека
  years:     годы жизни для подписи, например "1938 — 2015"
*/

window.SITE = {
  title: "Наша большая семья",
};

window.FAMILY = [
  // ——— Дни рождения ———
  { type: "birthday", name: "Людмила", date: "--03-05", photo: "", relation: "", hideAge: true  },
  { type: "birthday", name: "Валерий", date: "--03-08", photo: ["photos/valera3.jpg","photos/valera2.jpg","photos/valera4.jpg"], relation: "", hideAge: true  },
  { type: "birthday", name: "Диана", date: "--03-21", photo: ["photos/diana.jpg","photos/diana2.jpg"], relation: "", hideAge: true  },
  { type: "birthday", name: "Лена", date: "--03-30", photo: ["photos/lena.jpg","photos/lena2.jpg","photos/lena3.jpg"], relation: "", hideAge: true  },
  { type: "birthday", name: "Анжела", date: "--04-02", photo: ["photos/angela2.jpg","photos/angela.jpg","photos/angela3.jpg"], relation: "", hideAge: true },
  { type: "birthday", name: "Вадим", date: "--04-06", photo: "", relation: "", hideAge: true },
  { type: "birthday", name: "Наталья", date: "--04-11", photo: "", relation: "", hideAge: true },
  { type: "birthday", name: "Валентина", date: "--04-11", photo: ["photos/valea2.jpg","photos/valea3.jpg","photos/valea5.jpg"], relation: "", hideAge: true  },
  { type: "birthday", name: "Валерия", date: "2018-04-14", photo: ["photos/lera.jpg","photos/lera2.jpg","photos/lera3.jpg"], relation: "" },
  { type: "birthday", name: "Олег", date: "--05-11", photo: ["photos/oleg-bol.jpg","photos/oleg-bol2.jpg","photos/oleg-bol3.jpg"], relation: "", hideAge: true  },
  { type: "birthday", name: "Максим", date: "--05-26", photo: ["photos/maksim.jpg","photos/maksim2.jpg","photos/maksim3.jpg"], relation: "", hideAge: true  },
  { type: "birthday", name: "Руслан", date: "--06-22", photo: "photos/ruslan.jpg", relation: "" },
  { type: "birthday", name: "Артем", date: "2015-06-24", photo: "", relation: "" },
  { type: "birthday", name: "Лана", date: "--07-02", photo: "", relation: "", hideAge: true  },
  { type: "birthday", name: "Вадим", date: "--07-04", photo: ["photos/vadim-t.jpg","photos/vadim-t2.jpg","photos/vadim-t3.jpg","photos/vadim-t4.jpg"], relation: "", hideAge: true  },
  { type: "birthday", name: "Олег", date: "--07-12", photo: "photos/oleg-mal.jpg", relation: "", hideAge: true  },
  { type: "birthday", name: "Игорь", date: "--07-12", photo: "", relation: "", hideAge: true  },
  { type: "birthday", name: "Мария", date: "--07-15", photo: ["photos/masha2.jpg","photos/masha.jpg"], relation: "", hideAge: true  },
  { type: "birthday", name: "Алина", date: "2011-07-18", photo: ["photos/alina.jpg","photos/alina2.jpg","photos/alina3.jpg","photos/alina4.jpg"], relation: "" },
  { type: "birthday", name: "Кристина", date: "2011-07-18", photo: ["photos/kristina.jpg","photos/kristina2.jpg","photos/alina2.jpg","photos/kristina4.jpg"], relation: "" },
  { type: "birthday", name: "Светлана", date: "--07-22", photo: "photos/sveta2.jpg", relation: "", hideAge: true  },
  { type: "birthday", name: "Анюта", date: "2026-07-31", photo: ["photos/aniuta2.jpg","photos/aniuta.jpg","photos/aniuta3.jpg"], relation: "", hideAge: true  },
  { type: "birthday", name: "Бабушка Мария", date: "1937-08-28", photo: "photos/babuska-maria.JPG", relation: "Самая мудрая бабушка" },
  { type: "birthday", name: "Злата", date: "2012-09-06", photo: ["photos/zlata.jpg","photos/zlata3.jpg","photos/zlata4.jpg","photos/zlata5.jpg","photos/zlata6.jpg"], relation: "" },
  { type: "birthday", name: "Бабушка Мила", date: "1950-09-09", photo: ["photos/babuska-mila.jpg","photos/babuska-mila2.jpg"], relation: "" },
  { type: "birthday", name: "Сережа", date: "--09-21", photo: ["photos/sereja.jpg","photos/sereja2.jpg","photos/sereja3.jpg"], relation: "", hideAge: true  },
  { type: "birthday", name: "Александра", date: "2010-10-18", photo: ["photos/sasha.jpg","photos/sasha2.jpg","photos/sasha3.jpg"], relation: "" },
  { type: "birthday", name: "Инна", date: "--10-28", photo: ["photos/inna.jpg","photos/inna4.jpg","photos/inna5.jpg","photos/inna6.jpg"], relation: "", hideAge: true  },
  { type: "birthday", name: "Андрей", date: "--10-28", photo: ["photos/andrei.jpg","photos/andrei2.jpg"], relation: "", hideAge: true  },
  { type: "birthday", name: "Олеся", date: "--11-29", photo: ["photos/olesea.jpg","photos/olesea4.jpg","photos/olesea2.jpg","photos/vadim-t.jpg","photos/vadim-t2.jpg","photos/olesea6.jpg","photos/olesea3.jpg"], relation: "", hideAge: true  },
  { type: "birthday", name: "Юлия", date: "--12-06", photo: ["photos/iulia.jpg","photos/iulia3.jpg","photos/iulia6.jpg"], relation: "", hideAge: true  },

  // Малыш: когда родится — уберите // в начале строки и впишите имя, дату, вес и рост
  { type: "birthday", name: "Алан", date: "2026-11-08", photo: "", relation: "Сын Ланы и Николая", newborn: { weight: "4 150 г", height: "54 см" } },


  // ——— Годовщины свадеб ———

  { type: "anniversary", name: "Диана и Сережа", date: "2018-02-24", photo: "photos/dianasereja.jpg", relation: "" },
  { type: "anniversary", name: "Людмила и Валерий", date: "1985-06-15", photo: "", relation: "" },
  { type: "anniversary", name: "Лена и Максим", date: "2009-06-15", photo: "", relation: "" },
  { type: "anniversary", name: "Мария и Руслан", date: "2025-07-09", photo: "photos/masharuslan.jpg", relation: "" },
  { type: "anniversary", name: "Юлия и Андрей", date: "2025-08-08", photo: "photos/iuliaandrei.jpg", relation: "" },
  { type: "anniversary", name: "Светлана и Олег", date: "1998-09-04", photo: "photos/svetaoleg.jpg" },
  { type: "anniversary", name: "Наталья и Вадим", date: "2014-09-04", photo: "" },
  { type: "anniversary", name: "Валентина и Олег", date: "1987-09-27", photo: "" },
  

  // ——— Памятные даты ———
  { type: "memory", kind: "birth", name: "Дедушка Илья", date: "1940-04-28", photo: "photos/papa.jpg", years: "1940 — 2000" },
  { type: "memory", kind: "birth", name: "Дедушка Костя", date: "1949-11-14", photo: "photos/konstantin.jpg", years: "1949 — 2024" },
  
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
