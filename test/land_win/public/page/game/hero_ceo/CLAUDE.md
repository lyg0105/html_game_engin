# hero_ceo 게임 프로젝트

## 개요
HTML Canvas 기반 자동전투 RPG 시뮬레이터. ES6 import/export 모듈 사용. MVC 패턴.

## 기술 스택
- 순수 JS (no framework), HTML Canvas 2D, ES6 modules
- 게임 루프: `setInterval` 50ms (20 FPS)
- 설정 저장: LocalStorage

---

## 디렉토리 구조

```
hero_ceo/
├── index.html
├── js/
│   ├── init.js              # 진입점 - new Main() 생성
│   ├── main.js              # Main 클래스 - MVC 코디네이터
│   ├── view/index.js        # View - 캔버스 생성/배경/렌더링
│   ├── model/
│   │   ├── index.js         # Model - 전역 데이터 (canvas, page_obj, game_data, game_option)
│   │   ├── util/index.js    # Util - 유틸리티 함수
│   │   ├── res/index.js     # Resource - 이미지 리소스 관리
│   │   ├── sound/index.js   # Sound - 사운드 재생
│   │   └── obj/
│   │       ├── index.js     # Obj - 공통 객체 초기화
│   │       ├── common/
│   │       │   ├── button/basic/index.js          # BasicButton
│   │       │   └── char/data/
│   │       │       ├── char_list/index.js          # CharListData (80명 캐릭터)
│   │       │       └── stage_list/index.js         # StageListData (5개 스테이지)
│   │       ├── lobby/
│   │       │   ├── index.js          # Lobby 페이지
│   │       │   ├── event/index.js    # ObjEvent
│   │       │   └── ui/index.js       # UIArea (버튼 5개)
│   │       ├── option/
│   │       │   ├── index.js          # Option 페이지
│   │       │   ├── event/index.js    # ObjEvent (슬라이더, 체크박스)
│   │       │   ├── ui/index.js       # UIArea
│   │       │   └── option_arr/index.js  # OptionArr
│   │       ├── shop/
│   │       │   ├── index.js          # Shop 페이지
│   │       │   ├── event/index.js    # ObjEvent
│   │       │   └── ui/index.js       # UIArea
│   │       └── game/
│   │           ├── select_char/
│   │           │   ├── index.js        # SelectChar 페이지
│   │           │   ├── event/index.js  # ObjEvent
│   │           │   ├── ui/index.js     # UIArea
│   │           │   └── char_list/index.js  # CharList (그리드)
│   │           ├── select_stage/
│   │           │   ├── index.js        # SelectStage 페이지
│   │           │   ├── event/index.js  # ObjEvent
│   │           │   ├── ui/index.js     # UIArea
│   │           │   └── stage_list/index.js  # StageListArea
│   │           └── game/
│   │               ├── index.js        # GamePage - 게임루프 관리
│   │               ├── event/index.js  # EventAera
│   │               ├── control/index.js # ControlArea - 타이머/승패
│   │               ├── ui/index.js     # UIArea
│   │               └── unit/index.js   # UnitControl - 유닛 이동/전투
│   └── control/
│       ├── index.js          # Control - 이벤트/라우팅 관리
│       ├── event/index.js    # Event - 전역 마우스/터치/키보드
│       └── route/index.js    # Route - 페이지 전환
```

---

## MVC 구조

| 레이어 | 파일 | 역할 |
|--------|------|------|
| **Model** | `model/index.js` | 전역 데이터 (canvas, ctx, page_obj, page_state, game_data, game_option) |
| **Model** | `model/obj/**/index.js` | 각 페이지 객체 (데이터 + render) |
| **View** | `view/index.js` | 배경 클리어 + `page_obj.render()` 호출 |
| **Controller** | `control/index.js` | Event + Route 관리 |
| **Controller** | `control/event/index.js` | 전역 입력 이벤트 수집 |
| **Controller** | `control/route/index.js` | 페이지 상태에 따라 페이지 인스턴스 생성 |

---

## 페이지 흐름

```
lobby → select_char → select_stage → game → select_stage
  ↓           ↓
 shop        lobby
  ↓
option → lobby
```

### 라우팅 방식
`Route.set_page_state({ state })` 호출 → `load_page()` → `switch(state)` → `new 페이지클래스(main)` → `page_obj.init()` → `view.render()`

### page_state 값
`"lobby"` | `"option"` | `"shop"` | `"select_char"` | `"select_stage"` | `"game"`

---

## 각 페이지 클래스 공통 패턴

```javascript
// 모든 페이지가 동일한 구조를 가짐
class SomePage {
  constructor(main) { this.main = main; this.data = {...}; }
  init()   { /* UIArea, ObjEvent 초기화, 이벤트 핸들러 등록 */ }
  render() { /* UIArea.render(), 특수 렌더링 */ }
}
```

- `ui_area` (UIArea): 버튼 배치 + 렌더링
- `obj_event` (ObjEvent): `main.control.event.on_mouseup_custom` 등에 핸들러 등록
- `data.buttons[]`: BasicButton 배열 - 마우스 충돌 검사용

---

## 게임 루프 (GamePage)

```
setInterval(50ms)
  → ControlArea.update()   // 타이머 증가, 승패 판정
  → UnitControl.update()   // 유닛 이동 및 전투
  → View.render()          // 전체 화면 다시 그리기
```

### 유닛 자동 전투 로직
1. 살아있는 유닛마다 가장 가까운 적 탐색
2. 거리 > 공격범위 → 적 방향으로 이동
3. 거리 <= 공격범위 → 매 프레임 데미지 적용 `dmg = (attack - defense) * 0.05`

### 게임 종료 조건
- 승리: 모든 몬스터 HP <= 0
- 패배: 모든 플레이어 HP <= 0
- 시간 종료: 남은 시간 <= 0

---

## 이벤트 처리 방식

```javascript
// Event 클래스에서 커스텀 훅 노출
main.control.event.on_mouseup_custom = function() { ... }
main.control.event.on_mousedown_custom = function() { ... }
main.control.event.on_mousemove_custom = function() { ... }
main.control.event.on_keydown_custom = function() { ... }
```

- 각 페이지의 `ObjEvent.init()`에서 이 훅에 함수 등록
- PC: mouse 이벤트 / 모바일: touch 이벤트 (자동 감지)

### 버튼 충돌 검사
```javascript
// 마우스 x,y가 버튼 영역 내에 있는지 AABB 검사
m_x >= b.data.x && m_x <= b.data.x + b.data.width &&
m_y >= b.data.y && m_y <= b.data.y + b.data.height
```

---

## 주요 데이터 구조

### model.data (전역)
```javascript
{
  html: { canvas, ctx },
  page_obj: 현재페이지인스턴스,
  page_state: "lobby",
  game_data: { selected_chars[], selected_stage, units[] },
  game_option: { is_sound, is_bgm, sound_volume, bgm_volume },
  object: { common: { button, char: { data: { char_list, stage_list } } } }
}
```

### 캐릭터 데이터
```javascript
{ id, name, w:30, h:50, hp:100, mp:100, attack:10, defense:5,
  attack_speed:1, move_speed:1, job:"전사", race:"인간" }
```

### 스테이지 데이터
```javascript
{ id, monster_level:1-5, monster_race_arr:[], monster_job_arr:[],
  monster_cnt:10, end_sec:60, has_king:false }
```

### 유닛 (게임 런타임)
```javascript
{ x, y, w, h, hp, max_hp, attack, defense, move_speed,
  name, job, race, is_player:true/false, color:"#4a90e2" }
```

---

## Canvas 렌더링

### 주요 배경색
- 로비/옵션/상점/선택 화면: `#16213e`, `#1a1a2e`
- 게임 화면: `#1a3a1a`
- 강조색: `#4a90d9` (파랑), `#e94560` (빨강)

### 유닛 렌더링
- 살아있음: `globalAlpha = 1.0`
- 죽음: `globalAlpha = 0.3` (반투명)
- HP바: HP 비율에 따라 파랑→주황→빨강

---

## LocalStorage 키
- `hero_ceo_is_game_sound` - 게임 사운드 On/Off
- `hero_ceo_is_background_sound` - 배경음악 On/Off
- `hero_ceo_sound_volume` - 게임음 볼륨 (0-1)
- `hero_ceo_bgm_volume` - 배경음 볼륨 (0-1)

---

## 자주 하는 작업 패턴

### 새 버튼 추가
`ui/index.js`의 UIArea에 `new BasicButton({ x, y, width, height, text, on_click })` 추가

### 새 페이지 추가
1. `model/obj/새페이지/index.js` - 페이지 클래스
2. `model/obj/새페이지/ui/index.js` - UIArea
3. `model/obj/새페이지/event/index.js` - ObjEvent
4. `control/route/index.js`의 `switch`에 케이스 추가

### 페이지 전환
```javascript
main.control.route.set_page_state({ state: "페이지명" });
```
