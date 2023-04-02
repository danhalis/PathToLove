import Character from "./Character";
import Sprite from "lib/Sprite"
import Animation from "lib/Animation";

/**
 * Represents the character's upper body.
 */
export class UpperBody {

  sprites?: UpperBodySprites;
  animation?: Animation;

  /**
   * Initializes an upper body of the character.
   * 
   * @param {UpperBody.UpperBodySprites} sprites upper body's sprites.
   * @param {Animation} animation upper body's animation.
   */
  constructor(
    sprites?: UpperBodySprites,
    animation?: Animation
  ) {
    this.sprites = sprites;
    this.animation = animation;
  }

  /**
   * Sets sprites for upper body.
   * 
   * @param {UpperBodySprites} sprites upper body's sprites.
   */
  setSprites(sprites: UpperBodySprites) {
    this.sprites = sprites;
  }

  /**
   * Sets animation for upper body.
   * 
   * @param {Animation} animation upper body's animation.
   */
  setAnimation(animation: Animation) {
    this.animation = animation;
  }

  getAnimation() {
      return this.animation;
  }

  update(dt: number) {
      this.animation?.update(dt);
  }

  /**
   * 
   * @param {number} x x position in the canvas.
   * @param {number} y y position in the canvas.
   * @param {number} width width of the character.
   * @param {number} height height of the character.
   */
  render(x: number, y: number, width: number = Character.RENDER_WIDTH, height: number = Character.RENDER_HEIGHT) {
      if (!this.animation) {
          this.sprites?.outlineSprites[0].render(x, y, width, height);
          this.sprites?.hairSprites[0].render(x, y, width, height);
          this.sprites?.skinSprites[0].render(x, y, width, height);
          this.sprites?.clothesSprites[0].render(x, y, width, height);
      }
      else {
          this.sprites?.outlineSprites[this.animation.getCurrentFrame()].render(x, y, width, height);
          this.sprites?.hairSprites[this.animation.getCurrentFrame()].render(x, y, width, height);
          this.sprites?.skinSprites[this.animation.getCurrentFrame()].render(x, y, width, height);
          this.sprites?.clothesSprites[this.animation.getCurrentFrame()].render(x, y, width, height);
      }
  }
}

export interface UpperBodySpritesProps {
  outlineSprites: Sprite[];
  hairSprites: Sprite[];
  skinSprites: Sprite[];
  clothesSprites: Sprite[];
}

/**
* Represents the sprites of the character's upper body.
*/
export class UpperBodySprites {
  outlineSprites: Sprite[];
  hairSprites: Sprite[];
  skinSprites: Sprite[];
  clothesSprites: Sprite[];

  /**
    * Initializes a sprite holder for the character's upper body.
    */
  constructor(
    props: UpperBodySpritesProps
  ) {
    const {
      outlineSprites,
      hairSprites,
      skinSprites,
      clothesSprites,
    } = props;

    this.outlineSprites = outlineSprites;
    this.hairSprites = hairSprites;
    this.skinSprites = skinSprites;
    this.clothesSprites = clothesSprites;
  }
}