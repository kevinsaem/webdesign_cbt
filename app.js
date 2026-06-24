// 웹디자인개발기능사 문제풀이 사이트 - 메인 로직
// 의존: questions.js (QUESTIONS, CONCEPTS_INDEX), concepts.js (CONCEPTS)

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

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

// ---------- 로컬 스토리지(오답노트) ----------
const STORE_KEY = "wdc-wrong-v1";
function loadWrongIds() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY) || "[]"); }
  catch { return []; }
}
function saveWrongIds(ids) {
  localStorage.setItem(STORE_KEY, JSON.stringify(Array.from(new Set(ids))));
}
function addWrong(id) {
  const s = new Set(loadWrongIds()); s.add(id); saveWrongIds(Array.from(s));
}
function removeWrong(id) {
  const s = new Set(loadWrongIds()); s.delete(id); saveWrongIds(Array.from(s));
}
function clearWrong() { localStorage.removeItem(STORE_KEY); }

// ---------- 카테고리 ----------
function allCategories() {
  return Array.from(new Set(QUESTIONS.map(q => q.category)));
}
function questionsByCategory(cat) {
  return QUESTIONS.filter(q => q.category === cat);
}

// ---------- 상태 ----------
const state = {
  mode: null,         // 'practice' | 'exam' | 'category' | 'wrong' | null
  pool: [],           // 현재 풀이 중인 문제 배열
  idx: 0,
  selected: null,     // 선택한 보기 인덱스
  checked: false,     // 채점 완료 여부 (연습 모드)
  answers: [],        // 시험모드: {qid, selected, correct}
  meta: { title: "", target: 0 } // 화면 표기용
};

// ---------- 라우팅(간단) ----------
function navigate(view) {
  // view: 'home' | 'quiz' | 'result' | 'concepts'
  $$(".view").forEach(v => v.classList.add("hidden"));
  $(`#view-${view}`).classList.remove("hidden");
  window.scrollTo(0, 0);
}

// ---------- 홈 렌더링 ----------
function renderHome() {
  const cats = allCategories();
  const wrongCount = loadWrongIds().length;
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
  $("#total-count").textContent = QUESTIONS.length;
  $("#concept-count").textContent = Object.keys(CONCEPTS).length;
  $("#btn-wrong").disabled = wrongCount === 0;
  $("#btn-wrong").style.opacity = wrongCount === 0 ? 0.5 : 1;
  $("#btn-clear-wrong").classList.toggle("hidden", wrongCount === 0);
}

// ---------- 모드 시작 ----------
function startPractice() {
  state.mode = "practice";
  state.pool = shuffle(QUESTIONS);
  state.idx = 0; state.selected = null; state.checked = false;
  state.meta = { title: "연습 모드", target: state.pool.length };
  navigate("quiz");
  renderQuestion();
}
function startExam() {
  state.mode = "exam";
  // 60문항 시험: 문제은행이 60개 미만이면 중복 없이 가능한 만큼만
  const total = Math.min(60, QUESTIONS.length);
  state.pool = shuffle(QUESTIONS).slice(0, total);
  state.idx = 0; state.selected = null; state.checked = false; state.answers = [];
  state.meta = { title: `시험 모드 (${total}문항)`, target: total };
  navigate("quiz");
  renderQuestion();
}
function startCategory(cat) {
  state.mode = "category";
  state.pool = shuffle(questionsByCategory(cat));
  state.idx = 0; state.selected = null; state.checked = false;
  state.meta = { title: `${cat} 학습`, target: state.pool.length };
  navigate("quiz");
  renderQuestion();
}
function startWrong() {
  const ids = loadWrongIds();
  if (ids.length === 0) return;
  const pool = QUESTIONS.filter(q => ids.includes(q.id));
  if (pool.length === 0) { alert("오답이 없습니다."); return; }
  state.mode = "wrong";
  state.pool = shuffle(pool);
  state.idx = 0; state.selected = null; state.checked = false;
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
  $("#progress-bar").style.width = `${((state.idx) / state.pool.length) * 100}%`;

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
      el("span", { class: "idx" }, ["①", "②", "③", "④"][i] || String(i + 1)),
      el("span", { class: "txt" }, text)
    );
    opts.appendChild(opt);
  });
  card.appendChild(opts);

  // 액션 버튼
  const actions = el("div", { class: "actions" });
  if (state.mode === "practice" || state.mode === "category" || state.mode === "wrong") {
    // 연습/카테고리/오답: 정답 확인 → 다음
    const checkBtn = el("button", {
      class: "btn primary",
      id: "btn-check",
      onclick: onCheck
    }, "정답 확인");
    const nextBtn = el("button", {
      class: "btn ghost",
      id: "btn-next",
      onclick: onNext
    }, state.idx === state.pool.length - 1 ? "마치기" : "다음 문제");
    actions.appendChild(checkBtn);
    actions.appendChild(nextBtn);
  } else if (state.mode === "exam") {
    // 시험: 다음 / 제출
    const nextBtn = el("button", {
      class: "btn primary",
      id: "btn-next",
      onclick: onNext
    }, state.idx === state.pool.length - 1 ? "제출하기" : "다음 문제");
    actions.appendChild(nextBtn);
  }
  card.appendChild(actions);

  container.appendChild(card);

  state.selected = null;
  state.checked = false;
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
    nextBtn.disabled = state.selected === null;
    return;
  }
  if (checkBtn) checkBtn.disabled = state.selected === null || state.checked;
  if (nextBtn) {
    nextBtn.disabled = !state.checked;
    // 채점 전엔 정답 확인이 메인, 채점 후엔 다음이 메인
    if (state.checked) {
      checkBtn.classList.replace("primary", "ghost") ||
        (checkBtn.className = "btn ghost");
      nextBtn.classList.replace("ghost", "primary") ||
        (nextBtn.className = "btn primary");
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

  // 오답노트 기록/제거
  if (correct) {
    removeWrong(q.id);
  } else {
    addWrong(q.id);
  }

  // 보기 색칠
  $$("#question-area .opt").forEach(opt => {
    opt.classList.add("disabled");
    const i = Number(opt.dataset.i);
    if (i === q.answer) opt.classList.add("correct");
    else if (i === state.selected) opt.classList.add("wrong");
  });

  // 해설
  const fb = el("div", { class: "feedback " + (correct ? "correct" : "wrong") });
  fb.appendChild(el("div", { class: "head" },
    correct ? "✅ 정답입니다!" : "❌ 오답입니다."
  ));
  fb.appendChild(el("div", { html: escapeHtml(q.explain) }));

  // 쉬운 설명 토글
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
      selected: state.selected,
      correct: state.selected === q.answer
    });
    if (state.selected === q.answer) removeWrong(q.id);
    else addWrong(q.id);
  } else {
    if (!state.checked) return;
  }

  state.idx++;
  if (state.idx >= state.pool.length) return finishQuiz();
  renderQuestion();
}

// ---------- 결과 ----------
function finishQuiz() {
  // 시험 모드는 결과 화면, 그 외는 간단 종료 화면
  navigate("result");
  $("#progress-bar").style.width = "100%";

  const isExam = state.mode === "exam";
  const correctCount = isExam
    ? state.answers.filter(a => a.correct).length
    : null;

  $("#result-area").innerHTML = "";

  if (isExam) {
    const total = state.pool.length;
    // 실제 시험: 60문항 중 36문항 이상(60%) 합격
    const passLine = Math.ceil(total * 0.6);
    const pass = correctCount >= passLine;

    const hero = el("div", { class: "card score-hero" });
    hero.appendChild(el("div", { class: "stat" }, "시험 모드 결과"));
    hero.appendChild(el("div", { class: "grade " + (pass ? "pass" : "fail") },
      pass ? "🎉 합격" : "📚 더 연습"));
    hero.appendChild(el("div", { class: "stat" },
      `${total}문항 중 ${correctCount}문항 정답 (합격선: ${passLine}문항)`));
    $("#result-area").appendChild(hero);

    const sum = el("div", { class: "card" });
    const grid = el("div", { class: "score-summary" });
    grid.appendChild(scoreBox(correctCount, "정답"));
    grid.appendChild(scoreBox(total - correctCount, "오답"));
    grid.appendChild(scoreBox(`${Math.round(correctCount / total * 100)}%`, "정답률"));
    sum.appendChild(grid);
    $("#result-area").appendChild(sum);

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
    // 연습/카테고리/오답 모드는 간단한 완료 화면
    const hero = el("div", { class: "card score-hero" });
    hero.appendChild(el("div", { class: "grade" }, "🙌 수고하셨어요"));
    hero.appendChild(el("div", { class: "stat" },
      `${state.meta.title} · ${state.pool.length}문항을 모두 풀었습니다`));
    $("#result-area").appendChild(hero);

    const tip = el("div", { class: "card" }, "오답으로 표시된 문제는 홈의 '오답노트'에서 다시 풀 수 있습니다.");
    $("#result-area").appendChild(tip);
  }

  const acts = el("div", { class: "actions" });
  acts.appendChild(el("button", {
    class: "btn primary",
    onclick: goHome
  }, "홈으로"));
  if (isExam) {
    acts.appendChild(el("button", {
      class: "btn ghost",
      onclick: startExam
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
    const cat = (QUESTIONS.find(q => q.conceptId === id) || {}).category || "";
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
  // 모드 카드
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
    if (confirm("오답노트를 모두 비울까요?")) {
      clearWrong();
      renderHome();
    }
  });

  $("#btn-quit").addEventListener("click", () => {
    if (state.mode === "exam") {
      if (!confirm("시험을 중단하고 홈으로 갈까요? 진행 중인 답은 저장되지 않습니다.")) return;
    }
    goHome();
  });

  renderHome();
  navigate("home");
}

document.addEventListener("DOMContentLoaded", init);
