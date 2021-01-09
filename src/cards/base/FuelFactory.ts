import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Tags} from '../Tags';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class FuelFactory extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.FUEL_FACTORY,
      tags: [Tags.BUILDING],
      cost: 6,
      hasRequirements: false,

      metadata: {
        cardNumber: '180',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).br;
            pb.plus().titanium(1).megacredits(1);
          });
        }),
        description: 'Decrease your Energy production 1 step and increase your titanium and your MC production 1 step each.',
      },
    });
  }

  public canPlay(player: Player): boolean {
    return player.getProduction(Resources.ENERGY) >= 1;
  }
  public play(player: Player) {
    player.addProduction(Resources.ENERGY, -1);
    player.addProduction(Resources.TITANIUM);
    player.addProduction(Resources.MEGACREDITS);
    return undefined;
  }
}
