import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { CardName } from "../../CardName";
import { ResourceType } from "../../ResourceType";
import { Game } from "../../Game";
import { LogHelper } from "../../components/LogHelper";

export class FloaterTechnology implements IProjectCard {
    public cost: number = 7;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public name: CardName = CardName.FLOATER_TECHNOLOGY;
    public cardType: CardType = CardType.ACTIVE;

    public canAct(player: Player): boolean {
        return player.getResourceCards(ResourceType.FLOATER).length > 0;
    } 

    public action(player: Player, game: Game) {
        const floaterCards = player.getResourceCards(ResourceType.FLOATER);

        if (floaterCards.length === 1) {
            player.addResourceTo(floaterCards[0], 1);
            LogHelper.logAddResource(game, player, floaterCards[0]);
        } else if (floaterCards.length > 1) {
            game.addResourceInterrupt(player, ResourceType.FLOATER, 1, undefined);
        }

        return undefined;
    } 

    public play() {
      return undefined;
    }
}

