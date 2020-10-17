import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { CardName } from "../../CardName";
import { ResourceType } from "../../ResourceType";
import { Game } from "../../Game";

export class FloaterPrototypes implements IProjectCard {
    public cost: number = 2;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public name: CardName = CardName.FLOATER_PROTOTYPES;
    public cardType: CardType = CardType.EVENT;

    public play(player: Player, game: Game) {
      game.addResourceInterrupt(player, ResourceType.FLOATER, 2);
      return undefined;
    }
}

