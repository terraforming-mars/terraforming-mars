import { CardName } from "../../CardName";
import { Game } from "../../Game";
import { Player } from "../../Player";
import { Resources } from "../../Resources";
import { CardType } from "../CardType";
import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";

export class MarketingExperts implements IProjectCard {
  public cost: number = 5;
  public tags: Array<Tags> = [Tags.EARTH];
  public cardType: CardType = CardType.ACTIVE;
  public name: CardName = CardName.MARKETING_EXPERTS;

  public play(player: Player, _game: Game) {
    player.addProduction(Resources.MEGACREDITS, 1)
    return undefined;
  }
}
