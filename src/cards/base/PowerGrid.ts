import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';

export class PowerGrid extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.POWER_GRID,
      tags: [Tags.ENERGY],
      cost: 18,

      metadata: {
        cardNumber: '102',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(1).slash().energy(1, {played}));
        }),
        description: 'Increase your Energy production step for each Power tag you have, including this.',
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.ENERGY, 1 + player.getTagCount(Tags.ENERGY), {log: true});
    return undefined;
  }
}
