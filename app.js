// 웹디자인개발기능사 문제풀이 사이트 - 황근호 전용 학습 시스템
// 의존: questions.js (BASE_QUESTIONS, QUESTIONS, CONCEPTS_INDEX), concepts.js (CONCEPTS)

const STUDENT_NAME = "황근호";

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

// ---------- 로컬 스토리지 ----------
const STORE_WRONG = "wdc-wrong-v1";
const STORE_ATTEMPTS = "wdc-attempts-v1";

function loadWrongBaseIds() {
  try { return JSON.parse(localStorage.getItem(STORE_WRONG) || "[]"); }
  catch { return []; }
}
function saveWrongBaseIds(ids) {
  localStorage.setItem(STORE_WRONG, JSON.stringify(Array.from(new Set(ids))));
}
function addWrong(baseId) {
  const s = new Set(loadWrongBaseIds()); s.add(baseId); saveWrongBaseIds(Array.from(s));
}
function removeWrong(baseId) {
  const s = new Set(loadWrongBaseIds()); s.delete(baseId); saveWrongBaseIds(Array.from(s));
}
function clearWrong() { localStorage.removeItem(STORE_WRONG); }

function loadAttempts() {
  try { return JSON.parse(localStorage.getItem(STORE_ATTEMPTS) || "[]"); }
  catch { return []; }
}
function saveAttempt(attempt) {
  const arr = loadAttempts();
  arr.push(attempt);
  localStorage.setItem(STORE_ATTEMPTS, JSON.stringify(arr));
}
function clearAttempts() { localStorage.removeItem(STORE_ATTEMPTS); }

// ---------- 카테고리 ----------
function allCategories() {
  return Array.from(new Set(BASE_QUESTIONS.map(q => q.category)));
}
function questionsByCategory(cat) {
  return QUESTIONS.filter(q => q.category === cat);
}

// ---------- 상태 ----------
const state = {
  mode: null,
  pool: [],
  idx: 0,
  selected: null,
  checked: false,
  answers: [],
  startedAt: 0,
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
  const cats = allCategories();
  const wrongCount = loadWrongBaseIds().length;
  const attempts = loadAttempts();
  $("#cat-chips").innerHTML = "";
  cats.forEach(c => {
    const count = questionsByCategory(c).length;
    const chip = el("button", {
      class: "chip",
      onclick: () => startCategory(c)
    }, `${c} · ${count}문항`);
    $("#cat-chips").appendChild(chip);
  });
  $("#wrong-count").textContent = wrongCount;
  $("#total-count").textContent = QUESTIONS.length.toLocaleString();
  $("#concept-count").textContent = Object.keys(CONCEPTS).length;
  $("#student-name").textContent = STUDENT_NAME;
  $$(".student-name-inline").forEach(n => n.textContent = STUDENT_NAME);
  $("#btn-wrong").disabled = wrongCount === 0;
  $("#btn-wrong").style.opacity = wrongCount === 0 ? 0.5 : 1;
  $("#btn-clear-wrong").classList.toggle("hidden", wrongCount === 0);
  renderStats(attempts);
}

// ---------- 통계 (시험 점수 추이) ----------
function renderStats(attempts) {
  const wrap = $("#stats-area");
  wrap.innerHTML = "";
  const examAttempts = attempts.filter(a => a.mode === "exam");

  if (examAttempts.length === 0) {
    wrap.appendChild(el("div", { class: "empty" },
      `${STUDENT_NAME} 학생, 시험 모드를 한 번도 보지 않았어요. 첫 시험을 봐서 점수 그래프를 시작해보세요!`));
    return;
  }

  // 요약 카드
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
    const arrow = delta > 0 ? "▲" : delta < 0 ? "▼" : "─";
    const cls = delta > 0 ? "delta up" : delta < 0 ? "delta down" : "delta";
    const txt = delta === 0 ? "지난 시험과 동일" : `지난 시험 대비 ${arrow} ${Math.abs(delta)}점`;
    wrap.appendChild(el("div", { class: cls, style: "text-align:center; margin:8px 0;" }, txt));
  }

  // 라인 차트 (SVG)
  wrap.appendChild(renderSparkline(examAttempts));

  // 최근 시험 5개 목록
  wrap.appendChild(el("div", { class: "section-title", style: "margin-top:14px" }, "최근 응시 기록"));
  const list = el("div", { class: "attempt-list" });
  examAttempts.slice(-10).reverse().forEach((a) => {
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

  // 초기화 버튼
  const reset = el("button", {
    class: "chip danger",
    style: "margin-top:10px",
    onclick: () => {
      if (confirm(`${STUDENT_NAME} 학생의 시험 기록을 모두 초기화할까요?`)) {
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
  const maxY = 100, minY = 0;

  const xStep = n > 1 ? (W - PAD * 2) / (n - 1) : 0;
  const points = scores.map((v, i) => {
    const x = PAD + i * xStep;
    const y = PAD + (1 - (v - minY) / (maxY - minY)) * (H - PAD * 2);
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

  // 점수 라인
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

  // 각 점
  points.forEach(([x, y], i) => {
    const c = document.createElementNS(svgNS, "circle");
    c.setAttribute("cx", x); c.setAttribute("cy", y); c.setAttribute("r", "3.5");
    c.setAttribute("fill", scores[i] >= 60 ? "#16a34a" : "#dc2626");
    svg.appendChild(c);

    if (i === points.length - 1) {
      const lbl = document.createElementNS(svgNS, "text");
      lbl.setAttribute("x", x);
      lbl.setAttribute("y", y - 8);
      lbl.setAttribute("text-anchor", "middle");
      lbl.setAttribute("font-size", "11");
      lbl.setAttribute("font-weight", "700");
      lbl.setAttribute("fill", "#1f2430");
      lbl.textContent = scores[i];
      svg.appendChild(lbl);
    }
  });

  const wrap = el("div", { class: "sparkline-wrap" });
  wrap.appendChild(el("div", { class: "sparkline-title" },
    `시험 점수 추이 (최근 ${n}회)`));
  wrap.appendChild(svg);
  return wrap;
}

// ---------- 모드 시작 ----------
function startPractice() {
  state.mode = "practice";
  state.pool = shuffle(QUESTIONS).slice(0, 100); // 연습은 100문항 무작위
  state.idx = 0; state.selected = null; state.checked = false;
  state.startedAt = Date.now();
  state.meta = { title: "연습 모드", target: state.pool.length };
  navigate("quiz");
  renderQuestion();
}
function startExam() {
  state.mode = "exam";
  // 실제 시험과 동일하게 60문항. BASE 기준으로 중복 개념 방지.
  const target = Math.min(60, BASE_QUESTIONS.length);
  const usedBaseIds = new Set();
  const pool = [];
  const shuffled = shuffle(QUESTIONS);
  for (const q of shuffled) {
    if (usedBaseIds.has(q.baseId)) continue;
    usedBaseIds.add(q.baseId);
    pool.push(q);
    if (pool.length >= target) break;
  }
  state.pool = pool;
  state.idx = 0; state.selected = null; state.checked = false; state.answers = [];
  state.startedAt = Date.now();
  state.meta = { title: `시험 모드 (${target}문항)`, target };
  navigate("quiz");
  renderQuestion();
}
function startCategory(cat) {
  state.mode = "category";
  // 카테고리 학습은 BASE 기준 중복 제거 후 30문항
  const usedBaseIds = new Set();
  const pool = [];
  for (const q of shuffle(questionsByCategory(cat))) {
    if (usedBaseIds.has(q.baseId)) continue;
    usedBaseIds.add(q.baseId);
    pool.push(q);
    if (pool.length >= 30) break;
  }
  state.pool = pool;
  state.idx = 0; state.selected = null; state.checked = false;
  state.startedAt = Date.now();
  state.meta = { title: `${cat} 학습`, target: state.pool.length };
  navigate("quiz");
  renderQuestion();
}
function startWrong() {
  const baseIds = loadWrongBaseIds();
  if (baseIds.length === 0) return;
  // 오답으로 표시된 base에서 변형 하나씩 골라 다시 출제
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
      class: "opt",
      type: "button",
      "data-i": i,
      onclick: () => onSelect(i)
    },
      el("span", { class: "idx" }, ["①", "②", "③", "④"][i]),
      el("span", { class: "txt" }, text)
    );
    opts.appendChild(opt);
  });
  card.appendChild(opts);

  const actions = el("div", { class: "actions" });
  if (state.mode === "practice" || state.mode === "category" || state.mode === "wrong") {
    actions.appendChild(el("button", {
      class: "btn primary", id: "btn-check", onclick: onCheck
    }, "정답 확인"));
    actions.appendChild(el("button", {
      class: "btn ghost", id: "btn-next", onclick: onNext
    }, state.idx === state.pool.length - 1 ? "마치기" : "다음 문제"));
  } else if (state.mode === "exam") {
    actions.appendChild(el("button", {
      class: "btn primary", id: "btn-next", onclick: onNext
    }, state.idx === state.pool.length - 1 ? "제출하기" : "다음 문제"));
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
  fb.appendChild(el("div", { class: "head" },
    correct ? `✅ 정답입니다! ${STUDENT_NAME} 학생, 잘했어요!` : `❌ 오답입니다. ${STUDENT_NAME} 학생, 한 번 더 확인해요`
  ));
  fb.appendChild(el("div", {}, q.explain));

  const cInfo = CONCEPTS[q.conceptId];
  if (cInfo) {
    const toggle = el("button", { class: "easy-toggle", type: "button" },
      "🧒 초등학생도 알 수 있게 설명 보기");
    const easyBox = renderEasyBox(cInfo);
    easyBox.style.display = "none";
    toggle.addEventListener("click", () => {
      const open = easyBox.style.display !== "none";
      easyBox.style.display = open ? "none" : "block";
      toggle.textContent = open
        ? "🧒 초등학생도 알 수 있게 설명 보기"
        : "🙈 쉬운 설명 닫기";
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
  if (c.trap) box.appendChild(el("div", { class: "trap" }, "💡 함정: " + c.trap));
  return box;
}

function onNext() {
  if (state.mode === "exam") {
    if (state.selected === null) return;
    const q = state.pool[state.idx];
    state.answers.push({
      qid: q.id,
      baseId: q.baseId,
      selected: state.selected,
      correct: state.selected === q.answer
    });
    if (state.selected === q.answer) removeWrong(q.baseId);
    else addWrong(q.baseId);
  } else {
    if (!state.checked) return;
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
  const durationSec = Math.round((Date.now() - state.startedAt) / 1000);

  $("#result-area").innerHTML = "";

  if (isExam) {
    const total = state.pool.length;
    const correctCount = state.answers.filter(a => a.correct).length;
    const passLine = Math.ceil(total * 0.6);
    const pass = correctCount >= passLine;
    const percent = Math.round(correctCount / total * 100);

    // 시험 기록 저장
    saveAttempt({
      at: Date.now(), mode: "exam",
      total, correct: correctCount, percent,
      durationSec
    });

    const attempts = loadAttempts().filter(a => a.mode === "exam");
    const prev = attempts.length > 1 ? attempts[attempts.length - 2] : null;
    const delta = prev ? percent - prev.percent : null;

    const hero = el("div", { class: "card score-hero" });
    hero.appendChild(el("div", { class: "stat" }, `${STUDENT_NAME} 학생의 시험 결과`));
    hero.appendChild(el("div", { class: "grade " + (pass ? "pass" : "fail") },
      pass ? "🎉 합격" : "📚 더 연습"));
    hero.appendChild(el("div", { class: "stat" },
      `${total}문항 중 ${correctCount}문항 정답 · ${percent}점 (합격선 ${passLine}문항)`));
    if (delta !== null) {
      const arrow = delta > 0 ? "▲" : delta < 0 ? "▼" : "─";
      hero.appendChild(el("div", {
        class: "stat",
        style: "margin-top:6px;color:" + (delta > 0 ? "#16a34a" : delta < 0 ? "#dc2626" : "#6b7384")
      }, `지난 시험 대비 ${arrow} ${Math.abs(delta)}점 · 응시 ${attempts.length}회차`));
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

    // 응원 메시지
    const cheer = pass
      ? `근호야 ✊ 이대로만 가면 본 시험에서도 충분히 합격이야!`
      : `근호야 💪 오답노트로 한 번 더 다지면 다음엔 합격선을 넘을 수 있어!`;
    $("#result-area").appendChild(el("div", { class: "card cheer" }, cheer));

    $("#result-area").appendChild(el("div", { class: "section-title" }, "문항별 결과"));
    const list = el("div", { class: "review-list" });
    state.answers.forEach((a, i) => {
      const q = state.pool[i];
      const item = el("div", {
        class: "review-item " + (a.correct ? "correct-item" : "wrong-item")
      });
      item.appendChild(el("div", { class: "q" },
        `${i + 1}. ${q.question}`));
      item.appendChild(el("div", { class: "meta" },
        `${a.correct ? "✅ 정답" : "❌ 오답"} · 정답: ${["①","②","③","④"][q.answer]} ${q.options[q.answer]}`));
      list.appendChild(item);
    });
    $("#result-area").appendChild(list);
  } else {
    const hero = el("div", { class: "card score-hero" });
    hero.appendChild(el("div", { class: "grade" }, "🙌 수고했어요"));
    hero.appendChild(el("div", { class: "stat" },
      `${STUDENT_NAME} 학생, ${state.meta.title} ${state.pool.length}문항을 모두 풀었어요`));
    $("#result-area").appendChild(hero);
    $("#result-area").appendChild(el("div", { class: "card" },
      "오답으로 표시된 문제는 홈의 '오답노트'에서 다시 풀 수 있어요."));
  }

  const acts = el("div", { class: "actions" });
  acts.appendChild(el("button", {
    class: "btn primary", onclick: goHome
  }, "홈으로"));
  if (isExam) {
    acts.appendChild(el("button", {
      class: "btn ghost", onclick: startExam
    }, "다시 시험"));
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
      el("span", { class: "arrow" }, "▾")
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
    if (c.trap) body.appendChild(el("div", { class: "trap" }, "💡 시험 함정: " + c.trap));
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
  $("#mode-exam").addEventListener("click", startExam);
  $("#btn-wrong").addEventListener("click", startWrong);
  $("#mode-concepts").addEventListener("click", () => {
    renderConcepts();
    navigate("concepts");
  });

  $("#btn-home-1").addEventListener("click", goHome);
  $("#btn-home-2").addEventListener("click", goHome);
  $("#btn-home-3").addEventListener("click", goHome);

  $("#btn-clear-wrong").addEventListener("click", () => {
    if (confirm(`${STUDENT_NAME} 학생의 오답노트를 모두 비울까요?`)) {
      clearWrong(); renderHome();
    }
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
