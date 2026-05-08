import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';

export class CompanyMerger extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.COMPANY_MERGER,
      tags: [Tag.EARTH, Tag.BUILDING],
      cost: 77,
      victoryPoints: 2,
      metadata: {
        cardNumber: 'B53',
        description: 'Draw 2 Corporation cards, choose 1 to gain all its effects and starting M€. Draw 2 Prelude cards, choose 1 to gain all its effects.',
        renderData: CardRenderer.builder((b) => {
          b.corporation().corporation().minus().corporation().br;
          b.prelude().prelude().minus().prelude();
        }),
      },
    });
  }

  public override play(_player: IPlayer) {
    // TODO: Draw 2 corps + 2 preludes mid-game, present selection, apply chosen effects.
    // Requires significant engine support for mid-game corp/prelude application.
    return undefined;
  }
}
