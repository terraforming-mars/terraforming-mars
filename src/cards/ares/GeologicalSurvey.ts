import { CardName } from "../../CardName";
import { Game } from "../../Game";
import { Player } from "../../Player";
import { TileType } from "../../TileType";
import { CardType } from "../CardType";
import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";

export class GeologicalSurvey implements IProjectCard {
  public cost: number = 8;
  public tags: Array<Tags> = [Tags.SCIENCE];
  public cardType: CardType = CardType.ACTIVE;
  public name: CardName = CardName.GEOLOGICAL_SURVEY;

  private countGreeneryTiles(game: Game): number {
    return game.board.spaces.filter(
            (space) => space.tile?.tileType === TileType.GREENERY).length;
  }

  public canPlay(_player: Player, game: Game): boolean {
    return this.countGreeneryTiles(game) <= 5;
  }

  public play(_player: Player, _game: Game) {
    return undefined;
  }
}
