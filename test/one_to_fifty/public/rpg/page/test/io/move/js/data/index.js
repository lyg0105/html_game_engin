class GameData {
  static data = {
    socket: null,
    is_host:false,
    is_wait_response: false,
    host_check_time_out:null,
    canvas: null,
    ctx: null,
    loop_frame:1000 / 30,
    unit_json: {},
    select_unit_id: 0,
    unit_sprite_images: {},
    unit_types: ["player", "npc", "monster", "item", "environment", "ball"],
    unit_directions: ["up", "down", "left", "right"],
    unit_sprites: {
      player: "/rpg/img/forest/char/hero/hero_sprite.png",
      monster: "/rpg/img/forest/char/mole/mole-idle-front.png",
      gem: "/rpg/img/forest/char/gem/gem-1.png",
      map: "/rpg/img/back/jyr2.jpg",
    },
    unit_img_data:{
      player:{
        width: 32,
        height: 32,
        full_w:32*6,
        full_h:32*7,
        idle_back:[[0,0]],
        idle_front:[[1,0]],
        idle_side:[[2,0]],
        move_back:[
          [0,1],[1,1],[2,1],[3,1],[4,1],[5,1],
        ],
        move_front:[
          [0,2],[1,2],[2,2],[3,2],[4,2],[5,2],
        ],
        move_side:[
          [0,3],[1,3],[2,3],[3,3],[4,3],[5,3],
        ],
        attack_back:[
          [0,4],[1,4],[2,4]
        ],
        attack_front:[
          [0,5],[1,5],[2,5]
        ],
        attack_side:[
          [0,6],[1,6],[2,6]
        ],
      },
    },
  };
}
export default GameData;