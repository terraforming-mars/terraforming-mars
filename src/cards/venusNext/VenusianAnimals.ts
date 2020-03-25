import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { ResourceType } from "../../ResourceType";
import { Game } from '../../Game';
import { CardName } from '../../CardName';
import { IResourceCard } from '../ICard';

export class VenusianAnimals implements IProjectCard, IResourceCard {
    public cost: number = 15;
    public tags: Array<Tags> = [Tags.VENUS, Tags.ANIMAL, Tags.SCIENCE];
    public name: CardName = CardName.VENUSIAN_ANIMALS;
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.ANIMAL;
    public resourceCount: number = 0;
    public canPlay(player: Player, game: Game): boolean {
        return game.getVenusScaleLevel() >= 18 - (2 * player.getRequirementsBonus(game, true));
    }
    public play() {
        this.resourceCount++;
        return undefined;
    }
    public onCardPlayed(_player: Player, _game: Game, card: IProjectCard): void {
        if (card.tags.indexOf(Tags.SCIENCE) !== -1) {
          this.resourceCount++;
        }
      } 
    public getVictoryPoints(): number {
        return this.resourceCount;
    }
}