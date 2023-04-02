import Character from "./Character";
import Sprite from "lib/Sprite"
import Animation from "lib/Animation";

/**
 * Represents the character's lower body.
 */
export class LowerBody {

  sprites?: LowerBodySprites;
  animation?: Animation;

  /**
   * Initializes a lower body of the character.
   * 
   * @param {LowerBodySprites} sprites 
   * @param {Animation} animation 
   */
  constructor(
    sprites?: LowerBodySprites,
    animation?: Animation
  ) {
    this.sprites = sprites;
    this.animation = animation;
  }

  /**
   * Sets sprites for lower body.
   * 
   * @param {LowerBodySprites} sprites lower body's sprites.
   */
  setSprites(sprites: LowerBodySprites) {
      this.sprites = sprites;
  }

  /**
   * Sets animation for lower body.
   * 
   * @param {Animation} animation 
   */
  setAnimation(animation: Animation) {
      this.animation = animation;
  }

  getAnimation() {
      return this.animation;
  }


  update(dt) {
      this.animation?.update(dt);
  }

  /**
   * 
   * @param {number} x x position in the canvas.
   * @param {number} y y position in the canvas.
   */
  render(x: number, y: number, width = Character.RENDER_WIDTH, height = Character.RENDER_HEIGHT) {
      if (!this.animation) {
          this.sprites?.outlineSprites[0].render(x, y, width, height);
          this.sprites?.clothesSprites[0].render(x, y, width, height);
          this.sprites?.skinSprites[0].render(x, y, width, height);
          this.sprites?.shoesSprites[0].render(x, y, width, height);
      }
      else {
          this.sprites?.outlineSprites[this.animation.getCurrentFrame()].render(x, y, width, height);
          this.sprites?.clothesSprites[this.animation.getCurrentFrame()].render(x, y, width, height);
          this.sprites?.skinSprites[this.animation.getCurrentFrame()].render(x, y, width, height);
          this.sprites?.shoesSprites[this.animation.getCurrentFrame()].render(x, y, width, height);
      }
  }
}

export interface LowerBodySpritesProps {
  outlineSprites: Sprite[];
  clothesSprites: Sprite[];
  skinSprites: Sprite[];
  shoesSprites: Sprite[];
}

/**
 * Represents the sprites of the character's lower body.
 */
export class LowerBodySprites {
  outlineSprites: Sprite[];
  clothesSprites: Sprite[];
  skinSprites: Sprite[];
  shoesSprites: Sprite[];

  /**
   * Initializes a sprite holder for the character's lower body.
   */
  constructor(props: LowerBodySpritesProps) {
    const {
      outlineSprites,
      clothesSprites,
      skinSprites,
      shoesSprites,
    } = props;

    this.outlineSprites = outlineSprites;
    this.clothesSprites = clothesSprites;
    this.skinSprites = skinSprites;
    this.shoesSprites = shoesSprites;
  }
}