import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Phase} from '../../../common/Phase';
import {played} from '../Options';

export class Decomposers extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.DECOMPOSERS,
      tags: [Tag.MICROBE],
      cost: 5,

      resourceType: CardResource.MICROBE,
      victoryPoints: VictoryPoints.resource(1, 3),
      requirements: CardRequirements.builder((b) => b.oxygen(3)),

      metadata: {
        cardNumber: '131',
        description: 'Requires 3% oxygen.',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play an animal, plant, or microbe tag, including this, add a microbe to this card.', (be) => {
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
  public onCardPlayed(player: Player, card: IProjectCard): void {
    player.addResourceTo(this, card.tags.filter((tag) => tag === Tag.ANIMAL || tag === Tag.PLANT || tag === Tag.MICROBE).length);
  }
  public override bespokePlay(player: Player) {
    // Get two extra microbes from EcoExperts if played during prelude while having just played EcoExperts
    if (player.game.phase === Phase.PRELUDES && player.playedCards.length > 0 && player.playedCards[player.playedCards.length-1].name === CardName.ECOLOGY_EXPERTS) {
      player.addResourceTo(this, 2);
    }
    return undefined;
  }
}
