import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { Resources } from '../../Resources';
import { ResourceType } from '../../ResourceType';
import { SelectCard } from '../../inputs/SelectCard';


export class FreyjaBiodomes implements IProjectCard {
    public cost: number = 14;
    public tags: Array<Tags> = [Tags.PLANT, Tags.VENUS];
    public name: string = "Freyja Biodomes";
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
        return player.getProduction(Resources.ENERGY) >= 1 && game.getVenusScaleLevel() >= 10 - (2 * player.getRequirementsBonus(game, true));
    }
    public getResCards(player: Player): IProjectCard[] {
        let resourceCards = player.getResourceCards(ResourceType.ANIMAL);
        resourceCards = resourceCards.concat(player.getResourceCards(ResourceType.MICROBE));
        return resourceCards.filter(card => card.tags.indexOf(Tags.VENUS) !== -1);
    }

    public play(player: Player) {
        if (this.getResCards(player).length > 0) {
            return new SelectCard(
                'Select card to add 2 resources',
                this.getResCards(player),
                (foundCards: Array<IProjectCard>) => {
                    player.addResourceTo(foundCards[0], 2);
                player.setProduction(Resources.ENERGY,-1);
                player.setProduction(Resources.MEGACREDITS,2);   
                return undefined;
                }
            );
        }
        player.setProduction(Resources.ENERGY,-1);
        player.setProduction(Resources.MEGACREDITS,2);
        return undefined;
    }    

    public getVictoryPoints() {
        return 2;
    } 
}