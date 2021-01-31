import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class MassConverter extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.MASS_CONVERTER,
      tags: [Tags.SCIENCE, Tags.ENERGY],
      cost: 8,

      requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 5)),
      metadata: {
        cardNumber: '094',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play a Space card, you pay 2 MC less for it.', (eb) => {
            eb.space().played.startEffect.megacredits(-2);
          }).br;
          b.production((pb) => pb.energy(6));
        }),
        description: 'Requires 5 science tags. Increase your energy production 6 steps.',
      },
    });
  }
  public getCardDiscount(_player: Player, card: IProjectCard) {
    if (card.tags.indexOf(Tags.SPACE) !== -1) {
      return 2;
    }
    return 0;
  }
  public play(player: Player) {
    player.addProduction(Resources.ENERGY, 6);
    return undefined;
  }
}
