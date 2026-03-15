import Lobby from "../../model/obj/lobby/index.js";
import Option from "../../model/obj/option/index.js";
import Shop from "../../model/obj/shop/main/index.js";
import CharShop from "../../model/obj/shop/char_shop/index.js";
import ItemShop from "../../model/obj/shop/item_shop/index.js";
import Auction from "../../model/obj/shop/auction/index.js";
import SelectChar from "../../model/obj/game/select_char/index.js";
import SelectStage from "../../model/obj/game/select_stage/index.js";
import GamePage from "../../model/obj/game/game/index.js";
import GameMenu from "../../model/obj/game/game_menu/index.js";
import SelectPosition from "../../model/obj/game/select_position/index.js";

class Route {
  main;
  constructor(main) {
    this.main = main;
  }
  init() {

  }

  set_page_state(inData) {
    let opt_obj = {
      state: "lobby",
      is_render: true,
      ...inData
    };
    let this_obj = this;
    let main = this.main;
    let state = opt_obj.state;
    let load_page_obj = this_obj.load_page(opt_obj);
    if (load_page_obj) {
      main.model.data.page_state = opt_obj.state;
      main.model.data.page_obj = load_page_obj;
      main.model.data.html.canvas.style.cursor = "default";
      main.model.data.page_obj.init();
    }

    if (opt_obj.is_render) {
      main.view.render();
    }
  }

  load_page(inData) {
    let opt_obj = {
      state: "lobby",
      ...inData
    };
    let this_obj = this;
    let main = this.main;
    let state = opt_obj.state;

    let load_page_obj = null;
    switch (state) {
      case "lobby":
        load_page_obj = new Lobby(main);
        break;
      case "option":
        load_page_obj = new Option(main);
        break;
      case "shop":
        load_page_obj = new Shop(main);
        break;
      case "char_shop":
        load_page_obj = new CharShop(main);
        break;
      case "item_shop":
        load_page_obj = new ItemShop(main);
        break;
      case "auction":
        load_page_obj = new Auction(main);
        break;
      case "select_char":
        load_page_obj = new SelectChar(main);
        break;
      case "select_stage":
        load_page_obj = new SelectStage(main);
        break;
      case "game":
        load_page_obj = new GamePage(main);
        break;
      case "game_menu":
        load_page_obj = new GameMenu(main);
        break;
      case "select_position":
        load_page_obj = new SelectPosition(main);
        break;

    }
    return load_page_obj;
  }
}
export default Route;