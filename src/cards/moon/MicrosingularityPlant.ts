import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {TileType} from '../../TileType';
import {Resources} from '../../Resources';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class MicrosingularityPlant extends Card {
  constructor() {
    super({
      name: CardName.MICROSINGULARITY_PLANT,
      cardType: CardType.AUTOMATED,
      tags: [Tags.ENERGY],
      cost: 10,

      metadata: {
        description: 'Requires 2 colonies on the Moon. Increase your energy production 2 steps.',
        cardNumber: 'M40',
        // TODO(kberg): requirements: CardRequirements.text('2 colonies @moon'),
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(2));
        }),
      },
    });
  };

  public canPlay(player: Player): boolean {
    return MoonExpansion.tiles(player.game, TileType.MOON_COLONY, true).length >= 2;
  }

  public play(player: Player) {
    player.addProduction(Resources.ENERGY, 2, player.game);
    return undefined;
  }
}
