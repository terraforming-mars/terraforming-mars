import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {PartyName} from '../../../common/turmoil/PartyName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {all, played} from '../Options';

export class DiasporaMovement extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.DIASPORA_MOVEMENT,
      tags: [Tag.JOVIAN],
      cost: 7,
      requirements: CardRequirements.builder((b) => b.party(PartyName.REDS)),
      victoryPoints: 1,

      behavior: {
        stock: {megacredits: {tag: Tag.JOVIAN, all: true}},
      },

      metadata: {
        cardNumber: 'TO4',
        description: 'Requires that Reds are ruling or that you have 2 delegates there. Gain 1M€ for each Jovian tag in play, including this.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(1).slash().jovian({played, all});
        }),
      },
    });
  }
}
