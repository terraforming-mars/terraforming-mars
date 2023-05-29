import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';
import {Resource} from '../../../common/Resource';
import {Player} from '../../Player';

export class LimitedEnergyBudget extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.LIMITED_ENERGY_BUDGET,
      tags: [Tag.RADIATION, Tag.POWER],
      cost: 7,

      behavior: {
        production: {energy: 1},
      },

      cardDiscount: [{tag: Tag.RADIATION, amount: 1, per: 'card'},{tag: Tag.POWER, amount: -1, per: 'card'} ],
      metadata: {
        cardNumber: 'N46',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play a radiation card, you pay 1 M€ less for it.', (eb) => {
            eb.radiation({played}).startEffect.megacredits(-1);
          }).br;
          b.effect('When you play a power card, you pay 1 M€ more for it and gain 1 energy.', (eb) => {
            eb.energy(1, {played}).startEffect.plus().megacredits(1).colon().energy(1);
          }).br;
          b.production((pb) => pb.energy(1));
        }),
        description: 'Increase your energy production 1 step.',
      },
    }); 
  }
  public onCardPlayed(player: Player, card: IProjectCard) {
    if (card.tags.includes(Tag.POWER)) {
      player.addResource(Resource.ENERGY, 1, {log: true, from: this});
    }
  }
}
