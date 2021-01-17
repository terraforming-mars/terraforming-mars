import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {ResourceType} from '../../ResourceType';
import {CardName} from '../../CardName';
import {IResourceCard} from '../ICard';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';

export class Decomposers extends Card implements IProjectCard, IResourceCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.DECOMPOSERS,
      tags: [Tags.MICROBE],
      cost: 5,
      resourceType: ResourceType.MICROBE,

      metadata: {
        cardNumber: '131',
        requirements: CardRequirements.builder((b) => b.oxygen(3)),
        description: 'Requires 3% oxygen.',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play an Animal, Plant, or Microbe tag, including this, add a Microbe to this card.', (be) => {
            be.animals(1).played.slash();
            be.plants(1).played.slash();
            be.microbes(1).played.slash();
            be.startEffect.microbes(1);
          }).br;
          b.vpText('1 VP per 3 Microbes on this card.');
        }),
        victoryPoints: CardRenderDynamicVictoryPoints.microbes(1, 3),
      },
    });
  }
    public resourceCount: number = 0;
    public onCardPlayed(player: Player, _game: Game, card: IProjectCard): void {
      player.addResourceTo(this, card.tags.filter((tag) => tag === Tags.ANIMAL || tag === Tags.PLANT || tag === Tags.MICROBE).length);
    }
    public getVictoryPoints(): number {
      return Math.floor(this.resourceCount / 3);
    }
    public play() {
      return undefined;
    }
}

