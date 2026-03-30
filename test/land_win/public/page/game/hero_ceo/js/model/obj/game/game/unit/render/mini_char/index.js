class RenderMiniChar {
  main;
  constructor(main) {
    this.main = main;
  }
  init() {
    let this_obj = this;
    let main = this.main;
  }
  render_char(inData) {
    let this_obj = this;
    let main = this.main;
    let opt_obj={
      unit:null,
      ...inData
    };
    let ctx = main.model.data.html.ctx;
    let unit=opt_obj.unit;
    if(unit){}else{return false;}
    let game = main.model.data.page_obj;
    //mini_char
    let char_list = main.model.data.object.common.char.data.char_list;
    let sprite_data = char_list.sprite_data.mini_char;
    let img = main.model.data.res.img.mini_char;
    if(!img || !img.complete) return;

    let sp = unit.sprite_part_json || {};
    let parts = {
      face:      sprite_data.face[sp.face || 0],
      head:      sprite_data.head[sp.head || 0],
      side_hair: sprite_data.side_hair[sp.side_hair || 0],
      chest:     sprite_data.chest[sp.chest || 0],
      arm_l:     sprite_data.arm_l[sp.arm_l || 0],
      arm_r:     sprite_data.arm_r[sp.arm_r || 0],
      leg_l:     sprite_data.leg_l[sp.leg_l || 0],
      leg_r:     sprite_data.leg_r[sp.leg_r || 0],
    };

    // 전체 높이 기준 scale (raw 기준 약 123px)
    let scale = unit.h / 120;
    // 유닛 하단 중앙을 기준점으로
    let ax = unit.x + unit.w / 2;
    let ay = unit.y + unit.h;

    let tick = unit._anim_tick || 0;
    let state = unit.state;

    ctx.save();
    ctx.translate(ax, ay);
    if(unit._face_right){ ctx.scale(-1, 1); }

    // cx_raw, cy_bot_raw: 기준점(하단 중앙)으로부터의 raw 오프셋
    function dp(d, cx_raw, cy_bot_raw) {
      let dw = d.w * scale;
      let dh = d.h * scale;
      ctx.drawImage(img, d.x, d.y, d.w, d.h,
        cx_raw * scale - dw / 2,
        -cy_bot_raw * scale - dh,
        dw, dh);
    }

    // 어깨(팔 꼭대기)를 pivot으로 회전 후 아래로 그리기
    // len_scale: 팔 길이 배율 (1=기본, 1.3=30% 길어짐)
    function dp_rot(d, shoulder_cx_raw, shoulder_cy_raw, angle_rad, len_scale = 1) {
      let dw = d.w * scale;
      let dh = d.h * scale * len_scale;
      ctx.save();
      ctx.translate(shoulder_cx_raw * scale, -shoulder_cy_raw * scale);
      ctx.rotate(angle_rad);
      ctx.drawImage(img, d.x, d.y, d.w, d.h, -dw / 2, 0, dw, dh);
      ctx.restore();
    }

    // arm 어깨 y = cy_bot_raw + d.h (바닥~팔꼭대기)
    let arm_shoulder_cy = 35 + parts.arm_l.h;

    if (state === "move") {
      // 걷기: 다리 교대로 올라감, 팔 반대로 흔들림
      let walk = Math.sin(tick * 0.25);
      dp(parts.leg_l,  -10 + walk * 2, 10 + walk * 5);
      dp(parts.leg_r,   10 - walk * 2, 10 - walk * 5);
      dp_rot(parts.arm_l, -25, arm_shoulder_cy,  walk * 0.1);
      dp(parts.chest, 0, 30);
      dp_rot(parts.arm_r,  30, arm_shoulder_cy, -walk * 0.1);
    } else if (state === "attack") {
      // atk: -1(위, 시작) ~ +1(중간, 끝)
      let atk = Math.sin(tick * 0.5);
      dp(parts.leg_l, -10, 10);
      dp(parts.leg_r,  10, 10);
      // 오른팔(보조): 왼팔과 같은 방향(바깥), 소폭 움직임
      let r_angle = 1.7 + atk * 0.15;
      dp_rot(parts.arm_r, 18, arm_shoulder_cy, r_angle);
      dp(parts.chest, 0, 30);
      // 왼팔(메인): 손끝이 바깥(왼쪽) 방향 유지, -π/2 중심으로 위↔아래 스윙
      // -π/2 ≈ -1.57 (수평 바깥) 기준 ± 진폭
      let l_angle = 1.57 + atk * 0.6;  // 0.97(손끝 아래쪽 바깥) ~ 2.17(손끝 위쪽 바깥)
      let l_len = 1 + Math.max(0, atk) * 0.15;
      dp_rot(parts.arm_l, -12, arm_shoulder_cy, l_angle, l_len);
    } else {
      // idle
      dp(parts.leg_l, -10, 10);
      dp(parts.leg_r,  10, 10);
      dp(parts.arm_l, -25, 35);
      dp(parts.chest, 0, 30);
      dp(parts.arm_r,  30, 35);
    }

    // 머리 파트는 상태 무관하게 항상 위에 그리기
    dp(parts.face,      0, 80);
    dp(parts.head,      0, 80);
    dp(parts.side_hair, 20, 52);

    ctx.restore();
  }
}
export default RenderMiniChar;