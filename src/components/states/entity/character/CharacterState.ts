import { UpperBodySprites } from "components/entities/character/UpperBody";
import { LowerBodySprites } from "components/entities/character/LowerBody";
import State from "lib/State";
import Character from "components/entities/character/Character";

export default abstract class CharacterState extends State {
  character: Character;
  
  constructor(character: Character) {
    super();
    this.character = character;
  }

  abstract getUpperBodySprites(refresh: boolean): UpperBodySprites;
  abstract getLowerBodySprites(refresh: boolean): LowerBodySprites;
}