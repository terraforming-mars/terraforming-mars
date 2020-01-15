import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { ResourceType } from "../../ResourceType";
import { Game } from '../../Game';

export class VenusianAnimals implements IProjectCard {
    public cost: number = 15;
    public tags: Array<Tags> = [Tags.VENUS, Tags.ANIMAL, Tags.SCIENCE];
    public name: string = "Venusian Animals";
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.ANIMAL;
    public canPlay(player: Player, game: Game): boolean {
        return game.getVenusScaleLevel() >= 18 - (2 * player.getRequirementsBonus(game, true));
    }
    public play(player: Player) {
        player.addResourceTo(this);
        return undefined;
    }
    public onCardPlayed(player: Player, _game: Game, card: IProjectCard): void {
        if (card.tags.indexOf(Tags.SCIENCE) !== -1) {
          player.addResourceTo(this);
        }
      } 
    public getVictoryPoints(player: Player): number {
        return player.getResourcesOnCard(this);
    }
}