// ===== DATA =====
const user = {
  name: "Иван", email: "ivan.ivanov@inbox.ru", avatar: "И", avatarColor: "#2BC4A7",
  weight: 100, goalWeight: 70,
  flames: 20,
  recordFlames: 24,
  streakDays: 12,
  yesterdaySteps: 10847,
  yesterdayActivityMin: 25,
  goalsWeek: { done: 4, total: 7 },
  season: { name: "Весна 2026", rank: "Золото III" },
  achievements: ["Первая неделя", "Серия 7 дней", "Лига: Бронза"],
  extraBadgeUnlocked: false,
  freezesLeft: 3,
  todayActive: true,
  todayFlames: { challenge: false, goal: false },
  goals: [
    { icon:"👟", title:"Шаги", target:10000, progress:0, unit:"", step:2000, color:"var(--streak-or)", reason:"🤖 Вам нужно больше двигаться — сидячий образ жизни", done:false },
    { icon:"💧", title:"Вода", target:2, progress:0, unit:"л", step:0.5, color:"#2196F3", reason:"🤖 Вы пьёте мало воды, это замедляет метаболизм", done:false },
  ],
};
let friends = [
  { id:"1", name:"Аня", avatar:"А", avatarColor:"#E91E63", flames:48, recordFlames:52, todayActive:true },
  { id:"2", name:"Дима", avatar:"Д", avatarColor:"#3F51B5", flames:10, recordFlames:18, todayActive:false },
  { id:"3", name:"Маша", avatar:"М", avatarColor:"#9C27B0", flames:82, recordFlames:82, todayActive:true },
  { id:"4", name:"Серёжа", avatar:"С", avatarColor:"#FF9800", flames:5, recordFlames:14, todayActive:true },
  { id:"5", name:"Лена", avatar:"Л", avatarColor:"#00BCD4", flames:30, recordFlames:35, todayActive:false },
  { id:"6", name:"Костя", avatar:"К", avatarColor:"#4CAF50", flames:115, recordFlames:115, todayActive:true },
];

// ===== LEAGUES (by total flames) =====
const LEAGUES = [
  { name:"Бронза", icon:"🥉", min:0, max:20, color:"#CD7F32", bg:"linear-gradient(135deg,#CD7F32,#E8A860)" },
  { name:"Серебро", icon:"🥈", min:21, max:60, color:"#8E9AAF", bg:"linear-gradient(135deg,#8E9AAF,#C0C7D6)" },
  { name:"Золото", icon:"🥇", min:61, max:120, color:"#D4A017", bg:"linear-gradient(135deg,#D4A017,#F5D060)" },
  { name:"Платина", icon:"💠", min:121, max:200, color:"#5B8C5A", bg:"linear-gradient(135deg,#3A7D44,#7BC67E)" },
  { name:"Бриллиант", icon:"💎", min:201, max:350, color:"#2196F3", bg:"linear-gradient(135deg,#1565C0,#42A5F5)" },
  { name:"Мастер", icon:"🔮", min:351, max:500, color:"#7B1FA2", bg:"linear-gradient(135deg,#6A1B9A,#AB47BC)" },
  { name:"Легенда", icon:"👑", min:501, max:99999, color:"#FF6B35", bg:"linear-gradient(135deg,#E65100,#FF9800)" },
];

function getLeague(flames) { return LEAGUES.find(l => flames >= l.min && flames <= l.max) || LEAGUES[0]; }
function getNextLeague(flames) { const i = LEAGUES.findIndex(l => flames >= l.min && flames <= l.max); return i < LEAGUES.length - 1 ? LEAGUES[i+1] : null; }
function sameLeague(flamesA, flamesB) { return getLeague(flamesA).name === getLeague(flamesB).name; }

// ===== CHALLENGES =====
const CHALLENGE_EXERCISES = [
  { text:"Сделай 20 приседаний", icon:"🦵" },
  { text:"Сделай 15 отжиманий (можно за весь день)", icon:"💪" },
  { text:"Планка 45 секунд", icon:"🏋️" },
  { text:"Потянись 10 минут", icon:"🧘" },
  { text:"Сделай 30 скручиваний на пресс", icon:"🔥" },
  { text:"10 берпи (можно с перерывами)", icon:"⚡" },
  { text:"Сделай 50 прыжков на месте", icon:"🦘" },
  { text:"Сделай 3 подхода по 10 выпадов", icon:"🦵" },
];
const CHALLENGE_FOOD = [
  { text:"Приготовь полезный завтрак и скинь фото в калькулятор калорий", icon:"🍳" },
  { text:"Приготовь ПП-обед и сфоткай для дневника", icon:"🥗" },
  { text:"Сделай полезный перекус и загрузи фото в калькулятор", icon:"🍎" },
  { text:"Приготовь ужин до 400 ккал и скинь фото", icon:"🍽️" },
  { text:"Сделай смузи и сфоткай для дневника питания", icon:"🥤" },
  { text:"Собери ланч-бокс и загрузи фото в калькулятор", icon:"🍱" },
];
const CHALLENGE_STEPS = [
  { text:"Пройди 500 шагов", icon:"🚶" },
  { text:"Пройди 5 000 шагов", icon:"🚶" },
  { text:"Пройди 7 000 шагов", icon:"🚶" },
  { text:"Пройди 8 000 шагов", icon:"🚶‍♂️" },
  { text:"Пройди 10 000 шагов", icon:"🏃" },
  { text:"Пройди 12 000 шагов", icon:"🏃‍♂️" },
];
const CHALLENGE_WELLNESS = [
  { text:"Помедитируй 5 минут", icon:"🧘‍♀️" },
  { text:"Ложись спать до 23:00", icon:"😴" },
  { text:"Не заходи в соцсети 1 час подряд", icon:"📵" },
  { text:"Напиши 3 вещи, за которые благодарен", icon:"🙏" },
  { text:"Выпей 8 стаканов воды за день", icon:"💧" },
  { text:"Прими контрастный душ", icon:"🚿" },
  { text:"Почитай книгу 15 минут", icon:"📖" },
];
const CHALLENGE_SOCIAL = [
  { text:"Напиши другу слова поддержки", icon:"💌" },
  { text:"Поделись прогрессом в ленте", icon:"📢" },
  { text:"Поставь 5 лайков друзьям", icon:"❤️" },
  { text:"Позвони другу и обсудите цели", icon:"📞" },
  { text:"Пригласи кого-то на совместную прогулку", icon:"🤝" },
];

// EXTRA BONUS — hard strength challenge, appears ~once a week
const CHALLENGE_EXTRA = [
  { text:"5 подходов по 20 приседаний с весом", icon:"🏋️‍♂️" },
  { text:"Круговая тренировка: 3 раунда (берпи + выпады + планка)", icon:"⚡" },
  { text:"100 отжиманий за день (любыми подходами)", icon:"💪" },
  { text:"Табата 4 минуты: 20 сек работа / 10 сек отдых × 8", icon:"🔥" },
  { text:"5 подходов планки по 1 минуте", icon:"🏋️" },
  { text:"50 берпи за день (разбей на подходы)", icon:"⚡" },
  { text:"3 подхода по 15 подтягиваний (или австралийских)", icon:"💪" },
  { text:"200 скручиваний на пресс за день", icon:"🔥" },
];

let todayChallenges = null;
let todayExtra = null;

function getTodayChallenges() {
  if (todayChallenges) return todayChallenges;
  const pick = arr => arr[Math.floor(Math.random()*arr.length)];
  todayChallenges = [
    { ...pick(CHALLENGE_EXERCISES), category:"Упражнение", catIcon:"💪", completed:false },
    { ...pick(CHALLENGE_FOOD), category:"Питание + фото", catIcon:"📸", completed:false },
    { ...pick(CHALLENGE_STEPS), category:"Шаги", catIcon:"👟", completed:false },
    { ...pick(CHALLENGE_WELLNESS), category:"Здоровье", catIcon:"🧘", completed:false },
    { ...pick(CHALLENGE_SOCIAL), category:"Социальное", catIcon:"🤝", completed:false },
  ];
  // Демо для защиты: задание «500 шагов» (сценарий слайда)
  todayChallenges[2] = { text:"Пройди 500 шагов", icon:"🚶", category:"Шаги", catIcon:"👟", completed:false };
  return todayChallenges;
}

function getTodayExtra() {
  if (todayExtra !== null) return todayExtra;
  // Always show for demo (in production: Math.random() < 0.15)
  const pick = CHALLENGE_EXTRA[Math.floor(Math.random()*CHALLENGE_EXTRA.length)];
  todayExtra = { ...pick, category:"Экстра 💀", catIcon:"🏆", completed:false };
  return todayExtra;
}

/** Подпись к посту: защита от неизвестного тега */
function tagStyleFor(tag) {
  return tagColors[tag] || { bg: "#F0F0F0", text: "#555555" };
}

const posts = [
  { id:1, userId:"1", time:"15 мин назад", text:"Утренняя пробежка 5 км по парку! Погода шикарная 🌤 Кто со мной завтра?", likes:12, comments:3, liked:false, tag:"Активность" },
  { id:2, userId:"5", time:"1 час назад", text:"Приготовила ПП-пиццу на цветной капусте! Всего 180 ккал на порцию 🍕", likes:24, comments:8, liked:true, tag:"Рецепт", emoji:"🍕" },
  { id:3, userId:"4", time:"2 часа назад", text:"Официально минус 2 кг за неделю! Дневник питания реально помогает 💪", likes:31, comments:5, liked:false, tag:"Результат" },
  { id:4, userId:"3", time:"3 часа назад", text:"Утренняя йога — лучшее начало дня. 20 минут и заряд энергии ☀️", likes:18, comments:2, liked:false, tag:"Активность", emoji:"🧘‍♀️" },
  { id:5, userId:"6", time:"5 часов назад", text:"61 день подряд без пропусков! 🔥🔥🔥 Готовлюсь к марафону.", likes:45, comments:12, liked:true, tag:"Мотивация" },
  { id:6, userId:"2", time:"20 мин назад", text:"Сделал 500 шагов до обеда — уже не ноль! 💪", likes:5, comments:1, liked:false, tag:"Активность" },
];

let chatList = [
  { userId:"1", lastMsg:"Давай завтра в 7 утра?", time:"15:30", unread:2 },
  { userId:"3", lastMsg:"Спасибо за рецепт! 🙏", time:"14:15", unread:0 },
  { userId:"4", lastMsg:"Как твои успехи?", time:"12:40", unread:1 },
  { userId:"6", lastMsg:"Погнали на марафон вместе!", time:"вчера", unread:0 },
];

let chatMsgs = [
  { from:"them", text:"Привет! Пойдёшь завтра бегать?", time:"15:20" },
  { from:"me", text:"Привет! Да, давай. Во сколько?", time:"15:22" },
  { from:"them", text:"В 7 утра в парке у озера?", time:"15:25" },
  { from:"me", text:"Идеально, буду! 💪", time:"15:27" },
  { from:"them", text:"Давай завтра в 7 утра?", time:"15:30" },
];

const tagColors = { "Активность":{bg:"#E3F6ED",text:"#1A9E5C"}, "Рецепт":{bg:"#FFF3E0",text:"#E67E22"}, "Результат":{bg:"#E8F0FE",text:"#1A73E8"}, "Мотивация":{bg:"#FDE8E8",text:"#D93025"} };

const tabs = [
  { id:"profile", label:"Профиль", title:"Профиль" },
  { id:"diary", label:"Дневник", title:"Сегодня" },
  { id:"community", label:"Сообщество", title:"Сообщество", isNew:true },
  { id:"progress", label:"Прогресс", title:"Прогресс" },
  { id:"video", label:"Видео", title:"Видеотренировки" },
  { id:"aichat", label:"Чат", title:"Чат" },
];

let currentTab = "community";
let communitySubTab = "feed";
let currentDialog = null;
let feedFilter = "all";
let progressMetric = "weight";
let debugScrollSamples = 0;
let authToken = localStorage.getItem("bootcamp_token") || "";
let ws = null;
let activeTrackingSessionId = null;
let currentUserId = null;
let progressSummary = { messages_sent: 0, points_recorded: 0 };
let livePoint = null;
let chartSeriesFromApi = null;
let feedPosts = [];
let feedLoaded = false;
let geoWatchId = null;
let lastTrackSent = 0;
let trackingUiTimer = null;
let videoCatIndex = 0;
let aiChatMessages = [
  { role: "bot", category: "Приветствие", html: "Привет! Я подскажу по питанию, активности и привычкам. Выберите тему ниже или напишите вопрос." },
];

const MESSAGE_CATEGORIES = ["Общее", "Спорт", "Питание", "Мотивация", "Советы", "Рецепт"];

const API_BASE = window.API_BASE || "http://127.0.0.1:8000/api/v1";

function escapeHtml(s) {
  const d = document.createElement("div");
  d.textContent = s == null ? "" : String(s);
  return d.innerHTML;
}

function getProgressSeries() {
  if (chartSeriesFromApi) {
    return {
      labels: chartSeriesFromApi.labels,
      weight: chartSeriesFromApi.weight,
      calories: chartSeriesFromApi.calories,
      movement: chartSeriesFromApi.movement,
      steps: chartSeriesFromApi.steps,
      distance: chartSeriesFromApi.distance,
      activityTime: chartSeriesFromApi.activity_time,
    };
  }
  return progressSeries;
}

function getFriend(id) { return friends.find(f => f.id === id); }

function apiHeaders() {
  const headers = { "Content-Type": "application/json" };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;
  return headers;
}

async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...apiHeaders(), ...(options.headers || {}) },
  });
  if (!response.ok) {
    let detail = `HTTP ${response.status}`;
    try {
      const payload = await response.json();
      detail = payload.detail || detail;
    } catch (_) {}
    throw new Error(detail);
  }
  const text = await response.text();
  return text ? JSON.parse(text) : {};
}

async function syncUserFromApi() {
  const me = await apiFetch("/auth/me");
  currentUserId = me.id;
  user.name = me.name;
  user.email = me.email;
  user.avatar = me.avatar;
  user.avatarColor = me.avatar_color;
}

async function tryResumeSession() {
  if (!authToken) return false;
  try {
    await syncUserFromApi();
    return true;
  } catch (_) {
    authToken = "";
    localStorage.removeItem("bootcamp_token");
    return false;
  }
}

function setAuthVisible(visible) {
  const o = document.getElementById("auth-overlay");
  if (o) o.hidden = !visible;
}

async function loadFriendsFromApi() {
  try {
    const rows = await apiFetch("/users");
    friends = rows.map((r) => ({
      id: String(r.id),
      name: r.name,
      avatar: r.avatar,
      avatarColor: r.avatar_color,
      flames: 15 + (r.id % 50),
      recordFlames: 20 + (r.id % 40),
      todayActive: true,
    }));
  } catch (_) {}
}

async function loadChartSeries() {
  try {
    chartSeriesFromApi = await apiFetch("/progress/chart-series");
  } catch (_) {
    chartSeriesFromApi = null;
  }
}

async function loadFeedPosts() {
  try {
    feedPosts = await apiFetch("/feed/posts");
    feedLoaded = true;
  } catch (_) {
    feedPosts = [];
    feedLoaded = false;
  }
}

async function createFeedPost({ text, tag, emoji }) {
  const p = await apiFetch("/feed/posts", {
    method: "POST",
    body: JSON.stringify({ text, tag, emoji }),
  });
  feedPosts = [p, ...feedPosts];
}

async function toggleFeedLike(postId) {
  await apiFetch(`/feed/posts/${postId}/like`, { method: "POST" });
  await loadFeedPosts();
  renderContent();
}

async function openComments(postId) {
  try {
    const comments = await apiFetch(`/feed/posts/${postId}/comments`);
    showCommentsModal(postId, comments);
  } catch (_) {}
}

function showCommentsModal(postId, comments) {
  document.querySelectorAll(".comments-overlay").forEach((e) => e.remove());
  const overlay = document.createElement("div");
  overlay.className = "comments-overlay";
  overlay.style.cssText =
    "position:absolute;inset:0;background:rgba(0,0,0,0.35);z-index:200;display:flex;align-items:flex-end;justify-content:center;animation:fadeIn 0.2s ease";
  overlay.onclick = (e) => {
    if (e.target === overlay) overlay.remove();
  };
  const list = comments
    .map(
      (c) => `<div class="card" style="margin-bottom:8px;padding:12px">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
          <div class="letter-ava" style="width:30px;height:30px;font-size:13px;background:${c.author.avatar_color}">${escapeHtml(
        c.author.avatar
      )}</div>
          <div style="flex:1">
            <div style="font-weight:700;font-size:13px">${escapeHtml(c.author.name)}</div>
            <div style="font-size:11px;color:var(--text2)">${new Date(c.created_at).toLocaleString("ru-RU", {
              hour: "2-digit",
              minute: "2-digit",
              day: "2-digit",
              month: "2-digit",
            })}</div>
          </div>
        </div>
        <div style="font-size:14px;line-height:1.5">${escapeHtml(c.text)}</div>
      </div>`
    )
    .join("");
  overlay.innerHTML = `
    <div class="create-post-sheet" style="border-radius:24px 24px 0 0;max-height:78vh;overflow:auto">
      <div style="display:flex;justify-content:center;margin-bottom:8px"><div style="width:40px;height:4px;border-radius:2px;background:#DDD"></div></div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <div style="font-size:16px;font-weight:800">Комментарии</div>
        <button onclick="this.closest('.comments-overlay').remove()" style="background:none;border:none;cursor:pointer">${iconSvg(
          "close"
        )}</button>
      </div>
      <div id="comments-list">${list || '<div style="padding:18px;text-align:center;color:var(--text2)">Пока нет комментариев</div>'}</div>
      <div style="display:flex;gap:8px;margin-top:12px">
        <input id="comment-input" class="auth-input" style="margin:0;flex:1" placeholder="Напишите комментарий...">
        <button class="auth-btn auth-btn-primary" style="flex:0 0 auto;padding:12px 16px" onclick="sendComment(${postId})">Отправить</button>
      </div>
    </div>`;
  document.querySelector(".app").appendChild(overlay);
  setTimeout(() => document.getElementById("comment-input")?.focus(), 50);
}

async function sendComment(postId) {
  const inp = document.getElementById("comment-input");
  if (!inp || !inp.value.trim()) return;
  const text = inp.value.trim();
  inp.value = "";
  try {
    await apiFetch(`/feed/posts/${postId}/comments`, { method: "POST", body: JSON.stringify({ text }) });
    const comments = await apiFetch(`/feed/posts/${postId}/comments`);
    const listEl = document.getElementById("comments-list");
    if (listEl) {
      listEl.innerHTML =
        comments
          .map(
            (c) => `<div class="card" style="margin-bottom:8px;padding:12px">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
                <div class="letter-ava" style="width:30px;height:30px;font-size:13px;background:${c.author.avatar_color}">${escapeHtml(
        c.author.avatar
      )}</div>
                <div style="flex:1">
                  <div style="font-weight:700;font-size:13px">${escapeHtml(c.author.name)}</div>
                  <div style="font-size:11px;color:var(--text2)">${new Date(c.created_at).toLocaleString("ru-RU", {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "2-digit",
                    month: "2-digit",
                  })}</div>
                </div>
              </div>
              <div style="font-size:14px;line-height:1.5">${escapeHtml(c.text)}</div>
            </div>`
          )
          .join("") || '<div style="padding:18px;text-align:center;color:var(--text2)">Пока нет комментариев</div>';
    }
    await loadFeedPosts();
    renderContent();
  } catch (_) {}
}

async function afterLogin() {
  connectWs();
  await Promise.all([
    loadFriendsFromApi(),
    loadChatListFromApi(),
    loadFeedPosts(),
    loadProgressSummary(),
    loadChartSeries(),
    refreshLivePoint(),
  ]);
  renderNav();
  renderHeader();
  renderContent();
  const appEl = document.getElementById("app");
  if (appEl) appEl.style.background = tabGradients[currentTab] || tabGradients.community;
}

function initAuthUI() {
  const submit = document.getElementById("auth-submit");
  const toggle = document.getElementById("auth-toggle");
  const demo = document.getElementById("auth-demo");
  const nameWrap = document.getElementById("auth-name-wrap");
  const nameInput = document.getElementById("auth-name");
  let isReg = false;
  const errEl = document.getElementById("auth-error");

  function showErr(t) {
    if (!errEl) return;
    if (t) {
      errEl.textContent = t;
      errEl.hidden = false;
    } else {
      errEl.hidden = true;
    }
  }

  function syncToggleUi() {
    if (submit) submit.textContent = isReg ? "Создать аккаунт" : "Войти";
    if (toggle) toggle.textContent = isReg ? "Уже есть аккаунт" : "Регистрация";
    if (nameWrap) nameWrap.hidden = !isReg;
    if (nameInput) nameInput.hidden = !isReg;
  }

  toggle?.addEventListener("click", () => {
    isReg = !isReg;
    syncToggleUi();
    showErr("");
  });
  syncToggleUi();

  async function doAuth() {
    const email = document.getElementById("auth-email")?.value?.trim();
    const password = document.getElementById("auth-password")?.value || "";
    const name = document.getElementById("auth-name")?.value?.trim() || "Пользователь";
    showErr("");
    if (!email || password.length < 6) {
      showErr("Введите email и пароль не короче 6 символов.");
      return;
    }
    try {
      if (isReg) {
        const r = await apiFetch("/auth/register", {
          method: "POST",
          body: JSON.stringify({ email, password, name }),
        });
        authToken = r.access_token;
      } else {
        const r = await apiFetch("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        authToken = r.access_token;
      }
      localStorage.setItem("bootcamp_token", authToken);
      await syncUserFromApi();
      setAuthVisible(false);
      await afterLogin();
    } catch (e) {
      showErr(e.message || "Ошибка входа");
    }
  }

  submit?.addEventListener("click", doAuth);

  demo?.addEventListener("click", async () => {
    showErr("");
    const demoEmail = "demo@bootcamp.local";
    const demoPassword = "demo1234";
    try {
      try {
        const r = await apiFetch("/auth/register", {
          method: "POST",
          body: JSON.stringify({ email: demoEmail, password: demoPassword, name: user.name }),
        });
        authToken = r.access_token;
      } catch (_) {
        const r = await apiFetch("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email: demoEmail, password: demoPassword }),
        });
        authToken = r.access_token;
      }
      localStorage.setItem("bootcamp_token", authToken);
      await syncUserFromApi();
      setAuthVisible(false);
      await afterLogin();
    } catch (e) {
      showErr(e.message || "Демо недоступно. Запустите backend.");
    }
  });
}

function logout() {
  authToken = "";
  localStorage.removeItem("bootcamp_token");
  chatList = [];
  chatMsgs = [];
  chartSeriesFromApi = null;
  if (ws) {
    ws.close();
    ws = null;
  }
  if (geoWatchId != null) {
    navigator.geolocation.clearWatch(geoWatchId);
    geoWatchId = null;
  }
  setAuthVisible(true);
  renderNav();
  renderHeader();
  renderContent();
}

function connectWs() {
  if (!authToken) return;
  if (ws) ws.close();
  const url = API_BASE.replace("http://", "ws://").replace("https://", "wss://").replace("/api/v1", "");
  ws = new WebSocket(`${url}/ws?token=${encodeURIComponent(authToken)}`);
  ws.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data);
      if (payload.type === "chat:new_message") {
        const msg = payload.data;
        const isCurrent =
          currentDialog && (String(msg.sender_id) === String(currentDialog) || String(msg.recipient_id) === String(currentDialog));
        if (isCurrent) {
          chatMsgs.push({
            from: String(msg.sender_id) === String(currentUserId) ? "me" : "them",
            text: msg.text,
            category: msg.category || "Общее",
            time: new Date(msg.created_at).toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
          });
          renderContent();
          const msgsEl = document.getElementById("msgs");
          if (msgsEl) msgsEl.scrollTop = msgsEl.scrollHeight;
        }
        loadChatListFromApi().then(() => {
          if (currentTab === "community" && communitySubTab === "chats" && !currentDialog) renderContent();
        });
      }
      if (payload.type === "tracking:position_update") {
        const d = payload.data;
        livePoint = { lat: d.lat, lon: d.lon, accuracy: d.accuracy, speed: d.speed };
        clearTimeout(trackingUiTimer);
        trackingUiTimer = setTimeout(() => {
          if (currentTab === "progress") renderContent();
        }, 350);
      }
    } catch (_) {}
  };
}

async function loadProgressSummary() {
  try {
    progressSummary = await apiFetch("/progress/summary");
  } catch (_) {}
}

async function refreshLivePoint() {
  try {
    livePoint = await apiFetch("/tracking/live");
  } catch (_) {}
}

async function sendTrackPoint(position) {
  await apiFetch("/tracking/point", {
    method: "POST",
    body: JSON.stringify({
      lat: position.coords.latitude,
      lon: position.coords.longitude,
      accuracy: position.coords.accuracy,
      speed: position.coords.speed,
    }),
  });
  await refreshLivePoint();
  await loadProgressSummary();
  await loadChartSeries();
  if (currentTab === "progress") renderContent();
}

async function startTracking() {
  if (!navigator.geolocation) {
    alert("Геолокация недоступна в этом браузере.");
    return;
  }
  try {
    const started = await apiFetch("/tracking/start", { method: "POST" });
    activeTrackingSessionId = started.session_id;
  } catch (_) {
    return;
  }
  lastTrackSent = 0;
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      try {
        await sendTrackPoint(pos);
      } catch (_) {}
    },
    () => {},
    { enableHighAccuracy: true, maximumAge: 5000 }
  );
  if (geoWatchId != null) navigator.geolocation.clearWatch(geoWatchId);
  geoWatchId = navigator.geolocation.watchPosition(
    (pos) => {
      const now = Date.now();
      if (now - lastTrackSent < 12000) return;
      lastTrackSent = now;
      sendTrackPoint(pos).catch(() => {});
    },
    () => {},
    { enableHighAccuracy: true, maximumAge: 10000 }
  );
}

async function stopTracking() {
  activeTrackingSessionId = null;
  if (geoWatchId != null) {
    navigator.geolocation.clearWatch(geoWatchId);
    geoWatchId = null;
  }
  try {
    await apiFetch("/tracking/stop", { method: "POST" });
  } catch (_) {}
}

// #region agent log
function agentDebugLog(hypothesisId, location, message, data, runId = "run-1") {
  fetch('http://127.0.0.1:7901/ingest/e375e2ad-47db-4633-be57-d00484c4df7c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'46283f'},body:JSON.stringify({sessionId:'46283f',runId,hypothesisId,location,message,data,timestamp:Date.now()})}).catch(()=>{});
}
// #endregion

const progressSeries = {
  labels: ["пн", "вт", "ср", "чт", "пт", "сб", "вс"],
  weight: [90, 89.8, 89.6, 89.3, 89.1, 88.9, 88.7],
  calories: [2120, 1980, 1870, 2010, 1760, 1840, 1790],
  movement: [22, 34, 40, 38, 51, 57, 49],
  steps: [4200, 6800, 7300, 7900, 9600, 11200, 9800],
  distance: [2.8, 4.4, 5.2, 5.1, 6.7, 8.4, 7.5],
  activityTime: [28, 42, 47, 45, 58, 71, 64]
};

// ===== ICONS =====
function iconSvg(name, color = "#999") {
  const c = color;
  const icons = {
    // Profile - person outline with half-body, matching original
    profile: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    // Diary - pencil in rounded square (like the original edit icon)
    diary: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M13.5 7.5l3 3"/><path d="M7 17l0.5-3.5L14 7l3 3-6.5 6.5L7 17z"/></svg>`,
    // Chat - speech bubble with small rectangle inside (matching original monitor-bubble icon)  
    aichat: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><rect x="9" y="8" width="6" height="4" rx="0.5"/></svg>`,
    // Progress - bar chart 3 bars (matching original)
    progress: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="12" width="4" height="8" rx="1"/><rect x="10" y="6" width="4" height="14" rx="1"/><rect x="16" y="9" width="4" height="11" rx="1"/></svg>`,
    // Video - play triangle inside rounded rectangle (matching original)
    video: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2.5"/><polygon points="10 8 16 12 10 16" fill="${c === '#2BC4A7' ? c : 'none'}" stroke="${c}" stroke-width="1.5"/></svg>`,
    // Community - two people
    community: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    heart: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    heartFilled: `<svg width="20" height="20" viewBox="0 0 24 24" fill="#FF4757" stroke="#FF4757" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    comment: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    fire: `<svg width="26" height="26" viewBox="0 0 24 24" fill="#FF6B35"><path d="M12 23c-4.97 0-8-3.03-8-7 0-2.5 1.5-4.5 3-6 .5-.5 1.5-1.5 2-2.5C10 6 10 4 10 3c0 0 2 1 3 3s1 4 1 4c1-1.5 2-3 2-5 0 0 3 2.5 3 7 0 3.97-3.03 7-7 7zm-2-5c0 1.1.9 2 2 2s2-.9 2-2c0-1.5-1-2.5-2-4-1 1.5-2 2.5-2 4z"/></svg>`,
    fireSm: `<svg width="14" height="14" viewBox="0 0 24 24" fill="#FF6B35"><path d="M12 23c-4.97 0-8-3.03-8-7 0-2.5 1.5-4.5 3-6 .5-.5 1.5-1.5 2-2.5C10 6 10 4 10 3c0 0 2 1 3 3s1 4 1 4c1-1.5 2-3 2-5 0 0 3 2.5 3 7 0 3.97-3.03 7-7 7zm-2-5c0 1.1.9 2 2 2s2-.9 2-2c0-1.5-1-2.5-2-4-1 1.5-2 2.5-2 4z"/></svg>`,
    send: `<svg width="24" height="24" viewBox="0 0 24 24" fill="#2BC4A7"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>`,
    back: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>`,
    close: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    plus: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2BC4A7" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    chevron: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>`,
    medal1: `<svg width="18" height="18" viewBox="0 0 24 24"><circle cx="12" cy="14" r="7" fill="#FFD700" stroke="#DAA520" stroke-width="1.5"/><text x="12" y="18" text-anchor="middle" font-size="11" font-weight="bold" fill="#8B6914">1</text><path d="M8 2l4 8 4-8" fill="none" stroke="#DAA520" stroke-width="1.5"/></svg>`,
    medal2: `<svg width="18" height="18" viewBox="0 0 24 24"><circle cx="12" cy="14" r="7" fill="#C0C0C0" stroke="#999" stroke-width="1.5"/><text x="12" y="18" text-anchor="middle" font-size="11" font-weight="bold" fill="#666">2</text><path d="M8 2l4 8 4-8" fill="none" stroke="#999" stroke-width="1.5"/></svg>`,
    medal3: `<svg width="18" height="18" viewBox="0 0 24 24"><circle cx="12" cy="14" r="7" fill="#CD7F32" stroke="#8B5E3C" stroke-width="1.5"/><text x="12" y="18" text-anchor="middle" font-size="11" font-weight="bold" fill="#5C3A1E">3</text><path d="M8 2l4 8 4-8" fill="none" stroke="#8B5E3C" stroke-width="1.5"/></svg>`,
  };
  return icons[name] || '';
}

// ===== NAV =====
function renderNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  nav.innerHTML = tabs.map(t => `
    <button class="nav-btn ${currentTab === t.id ? 'active' : ''}" onclick="switchTab('${t.id}')">
      ${t.isNew ? '<div class="nav-new">NEW</div>' : ''}
      ${iconSvg(t.id, currentTab === t.id ? '#2BC4A7' : '#999')}
      <span class="nav-label">${t.label}</span>
    </button>
  `).join('');
}

// ===== HEADER =====
function renderHeader() {
  const h = document.getElementById('header');
  if (!h) return;
  const t = tabs.find(x => x.id === currentTab) || tabs[0];
  if (currentTab === 'profile') { h.style.display = 'none'; return; }
  h.style.display = 'flex';

  if (currentTab === 'community' && !currentDialog) {
    h.innerHTML = `
      <div class="header-spacer"></div>
      <span class="header-title">${t.title}</span>
      <button onclick="showStreak()" style="background:none;border:none;cursor:pointer;padding:4px;position:relative;display:flex;align-items:center">
        ${iconSvg('fire')}
        <span style="position:absolute;top:-2px;right:-6px;background:linear-gradient(135deg,var(--streak-or),var(--streak-yl));color:#fff;font-size:9px;font-weight:700;border-radius:8px;padding:1px 5px;border:1.5px solid var(--card);min-width:16px;text-align:center">${user.flames}</span>
      </button>`;
  } else {
    h.innerHTML = `<div style="width:24px"></div><span class="header-title">${t.title}</span><div style="width:24px"></div>`;
  }
}

// ===== SCREENS =====
// ===== TAB GRADIENTS =====
const tabGradients = {
  profile:   '#B7ABD9',
  diary:     'linear-gradient(140deg, #FFCC80 0%, #FFE0B2 30%, #FFF8E1 60%, #FFFDE7 100%)',
  community: 'linear-gradient(140deg, #80DEEA 0%, #B2EBF2 25%, #A5D6A7 55%, #E8F5E9 100%)',
  progress:  'linear-gradient(140deg, #9FA8DA 0%, #B3E5FC 35%, #E1F5FE 65%, #EDE7F6 100%)',
  video:     'linear-gradient(140deg, #F48FB1 0%, #CE93D8 30%, #E1BEE7 60%, #F3E5F5 100%)',
  aichat:    'linear-gradient(140deg, #4DB6AC 0%, #80CBC4 30%, #A5D6A7 60%, #E0F2F1 100%)',
};

function switchTab(id) {
  currentTab = id;
  currentDialog = null;
  communitySubTab = 'feed';
  feedFilter = 'all';
  const app = document.getElementById('app');
  if (app) app.style.background = tabGradients[id] || tabGradients.community;
  renderNav();
  renderHeader();
  if (id === "progress" && authToken) {
    Promise.all([loadChartSeries(), loadProgressSummary()]).then(() => renderContent());
  } else {
    renderContent();
  }
  const navEl = document.getElementById('nav');
  if (navEl) navEl.style.display = 'flex';
}

function renderContent() {
  const c = document.getElementById('content');
  if (!c) return;
  c.classList.toggle('dialog-open', currentTab === 'community' && !!currentDialog);
  // #region agent log
  const header = document.getElementById('header');
  const nav = document.getElementById('nav');
  const contentRect = c.getBoundingClientRect();
  agentDebugLog("H3", "js/app.js:286", "renderContent layout snapshot", {
    currentTab,
    currentDialog,
    contentTop: contentRect.top,
    contentHeight: contentRect.height,
    headerDisplay: header ? getComputedStyle(header).display : null,
    navDisplay: nav ? getComputedStyle(nav).display : null
  });
  // #endregion
  c.scrollTop = 0;
  switch(currentTab) {
    case 'profile': c.innerHTML = renderProfile(); break;
    case 'diary': c.innerHTML = renderDiary(); break;
    case 'aichat': c.innerHTML = renderAIChat(); break;
    case 'progress': c.innerHTML = renderProgress(); break;
    case 'video': c.innerHTML = renderVideo(); break;
    case 'community': c.innerHTML = currentDialog ? renderDialog() : renderCommunity(); break;
  }
}

function renderProfile() {
  const league = getLeague(user.flames);
  return `<div style="padding:0 16px 24px">
    <div class="profile-hero">
      <div class="profile-hero-row">
        <div>
          <div class="profile-hero-title">Текущая лига</div>
          <div class="profile-hero-value">${league.icon} ${league.name}</div>
        </div>
        <div style="text-align:right">
          <div class="profile-hero-title">Сезон</div>
          <div style="font-size:13px;font-weight:700;color:var(--text);margin-top:4px">${user.season.name}</div>
          <div style="font-size:12px;color:var(--text2);margin-top:2px">${user.season.rank}</div>
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:12px;padding-top:12px;border-top:1px solid var(--border)">
        <div><div class="profile-hero-title">Серия</div><div style="font-size:16px;font-weight:800;margin-top:4px">${user.streakDays} дн.</div></div>
        <div style="text-align:center"><div class="profile-hero-title">Огоньки</div><div style="font-size:16px;font-weight:800;margin-top:4px;color:var(--streak-or)">${user.flames}</div></div>
        <div style="text-align:right"><div class="profile-hero-title">Рекорд</div><div style="font-size:16px;font-weight:800;margin-top:4px">${user.recordFlames}</div></div>
      </div>
      <div class="profile-badges">${user.achievements.map(a => `<span class="profile-badge">${a}</span>`).join("")}${user.extraBadgeUnlocked ? `<span class="profile-badge">🏆 Экстра</span>` : ""}</div>
    </div>
    <div style="display:flex;justify-content:space-between;padding:12px 0">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
    </div>
    <div style="display:flex;align-items:center;gap:14px;margin-bottom:20px">
      <div class="letter-ava" style="width:56px;height:56px;font-size:24px;background:${user.avatarColor}">${user.avatar}</div>
      <span style="font-size:16px;font-weight:500">${user.email}</span>
    </div>
    <div class="card" style="display:flex;align-items:center;gap:14px;margin-bottom:12px"><span style="font-size:36px">🥗</span><span style="flex:1;font-weight:600;font-size:15px">Персональный план</span>${iconSvg('chevron')}</div>
    <div class="card" style="display:flex;align-items:center;gap:14px;margin-bottom:20px">
      <div style="width:44px;height:44px;border-radius:50%;background:var(--teal-light);display:flex;align-items:center;justify-content:center"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2BC4A7" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
      <div style="flex:1"><div style="display:flex;align-items:center;gap:8px"><span style="font-weight:600;font-size:15px">Здоровье и спорт</span><span style="font-size:12px;color:#E57373;font-weight:500">Отключено</span></div><span style="font-size:12px;color:var(--text2)">Синхронизируйте данные здоровья</span></div>${iconSvg('chevron')}
    </div>
    <h3 style="font-size:18px;font-weight:700;margin-bottom:16px">Основные данные</h3>
    ${[["Пол","Мужской"],["Возраст","18 лет"],["Рост","173 см"],["Вес","90.0 кг"],["ИМТ","30,1 кг/м²"],["Цель","Снизить вес"]].map(([l,v],i)=>`<div style="display:flex;justify-content:space-between;padding:14px 0;${i<5?'border-bottom:1px solid var(--border)':''}"><span style="font-size:15px">${l}</span><span style="font-size:15px;font-weight:500">${v}</span></div>`).join('')}
    <button type="button" style="width:100%;padding:14px;border-radius:28px;border:1px solid var(--border);background:var(--card);font-size:15px;font-weight:500;cursor:pointer;margin-top:8px">Изменить цель</button>
    <button type="button" class="auth-btn auth-btn-ghost" style="width:100%;margin-top:12px" onclick="logout()">Выйти из аккаунта</button>
  </div>`;
}

function renderDiary() {
  const items=[{icon:"🥗",title:"Питание",label:"0 из 1955 ккал"},{icon:"💧",title:"Вода",label:"Выпито 0 из 2 л"},{icon:"🏃",title:"Активность",label:"0 из 500 ккал"},{icon:"😴",title:"Сон",label:null}];
  return `<div style="padding:0 16px 24px">
    <div class="card" style="margin:16px 0 12px">
      <div style="display:flex;align-items:center;gap:12px">
        <div style="width:44px;height:44px;border-radius:50%;background:var(--teal-light);display:flex;align-items:center;justify-content:center"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2BC4A7" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg></div>
        <span style="font-weight:600;font-size:16px;flex:1">Мой вес: ${user.weight} кг</span>${iconSvg('plus')}
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:12px;font-size:13px;color:var(--text2)"><span>старт<br><strong style="color:var(--text);font-size:15px">${user.weight} кг</strong></span><span style="text-align:right">цель<br><strong style="color:var(--text);font-size:15px">${user.goalWeight} кг</strong></span></div>
      <div class="pbar"><div class="pbar-fill" style="width:0%;background:var(--teal)"></div></div>
    </div>
    ${items.map(it=>`<div class="card" style="margin-bottom:12px"><div style="display:flex;align-items:center;justify-content:space-between"><div style="display:flex;align-items:center;gap:10px"><span style="font-size:28px">${it.icon}</span><span style="font-weight:600;font-size:15px">${it.title}</span></div>${iconSvg('plus')}</div>${it.label?`<p style="font-size:14px;color:var(--text2);margin-top:8px">${it.label}</p><div class="pbar"><div class="pbar-fill" style="width:0%;background:var(--lavender)"></div></div>`:''}</div>`).join('')}
  </div>`;
}

const AI_QUICK = {
  Питание: "Держите дефицит 300–500 ккал, белок 1.6–2 г/кг, больше овощей и воды.",
  Активность: "Сочетайте шаги 8–10 тыс. и 2–3 силовые в неделю по 30–45 мин.",
  Сон: "Ложитесь в одно время, экраны за час до сна, прохладная комната.",
  Мотивация: "Маленькие цели на неделю лучше, чем «идеал через месяц».",
  Привычки: "Один триггер: после завтрака — стакан воды; после обеда — 10 минут ходьбы.",
};

function aiQuickReply(category) {
  const tip = AI_QUICK[category] || "Запишите вопрос в поле ниже — подскажу по шагам.";
  aiChatMessages.push({ role: "user", category, text: `Тема: ${category}` });
  aiChatMessages.push({ role: "bot", category: "Ответ", html: tip });
  renderContent();
  setTimeout(() => {
    const el = document.getElementById("ai-chat-scroll");
    if (el) el.scrollTop = el.scrollHeight;
  }, 50);
}

function aiSendUserMessage() {
  const inp = document.getElementById("ai-chat-input");
  if (!inp || !inp.value.trim()) return;
  const text = inp.value.trim();
  inp.value = "";
  aiChatMessages.push({ role: "user", category: "Вопрос", text });
  const low = text.toLowerCase();
  let reply = "Продолжайте вести дневник — так проще видеть прогресс.";
  if (/вес|ккал|еда|питание/.test(low)) reply = AI_QUICK["Питание"];
  else if (/шаг|бег|трен|спорт/.test(low)) reply = AI_QUICK["Активность"];
  else if (/сон|спать/.test(low)) reply = AI_QUICK["Сон"];
  aiChatMessages.push({ role: "bot", category: "Ответ", html: reply });
  renderContent();
  setTimeout(() => {
    const el = document.getElementById("ai-chat-scroll");
    if (el) el.scrollTop = el.scrollHeight;
  }, 50);
}

function renderAIChat() {
  const chips = ["Питание", "Активность", "Сон", "Мотивация", "Привычки"];
  const body = aiChatMessages
    .map((m) => {
      if (m.role === "bot") {
        return `<div class="card" style="margin-bottom:10px;font-size:14px;line-height:1.6;border-left:3px solid var(--teal)">
          ${m.category ? `<div class="msg-cat">${escapeHtml(m.category)}</div>` : ""}
          <div>${m.html}</div>
        </div>`;
      }
      return `<div style="text-align:right;margin-bottom:8px"><span style="display:inline-block;background:var(--teal-light);padding:10px 14px;border-radius:16px 16px 4px 16px;font-size:14px;text-align:left;max-width:92%">
        ${m.category ? `<div class="msg-cat" style="text-align:left">${escapeHtml(m.category)}</div>` : ""}
        ${escapeHtml(m.text)}
      </span></div>`;
    })
    .join("");
  return `<div id="ai-chat-scroll" style="flex:1;overflow-y:auto;padding:16px">
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">
      ${chips.map((c) => `<button type="button" class="chip chip-sm" onclick="aiQuickReply('${c}')">${c}</button>`).join("")}
    </div>
    ${body}
  </div>
  <div style="border-top:1px solid var(--border);padding:10px 16px;background:var(--card)">
    <div style="display:flex;gap:8px;align-items:center">
      <input id="ai-chat-input" class="auth-input" style="margin:0;flex:1;padding:10px 14px;border-radius:20px;font-size:14px" placeholder="Напишите вопрос..." onkeydown="if(event.key==='Enter')aiSendUserMessage()">
      <button type="button" class="auth-btn auth-btn-primary" style="padding:10px 16px;border-radius:20px" onclick="aiSendUserMessage()">Отправить</button>
    </div>
    <p style="font-size:11px;color:var(--text2);text-align:center;margin-top:8px">Подсказки носят общий характер и не заменяют врача.</p>
  </div>`;
}

function renderProgress() {
  const ps = getProgressSeries();
  const seriesByMetric = {
    weight: { label: "Вес", unit: "кг", values: ps.weight, color: "#2BC4A7", targetText: "Цель: 70 кг", precision: 1 },
    calories: { label: "Калории", unit: "ккал", values: ps.calories, color: "#FF9800", targetText: "Дефицит: 1800 ккал/день", precision: 0 },
    movement: { label: "Движение", unit: "мин", values: ps.movement, color: "#9C27B0", targetText: "Цель: 60 мин/день", precision: 0 },
    steps: { label: "Шаги", unit: "", values: ps.steps, color: "#3F51B5", targetText: "Цель: 10 000 шагов", precision: 0 },
  };
  const active = seriesByMetric[progressMetric] || seriesByMetric.weight;
  const values = active.values;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values.map((v, i) => {
    const x = 20 + (i * 45);
    const y = 130 - ((v - min) / range) * 88;
    return `${x},${y}`;
  }).join(" ");
  const latest = values[values.length - 1];
  const prev = values[values.length - 2] ?? latest;
  const trend = latest - prev;
  const trendText = `${trend >= 0 ? "+" : ""}${trend.toFixed(active.precision)} ${active.unit}`.trim();

  const bars = ps.activityTime.map((v, i) => {
    const h = Math.max(10, (v / 75) * 90);
    const x = 20 + i * 45;
    return `<rect x="${x}" y="${104 - h}" width="24" height="${h}" rx="6" fill="${i === 6 ? '#2BC4A7' : '#CFECE3'}"></rect>`;
  }).join("");

  const routePath = "M28,138 C48,116 66,116 82,98 C98,82 112,86 124,70 C136,56 148,60 162,50 C178,38 198,44 214,58 C228,70 238,84 246,104 C252,120 262,130 282,136";

  return `<div style="padding:0 16px 24px">
    <div style="background:var(--yellow-bg);border-radius:12px;padding:14px;margin:16px 0;font-size:13px;color:var(--yellow-text);line-height:1.5">Все данные взяты из дневника. Точность ввода влияет на результат</div>
    <h2 style="font-size:20px;font-weight:700;margin-bottom:4px">Снижение веса</h2>
    <p style="font-size:13px;color:var(--text2);margin-bottom:16px">Срок программы 20 недель</p>
    <div style="font-size:14px;line-height:1.8;margin-bottom:12px">
      Вес: <strong>${ps.weight[6].toFixed(1)} кг</strong><br>
      Движение: <strong>${ps.movement[6]} мин/день</strong><br>
      Шаги: <strong>${ps.steps[6].toLocaleString('ru-RU')} в день</strong>
    </div>
    <div class="card" style="margin-bottom:12px">
      <div style="font-weight:700;font-size:14px;margin-bottom:8px">Трекинг и API</div>
      <div class="tracking-strip" style="margin-bottom:8px">
        <span>Сообщений: <strong class="tracking-live">${progressSummary.messages_sent || 0}</strong></span>
        <span>Точек GPS: <strong class="tracking-live">${progressSummary.points_recorded || 0}</strong></span>
        ${activeTrackingSessionId ? '<span class="tracking-live">● запись</span>' : ""}
      </div>
      <div style="font-size:13px;line-height:1.7;color:var(--text2)">
        Последняя позиция:
        <strong style="color:var(--text)">
          ${livePoint ? `${Number(livePoint.lat).toFixed(5)}, ${Number(livePoint.lon).toFixed(5)}` : "нет данных — нажмите «Старт»"}
        </strong>
      </div>
      <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">
        <button type="button" class="chip chip-sm active" onclick="startTracking()">Старт трекинга</button>
        <button type="button" class="chip chip-sm" onclick="stopTracking()">Стоп</button>
        <button type="button" class="chip chip-sm" onclick="loadChartSeries().then(()=>renderContent())">Обновить графики</button>
      </div>
    </div>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text2)" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg><span style="font-size:14px;font-weight:500">Текущая неделя</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text2)" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></div>
    <div class="metric-switch">${[
      ["weight", "Вес"],
      ["calories", "Калории"],
      ["movement", "Движение"],
      ["steps", "Шаги"]
    ].map(([key, label]) => `<button class="metric-btn ${progressMetric===key?'active':''}" onclick="setProgressMetric('${key}')">${label}</button>`).join('')}</div>

    <div class="chart-card">
      <div class="chart-title">${active.label}: ${latest.toFixed(active.precision)} ${active.unit}</div>
      <div class="chart-sub">${active.targetText} · тренд за день: ${trendText}</div>
      <svg width="100%" viewBox="0 0 320 160" preserveAspectRatio="none" style="height:170px">
        <defs>
          <linearGradient id="metricFill-${progressMetric}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${active.color}" stop-opacity="0.32"></stop>
            <stop offset="100%" stop-color="${active.color}" stop-opacity="0.02"></stop>
          </linearGradient>
        </defs>
        ${ps.labels.map((_, i) => `<line x1="${20 + i * 45}" y1="20" x2="${20 + i * 45}" y2="130" stroke="#EEF5F3" stroke-width="1"></line>`).join("")}
        <polyline fill="url(#metricFill-${progressMetric})" stroke="none" points="${points} 290,130 20,130"></polyline>
        <polyline fill="none" stroke="${active.color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="${points}"></polyline>
        ${values.map((v, i) => {
          const x = 20 + (i * 45);
          const y = 130 - ((v - min) / range) * 88;
          return `<circle cx="${x}" cy="${y}" r="${i===6?5:3.5}" fill="${i===6?active.color:'#fff'}" stroke="${active.color}" stroke-width="2"></circle>`;
        }).join("")}
        ${ps.labels.map((d, i) => `<text x="${20 + i * 45}" y="151" text-anchor="middle" font-size="10" fill="${i===6?'#2BC4A7':'#8A9491'}">${d}</text>`).join("")}
      </svg>
    </div>

    <div class="chart-card">
      <div class="chart-title">Время активности</div>
      <div class="chart-sub">Минуты движения по дням недели</div>
      <svg width="100%" viewBox="0 0 320 120" preserveAspectRatio="none" style="height:125px">
        <line x1="14" y1="104" x2="306" y2="104" stroke="#E5EFEC"></line>
        ${bars}
        ${ps.labels.map((d, i) => `<text x="${32 + i * 45}" y="116" text-anchor="middle" font-size="10" fill="#8A9491">${d}</text>`).join("")}
      </svg>
    </div>

    <div class="chart-card">
      <div class="chart-title">Траектория и путь за сегодня</div>
      <div class="chart-sub">Маршрут прогулки + динамика времени</div>
      <div class="route-map">
        <div class="route-grid"></div>
        <svg width="100%" height="100%" viewBox="0 0 300 170" preserveAspectRatio="none" style="position:absolute;inset:0">
          <path d="${routePath}" fill="none" stroke="#2BC4A7" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"></path>
          <circle cx="28" cy="138" r="7" fill="#fff" stroke="#2BC4A7" stroke-width="3"></circle>
          <circle cx="282" cy="136" r="8" fill="#2BC4A7"></circle>
        </svg>
      </div>
      <div class="route-stats">
        <div class="route-stat"><div class="route-stat-k">Путь</div><div class="route-stat-v">${ps.distance[6].toFixed(1)} км</div></div>
        <div class="route-stat"><div class="route-stat-k">Время</div><div class="route-stat-v">01:14:00</div></div>
        <div class="route-stat"><div class="route-stat-k">Темп</div><div class="route-stat-v">9:52 /км</div></div>
      </div>
    </div>
  </div>`;
}

function setProgressMetric(metric) {
  progressMetric = metric;
  requestAnimationFrame(() => renderContent());
}

function setVideoCat(i) {
  videoCatIndex = i;
  requestAnimationFrame(() => renderContent());
}

function renderVideo() {
  const cats=["Все видео","Руки и плечи","Спина","Грудь"];
  const vids=[{title:"Собака мордой вниз",dur:"00:13"},{title:"Прыжки с махами рук",dur:"00:13"},{title:"Приседание и подъем ног",dur:"00:13"}];
  return `<div style="padding:0 16px 24px">
    <div class="video-cat-row" style="display:flex;gap:8px;margin:16px 0;overflow-x:auto">${cats.map((c,i)=>`<button type="button" class="chip ${i===videoCatIndex?'active':''}" onclick="setVideoCat(${i})">${c}</button>`).join('')}</div>
    ${vids.map(v=>`<div style="background:#F0EDE5;border-radius:16px;margin-bottom:12px;height:180px;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center"><span style="font-size:48px;opacity:0.3">🏋️</span><div style="position:absolute;top:12px;left:12px;background:#2BC4A7DD;color:#fff;padding:4px 12px;border-radius:8px;font-size:13px;font-weight:500">${v.title}</div><div style="position:absolute;bottom:12px;left:12px;background:#2BC4A7DD;color:#fff;padding:4px 10px;border-radius:12px;font-size:12px;font-weight:600">${v.dur}</div></div>`).join('')}
  </div>`;
}

// ===== COMMUNITY =====
function renderCommunity() {
  return `
    <div class="subtabs">
      <button class="subtab ${communitySubTab==='feed'?'active':''}" onclick="setCommunitySubTab('feed')">Лента</button>
      <button class="subtab ${communitySubTab==='chats'?'active':''}" onclick="setCommunitySubTab('chats')">Чаты</button>
    </div>
    <div style="flex:1;overflow-y:auto" id="community-content">
      ${communitySubTab === 'feed' ? renderFeed() : renderChatList()}
    </div>
    <button class="fab" onclick="showCreatePost()">+</button>`;
}

async function setCommunitySubTab(t) {
  communitySubTab = t;
  if (t === "chats") await loadChatListFromApi();
  renderContent();
}

function isPostInMyLeague(p) {
  if (p.userId === "me") return true;
  const u = getFriend(p.userId);
  return u && sameLeague(u.flames, user.flames);
}

function renderFeed() {
  const myLeague = getLeague(user.flames);
  const leagueFriends = friends.filter(f => sameLeague(f.flames, user.flames));
  const allUsers = [{ id: "me", ...user }, ...leagueFriends];
  const filters=[{id:"all",label:"Все"},{id:"Активность",label:"Активность"},{id:"Рецепт",label:"Рецепты"},{id:"Мотивация",label:"Мотивация"},{id:"Результат",label:"Результаты"}];
  const inLeaguePosts = feedLoaded ? feedPosts : posts.filter(isPostInMyLeague);
  const filtered = feedFilter === 'all' ? inLeaguePosts : inLeaguePosts.filter(p => p.tag === feedFilter);

  return `
    <div class="feed-league-banner">Лента <strong>${myLeague.icon} ${myLeague.name}</strong>: вы видите сторис и посты людей вашего ранга — без сравнения с «легендами» из других лиг.</div>
    <div class="stories">${allUsers.map(u=>`<div class="story"><div class="story-ring ${(u.flames||0)>0?'':'no-streak'}"><div class="story-avatar" style="position:relative"><div class="letter-ava" style="width:43px;height:43px;font-size:18px;background:${u.avatarColor||'#2BC4A7'}">${u.avatar}</div>${u.todayActive?'<div class="today-dot"></div>':''}</div>${(u.flames||0)>0?`<div class="story-badge">🔥${u.flames}</div>`:''}</div><span class="story-name">${u.id==='me'?'Вы':u.name}</span></div>`).join('')}</div>
    <div style="height:1px;background:var(--border)"></div>
    <div style="display:flex;gap:6px;padding:10px 16px;overflow-x:auto">${filters.map(f=>`<button class="chip chip-sm ${feedFilter===f.id?'active':''}" onclick="setFeedFilter('${f.id}')">${f.label}</button>`).join('')}</div>
    ${filtered.map(p=>{
      const isApi = !!p.author;
      const u = isApi ? { id: String(p.author.id), name: p.author.name, avatar: p.author.avatar, avatarColor: p.author.avatar_color, flames: 0 } : (p.userId==="me"?{id:"me",...user}:getFriend(p.userId));
      if(!u) return '';
      const ts=tagStyleFor(p.tag);
      const pid = isApi ? p.id : p.id;
      const likes = isApi ? p.likes : p.likes;
      const comments = isApi ? p.comments : p.comments;
      const liked = isApi ? p.liked_by_me : p.liked;
      const timeText = isApi ? new Date(p.created_at).toLocaleString('ru-RU', { hour:'2-digit', minute:'2-digit', day:'2-digit', month:'2-digit' }) : p.time;
      return `<div class="card post">
      <div class="post-header">
        <div class="letter-ava" style="width:38px;height:38px;font-size:15px;background:${u.avatarColor}">${u.avatar}</div>
        <div style="flex:1"><div style="display:flex;align-items:center"><span class="post-name">${escapeHtml(u.name)}</span>${!isApi?`<span class="post-streak">🔥${u.flames||0}</span>`:''}</div><span class="post-time">${timeText}</span></div>
        ${p.tag?`<span class="post-tag" style="background:${ts.bg};color:${ts.text}">${p.tag}</span>`:''}
      </div>
      <p class="post-text">${escapeHtml(p.text)}</p>
      ${p.emoji?`<div class="post-emoji">${escapeHtml(p.emoji)}</div>`:''}
      <div class="post-actions">
        <button class="post-btn ${liked?'liked':''}" onclick="${isApi?`toggleFeedLike(${pid})`:`toggleLike(${pid})`}">${liked?iconSvg('heartFilled'):iconSvg('heart')} ${likes}</button>
        <button class="post-btn" onclick="${isApi?`openComments(${pid})`:`openComments(${pid})`}">${iconSvg('comment')} ${comments}</button>
      </div>
    </div>`}).join('')}
    <div style="height:16px"></div>`;
}

function renderChatList() {
  return `<div class="search-bar">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    <input placeholder="Поиск друзей..." oninput="filterChats(this.value)">
  </div>
  <div id="chat-list-items">${renderChatItems('')}</div>`;
}

async function loadChatListFromApi() {
  try {
    const rows = await apiFetch("/chats");
    chatList = rows.map((r) => ({
      userId: String(r.user_id),
      lastMsg: r.last_message,
      lastCategory: r.last_message_category || "Общее",
      time: new Date(r.last_message_at).toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
      unread: 0,
    }));
  } catch (_) {}
}

async function loadDialogFromApi(userId) {
  try {
    const rows = await apiFetch(`/chats/${userId}/messages`);
    chatMsgs = rows.map((r) => ({
      from: String(r.sender_id) === String(currentUserId) ? "me" : "them",
      text: r.text,
      category: r.category || "Общее",
      time: new Date(r.created_at).toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
    }));
  } catch (_) {}
}

function renderChatItems(query) {
  const q = query.toLowerCase();
  return chatList.filter(c => {
    const u = getFriend(c.userId);
    return u && (!q || u.name.toLowerCase().includes(q));
  }).map(c=>{const u=getFriend(c.userId);return `<div class="chat-item" onclick="openDialog('${c.userId}')">
    <div class="chat-avatar"><div class="letter-ava" style="width:48px;height:48px;font-size:20px;background:${u.avatarColor}">${u.avatar}</div>${u.todayActive?'<div class="today-dot" style="top:2px;right:2px"></div>':''}${u.flames>0?`<div class="chat-streak-badge">🔥${u.flames}</div>`:''}</div>
    <div style="flex:1;min-width:0">
      <div style="display:flex;justify-content:space-between"><span class="chat-name">${u.name}</span><span class="chat-time">${c.time}</span></div>
      <div style="display:flex;justify-content:space-between;margin-top:2px;align-items:center;gap:6px"><span class="msg-cat" style="flex-shrink:0">${escapeHtml(c.lastCategory || "Общее")}</span><span class="chat-last" style="flex:1;min-width:0">${escapeHtml(c.lastMsg)}</span>${c.unread>0?`<span class="chat-unread">${c.unread}</span>`:''}</div>
    </div>
  </div>`}).join('') || '<div style="padding:40px;text-align:center;color:var(--text2);font-size:14px">Ничего не найдено</div>';
}

function filterChats(query) {
  const el = document.getElementById('chat-list-items');
  if (el) el.innerHTML = renderChatItems(query);
}

function renderDialog() {
  const u = getFriend(currentDialog);
  return `
    <div class="dialog-header">
      <button class="dialog-back" onclick="closeDialog()">${iconSvg('back')}</button>
      <div class="letter-ava" style="width:36px;height:36px;font-size:15px;background:${u.avatarColor}">${u.avatar}</div>
      <div><div style="font-weight:600;font-size:15px">${u.name}</div><div style="font-size:11px;color:var(--streak-or);font-weight:600">🔥 Серия: ${u.flames} дней</div></div>
    </div>
    <div class="dialog-messages" id="msgs">
      ${chatMsgs.map(m=>`<div class="msg ${m.from}">${m.category ? `<div class="msg-cat">${escapeHtml(m.category)}</div>` : ''}<div class="msg-bubble">${escapeHtml(m.text)}</div><div class="msg-time">${m.time}</div></div>`).join('')}
    </div>
    <div class="dialog-input-row">
      <select id="msg-category" class="dialog-category" aria-label="Категория">
        ${MESSAGE_CATEGORIES.map((c) => `<option value="${String(c).replace(/"/g, "&quot;")}">${escapeHtml(c)}</option>`).join("")}
      </select>
      <div class="dialog-input" style="border-top:none;padding:0">
        <input id="msg-input" placeholder="Сообщение..." onkeydown="if(event.key==='Enter')sendMsg()">
        <button type="button" onclick="sendMsg()">${iconSvg('send')}</button>
      </div>
    </div>`;
}

// ===== ACTIONS =====
function toggleLike(id) {
  const p = posts.find(x => x.id === id);
  if (p) { p.liked = !p.liked; p.likes += p.liked ? 1 : -1; }
  renderContent();
}

function setFeedFilter(f) {
  feedFilter = f;
  if (communitySubTab === "feed" && authToken) {
    loadFeedPosts().then(() => renderContent());
  } else {
    renderContent();
  }
}

async function openDialog(userId) {
  currentDialog = userId;
  const header = document.getElementById('header');
  const nav = document.getElementById('nav');
  if (header) header.style.display = 'none';
  if (nav) nav.style.display = 'none';
  // #region agent log
  agentDebugLog("H4", "js/app.js:588", "openDialog toggled bars", {
    userId,
    headerDisplay: header ? getComputedStyle(header).display : null,
    navDisplay: nav ? getComputedStyle(nav).display : null
  });
  // #endregion
  await loadDialogFromApi(userId);
  renderContent();
}

function closeDialog() {
  currentDialog = null;
  const header = document.getElementById('header');
  const nav = document.getElementById('nav');
  if (header) header.style.display = 'flex';
  if (nav) nav.style.display = 'flex';
  renderHeader();
  renderContent();
}

async function sendMsg() {
  const input = document.getElementById('msg-input');
  const catEl = document.getElementById('msg-category');
  if (!input || !input.value.trim()) return;
  const text = input.value.trim();
  const category = (catEl && catEl.value) || "Общее";
  const time = new Date().toLocaleTimeString('ru', { hour:'2-digit', minute:'2-digit' });
  chatMsgs.push({ from:'me', text, category, time });
  input.value = '';
  renderContent();
  try {
    await apiFetch(`/chats/${currentDialog}/messages`, {
      method: "POST",
      body: JSON.stringify({ text, category }),
    });
    await loadChatListFromApi();
  } catch (_) {}
  const msgs = document.getElementById('msgs');
  if (msgs) msgs.scrollTop = msgs.scrollHeight;
}

function showStreak() {
  document.querySelectorAll('.streak-backdrop,.streak-popup').forEach(e=>e.remove());

  const leaguePeers = friends.filter(f => sameLeague(f.flames, user.flames));
  const allUsers = [{ id: "me", ...user }, ...leaguePeers].sort((a, b) => (b.flames || 0) - (a.flames || 0));
  const league = getLeague(user.flames);
  const nextLeague = getNextLeague(user.flames);
  const challenges = getTodayChallenges();
  const extra = getTodayExtra();
  const extraDone = extra && extra.completed;
  const todayCount = (user.todayFlames.challenge ? 1 : 0) + (user.todayFlames.goal ? 1 : 0) + (extraDone ? 2 : 0);
  const maxToday = extra ? 4 : 2;

  const backdrop = document.createElement('div');
  backdrop.className = 'streak-backdrop';
  backdrop.onclick = hideStreak;

  const popup = document.createElement('div');
  popup.className = 'streak-popup';
  popup.innerHTML = `
    <div class="streak-handle"></div>
    <button class="streak-close" onclick="hideStreak()">${iconSvg('close')}</button>
    <div style="clear:both"></div>

    <!-- League Hero -->
    <div class="streak-hero" style="background:${league.bg}">
      <div style="font-size:32px;position:relative">${league.icon}</div>
      <div style="font-size:12px;opacity:0.9;position:relative;margin-top:4px">${league.name}</div>
      <div class="streak-number">${user.flames}</div>
      <div class="streak-label">огоньков 🔥</div>
      ${nextLeague ? `<div style="font-size:11px;opacity:0.8;margin-top:6px;position:relative">До ${nextLeague.icon} ${nextLeague.name}: ${nextLeague.min - user.flames} 🔥</div>
      <div style="background:rgba(255,255,255,0.2);border-radius:4px;height:6px;margin:8px 30px 0;overflow:hidden;position:relative"><div style="background:#fff;height:100%;border-radius:4px;width:${Math.min(100, ((user.flames - league.min) / (league.max - league.min + 1)) * 100)}%"></div></div>` : '<div style="font-size:11px;opacity:0.8;margin-top:6px;position:relative">Максимальная лига! 👑</div>'}
    </div>

    <!-- Серия +50% и прогресс целей недели (сценарий слайдов 3 и 6) -->
    <div style="margin:0 20px 12px;background:#E8F8F4;border-radius:14px;padding:12px 14px;border:1px solid rgba(43,196,167,0.25)">
      <div style="font-weight:700;font-size:12px;color:var(--text);margin-bottom:4px">Серия и бонус</div>
      <div style="font-size:11px;color:var(--text2);line-height:1.45">${user.streakDays} дней подряд — надбавка к огонькам до <strong>+50%</strong>. Цели недели: <strong>${user.goalsWeek.done}/${user.goalsWeek.total}</strong> дней выполнено.</div>
    </div>

    <!-- Today's flames -->
    <div style="margin:0 20px 12px;background:#FFF8E1;border-radius:16px;padding:14px;display:flex;align-items:center;justify-content:center;gap:12px">
      <div style="text-align:center">
        <div style="font-size:24px;${user.todayFlames.challenge?'':'opacity:0.3'}">🔥</div>
        <div style="font-size:9px;color:${user.todayFlames.challenge?'var(--streak-or)':'var(--text2)'};font-weight:600;margin-top:2px">Челлендж</div>
      </div>
      <div style="text-align:center">
        <div style="font-size:24px;${user.todayFlames.goal?'':'opacity:0.3'}">🔥</div>
        <div style="font-size:9px;color:${user.todayFlames.goal?'var(--streak-or)':'var(--text2)'};font-weight:600;margin-top:2px">Цель</div>
      </div>
      ${extra ? `<div style="text-align:center">
        <div style="font-size:24px;${extraDone?'':'opacity:0.3'}">🔥</div>
        <div style="font-size:9px;color:${extraDone?'#D93025':'var(--text2)'};font-weight:600;margin-top:2px">Экстра</div>
      </div>` : ''}
      <div style="text-align:center;margin-left:4px">
        <div style="font-size:18px;font-weight:800;color:var(--streak-or)">${todayCount}/${maxToday}</div>
        <div style="font-size:9px;color:var(--text2)">сегодня</div>
      </div>
    </div>

    <!-- Penalty info -->
    <div style="margin:0 20px 12px;background:#FFF;border:1px solid var(--border);border-radius:14px;padding:10px 12px;font-size:11px;color:var(--text2);display:flex;align-items:center;gap:8px">
      <span style="font-size:16px">ℹ️</span>
      <span>Пропуск 1 дня — минус 1 🔥. Пропуск 2+ дней — минус 3 🔥</span>
    </div>

    <!-- Freeze -->
    <div style="margin:0 20px 12px;background:#F3ECF7;border-radius:14px;padding:10px 12px;display:flex;align-items:center;gap:8px">
      <span style="font-size:18px">❄️</span>
      <div style="flex:1"><span style="font-weight:600;font-size:12px">Заморозки: ${user.freezesLeft}/3</span> <span style="font-size:11px;color:var(--text2)">· на месяц</span></div>
      ${user.freezesLeft > 0 ? `<button onclick="useFreeze()" style="background:none;border:1px solid #9C27B0;color:#9C27B0;border-radius:12px;padding:3px 10px;font-size:10px;font-weight:600;cursor:pointer">Использовать</button>` : ''}
    </div>

    <!-- Challenges (flame 1) -->
    <div style="margin:0 20px 12px">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
        <span style="font-size:16px">${user.todayFlames.challenge?'🔥':'⚪'}</span>
        <span style="font-weight:600;font-size:14px">Огонёк за челлендж</span>
      </div>
      <div style="font-size:11px;color:var(--text2);margin-bottom:8px">Выполни любой из пяти</div>
      ${challenges.map((ch, i) => `
        <div style="background:${ch.completed ? 'var(--teal-light)' : '#FFF'};border:1px solid ${ch.completed ? 'var(--teal)' : 'var(--border)'};border-radius:14px;padding:10px 12px;margin-bottom:6px;display:flex;align-items:center;gap:8px">
          <span style="font-size:20px">${ch.icon}</span>
          <div style="flex:1">
            <div style="font-size:10px;color:var(--text2);font-weight:600">${ch.catIcon} ${ch.category}</div>
            <div style="font-size:12px;font-weight:500;color:var(--text)">${ch.text}</div>
          </div>
          ${ch.completed
            ? '<span style="font-size:11px;color:var(--teal);font-weight:600">✅</span>'
            : (user.todayFlames.challenge
              ? '<span style="font-size:10px;color:var(--text2)">—</span>'
              : `<button onclick="completeChallenge(${i})" style="background:var(--teal);color:#fff;border:none;border-radius:12px;padding:5px 12px;font-size:10px;font-weight:600;cursor:pointer">Готово</button>`)
          }
        </div>
      `).join('')}
    </div>

    <!-- Extra Bonus Challenge -->
    ${extra ? `
    <div style="margin:0 20px 12px">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
        <span style="font-size:16px">${extraDone?'🔥':'💀'}</span>
        <span style="font-weight:600;font-size:14px;color:#D93025">Экстра-челлендж</span>
        <span style="font-size:10px;background:#FDE8E8;color:#D93025;padding:2px 8px;border-radius:8px;font-weight:600">+2 бонус 🔥🔥</span>
      </div>
      <div style="background:${extraDone?'var(--teal-light)':'#FFF'};border:2px solid ${extraDone?'var(--teal)':'#D93025'};border-radius:14px;padding:12px;display:flex;align-items:center;gap:10px">
        <span style="font-size:24px">${extra.icon}</span>
        <div style="flex:1">
          <div style="font-size:10px;color:#D93025;font-weight:700">${extra.catIcon} ${extra.category}</div>
          <div style="font-size:13px;font-weight:600;color:var(--text)">${extra.text}</div>
        </div>
        ${extraDone
          ? '<span style="font-size:12px;color:var(--teal);font-weight:600">✅</span>'
          : `<button onclick="completeExtra()" style="background:#D93025;color:#fff;border:none;border-radius:12px;padding:6px 14px;font-size:10px;font-weight:600;cursor:pointer">Выполнено</button>`
        }
      </div>
    </div>
    ` : ''}

    <!-- Weekly Goals from AI (flame 2) -->
    <div style="margin:0 20px 16px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
        <div style="display:flex;align-items:center;gap:6px">
          <span style="font-size:16px">${user.todayFlames.goal?'🔥':'⚪'}</span>
          <span style="font-weight:600;font-size:14px">Огонёк за цель дня</span>
        </div>
      </div>
      <div style="font-size:11px;color:var(--text2);margin-bottom:4px;display:flex;align-items:center;gap:4px">
        <span style="font-size:12px">🤖</span> Цели подобраны ИИ-ассистентом на эту неделю
      </div>
      <div style="font-size:11px;color:var(--text2);margin-bottom:6px">Прогресс недели: <strong>${user.goalsWeek.done}</strong> из <strong>${user.goalsWeek.total}</strong> дней</div>
      <div style="font-size:10px;color:var(--teal);margin-bottom:8px;font-weight:500">Выполни обе цели за день</div>

      ${user.goals.map((g, i) => `
        <div style="background:${g.done?'var(--teal-light)':'#FFF'};border:1px solid ${g.done?'var(--teal)':'var(--border)'};border-radius:14px;padding:12px;margin-bottom:8px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
            <div style="display:flex;align-items:center;gap:6px">
              <span style="font-size:18px">${g.icon}</span>
              <span style="font-size:13px;font-weight:600">${g.title}</span>
            </div>
            <span style="font-size:12px;font-weight:600;color:${g.progress>=g.target?'var(--teal)':'var(--text)'}">${g.progress}${g.unit} / ${g.target}${g.unit}</span>
          </div>
          <div style="background:var(--border);border-radius:3px;height:6px;overflow:hidden"><div style="background:${g.progress>=g.target?'var(--teal)':g.color};height:100%;border-radius:3px;width:${Math.min(100,(g.progress/g.target)*100)}%"></div></div>
          <div style="font-size:10px;color:var(--text2);margin-top:4px">${g.reason}</div>
        </div>
      `).join('')}

      ${(user.goals.every(g=>g.progress>=g.target) && !user.todayFlames.goal) ? `<button onclick="claimGoalFlame()" style="background:var(--teal);color:#fff;border:none;border-radius:14px;padding:8px 0;width:100%;font-size:13px;font-weight:600;cursor:pointer">Забрать огонёк 🔥</button>` : ''}
      ${user.todayFlames.goal ? '<div style="text-align:center;color:var(--teal);font-weight:600;font-size:12px;margin-top:4px">✅ Цели выполнены!</div>' : ''}
      ${!user.goals.every(g=>g.progress>=g.target) && !user.todayFlames.goal ? '<div style="text-align:center;font-size:11px;color:var(--text2);margin-top:4px">Выполни обе цели для огонька</div>' : ''}

      <!-- Demo buttons -->
      <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap">
        ${user.goals.map((g,i) => `<button onclick="addGoalProgress(${i})" style="background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:4px 10px;font-size:10px;cursor:pointer">${g.icon} +${g.step}${g.unit}</button>`).join('')}
      </div>
    </div>

    <!-- Leaderboard -->
    <div class="leaderboard">
      <div class="leaderboard-title">Рейтинг</div>
      ${allUsers.map((u,i)=>{
        const uLeague = getLeague(u.flames||0);
        return `<div class="lb-row ${u.id==='me'?'me':''}" onclick="showFriendProfile('${u.id}')" style="cursor:pointer">
          <span class="lb-rank ${i<3?'top':''}">${i===0?iconSvg('medal1'):i===1?iconSvg('medal2'):i===2?iconSvg('medal3'):i+1}</span>
          <div style="position:relative"><div class="letter-ava" style="width:30px;height:30px;font-size:13px;background:${u.avatarColor||'#2BC4A7'}">${u.avatar}</div>${u.todayActive?'<div class="today-dot" style="top:-1px;right:-1px;width:7px;height:7px"></div>':''}</div>
          <span class="lb-name">${u.id==='me'?'Вы':u.name} <span style="font-size:11px">${uLeague.icon}</span>${u.todayActive?' <span style="font-size:10px;color:#4CAF50">●</span>':''}</span>
          <div style="display:flex;align-items:center;gap:3px">${iconSvg('fireSm')}<span style="font-weight:700;font-size:13px;color:var(--streak-or)">${u.flames||0}</span></div>
        </div>`;
      }).join('')}
    </div>`;

  document.querySelector('.app').appendChild(backdrop);
  document.querySelector('.app').appendChild(popup);
}

// ===== Персонализация после огонька (сценарий слайда 4) =====
function getPersonalizedLineAfterChallenge(ch) {
  if (!ch) return "";
  if (ch.category === "Шаги" && user.yesterdaySteps) {
    return `Вижу, вчера ты прошёл ${user.yesterdaySteps.toLocaleString("ru-RU")} шагов! Твои ноги сегодня заслужили отдых.`;
  }
  if (ch.category === "Упражнение" && user.yesterdayActivityMin) {
    return `Вчера ты занимался ${user.yesterdayActivityMin} минут — сегодня можно чуть мягче.`;
  }
  return "";
}

// ===== FIRE CELEBRATION =====
const firePhrases = [
  "Огонь! Ты на верном пути 🔥","Так держать! Ещё один шаг 💪","Красавчик! Продолжай 🚀",
  "Мощно! Ты становишься сильнее ⚡","Серия растёт! Не останавливайся 🏆","Вот это настрой! 🙌",
  "Ты лучше, чем вчера ✨","Прогресс налицо! 📈","Один огонёк ближе к цели 🎯",
  "Это было легко, правда? 😎","Ты в огне! В буквальном смысле 🔥","Супер! Ещё немного до новой лиги 🥇",
];
const motivePhrases = [
  "Сегодня можно начать с лёгкой прогулки или просто с хорошего настроения ☀️",
  "Маленький прогресс — это всё ещё прогресс. Продолжай!",
  "Ты уже круче 90% людей, которые только планируют начать 🚀",
  "Стабильность — самый сложный навык. А ты его прокачиваешь 💪",
  "Забота о себе — это радость, а не обязанность ✨",
  "Каждый огонёк — это шаг к лучшей версии себя 🔥",
  "Медленно — не значит плохо. Черепаха тоже финишировала! 🐢",
  "Танцуй, даже если никто не видит. Это тоже кардио! 💃",
  "Не важно, сколько огоньков. Важно, что ты здесь сейчас 🌟",
];

function showFireCelebration(bonusText, personalizedLine, flameDelta = 1) {
  document.getElementById('fire-celebration')?.remove();
  const phrase = firePhrases[Math.floor(Math.random() * firePhrases.length)];
  const motive = motivePhrases[Math.floor(Math.random() * motivePhrases.length)];
  const flameLabel = flameDelta === 1 ? "+1 огонёк!" : `+${flameDelta} огонька!`;
  
  const overlay = document.createElement('div');
  overlay.id = 'fire-celebration';
  overlay.style.cssText = 'position:absolute;top:0;left:0;right:0;bottom:0;z-index:200;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;flex-direction:column;animation:fadeIn 0.2s ease';
  
  // Flying fire particles
  for (let i = 0; i < 12; i++) {
    const p = document.createElement('div');
    const startX = 30 + Math.random() * 40;
    const dur = 0.8 + Math.random() * 0.6;
    const delay = Math.random() * 0.3;
    const size = 16 + Math.random() * 20;
    p.textContent = '🔥';
    p.style.cssText = `position:absolute;font-size:${size}px;left:${startX}%;bottom:35%;opacity:0;animation:fireParticle ${dur}s ease-out ${delay}s forwards;pointer-events:none`;
    overlay.appendChild(p);
  }
  
  // Center card
  const card = document.createElement('div');
  card.style.cssText = 'position:relative;text-align:center;z-index:10;background:var(--card);border-radius:24px;padding:28px 24px 20px;margin:20px;max-width:300px;width:100%;box-shadow:0 8px 40px rgba(0,0,0,0.3);animation:popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)';
  card.innerHTML = `
    <button onclick="closeFireCelebration()" style="position:absolute;top:12px;right:12px;background:none;border:none;cursor:pointer;padding:4px;font-size:18px;color:var(--text2)">✕</button>
    <div style="font-size:64px;animation:flameBurst 0.6s ease-out forwards">🔥</div>
    <div style="font-size:20px;font-weight:800;color:var(--streak-or);margin-top:8px">${flameLabel}</div>
    ${bonusText ? `<div style="font-size:14px;font-weight:600;color:var(--teal);margin-top:4px">${bonusText}</div>` : ''}
    ${personalizedLine ? `<div style="font-size:14px;font-weight:600;color:var(--text);margin-top:12px;line-height:1.45;padding:0 4px">💬 ${personalizedLine}</div>` : ''}
    <div style="font-size:16px;font-weight:700;color:var(--text);margin-top:16px">${phrase}</div>
    <div style="font-size:13px;color:var(--text2);margin-top:12px;line-height:1.5;padding:0 8px">${motive}</div>
    <div style="font-size:11px;color:var(--text2);margin-top:16px">Всего: ${user.flames} 🔥</div>`;
  overlay.appendChild(card);
  
  document.querySelector('.app').appendChild(overlay);
  // #region agent log
  const app = document.querySelector('.app');
  const appRect = app ? app.getBoundingClientRect() : null;
  const cardRect = card.getBoundingClientRect();
  agentDebugLog("H5", "js/app.js:871", "fire celebration mounted", {
    flameDelta,
    hasPersonalizedLine: Boolean(personalizedLine),
    appTop: appRect ? appRect.top : null,
    cardTop: cardRect.top,
    cardBottom: cardRect.bottom
  });
  // #endregion
}

function closeFireCelebration() {
  const el = document.getElementById('fire-celebration');
  if (el) { el.style.transition = 'opacity 0.3s'; el.style.opacity = '0'; setTimeout(() => { el.remove(); hideStreak(); showStreak(); }, 300); }
}

function completeChallenge(idx) {
  if (user.todayFlames.challenge) return;
  const list = getTodayChallenges();
  const ch = list[idx];
  const personalized = getPersonalizedLineAfterChallenge(ch);
  list[idx].completed = true;
  user.todayFlames.challenge = true;
  user.flames += 1;
  if (user.flames > user.recordFlames) user.recordFlames = user.flames;
  showFireCelebration(null, personalized, 1);
}

function completeExtra() {
  const extra = getTodayExtra();
  if (!extra || extra.completed) return;
  extra.completed = true;
  user.flames += 2;
  user.extraBadgeUnlocked = true;
  if (user.flames > user.recordFlames) user.recordFlames = user.flames;
  showFireCelebration('Эксклюзивный значок «Экстра» добавлен в профиль', null, 2);
}

function claimGoalFlame() {
  if (user.todayFlames.goal) return;
  user.todayFlames.goal = true;
  user.flames += 1;
  if (user.flames > user.recordFlames) user.recordFlames = user.flames;
  user.goals.forEach(g => g.done = true);
  showFireCelebration('Цель выполнена!', 'Отличная неделя — обе цели закрыты.', 1);
}

function addGoalProgress(idx) {
  const g = user.goals[idx];
  g.progress = Math.round((g.progress + g.step) * 100) / 100;
  hideStreak(); showStreak();
}

function useFreeze() {
  if (user.freezesLeft <= 0) return;
  user.freezesLeft -= 1;
  hideStreak(); showStreak();
  const toast = document.createElement('div');
  toast.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:var(--card);border-radius:20px;padding:20px 28px;text-align:center;box-shadow:0 8px 32px rgba(0,0,0,0.2);z-index:200;animation:popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)';
  toast.innerHTML = '<div style="font-size:40px;margin-bottom:8px">❄️</div><div style="font-weight:600;font-size:15px">Заморозка активирована!</div><div style="font-size:13px;color:var(--text2);margin-top:4px">Серия защищена на 1 день</div>';
  document.querySelector('.app').appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

function hideStreak() {
  document.querySelectorAll('.streak-backdrop,.streak-popup').forEach(e=>e.remove());
}

// ===== PERSONALIZED PHRASES =====
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Доброе утро,";
  if (h < 18) return "Добрый день,";
  return "Добрый вечер,";
}

function getPhrase() {
  const h = new Date().getHours();
  const phrases = [];

  // Morning
  if (h < 12) {
    phrases.push(
      "Сегодня можно начать день с лёгкой прогулки или просто с хорошего настроения ☀️",
      "Утро — лучшее время для заботы о себе. Ты уже здесь — это уже победа!",
      "Новый день — новые возможности. Давай сделаем его отличным!",
      "Каждое утро — это шанс стать немного лучше, чем вчера 🌅",
    );
  }
  // Evening
  else if (h >= 18) {
    phrases.push(
      "Вечер — время заботы о себе. Ты уже сделал сегодня достаточно 🌙",
      "5 минут растяжки перед сном творят чудеса. Попробуешь?",
      "День был долгим, но ты справился. Отдыхай — завтра новый день.",
      "Самое время подвести итоги дня. Ты молодец, что заглянул!",
    );
  }
  // Day
  else {
    phrases.push(
      "Знаешь, стабильность — самый сложный навык. А ты его прокачиваешь 💪",
      "Маленький прогресс — это всё ещё прогресс. Продолжай!",
      "Ты уже круче 90% людей, которые только планируют начать 🚀",
      "Не важно, сколько дней прошло. Важно, что ты здесь сейчас.",
      "Медленно — не значит плохо. Черепаха тоже финишировала! 🐢",
      "Танцуй, даже если никто не видит. Это тоже кардио! 💃",
    );
  }

  // Streak-based (дни серии, не валюта огоньков)
  if (user.streakDays > 7) {
    phrases.push(
      `${user.streakDays} дней подряд — это серьёзно! Не останавливайся 🔥`,
      "Третью неделю подряд ты держишь активность. Это настоящая сила воли!",
    );
  }
  if (user.streakDays <= 3 && user.streakDays > 0) {
    phrases.push(
      "Хорошее начало! Серия растёт — продолжай в том же духе.",
      "Вчера был день отдыха? Отлично! Восстановление — тоже часть тренировок.",
    );
  }

  return phrases[Math.floor(Math.random() * phrases.length)];
}

// ===== FRIEND PROFILE POPUP =====
function showFriendProfile(userId) {
  const f = userId === 'me' ? {...user, id:'me'} : getFriend(userId);
  if (!f) return;
  const name = f.id === 'me' ? 'Вы' : f.name;

  document.querySelectorAll('.friend-profile-overlay').forEach(e=>e.remove());

  const overlay = document.createElement('div');
  overlay.className = 'friend-profile-overlay';
  overlay.style.cssText = 'position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.4);z-index:150;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.2s ease';
  overlay.onclick = (e) => { if(e.target === overlay) overlay.remove(); };

  overlay.innerHTML = `
    <div style="background:var(--card);border-radius:24px;padding:28px 24px;margin:24px;text-align:center;box-shadow:0 8px 40px rgba(0,0,0,0.15);animation:popIn 0.3s cubic-bezier(0.34,1.56,0.64,1);max-width:300px;width:100%">
      <div style="position:relative;display:inline-block;margin-bottom:12px">
        <div class="letter-ava" style="width:64px;height:64px;font-size:26px;background:${f.avatarColor||'#2BC4A7'};margin:0 auto">${f.avatar}</div>
        ${f.todayActive?'<div class="today-dot" style="width:12px;height:12px;top:0;right:-2px;border-width:2px"></div>':''}
      </div>
      <div style="font-size:18px;font-weight:700;margin-bottom:4px">${name}</div>
      <div style="font-size:13px;color:var(--text2);margin-bottom:16px">${f.todayActive?'Активен(а) сегодня':'Был(а) недавно'} · ${getLeague(f.flames||0).icon} ${getLeague(f.flames||0).name}</div>
      <div style="background:linear-gradient(135deg,var(--streak-or),var(--streak-yl));border-radius:16px;padding:16px;color:#fff;margin-bottom:12px">
        <div style="font-size:13px;opacity:0.9">Огоньков</div>
        <div style="font-size:36px;font-weight:800;line-height:1">${f.flames||0}</div>
        <div style="font-size:13px;font-weight:600;margin-top:2px">🔥</div>
      </div>
      <div style="background:var(--teal-light);border-radius:12px;padding:10px 16px;margin-bottom:16px;display:flex;align-items:center;justify-content:center;gap:6px">
        <span style="font-size:16px">🏆</span>
        <span style="font-size:13px;font-weight:600;color:var(--text)">Рекорд: ${f.recordFlames||f.flames||0} 🔥</span>
      </div>
      ${f.id!=='me'?`<button onclick="this.closest('.friend-profile-overlay').remove()" style="background:var(--teal);color:#fff;border:none;border-radius:20px;padding:10px 28px;font-size:14px;font-weight:600;cursor:pointer">Написать</button>`:''}
      <button onclick="this.closest('.friend-profile-overlay').remove()" style="background:none;border:1px solid var(--border);border-radius:20px;padding:10px 28px;font-size:14px;font-weight:500;cursor:pointer;margin-left:${f.id!=='me'?'8px':'0'}">Закрыть</button>
    </div>`;

  document.querySelector('.app').appendChild(overlay);
}

// ===== CREATE POST =====
let selectedPostTag = 'Активность';

function showCreatePost() {
  document.querySelectorAll('.create-post-overlay').forEach(e=>e.remove());
  const overlay = document.createElement('div');
  overlay.className = 'create-post-overlay';
  overlay.onclick = (e) => { if(e.target === overlay) overlay.remove(); };

  const allTags = ['Активность','Рецепт','Результат','Мотивация'];
  overlay.innerHTML = `
    <div class="create-post-sheet">
      <div style="display:flex;justify-content:center;margin-bottom:8px"><div style="width:40px;height:4px;border-radius:2px;background:#DDD"></div></div>
      <div style="font-size:17px;font-weight:700;margin-bottom:16px">Новый пост</div>
      <textarea id="new-post-text" placeholder="Что нового? Поделитесь с сообществом..."></textarea>
      <div class="create-post-tags" id="post-tags">
        ${allTags.map(t=>`<button class="chip chip-sm ${selectedPostTag===t?'active':''}" onclick="selectPostTag('${t}')" style="font-size:12px">${t}</button>`).join('')}
      </div>
      <button class="create-post-btn" onclick="submitPost()">Опубликовать</button>
    </div>`;
  document.querySelector('.app').appendChild(overlay);
  setTimeout(()=>document.getElementById('new-post-text')?.focus(), 300);
}

function selectPostTag(tag) {
  selectedPostTag = tag;
  const container = document.getElementById('post-tags');
  if (!container) return;
  const allTags = ['Активность','Рецепт','Результат','Мотивация'];
  container.innerHTML = allTags.map(t=>`<button class="chip chip-sm ${selectedPostTag===t?'active':''}" onclick="selectPostTag('${t}')" style="font-size:12px">${t}</button>`).join('');
}

function submitPost() {
  const text = document.getElementById('new-post-text')?.value?.trim();
  if (!text) return;
  const emojiMatch = text.match(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u);
  const emoji = emojiMatch ? emojiMatch[0] : null;
  (async () => {
    try {
      if (authToken) {
        await createFeedPost({ text, tag: selectedPostTag, emoji });
      } else {
        posts.unshift({
          id: Date.now(), userId: "me", time: "только что",
          text: text, likes: 0, comments: 0, liked: false, tag: selectedPostTag, emoji
        });
      }
    } catch (_) {}
    document.querySelectorAll('.create-post-overlay').forEach(e=>e.remove());
    communitySubTab = 'feed';
    feedFilter = 'all';
    if (authToken) await loadFeedPosts();
    renderContent();
  })();
}

function showSplash() {
  const greeting = getGreeting();
  const splash = document.createElement('div');
  splash.className = 'splash';
  splash.id = 'splash';
  splash.innerHTML = `
    <div class="splash-greeting">${greeting}</div>
    <div class="splash-name">${user.name}</div>
    <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:32px;opacity:0;animation:fadeSlideIn 0.6s ease 0.4s forwards">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#FFB800"><path d="M12 23c-4.97 0-8-3.03-8-7 0-2.5 1.5-4.5 3-6 .5-.5 1.5-1.5 2-2.5C10 6 10 4 10 3c0 0 2 1 3 3s1 4 1 4c1-1.5 2-3 2-5 0 0 3 2.5 3 7 0 3.97-3.03 7-7 7z"/></svg>
      <span style="font-size:18px;font-weight:700;color:#FFB800">${user.flames} огоньков</span>
    </div>
    <div class="splash-bottom">
      <div class="splash-app-name">Худеем на здоровье</div>
    </div>`;
  document.querySelector('.app').appendChild(splash);
  setTimeout(() => { splash.style.opacity = '0'; setTimeout(() => splash.remove(), 600); }, 3000);
}

// ===== INIT =====
async function bootApp() {
  const app = document.getElementById('app');
  if (!app || !document.getElementById('content')) return;
  initAuthUI();
  // #region agent log
  const frame = document.getElementById('phone-frame');
  const beforeStyle = frame ? getComputedStyle(frame, '::before') : null;
  const afterStyle = frame ? getComputedStyle(frame, '::after') : null;
  agentDebugLog("H1", "js/app.js:1096", "bootApp pseudo elements snapshot", {
    frameClass: frame ? frame.className : null,
    notchDisplay: beforeStyle ? beforeStyle.display : null,
    notchHeight: beforeStyle ? beforeStyle.height : null,
    homeDisplay: afterStyle ? afterStyle.display : null,
    homeHeight: afterStyle ? afterStyle.height : null
  });
  // #endregion
  const ok = await tryResumeSession();
  if (ok) {
    setAuthVisible(false);
    await afterLogin();
  } else {
    setAuthVisible(true);
    renderNav();
    renderHeader();
    renderContent();
  }
  app.style.background = tabGradients.community;
  const content = document.getElementById('content');
  if (content) {
    content.addEventListener('scroll', () => {
      if (debugScrollSamples >= 3) return;
      debugScrollSamples += 1;
      // #region agent log
      const frameNow = document.getElementById('phone-frame');
      const headerNow = document.getElementById('header');
      const navNow = document.getElementById('nav');
      agentDebugLog("H3", "js/app.js:1117", "content scroll sample", {
        sample: debugScrollSamples,
        scrollTop: content.scrollTop,
        frameTop: frameNow ? frameNow.getBoundingClientRect().top : null,
        headerTop: headerNow ? headerNow.getBoundingClientRect().top : null,
        navTop: navNow ? navNow.getBoundingClientRect().top : null
      });
      // #endregion
    }, { passive: true });
  }
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootApp);
} else {
  bootApp();
}

// ===== DEVICE SWITCHER =====
function setDevice(type) {
  const frame = document.getElementById('phone-frame');
  frame.classList.remove('tablet','pc');
  if (type !== 'phone') frame.classList.add(type);
  document.querySelectorAll('.device-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.device === type);
  });
  // #region agent log
  const beforeStyle = frame ? getComputedStyle(frame, '::before') : null;
  const afterStyle = frame ? getComputedStyle(frame, '::after') : null;
  agentDebugLog("H2", "js/app.js:1138", "setDevice applied classes", {
    type,
    frameClass: frame ? frame.className : null,
    notchDisplay: beforeStyle ? beforeStyle.display : null,
    notchHeight: beforeStyle ? beforeStyle.height : null,
    homeDisplay: afterStyle ? afterStyle.display : null,
    homeHeight: afterStyle ? afterStyle.height : null
  });
  // #endregion
}
