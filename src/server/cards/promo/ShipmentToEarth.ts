import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IPlayer} from '../../IPlayer';
import {Units} from '@/common/Units';
import {digit} from '../Options';

export class ShipmentToEarth extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.SHIPMENT_TO_EARTH,
      tags: [Tag.SPACE],
      cost: 17,

      behavior: {
        tr: 3,
        stock: {megacredits: {tag: Tag.EARTH, each: 2}},
      },

      metadata: {
        cardNumber: 'X87',
        renderData: CardRenderer.builder((b) => {
          b.plants(-3, {digit}).steel(-3, {digit}).br;
          b.tr(3, {digit}).br;
          b.megacredits(2).slash().tag(Tag.EARTH);
        }),
        description: 'Lose 3 plants and 3 steel. Raise TR 3 steps. Gain 2 M€ per Earth tag.',
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer) {
    return player.plants >= 3 && player.steel >= 3;
  }

  public override bespokePlay(player: IPlayer) {
    player.stock.adjust(Units.of({steel: -3, plants: -3}));
    return undefined;
  }
}
