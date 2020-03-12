
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {ResourceType} from '../ResourceType';

export class Decomposers implements IProjectCard {
    public cost: number = 5;
    public resourceType: ResourceType = ResourceType.MICROBE;
    public tags: Array<Tags> = [Tags.MICROBES];
    public cardType: CardType = CardType.ACTIVE;
    public name: string = 'Decomposers';
    public canPlay(player: Player, game: Game): boolean {
      return game.getOxygenLevel() >= 3 - player.getRequirementsBonus(game);
    }
    public onCardPlayed(player: Player, _game: Game, card: IProjectCard): void {
      player.addResourceTo(this, card.tags.filter((tag) => tag === Tags.ANIMAL || tag === Tags.PLANT ||  tag === Tags.MICROBES).length);
    }
    public getVictoryPoints(player: Player): number {
      return Math.floor(player.getResourcesOnCard(this) / 3);
    }
    public play() {
      return undefined;
    }
}

