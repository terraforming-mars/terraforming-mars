import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { ResourceType } from '../../ResourceType';
import { SelectCard } from '../../inputs/SelectCard';
import { Game } from '../../Game';


export class VenusianPlants implements IProjectCard {
    public cost: number = 13;
    public tags: Array<Tags> = [Tags.VENUS, Tags.PLANT];
    public name: string = "Venusian Plants";
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
        return game.getVenusScaleLevel() >= 16 - (2 * player.getRequirementsBonus(game, true));
    }
    public play(player: Player, game: Game) {
        game.increaseVenusScaleLevel(player,1);
        if (this.getResCards(player).length === 0) return undefined;
        return new SelectCard(
            'Select card to add 1 resource',
            this.getResCards(player),
            (foundCards: Array<IProjectCard>) => {
              player.addResourceTo(foundCards[0], 1);
              return undefined;
            }
        );
    }
    public getVictoryPoints() {
        return 1;
    }
    public getResCards(player: Player): IProjectCard[] {
        let resourceCards = player.getResourceCards(ResourceType.MICROBE);
        resourceCards = resourceCards.concat(player.getResourceCards(ResourceType.ANIMAL));
        return resourceCards.filter(card => card.tags.indexOf(Tags.VENUS) !== -1);
    }
}