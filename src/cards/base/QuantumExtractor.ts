import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {digit, played} from '../Options';

export class QuantumExtractor extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.QUANTUM_EXTRACTOR,
      tags: [Tags.SCIENCE, Tags.ENERGY],
      cost: 13,

      requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 4)),
      cardDiscount: {tag: Tags.SPACE, amount: 2},
      metadata: {
        cardNumber: '079',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play a Space card, you pay 2 M€ less for it.', (eb) => {
            eb.space({played}).startEffect.megacredits(-2);
          }).br;
          b.production((pb) => pb.energy(4, {digit}));
        }),
        description: 'Requires 4 science tags. Increase your energy production 4 steps.',
      },
    });
  }


  public getCardDiscount(_player: Player, card: IProjectCard) {
    if (card.tags.includes(Tags.SPACE)) {
      return 2;
    }
    return 0;
  }
  public play(player: Player) {
    player.addProduction(Resources.ENERGY, 4);
    return undefined;
  }
}
