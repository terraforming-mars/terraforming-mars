import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {CardResource} from '../../../common/CardResource';

export class ResearchDevelopmentHub extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.RESEARCH_DEVELOPMENT_HUB,
      type: CardType.ACTIVE,
      cost: 14,
      tags: [Tag.SCIENCE, Tag.BUILDING],
      resourceType: CardResource.DATA,

      victoryPoints: {resourcesHere: {}, per: 3},

      metadata: {
        cardNumber: 'U84',
        renderData: CardRenderer.builder((b) => {
          // TODO(kberg): This is supposed to be at the START of each production phase.
          b.effect(
            'At the end of each production phase, ' +
            'add 1 data here for EACH OTHER PLAYER that has 7 or more cards in their hand.',
            (eb) => eb.text('7+').cards(1).asterix().startEffect.data());
        }),
        description: '1 VP for every 3 data resources on this card.',
      },
    });
  }

  public onProductionPhase(player: IPlayer) {
    for (const p of player.game.getPlayersInGenerationOrder()) {
      if (p !== player && p.cardsInHand.length >= 7) {
        player.addResourceTo(this);
      }
    }
    return undefined;
  }
}
