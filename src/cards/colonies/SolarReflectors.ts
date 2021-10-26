import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {digit} from '../Options';

export class SolarReflectors extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 23,
      tags: [Tags.SPACE],
      name: CardName.SOLAR_REFLECTORS,
      cardType: CardType.AUTOMATED,

      metadata: {
        cardNumber: 'C38',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.heat(5, {digit}));
        }),
        description: 'Increase your heat production 5 steps.',
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.HEAT, 5);
    return undefined;
  }
}
