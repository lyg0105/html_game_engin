class DrawMain{
  main = null;
  constructor(main) {
    this.main = main;
    this.init();
  }
  init() {
    this.main.data.canvas = document.getElementById('game_canvas');
    this.main.data.ctx = this.main.data.canvas.getContext('2d');
    
    // Set canvas dimensions
    let win_width = window.innerWidth-8;
    let win_height = window.innerHeight-8;
    this.main.data.canvas.width = win_width;
    this.main.data.canvas.height = win_height;
    this.main.data.canvas.style.width = `${win_width}px`;
    this.main.data.canvas.style.height = `${win_height}px`;
    this.main.data.canvas.style.border="1px solid #f00";
    this.main.data.canvas.style.margin="0 auto";

    // Load unit sprites
    this.loadUnitSprites();
  }
  loadUnitSprites() {
    const unit_sprites = this.main.data.unit_sprites;
    this.main.data.unit_sprite_images = {};

    for (let type in unit_sprites) {
      let path= unit_sprites[type];
      const img = new Image();
      img.src = path;
      img.onload = () => {
        this.main.data.unit_sprite_images[type] = img;
        console.log(`Loaded sprite for ${type}`);
      };
      img.onerror = () => {
        console.error(`Failed to load sprite for ${type} from ${path}`);
      };
    }
  }
  draw(){
    this.draw_background();
    this.main.unit.draw_unit();
  }
  draw_background() {
    this.main.map.draw();
  }
}
export default DrawMain;