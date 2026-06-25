// 웹디자인개발기능사 문제풀이 사이트 - 근호 전용
// 의존: questions.js (BASE_QUESTIONS, QUESTIONS, CONCEPTS_INDEX), concepts.js (CONCEPTS)

const STUDENT_NAME = "근호";
const PRACTICE_PER_TICKET = 2; // 연습 2회 = 시험권 1장
const PRACTICE_SIZE = 30;
const EXAM_SIZE = 60;
const RECENT_BASE_LIMIT = 120;

// ---------- 유틸 ----------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k === "html") node.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function")
      node.addEventListener(k.slice(2).toLowerCase(), v);
    else if (v !== undefined && v !== null) node.setAttribute(k, v);
  }
  for (const c of children) {
    if (c == null) continue;
    node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  }
  return node;
}

function fmtDate(t) {
  const d = new Date(t);
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}
function fmtDuration(sec) {
  const m = Math.floor(sec / 60), s = sec % 60;
  return m > 0 ? `${m}분 ${s}초` : `${s}초`;
}

// ---------- SVG 아이콘 (모두 단일색 stroke 라인 아이콘) ----------
const ICONS = {
  pencil: '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/>',
  refresh: '<polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  crown: '<path d="M3 18h18l-2-9-4 3-3-7-3 7-4-3-2 9z"/>',
  arrowUp: '<line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>',
  arrowDown: '<line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>',
  ticket: '<path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4z"/><line x1="13" y1="5" x2="13" y2="19" stroke-dasharray="2 3"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2" fill="currentColor"/>',
  spark: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  arrowLeft: '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
  trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v3a3 3 0 0 1-3 3M7 5H4v3a3 3 0 0 0 3 3"/>',
  flame: '<path d="M12 2s4 4 4 8a4 4 0 0 1-8 0c0-2 1-3 1-3s-1 5 3 5"/><path d="M12 22a7 7 0 0 0 7-7c0-3-2-5-2-5s.5 4-2 5"/>',
  list: '<line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/>',
  info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  chart: '<line x1="3" y1="20" x2="21" y2="20"/><polyline points="5 17 9 11 13 13 19 6"/>',
};

function iconHtml(name, size = 20) {
  return `<svg class="ico" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;
}
function iconNode(name, size = 20) {
  const wrap = document.createElement("span");
  wrap.className = "ico-wrap";
  wrap.innerHTML = iconHtml(name, size);
  return wrap.firstChild;
}

// ---------- 로컬 스토리지 ----------
const STORE_WRONG = "wdc-wrong-v1";
const STORE_ATTEMPTS = "wdc-attempts-v1";
const STORE_PRACTICE_DONE = "wdc-practice-done-v2";
const STORE_EXAMS_STARTED = "wdc-exams-started-v2";
const STORE_RECENT_BASES = "wdc-recent-bases-v2";

function loadJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
  catch { return fallback; }
}
function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadWrongBaseIds() { return loadJSON(STORE_WRONG, []); }
function saveWrongBaseIds(ids) { saveJSON(STORE_WRONG, Array.from(new Set(ids))); }
function addWrong(baseId) {
  const s = new Set(loadWrongBaseIds()); s.add(baseId); saveWrongBaseIds([...s]);
}
function removeWrong(baseId) {
  const s = new Set(loadWrongBaseIds()); s.delete(baseId); saveWrongBaseIds([...s]);
}
function clearWrong() { localStorage.removeItem(STORE_WRONG); }

function loadAttempts() { return loadJSON(STORE_ATTEMPTS, []); }
function saveAttempt(attempt) {
  const arr = loadAttempts(); arr.push(attempt); saveJSON(STORE_ATTEMPTS, arr);
}
function clearAttempts() { localStorage.removeItem(STORE_ATTEMPTS); }

function getPracticeDone() { return loadJSON(STORE_PRACTICE_DONE, 0); }
function incPracticeDone() { saveJSON(STORE_PRACTICE_DONE, getPracticeDone() + 1); }

function getExamsStarted() { return loadJSON(STORE_EXAMS_STARTED, 0); }
function incExamsStarted() { saveJSON(STORE_EXAMS_STARTED, getExamsStarted() + 1); }

function getRecentBases() { return loadJSON(STORE_RECENT_BASES, []); }
function addRecentBases(baseIds) {
  const arr = getRecentBases().concat(baseIds);
  // 중복 제거 후 최근 N개만 유지 (가장 최근 등장 우선)
  const seen = new Set();
  const result = [];
  for (let i = arr.length - 1; i >= 0; i--) {
    if (seen.has(arr[i])) continue;
    seen.add(arr[i]);
    result.unshift(arr[i]);
    if (result.length >= RECENT_BASE_LIMIT) break;
  }
  saveJSON(STORE_RECENT_BASES, result);
}

function availableTickets() {
  return Math.max(0, Math.floor(getPracticeDone() / PRACTICE_PER_TICKET) - getExamsStarted());
}
function practiceUntilNextTicket() {
  const remainder = getPracticeDone() % PRACTICE_PER_TICKET;
  return PRACTICE_PER_TICKET - remainder;
}

// ---------- 카테고리 ----------
function allCategories() {
  return Array.from(new Set(BASE_QUESTIONS.map(q => q.category)));
}
function questionsByCategory(cat) {
  return QUESTIONS.filter(q => q.category === cat);
}

// ---------- 상태 ----------
const state = {
  mode: null, pool: [], idx: 0,
  selected: null, checked: false,
  answers: [], startedAt: 0,
  meta: { title: "", target: 0 }
};

// ---------- 라우팅 ----------
function navigate(view) {
  $$(".view").forEach(v => v.classList.add("hidden"));
  $(`#view-${view}`).classList.remove("hidden");
  window.scrollTo(0, 0);
}

// ---------- 홈 렌더링 ----------
function renderHome() {
  $("#total-count").textContent = QUESTIONS.length.toLocaleString();
  $("#concept-count").textContent = Object.keys(CONCEPTS).length;
  $("#wrong-count").textContent = loadWrongBaseIds().length;

  // 시험권 상태
  renderTicketStatus();

  // 카테고리 칩
  const wrap = $("#cat-chips");
  wrap.innerHTML = "";
  allCategories().forEach(c => {
    const count = BASE_QUESTIONS.filter(q => q.category === c).length;
    const chip = el("button", {
      class: "chip", onclick: () => startCategory(c)
    }, `${c} · ${count}개념`);
    wrap.appendChild(chip);
  });

  // 오답 비우기 노출
  const wrongCount = loadWrongBaseIds().length;
  $("#btn-wrong").disabled = wrongCount === 0;
  $("#btn-wrong").classList.toggle("disabled", wrongCount === 0);
  $("#btn-clear-wrong").classList.toggle("hidden", wrongCount === 0);

  renderStats(loadAttempts());
}

function renderTicketStatus() {
  const tickets = availableTickets();
  const remaining = practiceUntilNextTicket();
  const done = getPracticeDone();

  const wrap = $("#ticket-status");
  wrap.innerHTML = "";

  const card = el("div", { class: "ticket-card " + (tickets > 0 ? "has-ticket" : "no-ticket") });

  // 좌측 아이콘 + 정보
  const left = el("div", { class: "ticket-left" });
  left.appendChild(el("div", { class: "ticket-ico", html: iconHtml(tickets > 0 ? "ticket" : "lock", 22) }));
  const info = el("div", { class: "ticket-info" });
  info.appendChild(el("div", { class: "ticket-headline" },
    tickets > 0
      ? `시험 응시권 ${tickets}장 보유`
      : "시험 모드 잠금"));
  info.appendChild(el("div", { class: "ticket-sub" },
    tickets > 0
      ? `근호야, 지금 바로 시험을 한 번 칠 수 있어`
      : `연습 모드 ${remaining}회 더 완료하면 시험권 1장이 생겨`));
  left.appendChild(info);
  card.appendChild(left);

  // 진행 점들
  const dots = el("div", { class: "ticket-dots" });
  for (let i = 0; i < PRACTICE_PER_TICKET; i++) {
    const filled = (done % PRACTICE_PER_TICKET) > i || tickets > 0;
    const d = el("span", { class: "dot " + (filled ? "on" : "off") });
    dots.appendChild(d);
  }
  card.appendChild(dots);

  wrap.appendChild(card);

  // 연습 모드 카드 안내 + 시험 모드 카드 상태
  const examBtn = $("#mode-exam");
  const examDesc = $("#mode-exam-desc");
  if (tickets > 0) {
    examBtn.classList.remove("locked");
    examDesc.textContent = `응시권 ${tickets}장 보유 · 60문항 · 합격선 60%`;
  } else {
    examBtn.classList.add("locked");
    examDesc.textContent = `연습 ${remaining}회 더 완료하면 응시 가능`;
  }
  const practiceDesc = $("#mode-practice-desc");
  practiceDesc.textContent = tickets > 0
    ? `${PRACTICE_SIZE}문항 · 풀이마다 해설과 쉬운 설명`
    : `${PRACTICE_SIZE}문항 · 완료 ${remaining}회 → 시험권 1장`;
}

// ---------- 통계 ----------
function renderStats(attempts) {
  const wrap = $("#stats-area");
  wrap.innerHTML = "";
  const examAttempts = attempts.filter(a => a.mode === "exam");

  if (examAttempts.length === 0) {
    wrap.appendChild(el("div", { class: "empty" },
      `근호야, 아직 시험을 한 번도 안 봤어. 연습 두 번 풀고 첫 시험을 봐서 점수 그래프를 시작해보자.`));
    return;
  }

  const last = examAttempts[examAttempts.length - 1];
  const best = examAttempts.reduce((a, b) => b.percent > a.percent ? b : a, examAttempts[0]);
  const avg = Math.round(examAttempts.reduce((s, a) => s + a.percent, 0) / examAttempts.length);
  const prev = examAttempts.length > 1 ? examAttempts[examAttempts.length - 2] : null;
  const delta = prev ? last.percent - prev.percent : 0;

  const grid = el("div", { class: "score-summary" });
  grid.appendChild(scoreBox(examAttempts.length, "응시 횟수"));
  grid.appendChild(scoreBox(`${last.percent}%`, "최근 점수"));
  grid.appendChild(scoreBox(`${best.percent}%`, "최고 점수"));
  grid.appendChild(scoreBox(`${avg}%`, "평균"));
  wrap.appendChild(grid);

  if (prev) {
    const cls = delta > 0 ? "delta up" : delta < 0 ? "delta down" : "delta";
    const iconName = delta > 0 ? "arrowUp" : delta < 0 ? "arrowDown" : "info";
    const txt = delta === 0 ? "지난 시험과 동일" : `지난 시험 대비 ${Math.abs(delta)}점`;
    const pill = el("div", { class: cls, style: "text-align:center; margin:8px auto;" });
    pill.innerHTML = `${iconHtml(iconName, 14)}<span>${txt}</span>`;
    wrap.appendChild(pill);
  }

  wrap.appendChild(renderSparkline(examAttempts));

  wrap.appendChild(el("div", { class: "section-title", style: "margin-top:14px" }, "최근 응시 기록"));
  const list = el("div", { class: "attempt-list" });
  examAttempts.slice(-10).reverse().forEach(a => {
    const item = el("div", { class: "attempt-item " + (a.percent >= 60 ? "pass" : "fail") });
    item.appendChild(el("div", { class: "main" },
      el("strong", {}, `${a.percent}점`),
      el("span", { class: "sub" },
        ` · ${a.correct}/${a.total}문항 · ${fmtDuration(a.durationSec || 0)}`)
    ));
    item.appendChild(el("div", { class: "sub" }, fmtDate(a.at)));
    list.appendChild(item);
  });
  wrap.appendChild(list);

  const reset = el("button", {
    class: "chip danger", style: "margin-top:10px",
    onclick: () => {
      if (confirm("근호의 시험 기록을 모두 초기화할까요?")) {
        clearAttempts(); renderHome();
      }
    }
  }, "시험 기록 초기화");
  wrap.appendChild(reset);
}

function renderSparkline(attempts) {
  const W = 320, H = 110, PAD = 24;
  const scores = attempts.slice(-20).map(a => a.percent);
  const n = scores.length;

  const xStep = n > 1 ? (W - PAD * 2) / (n - 1) : 0;
  const points = scores.map((v, i) => {
    const x = PAD + i * xStep;
    const y = PAD + (1 - v / 100) * (H - PAD * 2);
    return [x, y];
  });

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("class", "sparkline");

  // 합격선 60%
  const passY = PAD + (1 - 0.6) * (H - PAD * 2);
  const passLine = document.createElementNS(svgNS, "line");
  passLine.setAttribute("x1", PAD); passLine.setAttribute("x2", W - PAD);
  passLine.setAttribute("y1", passY); passLine.setAttribute("y2", passY);
  passLine.setAttribute("stroke", "#16a34a");
  passLine.setAttribute("stroke-dasharray", "3 3");
  passLine.setAttribute("stroke-width", "1");
  svg.appendChild(passLine);

  const passLabel = document.createElementNS(svgNS, "text");
  passLabel.setAttribute("x", W - PAD);
  passLabel.setAttribute("y", passY - 4);
  passLabel.setAttribute("text-anchor", "end");
  passLabel.setAttribute("font-size", "10");
  passLabel.setAttribute("fill", "#16a34a");
  passLabel.textContent = "합격선 60%";
  svg.appendChild(passLabel);

  if (n > 1) {
    const path = document.createElementNS(svgNS, "polyline");
    path.setAttribute("points", points.map(p => p.join(",")).join(" "));
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#3b66ff");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    svg.appendChild(path);
  }

  points.forEach(([x, y], i) => {
    const c = document.createElementNS(svgNS, "circle");
    c.setAttribute("cx", x); c.setAttribute("cy", y); c.setAttribute("r", "3.5");
    c.setAttribute("fill", scores[i] >= 60 ? "#16a34a" : "#dc2626");
    svg.appendChild(c);

    if (i === points.length - 1) {
      const lbl = document.createElementNS(svgNS, "text");
      lbl.setAttribute("x", x); lbl.setAttribute("y", y - 8);
      lbl.setAttribute("text-anchor", "middle");
      lbl.setAttribute("font-size", "11");
      lbl.setAttribute("font-weight", "700");
      lbl.setAttribute("fill", "#1f2430");
      lbl.textContent = scores[i];
      svg.appendChild(lbl);
    }
  });

  const wrap = el("div", { class: "sparkline-wrap" });
  wrap.appendChild(el("div", { class: "sparkline-title" }, `시험 점수 추이 (최근 ${n}회)`));
  wrap.appendChild(svg);
  return wrap;
}

// ---------- 풀 빌더 ----------
function buildPracticePool() {
  const usedBaseIds = new Set();
  const pool = [];
  for (const q of shuffle(QUESTIONS)) {
    if (usedBaseIds.has(q.baseId)) continue;
    usedBaseIds.add(q.baseId);
    pool.push(q);
    if (pool.length >= PRACTICE_SIZE) break;
  }
  return pool;
}

function buildExamPool() {
  // 1) 최근 연습한 베이스에서 우선 출제 (유사한 문제)
  // 2) 모자라면 나머지 무작위
  const recent = new Set(getRecentBases());
  const usedBaseIds = new Set();
  const pool = [];

  if (recent.size > 0) {
    const recentVariants = QUESTIONS.filter(q => recent.has(q.baseId));
    for (const q of shuffle(recentVariants)) {
      if (usedBaseIds.has(q.baseId)) continue;
      usedBaseIds.add(q.baseId);
      pool.push(q);
      if (pool.length >= EXAM_SIZE) break;
    }
  }

  if (pool.length < EXAM_SIZE) {
    for (const q of shuffle(QUESTIONS)) {
      if (usedBaseIds.has(q.baseId)) continue;
      usedBaseIds.add(q.baseId);
      pool.push(q);
      if (pool.length >= EXAM_SIZE) break;
    }
  }

  return shuffle(pool);
}

function buildCategoryPool(cat) {
  const usedBaseIds = new Set();
  const pool = [];
  for (const q of shuffle(questionsByCategory(cat))) {
    if (usedBaseIds.has(q.baseId)) continue;
    usedBaseIds.add(q.baseId);
    pool.push(q);
    if (pool.length >= 30) break;
  }
  return pool;
}

// ---------- 모드 시작 ----------
function startPractice() {
  state.mode = "practice";
  state.pool = buildPracticePool();
  state.idx = 0; state.selected = null; state.checked = false;
  state.startedAt = Date.now();
  state.meta = { title: "연습 모드", target: state.pool.length };
  navigate("quiz");
  renderQuestion();
}

function startExam() {
  if (availableTickets() <= 0) {
    showLockedExamMessage();
    return;
  }
  // 응시권 차감
  incExamsStarted();

  state.mode = "exam";
  state.pool = buildExamPool();
  state.idx = 0; state.selected = null; state.checked = false; state.answers = [];
  state.startedAt = Date.now();
  state.meta = { title: `시험 모드 (${state.pool.length}문항)`, target: state.pool.length };
  navigate("quiz");
  renderQuestion();
}

function showLockedExamMessage() {
  const remaining = practiceUntilNextTicket();
  alert(`근호야, 시험을 보려면 연습 모드를 ${remaining}회 더 완료해야 해.\n\n연습 2회 = 시험권 1장이야. 차근차근 다지고 시험 보러 가자.`);
}

function startCategory(cat) {
  state.mode = "category";
  state.pool = buildCategoryPool(cat);
  state.idx = 0; state.selected = null; state.checked = false;
  state.startedAt = Date.now();
  state.meta = { title: `${cat} 학습`, target: state.pool.length };
  navigate("quiz");
  renderQuestion();
}

function startWrong() {
  const baseIds = loadWrongBaseIds();
  if (baseIds.length === 0) return;
  const pool = baseIds.map(bid => {
    const variants = QUESTIONS.filter(q => q.baseId === bid);
    return variants[Math.floor(Math.random() * variants.length)];
  }).filter(Boolean);
  if (pool.length === 0) { alert("오답이 없습니다."); return; }
  state.mode = "wrong";
  state.pool = shuffle(pool);
  state.idx = 0; state.selected = null; state.checked = false;
  state.startedAt = Date.now();
  state.meta = { title: "오답노트 다시풀기", target: state.pool.length };
  navigate("quiz");
  renderQuestion();
}

// ---------- 문제 렌더링 ----------
function renderQuestion() {
  const q = state.pool[state.idx];
  if (!q) return finishQuiz();

  $("#quiz-title").textContent = state.meta.title;
  $("#progress-text").textContent = `${state.idx + 1} / ${state.pool.length}`;
  $("#progress-bar").style.width = `${(state.idx / state.pool.length) * 100}%`;

  const container = $("#question-area");
  container.innerHTML = "";

  const card = el("div", { class: "card qcard" });
  card.appendChild(el("div", { class: "meta" },
    el("span", { class: "tag" }, q.category),
    el("span", {}, CONCEPTS_INDEX[q.conceptId] || "")
  ));
  card.appendChild(el("h2", { class: "question" }, q.question));

  const opts = el("div", { class: "options" });
  q.options.forEach((text, i) => {
    const opt = el("button", {
      class: "opt", type: "button", "data-i": i,
      onclick: () => onSelect(i)
    },
      el("span", { class: "idx" }, ["①", "②", "③", "④"][i]),
      el("span", { class: "txt" }, text)
    );
    opts.appendChild(opt);
  });
  card.appendChild(opts);

  const actions = el("div", { class: "actions" });
  if (state.mode === "exam") {
    actions.appendChild(el("button", {
      class: "btn primary", id: "btn-next", onclick: onNext
    }, state.idx === state.pool.length - 1 ? "제출하기" : "다음 문제"));
  } else {
    actions.appendChild(el("button", {
      class: "btn primary", id: "btn-check", onclick: onCheck
    }, "정답 확인"));
    actions.appendChild(el("button", {
      class: "btn ghost", id: "btn-next", onclick: onNext
    }, state.idx === state.pool.length - 1 ? "마치기" : "다음 문제"));
  }
  card.appendChild(actions);

  container.appendChild(card);
  state.selected = null; state.checked = false;
  syncButtonState();
}

function onSelect(i) {
  if (state.checked) return;
  state.selected = i;
  $$("#question-area .opt").forEach(o => o.classList.remove("selected"));
  $(`#question-area .opt[data-i="${i}"]`).classList.add("selected");
  syncButtonState();
}

function syncButtonState() {
  const checkBtn = $("#btn-check");
  const nextBtn = $("#btn-next");
  if (state.mode === "exam") {
    if (nextBtn) nextBtn.disabled = state.selected === null;
    return;
  }
  if (checkBtn) checkBtn.disabled = state.selected === null || state.checked;
  if (nextBtn) {
    nextBtn.disabled = !state.checked;
    if (state.checked) {
      checkBtn.className = "btn ghost";
      nextBtn.className = "btn primary";
    } else {
      checkBtn.className = "btn primary";
      nextBtn.className = "btn ghost";
    }
  }
}

function onCheck() {
  if (state.selected === null || state.checked) return;
  const q = state.pool[state.idx];
  state.checked = true;
  const correct = state.selected === q.answer;

  if (correct) removeWrong(q.baseId);
  else addWrong(q.baseId);

  $$("#question-area .opt").forEach(opt => {
    opt.classList.add("disabled");
    const i = Number(opt.dataset.i);
    if (i === q.answer) opt.classList.add("correct");
    else if (i === state.selected) opt.classList.add("wrong");
  });

  const fb = el("div", { class: "feedback " + (correct ? "correct" : "wrong") });
  const head = el("div", { class: "head" });
  head.innerHTML = `${iconHtml(correct ? "check" : "x", 18)}<span>${
    correct ? "정답이야! 근호야 잘했어" : "오답이야. 근호야 다시 확인해보자"
  }</span>`;
  fb.appendChild(head);
  fb.appendChild(el("div", {}, q.explain));

  const cInfo = CONCEPTS[q.conceptId];
  if (cInfo) {
    const toggle = el("button", { class: "easy-toggle", type: "button" });
    toggle.innerHTML = `${iconHtml("book", 14)}<span>초등학생도 알 수 있게 설명 보기</span>`;
    const easyBox = renderEasyBox(cInfo);
    easyBox.style.display = "none";
    toggle.addEventListener("click", () => {
      const open = easyBox.style.display !== "none";
      easyBox.style.display = open ? "none" : "block";
      toggle.innerHTML = open
        ? `${iconHtml("book", 14)}<span>초등학생도 알 수 있게 설명 보기</span>`
        : `${iconHtml("x", 14)}<span>쉬운 설명 닫기</span>`;
    });
    fb.appendChild(toggle);
    fb.appendChild(easyBox);
  }

  $("#question-area .qcard").appendChild(fb);
  syncButtonState();
}

function renderEasyBox(c) {
  const box = el("div", { class: "easy-box" });
  box.appendChild(el("h4", {}, c.title));
  box.appendChild(el("div", {}, c.oneline));
  box.appendChild(el("div", { style: "margin-top:6px" }, c.easy));
  if (c.keys && c.keys.length) {
    const ul = el("ul");
    c.keys.forEach(k => ul.appendChild(el("li", {}, k)));
    box.appendChild(ul);
  }
  if (c.trap) {
    const trap = el("div", { class: "trap" });
    trap.innerHTML = `${iconHtml("info", 14)}<span>함정: ${c.trap}</span>`;
    box.appendChild(trap);
  }
  return box;
}

function onNext() {
  if (state.mode === "exam") {
    if (state.selected === null) return;
    const q = state.pool[state.idx];
    state.answers.push({
      qid: q.id, baseId: q.baseId,
      selected: state.selected, correct: state.selected === q.answer
    });
    if (state.selected === q.answer) removeWrong(q.baseId);
    else addWrong(q.baseId);
  } else if (!state.checked) {
    return;
  }
  state.idx++;
  if (state.idx >= state.pool.length) return finishQuiz();
  renderQuestion();
}

// ---------- 결과 ----------
function finishQuiz() {
  navigate("result");
  $("#progress-bar").style.width = "100%";

  const isExam = state.mode === "exam";
  const isPractice = state.mode === "practice";
  const durationSec = Math.round((Date.now() - state.startedAt) / 1000);

  // 연습 모드 완주 시 카운트 증가 + 최근 베이스 누적
  if (isPractice) {
    incPracticeDone();
    addRecentBases(state.pool.map(q => q.baseId));
  }

  $("#result-area").innerHTML = "";

  if (isExam) {
    const total = state.pool.length;
    const correctCount = state.answers.filter(a => a.correct).length;
    const passLine = Math.ceil(total * 0.6);
    const pass = correctCount >= passLine;
    const percent = Math.round(correctCount / total * 100);

    saveAttempt({
      at: Date.now(), mode: "exam",
      total, correct: correctCount, percent, durationSec
    });

    const attempts = loadAttempts().filter(a => a.mode === "exam");
    const prev = attempts.length > 1 ? attempts[attempts.length - 2] : null;
    const delta = prev ? percent - prev.percent : null;

    const hero = el("div", { class: "card score-hero" });
    hero.appendChild(el("div", { class: "stat" }, `근호의 시험 결과`));
    const grade = el("div", { class: "grade " + (pass ? "pass" : "fail") });
    grade.innerHTML = `${iconHtml(pass ? "trophy" : "target", 36)}<span>${pass ? "합격" : "더 연습"}</span>`;
    hero.appendChild(grade);
    hero.appendChild(el("div", { class: "stat" },
      `${total}문항 중 ${correctCount}문항 정답 · ${percent}점 (합격선 ${passLine}문항)`));
    if (delta !== null) {
      const stat = el("div", {
        class: "stat",
        style: "margin-top:6px;display:flex;align-items:center;justify-content:center;gap:4px;color:" + (delta > 0 ? "#16a34a" : delta < 0 ? "#dc2626" : "#6b7384")
      });
      const iname = delta > 0 ? "arrowUp" : delta < 0 ? "arrowDown" : "info";
      stat.innerHTML = `${iconHtml(iname, 14)}<span>지난 시험 대비 ${Math.abs(delta)}점 · 응시 ${attempts.length}회차</span>`;
      hero.appendChild(stat);
    }
    $("#result-area").appendChild(hero);

    const sum = el("div", { class: "card" });
    const grid = el("div", { class: "score-summary" });
    grid.appendChild(scoreBox(correctCount, "정답"));
    grid.appendChild(scoreBox(total - correctCount, "오답"));
    grid.appendChild(scoreBox(`${percent}%`, "정답률"));
    grid.appendChild(scoreBox(fmtDuration(durationSec), "소요"));
    sum.appendChild(grid);
    $("#result-area").appendChild(sum);

    const cheer = pass
      ? `근호야, 이대로만 가면 본 시험에서도 충분히 합격이야`
      : `근호야, 오답노트로 한 번 더 다지면 다음엔 합격선을 넘을 수 있어`;
    $("#result-area").appendChild(el("div", { class: "card cheer" }, cheer));

    $("#result-area").appendChild(el("div", { class: "section-title" }, "문항별 결과"));
    const list = el("div", { class: "review-list" });
    state.answers.forEach((a, i) => {
      const q = state.pool[i];
      const item = el("div", {
        class: "review-item " + (a.correct ? "correct-item" : "wrong-item")
      });
      const ico = iconHtml(a.correct ? "check" : "x", 14);
      const qline = el("div", { class: "q" }, `${i + 1}. ${q.question}`);
      const metaLine = el("div", { class: "meta" });
      metaLine.innerHTML = `${ico}<span>${a.correct ? "정답" : "오답"} · 정답: ${["①","②","③","④"][q.answer]} ${q.options[q.answer]}</span>`;
      item.appendChild(qline);
      item.appendChild(metaLine);
      list.appendChild(item);
    });
    $("#result-area").appendChild(list);
  } else if (isPractice) {
    const tickets = availableTickets();
    const remaining = practiceUntilNextTicket();

    const hero = el("div", { class: "card score-hero" });
    hero.appendChild(el("div", { class: "grade" }, "연습 완료"));
    hero.appendChild(el("div", { class: "stat" },
      `근호야, ${state.pool.length}문항을 다 풀었어 · 누적 연습 ${getPracticeDone()}회`));
    $("#result-area").appendChild(hero);

    const ticketCard = el("div", { class: "card cheer" });
    if (tickets > 0) {
      ticketCard.innerHTML = `${iconHtml("ticket", 22)}<div style="margin-top:6px"><strong>시험 응시권 ${tickets}장</strong><br>지금 바로 시험 모드에 도전할 수 있어</div>`;
      const btn = el("button", { class: "btn primary", style: "margin-top:10px", onclick: () => { goHome(); setTimeout(startExam, 100); } }, "시험 모드 바로 응시하기");
      ticketCard.appendChild(btn);
    } else {
      ticketCard.innerHTML = `${iconHtml("lock", 22)}<div style="margin-top:6px"><strong>시험권까지 ${remaining}회 남음</strong><br>한 번만 더 연습하면 시험 1회를 칠 수 있어</div>`;
    }
    $("#result-area").appendChild(ticketCard);
  } else {
    const hero = el("div", { class: "card score-hero" });
    hero.appendChild(el("div", { class: "grade" }, "수고했어"));
    hero.appendChild(el("div", { class: "stat" },
      `근호야, ${state.meta.title} ${state.pool.length}문항을 다 풀었어`));
    $("#result-area").appendChild(hero);
    $("#result-area").appendChild(el("div", { class: "card" },
      "오답으로 표시된 문제는 홈의 '오답노트'에서 다시 풀 수 있어."));
  }

  const acts = el("div", { class: "actions" });
  acts.appendChild(el("button", { class: "btn primary", onclick: goHome }, "홈으로"));
  if (isExam) {
    if (availableTickets() > 0) {
      acts.appendChild(el("button", { class: "btn ghost", onclick: startExam }, "다시 시험"));
    }
  }
  $("#result-area").appendChild(acts);
}

function scoreBox(value, label) {
  const box = el("div", { class: "box" });
  box.appendChild(el("div", { class: "v" }, String(value)));
  box.appendChild(el("div", { class: "l" }, label));
  return box;
}

// ---------- 개념 사전 ----------
function renderConcepts() {
  const list = $("#concept-list");
  list.innerHTML = "";
  Object.entries(CONCEPTS).forEach(([id, c]) => {
    const cat = (BASE_QUESTIONS.find(q => q.conceptId === id) || {}).category || "";
    const item = el("div", { class: "concept-item", "data-id": id });
    const head = el("div", { class: "concept-head" },
      el("div", {},
        el("div", { class: "cat" }, cat),
        el("div", { class: "ttl" }, c.title)
      ),
      el("span", { class: "arrow", html: iconHtml("arrowDown", 14) })
    );
    head.addEventListener("click", () => item.classList.toggle("open"));
    item.appendChild(head);

    const body = el("div", { class: "concept-body" });
    body.appendChild(el("div", { class: "oneline" }, c.oneline));
    body.appendChild(el("div", { class: "easy" }, c.easy));
    if (c.keys && c.keys.length) {
      body.appendChild(el("h4", {}, "핵심 포인트"));
      const ul = el("ul");
      c.keys.forEach(k => ul.appendChild(el("li", {}, k)));
      body.appendChild(ul);
    }
    if (c.trap) {
      const trap = el("div", { class: "trap" });
      trap.innerHTML = `${iconHtml("info", 14)}<span>시험 함정: ${c.trap}</span>`;
      body.appendChild(trap);
    }
    item.appendChild(body);
    list.appendChild(item);
  });
}

// ---------- 진입 ----------
function goHome() {
  state.mode = null;
  renderHome();
  navigate("home");
}

function init() {
  $("#mode-practice").addEventListener("click", startPractice);
  $("#mode-exam").addEventListener("click", () => {
    if (availableTickets() <= 0) { showLockedExamMessage(); return; }
    startExam();
  });
  $("#btn-wrong").addEventListener("click", startWrong);
  $("#mode-concepts").addEventListener("click", () => {
    renderConcepts();
    navigate("concepts");
  });

  $("#btn-home-1").addEventListener("click", goHome);
  $("#btn-home-2").addEventListener("click", goHome);
  $("#btn-home-3").addEventListener("click", goHome);

  $("#btn-clear-wrong").addEventListener("click", () => {
    if (confirm("오답노트를 모두 비울까요?")) { clearWrong(); renderHome(); }
  });

  $("#btn-quit").addEventListener("click", () => {
    if (state.mode === "exam" &&
        !confirm("시험을 중단하고 홈으로 갈까요? 진행 중인 답은 저장되지 않습니다.")) return;
    goHome();
  });

  renderHome();
  navigate("home");
}

document.addEventListener("DOMContentLoaded", init);
