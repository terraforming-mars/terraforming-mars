
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {ResourceType} from '../ResourceType';
import {CardName} from '../CardName';
import {IResourceCard} from './ICard';
import {CardMetadata} from './CardMetadata';
import {CardRequirements} from './CardRequirements';
import {CardRenderer} from './render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from './render/CardRenderDynamicVictoryPoints';

export class Decomposers implements IProjectCard, IResourceCard {
    public cost = 5;
    public resourceType = ResourceType.MICROBE;
    public resourceCount: number = 0;
    public tags = [Tags.MICROBES];
    public cardType = CardType.ACTIVE;
    public name = CardName.DECOMPOSERS;
    public canPlay(player: Player, game: Game): boolean {
      return game.getOxygenLevel() >= 3 - player.getRequirementsBonus(game);
    }
    public onCardPlayed(player: Player, _game: Game, card: IProjectCard): void {
      player.addResourceTo(this, card.tags.filter((tag) => tag === Tags.ANIMAL || tag === Tags.PLANT || tag === Tags.MICROBES).length);
    }
    public getVictoryPoints(): number {
      return Math.floor(this.resourceCount / 3);
    }
    public play() {
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '131',
      requirements: CardRequirements.builder((b) => b.oxygen(3)),
      description: 'Requires 3% oxygen. 1 VP per 3 Microbes on this card',
      renderData: CardRenderer.builder((b) => {
        b.effectBox((be) => {
          be.animals(1).played.slash();
          be.plants(1).played.slash();
          be.microbes(1).played.slash();
          be.startEffect.microbes(1);
          be.description('Effect: When you play an Animal, Plant, or Microbe tag, including this, add a Microbe to this card');
        });
      }),
      victoryPoints: CardRenderDynamicVictoryPoints.microbes(1, 3),
    }
}

