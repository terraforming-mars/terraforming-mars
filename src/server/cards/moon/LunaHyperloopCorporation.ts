import {CardName} from '@/common/cards/CardName';
import {all} from '@/server/cards/Options';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {Tag} from '@/common/cards/Tag';
import {ActiveCorporationCard} from '@/server/cards/corporation/CorporationCard';

export class LunaHyperloopCorporation extends ActiveCorporationCard {
  constructor() {
    super({
      name: CardName.LUNA_HYPERLOOP_CORPORATION,
      tags: [Tag.MOON, Tag.BUILDING],
      startingMegaCredits: 38,

      behavior: {
        stock: {steel: 4},
      },

      action: {
        stock: {megacredits: {moon: {road: {}}, all}},
      },

      victoryPoints: {moon: {road: {}}, all},

      metadata: {
        description: 'You start with 38 M€ and 4 steel.',
        cardNumber: 'MC4',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(38).steel(4).br;
          b.action('Gain 1 M€ for each road tile on The Moon.', (eb) => {
            eb.empty().startAction.megacredits(1).slash().moonRoad({all});
          }).br,
          b.vpText('1 VP for each road tile on The Moon.').br;
        }),
      },
    });
  }
}
