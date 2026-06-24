// 웹디자인개발기능사 문제은행 - 황근호 전용 문제집
// BASE_QUESTIONS(약 100개)를 보기 순서를 바꿔가며 1,000문제로 자동 확장
// 같은 개념을 다양한 보기 배치로 반복 학습 → 단순 위치 암기 방지

const BASE_QUESTIONS = [
  // ===== 색채/디자인일반 =====
  { id: 1, conceptId: "rgb-additive", category: "색채/디자인일반",
    question: "빛의 3원색(RGB)을 모두 합쳤을 때 나타나는 색은? (가산혼합)",
    options: ["검정", "흰색", "회색", "노랑"], answer: 1,
    explain: "RGB는 더할수록 밝아지는 가산혼합으로, 세 색을 모두 합치면 백색이 된다." },
  { id: 2, conceptId: "rgb-additive", category: "색채/디자인일반",
    question: "다음 중 가산혼합(빛의 혼합)의 3원색 조합은?",
    options: ["빨강·노랑·파랑", "빨강·초록·파랑", "사이안·마젠타·노랑", "검정·흰색·회색"], answer: 1,
    explain: "빛의 3원색은 Red·Green·Blue. 모두 더하면 흰색이 된다." },
  { id: 3, conceptId: "rgb-additive", category: "색채/디자인일반",
    question: "프린터 잉크처럼 색을 섞을수록 어두워지는 혼합 방식은?",
    options: ["가산혼합", "감산혼합", "중간혼합", "병치혼합"], answer: 1,
    explain: "CMYK처럼 물감·잉크는 섞을수록 빛이 흡수되어 어두워지는 감산혼합이다." },
  { id: 4, conceptId: "rgb-additive", category: "색채/디자인일반",
    question: "감산혼합의 3원색에 해당하는 것은?",
    options: ["RGB", "CMY", "HSL", "YUV"], answer: 1,
    explain: "감산혼합 3원색은 사이안(C), 마젠타(M), 옐로(Y)이다. 인쇄에 사용." },

  { id: 5, conceptId: "color-attr", category: "색채/디자인일반",
    question: "색의 3속성에 해당하지 않는 것은?",
    options: ["색상(Hue)", "명도(Value)", "채도(Chroma)", "보색"], answer: 3,
    explain: "색의 3속성은 색상·명도·채도이며, 보색은 색상환에서 마주보는 관계." },
  { id: 6, conceptId: "color-attr", category: "색채/디자인일반",
    question: "색의 밝고 어두운 정도를 나타내는 속성은?",
    options: ["색상", "명도", "채도", "톤"], answer: 1,
    explain: "명도(Value/Lightness)는 색의 밝기. 색상은 종류, 채도는 선명함." },
  { id: 7, conceptId: "color-attr", category: "색채/디자인일반",
    question: "색의 맑고 탁한 정도, 즉 선명함을 나타내는 속성은?",
    options: ["색상", "명도", "채도", "보색"], answer: 2,
    explain: "채도(Chroma/Saturation)는 색의 순수함·선명함. 회색이 섞일수록 채도가 낮아진다." },
  { id: 8, conceptId: "color-attr", category: "색채/디자인일반",
    question: "다음 중 빨강·노랑·파랑처럼 색의 종류를 구분하는 속성은?",
    options: ["색상", "명도", "채도", "톤"], answer: 0,
    explain: "색상(Hue)은 색의 종류를 구분짓는 속성." },

  { id: 9, conceptId: "munsell", category: "색채/디자인일반",
    question: "먼셀 표색계에서 색을 표기하는 순서로 옳은 것은?",
    options: ["명도 채도 색상", "색상 명도/채도", "채도 색상 명도", "색상 채도/명도"], answer: 1,
    explain: "먼셀 표기는 'H V/C'(색상 명도/채도) 순. 예) 5R 4/14." },
  { id: 10, conceptId: "munsell", category: "색채/디자인일반",
    question: "먼셀 표기 '5R 4/14'에서 숫자 '14'가 의미하는 것은?",
    options: ["색상", "명도", "채도", "톤"], answer: 2,
    explain: "5R(색상) 4(명도)/14(채도). 슬래시 뒤가 채도이며 클수록 선명하다." },

  { id: 11, conceptId: "contrast", category: "색채/디자인일반",
    question: "두 보색을 인접시켰을 때 서로의 채도가 더 선명해 보이는 대비는?",
    options: ["명도대비", "계시대비", "보색대비", "연변대비"], answer: 2,
    explain: "보색을 나란히 두면 서로의 채도가 강조되는 보색대비가 나타난다." },
  { id: 12, conceptId: "contrast", category: "색채/디자인일반",
    question: "어떤 색을 한참 본 뒤 흰 종이를 보면 보색의 잔상이 떠오르는 현상은?",
    options: ["동시대비", "계시대비", "면적대비", "보색대비"], answer: 1,
    explain: "시간차를 두고 나타나는 잔상 현상은 계시대비." },
  { id: 13, conceptId: "contrast", category: "색채/디자인일반",
    question: "두 색이 인접할 때 경계 부분에서 명도·채도가 더 강해 보이는 대비는?",
    options: ["연변대비", "면적대비", "계시대비", "온도대비"], answer: 0,
    explain: "경계 부분 강조 현상은 연변대비. 마하 밴드(Mach Band)도 같은 원리." },

  { id: 14, conceptId: "gestalt", category: "색채/디자인일반",
    question: "게슈탈트(Gestalt) 시지각 원리에 해당하지 않는 것은?",
    options: ["근접성", "유사성", "폐쇄성", "황금비"], answer: 3,
    explain: "게슈탈트 원리는 근접성·유사성·연속성·폐쇄성. 황금비는 비례." },
  { id: 15, conceptId: "gestalt", category: "색채/디자인일반",
    question: "흩어진 점이라도 가까운 것끼리 한 그룹으로 인식하는 게슈탈트 원리는?",
    options: ["유사성", "근접성", "연속성", "폐쇄성"], answer: 1,
    explain: "가까운 것끼리 묶어 인식하는 원리는 근접성(Proximity)." },
  { id: 16, conceptId: "gestalt", category: "색채/디자인일반",
    question: "끊어진 선이라도 머릿속에서 이어 보려는 게슈탈트 원리는?",
    options: ["근접성", "유사성", "연속성", "대칭성"], answer: 2,
    explain: "끊어진 흐름을 이어 보려는 원리는 연속성(Continuity)." },

  { id: 17, conceptId: "form-element", category: "색채/디자인일반",
    question: "디자인 조형요소가 아닌 것은?",
    options: ["점", "선", "면", "리듬"], answer: 3,
    explain: "점·선·면은 조형요소, 리듬은 구성원리." },
  { id: 18, conceptId: "form-element", category: "색채/디자인일반",
    question: "다음 중 디자인의 '구성 원리'에 해당하는 것은?",
    options: ["점", "선", "면", "균형"], answer: 3,
    explain: "균형·리듬·강조·통일은 구성 원리. 점·선·면은 조형요소." },

  { id: 19, conceptId: "golden-ratio", category: "색채/디자인일반",
    question: "황금비율의 근사값으로 옳은 것은?",
    options: ["1 : 1.414", "1 : 1.618", "1 : 2", "1 : 1.732"], answer: 1,
    explain: "황금비는 약 1 : 1.618. 1:1.414는 금속비(√2)." },
  { id: 20, conceptId: "golden-ratio", category: "색채/디자인일반",
    question: "A4 용지 등에 사용되는 비율로, 약 1 : 1.414인 것은?",
    options: ["황금비", "금속비", "정수비", "백은비"], answer: 1,
    explain: "1:√2(약 1.414)는 금속비. A4 등 ISO 종이 규격에 사용." },

  { id: 21, conceptId: "warm-cool", category: "색채/디자인일반",
    question: "다음 중 난색(따뜻한 색)에 해당하는 것은?",
    options: ["파랑", "초록", "빨강", "남색"], answer: 2,
    explain: "빨강·주황·노랑 계열은 난색. 파랑·청록 계열은 한색." },
  { id: 22, conceptId: "warm-cool", category: "색채/디자인일반",
    question: "심리적으로 차가움을 느끼게 하는 한색에 해당하는 색은?",
    options: ["주황", "노랑", "빨강", "파랑"], answer: 3,
    explain: "한색은 파랑·청록·남색 계열로 시원한 느낌." },

  { id: 23, conceptId: "achromatic", category: "색채/디자인일반",
    question: "다음 중 무채색에 해당하지 않는 것은?",
    options: ["흰색", "검정", "회색", "남색"], answer: 3,
    explain: "무채색은 색기가 없는 흰·검·회. 색상이 있으면 유채색." },
  { id: 24, conceptId: "achromatic", category: "색채/디자인일반",
    question: "무채색이 가지는 속성은?",
    options: ["색상만", "명도만", "채도만", "색상과 채도"], answer: 1,
    explain: "무채색은 명도만 있고, 색상·채도가 없다." },

  { id: 25, conceptId: "tone", category: "색채/디자인일반",
    question: "톤(Tone)에 대한 설명으로 옳은 것은?",
    options: ["색상의 종류", "명도와 채도의 복합 개념", "색상과 명도의 합", "빛의 파장"], answer: 1,
    explain: "톤은 명도와 채도가 합쳐진 색의 분위기·강약 표현." },

  { id: 26, conceptId: "visibility-color", category: "색채/디자인일반",
    question: "두 색의 명도 차이가 클수록 높아지는 색의 성질은?",
    options: ["주목성", "명시성", "심미성", "항상성"], answer: 1,
    explain: "명시성(가독성)은 두 색의 명도 차가 클수록 잘 보임. 검정 글씨에 노란 바탕 예." },
  { id: 27, conceptId: "visibility-color", category: "색채/디자인일반",
    question: "주위 색과 관계없이 눈에 잘 띄는 색의 성질은?",
    options: ["명시성", "주목성", "동화성", "잔상"], answer: 1,
    explain: "주목성은 단색의 시각적 끌어당김. 빨강·노랑이 주목성이 높음." },

  // ===== 웹그래픽 =====
  { id: 28, conceptId: "image-format", category: "웹그래픽",
    question: "투명도(알파 채널)를 지원하고 무손실 압축인 이미지 포맷은?",
    options: ["JPG", "PNG", "GIF", "BMP"], answer: 1,
    explain: "PNG는 무손실·알파채널 지원. JPG는 손실, GIF는 256색 한정 투명." },
  { id: 29, conceptId: "image-format", category: "웹그래픽",
    question: "사진처럼 색이 많은 이미지에 적합하며 손실 압축을 사용하는 포맷은?",
    options: ["GIF", "PNG", "JPG", "SVG"], answer: 2,
    explain: "JPG(JPEG)는 손실 압축이지만 사진처럼 색 정보가 풍부한 이미지에 효율적." },
  { id: 30, conceptId: "image-format", category: "웹그래픽",
    question: "256색 이하·간단한 애니메이션 지원이 특징인 이미지 포맷은?",
    options: ["JPG", "PNG", "GIF", "WebP"], answer: 2,
    explain: "GIF는 256색·간단 애니메이션을 지원. 화질은 낮은 편." },

  { id: 31, conceptId: "bitmap-vector", category: "웹그래픽",
    question: "확대해도 깨지지 않고 선명한 이미지 방식은?",
    options: ["비트맵", "래스터", "벡터", "도트"], answer: 2,
    explain: "벡터는 수학적 좌표·곡선으로 표현되어 확대해도 깨지지 않음." },
  { id: 32, conceptId: "bitmap-vector", category: "웹그래픽",
    question: "픽셀(점) 단위로 표현되어 확대 시 계단 현상이 생기는 이미지 방식은?",
    options: ["벡터", "비트맵", "SVG", "EPS"], answer: 1,
    explain: "비트맵(래스터)은 픽셀 단위. 확대하면 계단(에일리어싱) 현상 발생." },
  { id: 33, conceptId: "bitmap-vector", category: "웹그래픽",
    question: "다음 중 벡터 기반 이미지 포맷은?",
    options: ["JPG", "PNG", "GIF", "SVG"], answer: 3,
    explain: "SVG는 XML 기반 벡터 포맷. 확대·축소 시 화질 손실 없음." },

  { id: 34, conceptId: "resolution", category: "웹그래픽",
    question: "웹용 이미지의 표준 해상도로 가장 적절한 값은?",
    options: ["72dpi", "300dpi", "600dpi", "1200dpi"], answer: 0,
    explain: "웹은 일반적으로 72dpi(ppi)를 사용. 인쇄용은 300dpi 권장." },
  { id: 35, conceptId: "color-mode", category: "웹그래픽",
    question: "웹 화면 표시에 사용하는 색상 모드는?",
    options: ["CMYK", "RGB", "Pantone", "Grayscale"], answer: 1,
    explain: "웹·모니터는 RGB, 인쇄는 CMYK 모드를 사용한다." },

  // ===== HTML/CSS =====
  { id: 36, conceptId: "semantic-tag", category: "HTML/CSS",
    question: "HTML5에서 그 자체로 완결되는 독립 콘텐츠를 정의하는 시맨틱 태그는?",
    options: ["<div>", "<span>", "<article>", "<b>"], answer: 2,
    explain: "<article>은 독립적으로 배포·재사용 가능한 콘텐츠." },
  { id: 37, conceptId: "semantic-tag", category: "HTML/CSS",
    question: "페이지의 최상단 머리 영역(로고·메뉴 등)에 사용하는 시맨틱 태그는?",
    options: ["<header>", "<footer>", "<section>", "<aside>"], answer: 0,
    explain: "<header>는 페이지·섹션의 머리말 영역." },
  { id: 38, conceptId: "semantic-tag", category: "HTML/CSS",
    question: "사이트의 주된 탐색 메뉴 영역에 사용하는 시맨틱 태그는?",
    options: ["<menu>", "<nav>", "<list>", "<link>"], answer: 1,
    explain: "<nav>는 주요 탐색(navigation) 영역." },
  { id: 39, conceptId: "semantic-tag", category: "HTML/CSS",
    question: "본문 옆에 부수적인 정보(광고·관련글 등)를 담는 시맨틱 태그는?",
    options: ["<section>", "<article>", "<aside>", "<footer>"], answer: 2,
    explain: "<aside>는 본문과 간접적으로 관련된 부수 콘텐츠." },

  { id: 40, conceptId: "img-alt", category: "HTML/CSS",
    question: "이미지가 표시되지 않을 때 대체 텍스트를 제공하는 <img> 속성은?",
    options: ["src", "alt", "title", "href"], answer: 1,
    explain: "alt는 대체 텍스트로 스크린리더·접근성에 필수." },
  { id: 41, conceptId: "img-alt", category: "HTML/CSS",
    question: "스크린리더가 이미지를 설명할 때 읽어주는 속성은?",
    options: ["src", "title", "alt", "name"], answer: 2,
    explain: "alt 속성의 텍스트가 스크린리더로 음성 안내된다." },

  { id: 42, conceptId: "doctype", category: "HTML/CSS",
    question: "HTML5 문서임을 선언하기 위해 문서 최상단에 작성하는 것은?",
    options: ["<meta>", "<!DOCTYPE html>", "<head>", "<title>"], answer: 1,
    explain: "<!DOCTYPE html>은 문서 형식 선언으로 가장 위에 작성." },

  { id: 43, conceptId: "box-model", category: "HTML/CSS",
    question: "CSS 박스 모델에서 콘텐츠와 테두리 사이의 안쪽 여백은?",
    options: ["margin", "padding", "outline", "gap"], answer: 1,
    explain: "안쪽 여백은 padding, 바깥쪽 여백은 margin." },
  { id: 44, conceptId: "box-model", category: "HTML/CSS",
    question: "CSS 박스 모델에서 요소의 테두리 바깥쪽 여백을 지정하는 속성은?",
    options: ["margin", "padding", "border", "spacing"], answer: 0,
    explain: "margin은 요소 사이의 바깥 여백." },
  { id: 45, conceptId: "box-model", category: "HTML/CSS",
    question: "박스 모델을 안쪽부터 바깥쪽 순서로 올바르게 나열한 것은?",
    options: ["margin → border → padding → content", "content → padding → border → margin", "padding → content → margin → border", "content → margin → padding → border"], answer: 1,
    explain: "박스 모델: 콘텐츠 → 패딩 → 보더 → 마진." },

  { id: 46, conceptId: "specificity", category: "HTML/CSS",
    question: "CSS 선택자 명시도가 가장 높은 것은? (인라인 스타일 제외)",
    options: ["태그 선택자", "클래스 선택자", "id 선택자", "전체 선택자(*)"], answer: 2,
    explain: "명시도: id > class > 태그 > 전체. 인라인이 그보다 높음." },
  { id: 47, conceptId: "specificity", category: "HTML/CSS",
    question: "CSS에서 ID 선택자를 표시할 때 사용하는 기호는?",
    options: [".", "#", "*", "@"], answer: 1,
    explain: "ID는 #, 클래스는 ., 전체는 *." },
  { id: 48, conceptId: "specificity", category: "HTML/CSS",
    question: "CSS에서 클래스 선택자를 표시할 때 사용하는 기호는?",
    options: [".", "#", "&", ":"], answer: 0,
    explain: "클래스 선택자는 마침표(.)로 시작." },

  { id: 49, conceptId: "display-none", category: "HTML/CSS",
    question: "요소를 화면에서 숨기면서 차지하던 공간도 없애는 CSS 선언은?",
    options: ["visibility: hidden", "display: none", "opacity: 0", "position: absolute"], answer: 1,
    explain: "display:none은 공간까지 제거." },
  { id: 50, conceptId: "display-none", category: "HTML/CSS",
    question: "요소가 보이지 않지만 레이아웃 공간은 그대로 유지되는 선언은?",
    options: ["display: none", "visibility: hidden", "remove()", "hidden=true"], answer: 1,
    explain: "visibility:hidden은 안 보이지만 공간은 차지." },

  { id: 51, conceptId: "position", category: "HTML/CSS",
    question: "문서 흐름에서 벗어나 가장 가까운 position 지정 조상 기준으로 배치되는 값은?",
    options: ["static", "relative", "absolute", "sticky"], answer: 2,
    explain: "absolute는 흐름에서 빠지고 가장 가까운 position 지정 조상 기준 배치." },
  { id: 52, conceptId: "position", category: "HTML/CSS",
    question: "스크롤과 무관하게 항상 뷰포트에 고정되는 position 값은?",
    options: ["relative", "absolute", "fixed", "sticky"], answer: 2,
    explain: "fixed는 뷰포트 기준으로 항상 고정." },
  { id: 53, conceptId: "position", category: "HTML/CSS",
    question: "스크롤 시 임계점을 만나면 그 자리에서 고정되는 position 값은?",
    options: ["fixed", "sticky", "absolute", "static"], answer: 1,
    explain: "sticky는 평소 일반 흐름, 임계점에서 고정." },

  { id: 54, conceptId: "flex", category: "HTML/CSS",
    question: "Flexbox 컨테이너에서 주축 방향의 정렬을 지정하는 속성은?",
    options: ["align-items", "justify-content", "flex-wrap", "order"], answer: 1,
    explain: "justify-content는 주축 정렬, align-items는 교차축 정렬." },
  { id: 55, conceptId: "flex", category: "HTML/CSS",
    question: "요소를 Flex 컨테이너로 만들기 위한 CSS 선언은?",
    options: ["display: block", "display: flex", "display: grid", "position: flex"], answer: 1,
    explain: "display:flex 또는 display:inline-flex로 Flex 컨테이너가 됨." },

  { id: 56, conceptId: "grid", category: "HTML/CSS",
    question: "2차원(행+열) 레이아웃을 만들 때 사용하는 CSS 표시 방식은?",
    options: ["block", "flex", "grid", "inline"], answer: 2,
    explain: "Grid는 2차원(행·열) 레이아웃, Flex는 1차원." },

  { id: 57, conceptId: "media-query", category: "HTML/CSS",
    question: "화면 크기에 따라 다른 스타일을 적용할 때 사용하는 CSS 규칙은?",
    options: ["@import", "@media", "@font-face", "@keyframes"], answer: 1,
    explain: "@media 쿼리로 뷰포트 크기·기기 특성에 따라 스타일 적용." },
  { id: 58, conceptId: "media-query", category: "HTML/CSS",
    question: "모바일에서 가로 폭에 맞게 페이지를 표시하려고 <head>에 넣는 메타 태그는?",
    options: ["<meta charset>", "<meta viewport>", "<meta description>", "<meta robots>"], answer: 1,
    explain: "viewport meta로 모바일 가로폭·확대 정책을 설정." },

  { id: 59, conceptId: "css-units", category: "HTML/CSS",
    question: "부모 요소의 글자 크기에 비례하는 CSS 단위는?",
    options: ["px", "em", "rem", "vh"], answer: 1,
    explain: "em은 부모 요소의 글자 크기 기준. rem은 루트(html) 기준." },
  { id: 60, conceptId: "css-units", category: "HTML/CSS",
    question: "루트(html)의 글자 크기에 비례하는 CSS 단위는?",
    options: ["em", "rem", "%", "pt"], answer: 1,
    explain: "rem은 root em. 보통 html의 16px이 기준." },

  { id: 61, conceptId: "transition", category: "HTML/CSS",
    question: "요소의 상태 변화에 부드러운 변화 효과를 주는 CSS 속성은?",
    options: ["animation", "transition", "transform", "filter"], answer: 1,
    explain: "transition은 속성 값 변화에 시간차를 주어 부드럽게 표현." },

  { id: 62, conceptId: "form-input", category: "HTML/CSS",
    question: "사용자에게 한 줄 텍스트 입력을 받을 때 사용하는 input type은?",
    options: ["text", "password", "submit", "checkbox"], answer: 0,
    explain: "text는 일반 한 줄 입력. password는 마스킹." },
  { id: 63, conceptId: "form-input", category: "HTML/CSS",
    question: "label과 input을 연결하기 위해 label에 사용하는 속성은?",
    options: ["name", "for", "id", "value"], answer: 1,
    explain: "label의 for 속성 값과 input의 id가 같으면 연결됨." },
  { id: 64, conceptId: "form-input", category: "HTML/CSS",
    question: "여러 항목 중 하나만 선택할 수 있는 input type은?",
    options: ["checkbox", "radio", "select", "range"], answer: 1,
    explain: "radio는 같은 name끼리 그룹화되어 하나만 선택." },

  { id: 65, conceptId: "list-tag", category: "HTML/CSS",
    question: "순서가 있는(번호 매김) 목록을 만들 때 사용하는 HTML 태그는?",
    options: ["<ul>", "<ol>", "<dl>", "<li>"], answer: 1,
    explain: "<ol>(ordered list)는 번호 목록, <ul>(unordered list)는 점 목록." },
  { id: 66, conceptId: "list-tag", category: "HTML/CSS",
    question: "용어와 그 설명을 짝지어 표현할 때 사용하는 HTML 목록 태그는?",
    options: ["<ul>", "<ol>", "<dl>", "<list>"], answer: 2,
    explain: "<dl> 정의 목록. <dt>(용어), <dd>(설명) 쌍으로 사용." },

  { id: 67, conceptId: "table-tag", category: "HTML/CSS",
    question: "표의 머리행(헤더 셀)에 사용하는 HTML 태그는?",
    options: ["<td>", "<th>", "<tr>", "<tf>"], answer: 1,
    explain: "<th>는 표 머리 셀로 굵게 표시·접근성에 표 헤더로 인식됨." },
  { id: 68, conceptId: "anchor", category: "HTML/CSS",
    question: "다른 페이지로 이동하는 링크를 만들 때 사용하는 태그와 속성은?",
    options: ["<link href>", "<a href>", "<nav src>", "<go to>"], answer: 1,
    explain: "<a href='주소'>는 페이지 이동 링크." },

  // ===== JavaScript =====
  { id: 69, conceptId: "const-keyword", category: "JavaScript",
    question: "블록 스코프를 가지며 재할당이 불가능한 변수 선언 키워드는?",
    options: ["var", "let", "const", "new"], answer: 2,
    explain: "const는 블록 스코프·재할당 불가." },
  { id: 70, conceptId: "const-keyword", category: "JavaScript",
    question: "블록 스코프를 가지면서 값을 다시 바꿀 수 있는 변수 선언 키워드는?",
    options: ["var", "let", "const", "static"], answer: 1,
    explain: "let은 블록 스코프이며 재할당 가능." },
  { id: 71, conceptId: "const-keyword", category: "JavaScript",
    question: "함수 스코프를 가지며 호이스팅 시 undefined로 초기화되는 옛 키워드는?",
    options: ["var", "let", "const", "def"], answer: 0,
    explain: "var는 함수 스코프, 호이스팅 시 undefined로 초기화." },

  { id: 72, conceptId: "event", category: "JavaScript",
    question: "사용자의 클릭·입력 등 동작에 페이지가 반응하도록 하는 것을 무엇이라 하는가?",
    options: ["이벤트", "메서드", "속성", "주석"], answer: 0,
    explain: "발생하는 동작을 이벤트라 한다." },
  { id: 73, conceptId: "event", category: "JavaScript",
    question: "버튼 클릭 시 실행할 함수를 등록할 때 사용하는 메서드는?",
    options: ["addEventListener", "getElement", "querySelector", "createElement"], answer: 0,
    explain: "addEventListener('click', 함수)로 이벤트와 동작 연결." },

  { id: 74, conceptId: "equality", category: "JavaScript",
    question: "JavaScript에서 자료형까지 비교하는 동등 연산자는?",
    options: ["=", "==", "===", "!="], answer: 2,
    explain: "===는 자료형까지 같아야 true. ==는 자료형 변환 후 비교(엄격하지 않음)." },

  { id: 75, conceptId: "dom-query", category: "JavaScript",
    question: "id가 'box'인 요소를 선택하는 가장 적절한 코드는?",
    options: ["document.getElementById('box')", "document.getClass('box')", "document.find('#box')", "document.tag('box')"], answer: 0,
    explain: "getElementById는 id로 요소를 가져온다. querySelector('#box')도 가능." },
  { id: 76, conceptId: "dom-query", category: "JavaScript",
    question: "CSS 선택자 문법으로 요소를 가져오는 DOM 메서드는?",
    options: ["getElement()", "querySelector()", "findCss()", "selectTag()"], answer: 1,
    explain: "querySelector는 CSS 선택자로 첫 번째 일치 요소를 반환." },

  { id: 77, conceptId: "json", category: "JavaScript",
    question: "JSON에 대한 설명으로 옳은 것은?",
    options: ["프로그래밍 언어 이름", "데이터 교환 형식", "데이터베이스 종류", "디자인 패턴"], answer: 1,
    explain: "JSON(JavaScript Object Notation)은 가벼운 데이터 교환 형식." },

  { id: 78, conceptId: "array-method", category: "JavaScript",
    question: "배열의 길이를 알려주는 속성은?",
    options: ["count", "size", "length", "total"], answer: 2,
    explain: "배열의 요소 개수는 .length 속성." },

  // ===== 인터넷/네트워크 =====
  { id: 79, conceptId: "http-https", category: "인터넷/네트워크",
    question: "통신을 암호화해 보안을 강화한 웹 프로토콜은?",
    options: ["HTTP", "HTTPS", "FTP", "SMTP"], answer: 1,
    explain: "HTTPS는 SSL/TLS 암호화를 적용한 HTTP." },
  { id: 80, conceptId: "http-https", category: "인터넷/네트워크",
    question: "웹페이지를 주고받을 때 사용하는 기본 통신 프로토콜은?",
    options: ["FTP", "SMTP", "HTTP", "POP3"], answer: 2,
    explain: "HTTP는 웹의 기본 통신 프로토콜." },

  { id: 81, conceptId: "http-method", category: "인터넷/네트워크",
    question: "주소창에 데이터가 노출되며 주로 조회에 사용하는 HTTP 메서드는?",
    options: ["GET", "POST", "PUT", "DELETE"], answer: 0,
    explain: "GET은 URL 쿼리에 데이터 노출, 조회에 사용." },
  { id: 82, conceptId: "http-method", category: "인터넷/네트워크",
    question: "본문(body)에 데이터를 담아 서버로 전송하는 HTTP 메서드는?",
    options: ["GET", "POST", "HEAD", "OPTIONS"], answer: 1,
    explain: "POST는 요청 본문에 데이터를 담아 전송. 회원가입·로그인 등에 사용." },

  { id: 83, conceptId: "url", category: "인터넷/네트워크",
    question: "URL의 구성 요소가 아닌 것은?",
    options: ["프로토콜", "도메인", "경로", "쿠키"], answer: 3,
    explain: "URL: 프로토콜://도메인:포트/경로?쿼리. 쿠키는 별도 저장 데이터." },
  { id: 84, conceptId: "url", category: "인터넷/네트워크",
    question: "사람이 외우기 쉬운 글자 주소를 컴퓨터가 이해하는 IP로 변환하는 시스템은?",
    options: ["URL", "DNS", "HTTP", "FTP"], answer: 1,
    explain: "DNS(Domain Name System)는 도메인을 IP로 변환." },

  { id: 85, conceptId: "cookie-session", category: "인터넷/네트워크",
    question: "사용자 정보를 사용자의 브라우저에 저장하는 작은 텍스트 파일은?",
    options: ["세션", "쿠키", "캐시", "토큰"], answer: 1,
    explain: "쿠키는 클라이언트(브라우저)에 저장. 세션은 서버에 저장." },

  // ===== UX/UI =====
  { id: 86, conceptId: "wireframe", category: "UX/UI",
    question: "화면 구성과 콘텐츠 배치를 선·도형으로 단순하게 표현한 설계 도면은?",
    options: ["스토리보드", "와이어프레임", "프로토타입", "무드보드"], answer: 1,
    explain: "와이어프레임은 레이아웃 골격을 단순 표현." },
  { id: 87, conceptId: "wireframe", category: "UX/UI",
    question: "색·이미지 없이 화면 배치만 빠르게 그리는 산출물은?",
    options: ["프로토타입", "무드보드", "와이어프레임", "사이트맵"], answer: 2,
    explain: "와이어프레임은 색·이미지 없이 구조만 표현." },

  { id: 88, conceptId: "prototype", category: "UX/UI",
    question: "실제 동작에 가깝게 인터랙션을 구현해 사용성 테스트에 활용하는 산출물은?",
    options: ["사이트맵", "와이어프레임", "프로토타입", "스타일가이드"], answer: 2,
    explain: "프로토타입은 동작을 구현해 사용 흐름을 검증." },
  { id: 89, conceptId: "prototype", category: "UX/UI",
    question: "사용성 테스트(Usability Test)의 목적으로 가장 알맞은 것은?",
    options: ["서버 부하 측정", "사용자가 제품을 잘 쓰는지 검증", "코드 품질 점검", "디자인 색 선정"], answer: 1,
    explain: "사용자가 제품을 얼마나 쉽고 효과적으로 쓰는지 확인." },

  { id: 90, conceptId: "ux-ui", category: "UX/UI",
    question: "사용자가 제품을 사용하며 느끼는 전반적인 경험을 의미하는 용어는?",
    options: ["UI", "UX", "GUI", "CLI"], answer: 1,
    explain: "UX는 User Experience. UI는 화면 인터페이스." },
  { id: 91, conceptId: "ux-ui", category: "UX/UI",
    question: "버튼·메뉴·아이콘 등 사용자가 보고 조작하는 화면 요소를 가리키는 용어는?",
    options: ["UX", "UI", "DB", "API"], answer: 1,
    explain: "UI(User Interface)는 사용자와 시스템이 만나는 화면·조작 영역." },

  { id: 92, conceptId: "persona", category: "UX/UI",
    question: "제품의 가상 사용자를 구체적으로 설정해 의사결정 기준으로 삼는 UX 도구는?",
    options: ["페르소나", "사이트맵", "와이어프레임", "유스케이스"], answer: 0,
    explain: "페르소나는 대표 가상 사용자 프로필. 디자인·기획 의사결정 기준." },

  { id: 93, conceptId: "sitemap", category: "UX/UI",
    question: "사이트의 페이지 구조와 계층을 한눈에 보여주는 도면은?",
    options: ["사이트맵", "와이어프레임", "스토리보드", "플로우차트"], answer: 0,
    explain: "사이트맵은 페이지 간 구조·계층을 트리로 표현." },

  // ===== 웹표준 =====
  { id: 94, conceptId: "w3c", category: "웹표준",
    question: "HTML·CSS 등 웹 표준과 접근성 지침을 제정하는 국제 기구는?",
    options: ["ISO", "W3C", "IEEE", "ICANN"], answer: 1,
    explain: "W3C가 웹 표준·WCAG 접근성 지침을 제정." },
  { id: 95, conceptId: "w3c", category: "웹표준",
    question: "웹 접근성 국제 지침을 가리키는 약어는?",
    options: ["WCAG", "WAVE", "SEO", "ARIA"], answer: 0,
    explain: "WCAG는 W3C가 제정한 웹 접근성 지침." },
  { id: 96, conceptId: "w3c", category: "웹표준",
    question: "도메인 이름과 IP 주소(루트 DNS) 관리를 담당하는 국제 기구는?",
    options: ["W3C", "ICANN", "IEEE", "ISO"], answer: 1,
    explain: "ICANN은 도메인·IP 자원 관리. W3C는 웹 표준 제정." },

  { id: 97, conceptId: "accessibility", category: "웹표준",
    question: "장애 여부와 관계없이 누구나 웹을 이용할 수 있게 하는 개념은?",
    options: ["웹 표준", "웹 접근성", "웹 호환성", "반응형 웹"], answer: 1,
    explain: "웹 접근성은 누구나 차별 없이 웹을 이용할 수 있게 하는 개념." },
  { id: 98, conceptId: "accessibility", category: "웹표준",
    question: "스크린리더 사용자를 위해 본문 내용 시작점으로 바로 이동하는 링크는?",
    options: ["바로가기 링크(skip link)", "북마크", "퍼머링크", "앵커"], answer: 0,
    explain: "skip link는 접근성을 위한 본문 바로가기 링크." },

  { id: 99, conceptId: "responsive", category: "웹표준",
    question: "하나의 코드로 다양한 화면 크기에 적응해 표시되는 웹 디자인 방식은?",
    options: ["적응형 웹", "반응형 웹", "고정형 웹", "모바일 전용"], answer: 1,
    explain: "반응형 웹은 미디어 쿼리 등을 활용해 하나의 코드로 다양한 화면에 대응." },

  { id: 100, conceptId: "semantic-benefit", category: "웹표준",
    question: "시맨틱 마크업의 장점이 아닌 것은?",
    options: ["검색엔진 최적화(SEO)", "접근성 향상", "화면 디자인 자동 변경", "코드 가독성 향상"], answer: 2,
    explain: "시맨틱은 의미 전달용. 디자인을 자동으로 바꾸지는 않음." }
];

// 개념 인덱스 (오답노트·문제 카드 표시용)
const CONCEPTS_INDEX = {
  "rgb-additive": "빛의 3원색과 가산혼합",
  "color-attr": "색의 3속성",
  "munsell": "먼셀 표색계 표기법",
  "contrast": "색의 대비 현상",
  "gestalt": "게슈탈트 시지각 원리",
  "form-element": "조형요소와 구성원리",
  "golden-ratio": "황금비율",
  "warm-cool": "난색과 한색",
  "achromatic": "무채색과 유채색",
  "tone": "톤(Tone)",
  "visibility-color": "명시성·주목성",
  "image-format": "이미지 포맷(JPG/PNG/GIF)",
  "bitmap-vector": "비트맵 vs 벡터",
  "resolution": "해상도(dpi/ppi)",
  "color-mode": "RGB와 CMYK 색상모드",
  "semantic-tag": "HTML5 시맨틱 태그",
  "img-alt": "이미지 alt 속성",
  "doctype": "HTML5 문서 선언",
  "box-model": "CSS 박스 모델",
  "specificity": "CSS 선택자 명시도",
  "display-none": "요소 숨기기",
  "position": "CSS position 속성",
  "flex": "Flexbox",
  "grid": "CSS Grid",
  "media-query": "미디어 쿼리·뷰포트",
  "css-units": "CSS 단위(em/rem)",
  "transition": "CSS 전환 효과",
  "form-input": "폼과 input 요소",
  "list-tag": "목록 태그(ul/ol/dl)",
  "table-tag": "표 태그(table/th/td)",
  "anchor": "링크(a 태그)",
  "const-keyword": "변수 선언(var/let/const)",
  "event": "이벤트 처리",
  "equality": "동등 연산자(==/===)",
  "dom-query": "DOM 선택",
  "json": "JSON 데이터 형식",
  "array-method": "배열 속성",
  "http-https": "HTTP와 HTTPS",
  "http-method": "HTTP 메서드(GET/POST)",
  "url": "URL과 DNS",
  "cookie-session": "쿠키와 세션",
  "wireframe": "와이어프레임",
  "prototype": "프로토타입·사용성 테스트",
  "ux-ui": "UX와 UI",
  "persona": "페르소나",
  "sitemap": "사이트맵",
  "w3c": "웹 표준 기구",
  "accessibility": "웹 접근성",
  "responsive": "반응형 웹",
  "semantic-benefit": "시맨틱 마크업의 이점"
};

// ---------- 1,000문제 생성 ----------
// 같은 문제를 보기 순서만 다르게 배치해 다양한 변형 문제 생성
// 학생이 보기 위치를 외우는 게 아니라 내용을 읽고 판단하도록 유도
function seededRandom(seed) {
  let s = seed;
  return function() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function permuteOptions(base, seedOffset) {
  const indices = [0, 1, 2, 3];
  const rand = seededRandom(base.id * 1000 + seedOffset);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
}

function generateVariants(base, n) {
  const variants = [];
  const seen = new Set();
  let offset = 1;
  while (variants.length < n && offset < 200) {
    const perm = permuteOptions(base, offset++);
    const key = perm.join("");
    if (seen.has(key)) continue;
    seen.add(key);
    const options = perm.map(i => base.options[i]);
    const answer = perm.indexOf(base.answer);
    variants.push({
      id: base.id * 100 + variants.length,
      baseId: base.id,
      variantIdx: variants.length,
      conceptId: base.conceptId,
      category: base.category,
      question: base.question,
      options: options,
      answer: answer,
      explain: base.explain
    });
  }
  return variants;
}

const TARGET_TOTAL = 1000;
const VARIANTS_PER_BASE = Math.ceil(TARGET_TOTAL / BASE_QUESTIONS.length);

const QUESTIONS = [];
BASE_QUESTIONS.forEach(base => {
  generateVariants(base, VARIANTS_PER_BASE).forEach(v => QUESTIONS.push(v));
});
// 정확히 1000개로 맞춤
QUESTIONS.length = Math.min(QUESTIONS.length, TARGET_TOTAL);
