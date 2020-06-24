import { IProjectCard } from "../IProjectCard";
import { ICard, IActionCard, IResourceCard } from '../ICard';
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { ResourceType } from "../../ResourceType";
import { SelectCard } from '../../inputs/SelectCard';
import { CardName } from '../../CardName';
import { Game } from "../../Game";
import { LogHelper } from "../../components/LogHelper";


export class Dirigibles implements IActionCard,IProjectCard, IResourceCard {
    public cost: number = 11;
    public tags: Array<Tags> = [Tags.VENUS];

    public name: CardName = CardName.DIRIGIBLES;
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.FLOATER;
    public resourceCount: number = 0;

    public play() {
        return undefined;
    }
    public canAct(): boolean {
        return true;
    }         
    public action(player: Player, game: Game) {
        const floaterCards = player.getResourceCards(ResourceType.FLOATER);
        if (floaterCards.length === 1) {
            this.resourceCount++;
            LogHelper.logAddResource(game, player, floaterCards[0]);
            return undefined;
        }

        return new SelectCard(
            'Select card to add 1 floater',
            floaterCards,
            (foundCards: Array<ICard>) => {
                player.addResourceTo(foundCards[0], 1);
                LogHelper.logAddResource(game, player, foundCards[0]);
                return undefined;
            }
        );
    }
}