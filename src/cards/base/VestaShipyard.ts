import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class VestaShipyard extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.VESTA_SHIPYARD,
      tags: [Tags.JOVIAN, Tags.SPACE],
      cost: 15,
      victoryPoints: 1,

      metadata: {
        cardNumber: '057',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.titanium(1));
        }),
        description: 'Increase your titanium production 1 step.',
      },
    });
  }
  public play(player: Player): undefined {
    player.addProduction(Resources.TITANIUM, 1);
    return undefined;
  }
}
