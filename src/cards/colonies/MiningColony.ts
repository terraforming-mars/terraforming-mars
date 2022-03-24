import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {Resources} from '../../common/Resources';
import {BuildColony} from '../../deferredActions/BuildColony';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';

export class MiningColony extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 20,
      tags: [Tags.SPACE],
      name: CardName.MINING_COLONY,
      cardType: CardType.AUTOMATED,

      metadata: {
        cardNumber: 'C25',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.titanium(1)).colonies(1);
        }),
        description: 'Increase your titanium production 1 step. Place a colony.',
      },
    });
  }

  public override canPlay(player: Player): boolean {
    return player.hasAvailableColonyTileToBuildOn();
  }

  public play(player: Player) {
    player.game.defer(new BuildColony(player, false, 'Select colony for Mining Colony'));
    player.addProduction(Resources.TITANIUM, 1);
    return undefined;
  }
}
