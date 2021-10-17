import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class OrbitalReflectors extends Card {
  constructor() {
    super({
      name: CardName.ORBITAL_REFLECTORS,
      cardType: CardType.AUTOMATED,
      tags: [Tags.VENUS, Tags.SPACE],
      cost: 26,
      tr: {venus: 2},

      metadata: {
        cardNumber: '242',
        renderData: CardRenderer.builder((b) => {
          b.venus(2).br;
          b.production((pb) => {
            pb.heat(2);
          });
        }),
        description: 'Raise Venus 2 steps. Increase your heat production 2 steps.',
      },
    });
  };

  public play(player: Player) {
    player.game.increaseVenusScaleLevel(player, 2);
    player.addProduction(Resources.HEAT, 2);
    return undefined;
  }
}
