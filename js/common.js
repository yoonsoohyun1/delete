

/* ==========================================================================
   Header Scroll
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("#hd");

  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 10) {
      header.classList.add("bg-white", "shadow-sm");
      header.classList.remove("bg-transparent");
    } else {
      header.classList.remove("bg-white", "shadow-sm");
    }
  };

  handleScroll();
  window.addEventListener("scroll", handleScroll);
});


/* ==========================================================================
   현실섹션 / 차트섹션
   ========================================================================== */

const seoulGus = [
  "강남구", "강동구", "강북구", "강서구", "관악구",
  "광진구", "구로구", "금천구", "노원구", "도봉구",
  "동대문구", "동작구", "마포구", "서대문구", "서초구",
  "성동구", "성북구", "송파구", "양천구", "영등포구",
  "용산구", "은평구", "종로구", "중구", "중랑구"
];

const chartColors = {
  "재직 중": "#cbdffd",
  "아르바이트/프리랜서": "#fecdf4",
  "취업 준비 중": "#ffeeb3",
  "대학(원)생": "#e3ccfe",
  "무직": "#c1ecc7"
};

let currentChartData = [];
let chartSectionInView = false;
let metricRowInView = false;
let chartAnimationFrameId = null;

document.addEventListener("DOMContentLoaded", () => {
  initGuDropdown5x5();
  refreshDataView();
  initChartScrollReplay();
  initCounterAnimation();

  
const darkmodeBtn = document.getElementById('darkmodebtn');
  darkmodeBtn.addEventListener('click', function () {
    document.body.classList.toggle('darkmode');
    if (document.body.classList.contains('darkmode')) {
      darkmodeBtn.innerText = 'Light Mode';
    } else {
      darkmodeBtn.innerText = 'Dark Mode';
    }

  });


  
});


/* ==========================================================================
   구 선택 드롭다운 생성
   ========================================================================== */

function initGuDropdown5x5() {
  const guListWrapper = document.getElementById("gu-list");
  const selectedGu = document.getElementById("selected-gu");

  if (!guListWrapper || !selectedGu) return;
  if (guListWrapper.dataset.initialized === "true") return;

  seoulGus.forEach((gu) => {
    const col = document.createElement("div");
    col.className = "col";
    col.innerHTML = `
      <button type="button" class="dropdown-item text-center rounded-2" onclick="selectGu('${gu}')">
        ${gu}
      </button>
    `;
    guListWrapper.appendChild(col);
  });

  guListWrapper.dataset.initialized = "true";

  document.querySelectorAll("#gu-list .dropdown-item").forEach((item) => {
    item.classList.toggle("active", item.innerText.trim() === selectedGu.innerText.trim());
  });
}


/* ==========================================================================
   데이터 계산
   ========================================================================== */

function getFilteredChartData() {
  const selectedGu = document.getElementById("selected-gu");

  if (!selectedGu) return [];

  const currentGu = selectedGu.innerText.trim();
  const seed = currentGu.charCodeAt(0) + (currentGu.charCodeAt(1) || 0);

  const checkedStatuses = Array.from(document.querySelectorAll(".status-checkbox:checked")).map((cb) => cb.value);

  const mockBase = {
    "재직 중": 520,
    "아르바이트/프리랜서": 410,
    "취업 준비 중": 290,
    "대학(원)생": 460,
    "무직": 140
  };

  const result = [];

  checkedStatuses.forEach((status, index) => {
    let dynamicValue = mockBase[status] + (seed % (index + 4)) * 25;

    if (currentGu === "전체") {
      dynamicValue *= 4;
    }

    result.push({
      label: status,
      value: dynamicValue,
      color: chartColors[status]
    });
  });

  return result;
}


/* ==========================================================================
   필터 선택 함수
   ========================================================================== */

function selectGu(guName) {
  const selectedGu = document.getElementById("selected-gu");

  if (!selectedGu) return;

  selectedGu.innerText = guName;

  document.querySelectorAll("#gu-list .dropdown-item").forEach((item) => {
    item.classList.toggle("active", item.innerText.trim() === guName);
  });

  refreshDataView();
}

function selectPeriod(period) {
  const selectedPeriod = document.getElementById("selected-period");

  if (!selectedPeriod) return;

  selectedPeriod.innerText = period;

  document.querySelectorAll("#chart .dropdown-menu button").forEach((item) => {
    if (item.getAttribute("onclick") && item.getAttribute("onclick").includes("Period")) {
      item.classList.toggle("active", item.innerText.trim() === period);
    }
  });

  refreshDataView();
}

function updateStatusFilter() {
  const checkedValues = Array.from(document.querySelectorAll(".status-checkbox:checked")).map((cb) => cb.value);
  const textTarget = document.getElementById("selected-status");

  if (!textTarget) return;

  if (checkedValues.length === 5) {
    textTarget.innerText = "전체";
  } else if (checkedValues.length === 0) {
    textTarget.innerText = "선택 없음";
  } else {
    textTarget.innerText = checkedValues.length === 1
      ? checkedValues[0]
      : `${checkedValues[0]} 외 ${checkedValues.length - 1}`;
  }

  refreshDataView();
}


/* ==========================================================================
   화면 데이터 갱신
   ========================================================================== */

function refreshDataView() {
  currentChartData = getFilteredChartData();

  renderDonutChartWithAnimation(currentChartData);
  prepareCounters();

  if (metricRowInView) {
    playCounterAnimation();
  }
}

function prepareCounters() {
  const selectedGu = document.getElementById("selected-gu");

  if (!selectedGu) return;

  const currentGu = selectedGu.innerText.trim();

  document.querySelectorAll(".counter").forEach((counter) => {
    const baseTarget = parseInt(counter.getAttribute("data-target"), 10);
    const suffix = counter.getAttribute("data-suffix") || "";

    let modifier = currentGu.charCodeAt(0) * 3;

    if (currentGu === "전체") {
      modifier *= 3;
    }

    const newTarget = Math.max(180, (baseTarget % 900) + modifier);

    counter.dataset.currentTarget = newTarget;
    counter.dataset.currentSuffix = suffix;

    if (!metricRowInView) {
      counter.textContent = `1${suffix}`;
    }
  });
}


/* ==========================================================================
   차트 스크롤 재실행
   ========================================================================== */

function initChartScrollReplay() {
  const chartSection = document.getElementById("chart");

  if (!chartSection) return;

  if ("IntersectionObserver" in window) {
    const chartObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!chartSectionInView) {
            chartSectionInView = true;
            replayChartAnimation();
          }
        } else {
          chartSectionInView = false;
        }
      });
    }, {
      threshold: 0.25
    });

    chartObserver.observe(chartSection);
  } else {
    replayChartAnimation();
  }
}

function replayChartAnimation() {
  currentChartData = getFilteredChartData();
  renderDonutChartWithAnimation(currentChartData);
}


/* ==========================================================================
   도넛 차트 애니메이션
   ========================================================================== */

function renderDonutChartWithAnimation(data) {
  const segmentContainer = document.getElementById("donut-segments");
  const labelContainer = document.getElementById("chart-labels");

  if (!segmentContainer || !labelContainer) return;

  if (chartAnimationFrameId) {
    cancelAnimationFrame(chartAnimationFrameId);
    chartAnimationFrameId = null;
  }

  segmentContainer.innerHTML = "";
  labelContainer.innerHTML = "";

  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) return;

  const radius = 130;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  const elementsToAnimate = [];

  data.forEach((item) => {
    const percent = item.value / total;

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

    circle.setAttribute("class", "donut-segment");
    circle.setAttribute("cx", "250");
    circle.setAttribute("cy", "250");
    circle.setAttribute("r", String(radius));
    circle.setAttribute("stroke", item.color);

    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = String(circumference);

    segmentContainer.appendChild(circle);

    const midPercent = accumulatedPercent + percent / 2;
    const angle = midPercent * 2 * Math.PI - Math.PI / 2;

    const labelRadius = 195;
    const posX = 250 + labelRadius * Math.cos(angle);
    const posY = 250 + labelRadius * Math.sin(angle);

    const labelDiv = document.createElement("div");

    labelDiv.setAttribute(
      "class",
      "position-absolute chart-label-item d-inline-flex align-items-center gap-1 text-nowrap"
    );

    labelDiv.style.left = `${(posX / 500) * 100}%`;
    labelDiv.style.top = `${(posY / 500) * 100}%`;
    labelDiv.style.setProperty("--segment-color", item.color);

    labelDiv.innerHTML = `
      <span class="chart-label-name d-inline-block text-nowrap">${item.label}</span>
      <span class="chart-label-num d-inline-flex align-items-center justify-content-center rounded-pill px-2 py-1 text-nowrap">${item.value}명</span>
    `;

    labelContainer.appendChild(labelDiv);

    elementsToAnimate.push({
      element: circle,
      label: labelDiv,
      percent: percent,
      finalShift: -circumference * accumulatedPercent
    });

    accumulatedPercent += percent;
  });

  let startTimestamp = null;
  const duration = 900;

  function step(timestamp) {
    if (!startTimestamp) startTimestamp = timestamp;

    const elapsed = timestamp - startTimestamp;
    const progress = Math.min(elapsed / duration, 1);
    const ease = progress * (2 - progress);

    elementsToAnimate.forEach((obj) => {
      const currentLength = circumference * obj.percent * ease;
      obj.element.style.strokeDasharray = `${currentLength} ${circumference}`;
      obj.element.style.strokeDashoffset = String(obj.finalShift);
    });

    if (progress < 1) {
      chartAnimationFrameId = requestAnimationFrame(step);
    } else {
      elementsToAnimate.forEach((obj) => {
        obj.label.classList.add("show");
      });

      chartAnimationFrameId = null;
    }
  }

  chartAnimationFrameId = requestAnimationFrame(step);
}


/* ==========================================================================
   숫자 카운터 스크롤 재실행
   ========================================================================== */

function initCounterAnimation() {
  const metricRow = document.querySelector(".metric-row");

  if (!metricRow) return;

  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!metricRowInView) {
            metricRowInView = true;
            playCounterAnimation();
          }
        } else {
          metricRowInView = false;
        }
      });
    }, {
      threshold: 0.35
    });

    counterObserver.observe(metricRow);
  } else {
    metricRowInView = true;
    playCounterAnimation();
  }
}

function playCounterAnimation() {
  document.querySelectorAll(".counter").forEach((counter) => {
    const target = parseInt(counter.dataset.currentTarget || counter.getAttribute("data-target"), 10);
    const suffix = counter.dataset.currentSuffix || counter.getAttribute("data-suffix") || "";

    animateSingleCounter(counter, target, suffix);
  });
}


/* ==========================================================================
   숫자만 드르륵 굴러가는 효과
   ========================================================================== */

function animateSingleCounter(element, target, suffix) {
  if (!element || Number.isNaN(target)) return;

  const formattedNumber = target.toLocaleString();
  const numberParts = formattedNumber.split("");
  const duration = 900;

  element.innerHTML = "";

  element.classList.add(
    "d-inline-flex",
    "align-items-center",
    "justify-content-center",
    "counter-roll"
  );

  numberParts.forEach((char, index) => {
    if (char === ",") {
      const comma = document.createElement("span");

      comma.className = "counter-comma d-inline-flex align-items-center justify-content-center";
      comma.textContent = ",";
      comma.style.width = "0.3em";
      comma.style.height = "1em";
      comma.style.lineHeight = "1";

      element.appendChild(comma);
      return;
    }

    const digitWrap = document.createElement("span");

    digitWrap.className = "counter-digit-wrap d-inline-block overflow-hidden";
    digitWrap.style.width = "0.62em";
    digitWrap.style.height = "1em";
    digitWrap.style.overflow = "hidden";
    digitWrap.style.display = "inline-block";
    digitWrap.style.lineHeight = "1";
    digitWrap.style.verticalAlign = "middle";

    const digitStrip = document.createElement("span");

    digitStrip.className = "counter-digit-strip d-flex flex-column";
    digitStrip.style.display = "flex";
    digitStrip.style.flexDirection = "column";
    digitStrip.style.transform = "translate3d(0, 0, 0)";
    digitStrip.style.willChange = "transform";

    for (let i = 0; i <= 9; i++) {
      const digit = document.createElement("span");

      digit.className = "counter-digit d-flex align-items-center justify-content-center";
      digit.textContent = i;
      digit.style.height = "1em";
      digit.style.minHeight = "1em";
      digit.style.lineHeight = "1";

      digitStrip.appendChild(digit);
    }

    digitWrap.appendChild(digitStrip);
    element.appendChild(digitWrap);

    const targetDigit = parseInt(char, 10);
    const delay = index * 70;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        digitStrip.style.transition = `transform ${duration}ms cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}ms`;
        digitStrip.style.transform = `translate3d(0, -${targetDigit}em, 0)`;
      });
    });
  });

  if (suffix) {
    const suffixSpan = document.createElement("span");

    suffixSpan.className = "counter-suffix d-inline-flex align-items-center";
    suffixSpan.textContent = suffix;
    suffixSpan.style.marginLeft = "0.08em";
    suffixSpan.style.lineHeight = "1";

    element.appendChild(suffixSpan);
  }
}


/* ==========================================================================
   Quick Menu Smooth Scroll
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {

  const items = document.querySelectorAll("#quick .quick-item[data-target], #quick .btn-top[data-target], #quick .mobile-quick-item[data-target]");

  /* ==========================================================================
     모바일 퀵메뉴 토글
  ========================================================================== */

  const quickToggle = document.getElementById("mobileQuickToggle");
  const quickMenu = document.getElementById("mobileQuickMenu");

  if (quickToggle && quickMenu) {

    quickToggle.addEventListener("click", function () {
      quickMenu.classList.toggle("active");
    });

  }

  /* ==========================================================================
     스무스 스크롤
  ========================================================================== */

  // ⚡ 속도감 있는 스르륵 애니메이션 함수
  function smoothScrollTo(targetPosition, duration) {

    const startPosition = window.scrollY || document.documentElement.scrollTop;
    const distance = targetPosition - startPosition;

    let startTime = null;

    function animation(currentTime) {

      if (startTime === null) startTime = currentTime;

      const timeElapsed = currentTime - startTime;

      // cubic easing
      const run = easeInOutCubic(
        timeElapsed,
        startPosition,
        distance,
        duration
      );

      window.scrollTo(0, run);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }

    }

    // 부드러운 가속도
    function easeInOutCubic(t, b, c, d) {

      t /= d / 2;

      if (t < 1) {
        return c / 2 * t * t * t + b;
      }

      t -= 2;

      return c / 2 * (t * t * t + 2) + b;

    }

    requestAnimationFrame(animation);

  }

  /* ==========================================================================
     퀵메뉴 클릭 이동
  ========================================================================== */

  items.forEach(function (item) {

    item.addEventListener("click", function () {

      const targetId = this.getAttribute("data-target");

      /* 맨 위 */
      if (targetId === "top") {

        smoothScrollTo(0, 300);

      } else {

        const targetSection = document.querySelector(targetId);

        if (targetSection) {

          const header =
            document.querySelector("header") ||
            document.querySelector(".navbar");

          const headerHeight = header ? header.offsetHeight : 0;

          const targetTop =
            targetSection.getBoundingClientRect().top + window.scrollY;

          const windowHeight = window.innerHeight;

          const sectionHeight = targetSection.offsetHeight;

          // 화면 중앙 정렬
          const finalScrollPosition =
            targetTop -
            headerHeight -
            ((windowHeight - headerHeight - sectionHeight) / 2);

          smoothScrollTo(finalScrollPosition, 300);

        }

      }

      /* 모바일 메뉴 자동 닫기 */
      if (quickMenu && quickMenu.classList.contains("active")) {
        quickMenu.classList.remove("active");
      }

    });

  });

});