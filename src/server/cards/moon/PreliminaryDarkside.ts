import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {Resource} from '../../../common/Resource';
import {Card} from '../Card';
import {digit} from '../Options';

export class PreliminaryDarkside extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.PRELIMINARY_DARKSIDE,
      type: CardType.EVENT,
      tags: [Tag.MOON],
      cost: 13,

      behavior: {
        moon: {miningRate: 1},
      },

      metadata: {
        description: 'Gain 3 titanium or 4 steel. Raise the mining rate 1 step.',
        cardNumber: 'M63',
        renderData: CardRenderer.builder((b) => {
          b.titanium(3, {digit}).or().steel(4, {digit}).br;
          b.moonMiningRate();
        }),
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    return new OrOptions(
      new SelectOption('Gain 3 titanium', 'Gain titanium').andThen(() => {
        player.stock.add(Resource.TITANIUM, 3, {log: true});
        return undefined;
      }),
      new SelectOption('Gain 4 steel', 'Gain steel').andThen(() => {
        player.stock.add(Resource.STEEL, 4, {log: true});
        return undefined;
      }));
  }
}
