import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { Resources } from '../../Resources';
import { ResourceType } from '../../ResourceType';
import { SelectCard } from '../../inputs/SelectCard';
import { ICard } from '../ICard';
import { CardName } from '../../CardName';
import { LogHelper } from "../../components/LogHelper";

export class FreyjaBiodomes implements IProjectCard {
    public cost: number = 14;
    public tags: Array<Tags> = [Tags.PLANT, Tags.VENUS];
    public name: CardName = CardName.FREYJA_BIODOMES;
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
        return player.getProduction(Resources.ENERGY) >= 1 && game.getVenusScaleLevel() >= 10 - (2 * player.getRequirementsBonus(game, true));
    }
    public getResCards(player: Player): ICard[] {
        let resourceCards = player.getResourceCards(ResourceType.ANIMAL);
        resourceCards = resourceCards.concat(player.getResourceCards(ResourceType.MICROBE));
        return resourceCards.filter(card => card.tags.indexOf(Tags.VENUS) !== -1);
    }

    public play(player: Player, game: Game) {
        const cards = this.getResCards(player);

        if (cards.length > 1) {
            return new SelectCard(
                'Select card to add 2 resources',
                cards,
                (foundCards: Array<ICard>) => {
                    player.addResourceTo(foundCards[0], 2);
                    player.setProduction(Resources.ENERGY,-1);
                    player.setProduction(Resources.MEGACREDITS,2);
                    LogHelper.logAddResource(game, player, foundCards[0], 2);
                    return undefined;
                }
            );
        }

        if (cards.length === 1) {
            player.addResourceTo(cards[0], 2);
            LogHelper.logAddResource(game, player, cards[0], 2);
        }
        
        player.setProduction(Resources.ENERGY,-1);
        player.setProduction(Resources.MEGACREDITS,2);
        return undefined;
    }    

    public getVictoryPoints() {
        return 2;
    } 
}