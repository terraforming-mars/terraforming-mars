import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {PartyName} from '../../../common/turmoil/PartyName';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';
import {Size} from '../../../common/cards/render/Size';
import {all} from '../Options';

export class LunaConference extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.LUNA_CONFERENCE,
      cardType: CardType.EVENT,
      tags: [Tag.SCIENCE, Tag.MOON],
      cost: 5,
      requirements: CardRequirements.builder((b) => b.party(PartyName.SCIENTISTS)),

      behavior: {
        stock: {megacredits: {moon: {road: {}, habitat: {}}, each: 2}},
      },

      metadata: {
        description: 'Requires that Scientists are ruling or that you have 2 delegates there. ' +
        'Gain 2 M€ per road tile on The Moon. Gain 2M€ per habitat tile on The Moon.',
        cardNumber: 'M58',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(2).slash().moonRoad({size: Size.SMALL, all}).br;
          b.megacredits(2).slash().moonHabitat({size: Size.SMALL, all}).br;
        }),
      },
    });
  }
}
