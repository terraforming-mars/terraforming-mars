import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {IResourceCard} from '../ICard';

export class VenusianAnimals implements IProjectCard, IResourceCard {
    public cost = 15;
    public tags = [Tags.VENUS, Tags.ANIMAL, Tags.SCIENCE];
    public name = CardName.VENUSIAN_ANIMALS;
    public cardType = CardType.ACTIVE;
    public resourceType = ResourceType.ANIMAL;
    public resourceCount: number = 0;
    public canPlay(player: Player, game: Game): boolean {
      return game.getVenusScaleLevel() >= 18 - (2 * player.getRequirementsBonus(game, true));
    }
    public play() {
      return undefined;
    }
    public onCardPlayed(player: Player, _game: Game, card: IProjectCard): void {
      player.addResourceTo(this, card.tags.filter((tag) => tag === Tags.SCIENCE).length);
    }
    public getVictoryPoints(): number {
      return this.resourceCount;
    }
}
