import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {CardName} from '../../CardName';
import {IResourceCard} from '../ICard';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Phase} from '../../Phase';
import {played} from '../Options';

export class Decomposers extends Card implements IProjectCard, IResourceCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.DECOMPOSERS,
      tags: [Tags.MICROBE],
      cost: 5,

      resourceType: ResourceType.MICROBE,
      victoryPoints: VictoryPoints.resource(1, 3),
      requirements: CardRequirements.builder((b) => b.oxygen(3)),

      metadata: {
        cardNumber: '131',
        description: 'Requires 3% oxygen.',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play an Animal, Plant, or Microbe tag, including this, add a Microbe to this card.', (be) => {
            be.animals(1, {played}).slash();
            be.plants(1, {played}).slash();
            be.microbes(1, {played});
            be.startEffect.microbes(1);
          }).br;
          b.vpText('1 VP per 3 Microbes on this card.');
        }),
      },
    });
  }
    public resourceCount: number = 0;
    public onCardPlayed(player: Player, card: IProjectCard): void {
      player.addResourceTo(this, card.tags.filter((tag) => tag === Tags.ANIMAL || tag === Tags.PLANT || tag === Tags.MICROBE).length);
    }
    public play(player: Player) {
      // Get two extra microbes from EcoExperts if played during prelude while having just played EcoExperts
      if (player.game.phase === Phase.PRELUDES && player.playedCards.length > 0 && player.playedCards[player.playedCards.length-1].name === CardName.ECOLOGY_EXPERTS) {
        player.addResourceTo(this, 2);
      }
      return undefined;
    }
}

