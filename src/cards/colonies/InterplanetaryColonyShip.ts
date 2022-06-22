import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {BuildColony} from '../../deferredActions/BuildColony';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';

export class InterplanetaryColonyShip extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 12,
      tags: [Tags.SPACE, Tags.EARTH],
      name: CardName.INTERPLANETARY_COLONY_SHIP,
      cardType: CardType.EVENT,

      metadata: {
        cardNumber: 'C17',
        renderData: CardRenderer.builder((b) => b.colonies(1)),
        description: 'Place a colony.',
      },
    });
  }

  public override canPlay(player: Player): boolean {
    return player.hasAvailableColonyTileToBuildOn();
  }

  public play(player: Player) {
    player.game.defer(new BuildColony(player, false, 'Select colony for Interplanetary Colony Ship'));
    return undefined;
  }
}
