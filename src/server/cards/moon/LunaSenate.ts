import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';
import {all} from '../Options';

export class LunaSenate extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.LUNA_SENATE,
      cardType: CardType.AUTOMATED,
      tags: [Tag.MOON, Tag.MOON],
      cost: 32,
      victoryPoints: VictoryPoints.tags(Tag.MOON, 1, 1),

      behavior: {
        production: {megacredits: {tag: Tag.MOON, all: true}},
      },

      requirements: CardRequirements.builder((b) => b.tag(Tag.MOON, 3)),
      metadata: {
        description: 'Requires that you have 3 Moon tags. Increase your M€ production 1 step per Moon tag in the game (including these.)',
        cardNumber: 'M70',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1)).slash().moon(1, {all});
          b.vpText('1 VP per Moon tag you have.');
        }),
      },
    });
  }
}
