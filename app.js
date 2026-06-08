// app.js
// data.js에 저장된 민법 카드를 화면에 표시하는 파일입니다.

// 현재 선택된 단원
let currentChapter = "전체";

// HTML 요소 가져오기
const cardContainer = document.getElementById("cardContainer");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");
const cardCount = document.getElementById("cardCount");
const darkModeBtn = document.getElementById("darkModeBtn");

// data.js에 civilCards가 없을 경우를 대비한 안전 처리
const allCards = typeof civilCards !== "undefined" ? civilCards : [];

// 중요도 별 표시 만들기
function makeStars(count) {
  return "★".repeat(count) + "☆".repeat(5 - count);
}

// 카드 1개를 HTML로 변환
function createCardHTML(card) {
  const summaryHTML = card.summary
    .map((item) => `<li>${item}</li>`)
    .join("");

  const oxHTML = card.ox
    .map((item, index) => {
      return `
        <div class="ox-item">
          <p class="ox-q">Q${index + 1}. ${item.q}</p>
          <button class="answer-btn" type="button">정답 보기</button>
          <div class="ox-answer">
            <p>
              <span class="answer-mark">${item.a}</span>
              ${item.e}
            </p>
          </div>
        </div>
      `;
    })
    .join("");

  return `
    <article class="study-card">
      <div class="card-top">
        <div>
          <div class="badges">
            <span class="badge exam">${card.exam}</span>
            <span class="badge chapter">${card.chapter}</span>
            <span class="badge level">${card.level}</span>
          </div>
          <h2 class="card-title">${card.title}</h2>
        </div>
        <div class="importance">
          ${makeStars(card.importance)}
        </div>
      </div>

      <section class="card-section">
        <h3>① 쉬운 설명</h3>
        <p>${card.easy}</p>
      </section>

      <section class="card-section">
        <h3>② 핵심요약</h3>
        <ul class="summary-list">
          ${summaryHTML}
        </ul>
      </section>

      <section class="card-section">
        <h3>③ 시험포인트</h3>
        <div class="point-box">
          <p>${card.point}</p>
        </div>
      </section>

      <section class="card-section">
        <h3>④ 기출함정</h3>
        <div class="trap-box">
          <p>${card.trap}</p>
        </div>
      </section>

      <section class="card-section">
        <h3>⑤ OX 문제</h3>
        <div class="ox-list">
          ${oxHTML}
        </div>
      </section>
    </article>
  `;
}

// 검색 및 필터 조건에 맞는 카드만 걸러내기
function getFilteredCards() {
  const keyword = searchInput.value.trim().toLowerCase();

  return allCards.filter((card) => {
    const matchChapter =
      currentChapter === "전체" || card.chapter === currentChapter;

    const searchText = [
      card.title,
      card.easy,
      card.point,
      card.trap,
      card.chapter,
      card.level,
      ...card.summary,
      ...card.ox.map((item) => item.q),
      ...card.ox.map((item) => item.e),
    ]
      .join(" ")
      .toLowerCase();

    const matchKeyword = searchText.includes(keyword);

    return matchChapter && matchKeyword;
  });
}

// 화면에 카드 표시하기
function renderCards() {
  const filteredCards = getFilteredCards();

  cardCount.textContent = `카드 ${filteredCards.length}개`;

  if (filteredCards.length === 0) {
    cardContainer.innerHTML = `
      <div class="empty">
        조건에 맞는 카드가 없습니다.
      </div>
    `;
    return;
  }

  cardContainer.innerHTML = filteredCards
    .map((card) => createCardHTML(card))
    .join("");

  bindAnswerButtons();
}

// OX 정답 보기 버튼 작동
function bindAnswerButtons() {
  const answerButtons = document.querySelectorAll(".answer-btn");

  answerButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const answerBox = button.nextElementSibling;
      answerBox.classList.toggle("show");

      if (answerBox.classList.contains("show")) {
        button.textContent = "정답 숨기기";
      } else {
        button.textContent = "정답 보기";
      }
    });
  });
}

// 단원 필터 버튼 작동
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    currentChapter = button.dataset.chapter;
    renderCards();
  });
});

// 검색창 입력 시 카드 다시 표시
searchInput.addEventListener("input", () => {
  renderCards();
});

// 다크모드 버튼 작동
darkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    darkModeBtn.textContent = "라이트모드";
  } else {
    darkModeBtn.textContent = "다크모드";
  }
});

// 처음 화면 로딩 시 카드 표시
renderCards();