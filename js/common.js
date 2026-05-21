document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('#hd');

    // 스크롤 시 실행할 함수
    const handleScroll = () => {
        if (window.scrollY > 10) {
            // 휠을 내렸을 때: 투명 제거, 흰색 배경 및 그림자 추가
            header.classList.add('bg-white', 'shadow-sm');
            header.classList.remove('bg-transparent'); // 만약 초기 클래스에 투명이 있다면 제거
        } else {
            // 맨 위로 올라왔을 때: 흰색 배경 제거, 투명 추가
            header.classList.remove('bg-white', 'shadow-sm');
            // 필요 시 초기 투명 클래스 추가 (예: 헤더가 원래 투명해야 한다면)
            // header.classList.add('bg-transparent'); 
        }
    };

    // 페이지 로드 시점에도 스크롤 위치 확인 (새로고침 대응)
    handleScroll();

    // 스크롤 이벤트 리스너 등록
    window.addEventListener('scroll', handleScroll);
});


// !!!!!!!!!!현실섹션 함수!!!!!!!!!!!!!

const seoulGus = ["강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"];

const chartColors = {
    "재직 중": "#cbdffd",
    "아르바이트/프리랜서": "#fecdf4",
    "취업 준비 중": "#ffeeb3",
    "대학(원)생": "#e3ccfe",
    "무직": "#c1ecc7"
};

document.addEventListener("DOMContentLoaded", () => {
    initGuDropdown5x5();
    refreshDataView();
    initCounterAnimation();
});

function initGuDropdown5x5() {
    const guListWrapper = document.getElementById("gu-list");
    seoulGus.forEach(gu => {
        const col = document.createElement("div");
        col.className = "col";
        col.innerHTML = `<button type="button" class="dropdown-item text-center rounded-2" onclick="selectGu('${gu}')">${gu}</button>`;
        guListWrapper.appendChild(col);
    });
}

function getFilteredChartData() {
    const currentGu = document.getElementById("selected-gu").innerText;
    let seed = currentGu.charCodeAt(0) + (currentGu.charCodeAt(1) || 0);
    
    const checkedStatuses = Array.from(document.querySelectorAll(".status-checkbox:checked")).map(cb => cb.value);
    const mockBase = { "재직 중": 520, "아르바이트/프리랜서": 410, "취업 준비 중": 290, "대학(원)생": 460, "무직": 140 };
    
    const result = [];
    checkedStatuses.forEach((status, index) => {
        let dynamicValue = mockBase[status] + (seed % (index + 4)) * 25;
        if (currentGu === "전체") dynamicValue *= 4;
        
        result.push({
            label: status,
            value: dynamicValue,
            color: chartColors[status]
        });
    });
    return result;
}

function selectGu(guName) {
    document.getElementById("selected-gu").innerText = guName;
    document.querySelectorAll("#gu-list .dropdown-item").forEach(item => {
        item.classList.toggle("active", item.innerText === guName);
    });
    refreshDataView();
}

function selectPeriod(period) {
    document.getElementById("selected-period").innerText = period;
    document.querySelectorAll("#chart .dropdown-menu button").forEach(item => {
        if(item.getAttribute('onclick') && item.getAttribute('onclick').includes('Period')) {
            item.classList.toggle("active", item.innerText === period);
        }
    });
    refreshDataView();
}

function updateStatusFilter() {
    const checkedValues = Array.from(document.querySelectorAll(".status-checkbox:checked")).map(cb => cb.value);
    const textTarget = document.getElementById("selected-status");
    
    if (checkedValues.length === 5) { textTarget.innerText = "전체"; } 
    else if (checkedValues.length === 0) { textTarget.innerText = "선택 없음"; } 
    else { textTarget.innerText = checkedValues.length === 1 ? checkedValues[0] : `${checkedValues[0]} 외 ${checkedValues.length - 1}`; }
    
    refreshDataView();
}

function refreshDataView() {
    const currentGu = document.getElementById("selected-gu").innerText;
    const freshData = getFilteredChartData();
    
    renderDonutChartWithAnimation(freshData);
    
    document.querySelectorAll(".counter").forEach(counter => {
        const baseTarget = parseInt(counter.getAttribute("data-target"));
        let modifier = currentGu.charCodeAt(0) * 3;
        if(currentGu === "전체") modifier *= 3;
        
        const newTarget = Math.max(180, (baseTarget % 900) + modifier);
        counter.innerText = "1";
        animateSingleCounter(counter, newTarget, counter.getAttribute("data-suffix"));
    });
}

// 💡 [실시간 글자 위치 매칭 드로잉 함수]
function renderDonutChartWithAnimation(data) {
    const segmentContainer = document.getElementById("donut-segments");
    const labelContainer = document.getElementById("chart-labels");
    segmentContainer.innerHTML = "";
    labelContainer.innerHTML = "";
    
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if(total === 0) return;
    
    const radius = 130; 
    const circumference = 2 * Math.PI * radius;
    let accumulatedPercent = 0;
    
    const elementsToAnimate = [];

    data.forEach(item => {
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
        
        // 💡 [동적 각도 계산 기법] 각 도넛 조각의 시작점과 끝점 사이 '정중앙 각도'를 구합니다.
        const midPercent = accumulatedPercent + (percent / 2);
        const angle = (midPercent * 2 * Math.PI) - (Math.PI / 2); // 12시 시작점 보정(-Math.PI/2)
        
        // 💡 [그래프와 확실히 떨어뜨리기] 반지름이 130이고 고리 두께가 100(안팎으로 50씩)이므로, 
        // 중심에서 195px만큼 밀어내면 도넛 바깥선에서 정확히 기분 좋게 붕 뜹니다.
        const labelRadius = 195; 
        const posX = 250 + labelRadius * Math.cos(angle);
        const posY = 250 + labelRadius * Math.sin(angle);
        
        const labelDiv = document.createElement("div");
        labelDiv.setAttribute("class", "position-absolute chart-label-item");
        labelDiv.style.left = `${(posX / 500) * 100}%`;
        labelDiv.style.top = `${(posY / 500) * 100}%`;
        labelDiv.style.setProperty('--segment-color', item.color);
        labelDiv.innerHTML = `${item.label}<span class="chart-label-num">${item.value}명</span>`;
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

        elementsToAnimate.forEach(obj => {
            const currentLength = circumference * obj.percent * ease;
            obj.element.style.strokeDasharray = `${currentLength} ${circumference}`;
            obj.element.style.strokeDashoffset = String(obj.finalShift);
        });

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            elementsToAnimate.forEach(obj => obj.label.classList.add("show"));
        }
    }
    requestAnimationFrame(step);
}

function initCounterAnimation() {
    document.querySelectorAll(".counter").forEach(counter => {
        const target = parseInt(counter.getAttribute("data-target"));
        const suffix = counter.getAttribute("data-suffix");
        animateSingleCounter(counter, target, suffix);
    });
}

function animateSingleCounter(element, target, suffix) {
    let start = 1;
    const duration = 800; 
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsedTime = currentTime - startTime;
        if (elapsedTime >= duration) {
            element.innerText = target.toLocaleString() + suffix;
        } else {
            const progress = elapsedTime / duration;
            const easeOutProgress = progress * (2 - progress);
            const currentNumber = Math.floor(easeOutProgress * (target - start) + start);
            element.innerText = currentNumber.toLocaleString() + suffix;
            requestAnimationFrame(updateNumber);
        }
    }
    requestAnimationFrame(updateNumber);
}