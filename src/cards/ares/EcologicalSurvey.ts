import { CardName } from "../../CardName";
import { Game } from "../../Game";
import { Player } from "../../Player";
import { CardType } from "../CardType";
import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { TileType } from "../../TileType";

export class EcologicalSurvey implements IProjectCard {
  public cost: number = 9;
  public tags: Array<Tags> = [Tags.SCIENCE];
  public cardType: CardType = CardType.ACTIVE;
  public name: CardName = CardName.ECOLOGICAL_SURVEY;

  private countGreeneryTiles(game: Game): number {
    return game.board.spaces.filter(
            (space) => space.tile?.tileType === TileType.GREENERY).length;
  }

  public canPlay(_player: Player, game: Game): boolean {
    return this.countGreeneryTiles(game) >= 3;
  }

  public play(_player: Player, _game: Game) {
    return undefined;
  }
}
