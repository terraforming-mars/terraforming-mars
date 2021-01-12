import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class ResearchCoordination extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.RESEARCH_COORDINATION,
      tags: [Tags.WILDCARD],
      cost: 4,

      metadata: {
        cardNumber: 'P40',
        renderData: CardRenderer.builder((b) => {
          b.text('After being played, when you perform an action, the wild tag counts as any tag of your choice.', CardRenderItemSize.SMALL, true);
        }),
      },
    });
  }

  public play() {
    return undefined;
  }
}
