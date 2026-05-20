# 청월 : 청년 월세 지원 서비스 Web UI/UX Design


## 프로젝트 소개
‘청월’은 서울시 청년의 주거비 부담 완화를 돕는 **청년 월세 지원 서비스**를 가정하여 기획한 웹 UI/UX 디자인 포트폴리오 프로젝트입니다.  
복잡하고 이해하기 어려운 공공 지원 서비스의 신청 절차를 사용자 친화적으로 개선하는 것을 목표로 디자인했습니다.



## 프로젝트 목표
- 공공 서비스에 적합한 **신뢰감 있는 UI 설계**
- 복잡한 지원 절차의 **단계별 흐름 단순화**
- 빠른 정보 이해를 위한 **정보 구조 개선**
- 신청 완료율 향상을 위한 **사용자 중심 UX 설계**



## 타겟 퍼소나
- 서울시에 거주하는 만 19~34세 청년
- 월세 거주 중인 사회초년생 및 대학생
- 공공 지원 서비스 이용 경험이 적은 사용자


## 디자인 포인트
- 명확한 정보 전달을 위한 **시각적 계층 구조**
- 안정감 있는 컬러 시스템과 가독성 높은 타이포그래피
- 신청 단계 중심의 사용자 흐름 설계
- 직관적인 CTA(Call-To-Action) 배치


## 사용 툴
- Figma
- Adobe Illustrator
- vscode




## Figma 링크


## 📌 Git Commit Prefix Guide

프로젝트 커밋 메시지 규칙입니다.

---

## ✨ Prefix Table

| Prefix | Description | Example |
|---|---|---|
| `feat` | 새로운 기능 추가 | feat: 로그인 페이지 UI 추가 |
| `fix` | 버그 수정 | fix: 모바일에서 버튼 클릭 오류 수정 |
| `design` | UI/스타일 변경 (CSS 등) | design: 히어로 섹션 애니메이션 추가 |
| `style` | 코드 포맷/정리 (기능 변화 없음) | style: 들여쓰기 및 세미콜론 정리 |
| `refactor` | 코드 리팩토링 (동작 동일) | refactor: 헤더 구조 개선 |
| `comment` | 주석 추가/수정 | comment: 함수 설명 주석 추가 |
| `docs` | 문서 수정 (README 등) | docs: 커밋 규칙 문서 추가 |
| `rename` | 파일/폴더 이름 변경 | rename: hero.css → main.css |
| `remove` | 파일 삭제 | remove: 사용하지 않는 이미지 삭제 |
| `test` | 테스트 코드 추가/수정 | test: 로그인 테스트 추가 |
| `chore` | 설정/패키지/빌드 작업 | chore: bootstrap 업데이트 |
| `init` | 초기 프로젝트 설정 | init: 프로젝트 초기 세팅 |
| `merge` | 공동 작업 병합 | merge: Gbranch -> main으로 병합 |

---

## 📝 Commit Message Format

```
<Prefix>: <작업 내용>
```

### ✔ Example

```
feat: 히어로 캐릭터 애니메이션 추가
fix: 헤더 배경 가려지는 문제 수정
design: 메인 버튼 스타일 변경
```

---

## 🔖 Versioning Rule (Semantic Versioning)

버전은 **MAJOR.MINOR.PATCH** 형식을 사용합니다.

| Version | 의미 | 언제 올리나요? | 예시 |
|---|---|---|---|
| **MAJOR** | 큰 변경 (호환 깨짐) | 기존 기능과 호환되지 않는 변경 | v2.0.0 |
| **MINOR** | 기능 추가 | 기존 기능 유지 + 새로운 기능 추가 | v1.3.0 |
| **PATCH** | 버그 수정 | 기능 변화 없이 오류 수정 | v1.3.1 |

### 📌 Version Example

| 상황 | 버전 변경 |
|---|---|
| 초기 배포 | v1.0.0 |
| 기능 추가 | v1.1.0 |
| UI 개선 | v1.2.0 |
| 버그 수정 | v1.2.1 |
| 대규모 리뉴얼 | v2.0.0 |

---

### 🚀 Summary

- 기능 추가 → **MINOR**
- 버그 수정 → **PATCH**
- 구조 변경/리뉴얼 → **MAJOR**
