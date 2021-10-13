import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class GHGImportFromVenus extends Card {
  constructor() {
    super({
      name: CardName.GHG_IMPORT_FROM_VENUS,
      cardType: CardType.EVENT,
      tags: [Tags.SPACE, Tags.VENUS],
      cost: 23,
      tr: {venus: 1},

      metadata: {
        description: 'Raise Venus 1 step. Increase your heat production 3 steps.',
        cardNumber: '228',
        renderData: CardRenderer.builder((b) => {
          b.venus(1).production((pb) => {
            pb.heat(3);
          });
        }),
      },
    });
  };

  public play(player: Player) {
    player.addProduction(Resources.HEAT, 3);
    player.game.increaseVenusScaleLevel(player, 1);
    return undefined;
  }
}
