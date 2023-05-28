import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../requirements/CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
//import { digit } from '../Options';

export class OberonOrbitalBase extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.OBERON_ORBITAL_BASE,
      tags: [Tag.SPACE, Tag.RADIATION],
      cost: 10,
      victoryPoints: 1,

      behavior: {
        production: {megacredits: 4, steel: -1},
      },

      requirements: CardRequirements.builder((b) => b.tag(Tag.SPACE, 3).tag(Tag.JOVIAN, 3)),
      metadata: {
        cardNumber: 'N73',
        renderData: CardRenderer.builder((b) => b.production((pb) => pb.plus().megacredits(4).br.minus().steel(1))),
        description: 'Requires 3 space tags and 3 Jovian tags. Increase your M€ 4 steps and decrease your steel production 1 step.',
      },
    });
  }
}
