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

export class Extremophiles implements IActionCard,IProjectCard, IResourceCard {
    public cost: number = 3;
    public tags: Array<Tags> = [Tags.VENUS, Tags.MICROBES];
    public name: CardName = CardName.EXTREMOPHILES;
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.MICROBE;
    public resourceCount: number = 0;
    public canPlay(player: Player): boolean {
        return player.getTagCount(Tags.SCIENCE) >= 2 ;
    }
    public play() {
        return undefined;
    }
    public canAct(): boolean {
        return true;
    }  

    public getVictoryPoints(): number {
        return Math.floor(this.resourceCount / 3);
    }
    
    public action(player: Player, game: Game) {
        const microbeCards = player.getResourceCards(ResourceType.MICROBE);
        if (microbeCards.length === 1) {
            player.addResourceTo(this);
            LogHelper.logAddResource(game, player, microbeCards[0]);
            return undefined;
        }

        return new SelectCard(
            'Select card to add 1 microbe',
            microbeCards,
            (foundCards: Array<ICard>) => {
                player.addResourceTo(foundCards[0], 1);
                LogHelper.logAddResource(game, player, foundCards[0]);
                return undefined;
            }
        );
    }
}