import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {CardRequirements} from '../CardRequirements';
import {PartyName} from '../../../common/turmoil/PartyName';
import {played} from '../Options';

export class HighTempSuperconductors extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.HIGH_TEMP_SUPERCONDUCTORS,
      cost: 10,
      tags: [Tag.ENERGY, Tag.SCIENCE],

      requirements: CardRequirements.builder((b) => b.party(PartyName.KELVINISTS)),
      cardDiscount: {tag: Tag.ENERGY, amount: 3},

      behavior: {
        production: {energy: 2},
      },

      metadata: {
        cardNumber: 'PfTMP',
        renderData: CardRenderer.builder((b) => {
          b.effect('When playing a power card, THE STANDARD PROJECT POWER PLANT, OR THE KELVINIST RULING POLICY ACTION, pay 3M€ less.', (eb) => {
            // TODO(chosta): energy(, {played}) needs to be power() [same for space()]
            eb.energy(1, {played}).asterix().slash().text('Kelvinists').startEffect.megacredits(-3);
          }).br;
          b.production((pb) => pb.energy(2));
        }),
        description: 'Requires Kelvinists are ruling or you have 2 delegates there. Increase your energy production 2 steps.',
      },
    });
  }
}
