import {SimpleDeferredAction} from '../../deferredActions/DeferredAction';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {Game} from '../../Game';
import {Card} from '../Card';
import {Size} from '../../common/cards/render/Size';
import {CardRenderer} from '../render/CardRenderer';
import {SelectColony} from '../..//inputs/SelectColony';
import {IColony} from '../../colonies/IColony';

export class MarketManipulation extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 1,
      tags: [Tags.EARTH],
      name: CardName.MARKET_MANIPULATION,
      cardType: CardType.EVENT,

      metadata: {
        cardNumber: 'C23',
        renderData: CardRenderer.builder((b) => {
          b.text(
            'Increase one colony tile track 1 step. Decrease another colony tile track 1 step.',
            Size.SMALL,
            true,
          );
        }),
      },
    });
  }

  public override canPlay(player: Player): boolean {
    const increasableColonies = this.getIncreasableColonies(player.game);
    const decreasableColonies = this.getDecreasableColonies(player.game);

    if (increasableColonies.length === 0) return false;
    if (decreasableColonies.length === 0) return false;
    if (
      increasableColonies.length === 1 &&
      decreasableColonies.length === 1 &&
      increasableColonies[0] === decreasableColonies[0]
    ) {
      return false;
    }

    return true;
  }

  private getIncreasableColonies(game: Game) {
    return game.colonies.filter(
      (colony) => colony.trackPosition < 6 && colony.isActive,
    );
  }

  private getDecreasableColonies(game: Game) {
    return game.colonies.filter(
      (colony) =>
        colony.trackPosition > colony.colonies.length && colony.isActive,
    );
  }

  public play(player: Player) {
    const increasableColonies = this.getIncreasableColonies(player.game);
    const decreasableColonies = this.getDecreasableColonies(player.game);
    const increaseColonyTrack = new SelectColony(
      'Select which colony tile track to increase',
      'Increase',
      increasableColonies,
      (colony: IColony) => {
        player.game.log('${0} increased ${1} track', (b) => b.player(player).string(colony.name));
        colony.increaseTrack();
        return undefined;
      },
    );
    const decreaseColonyTrack = new SelectColony(
      'Select which colony tile track to decrease',
      'Decrease',
      decreasableColonies,
      (colony: IColony) => {
        player.game.log('${0} decreased ${1} track', (b) => b.player(player).string(colony.name));
        colony.decreaseTrack();
        return undefined;
      },
    );
    player.game.defer(
      new SimpleDeferredAction(player, () => increaseColonyTrack),
    );
    player.game.defer(
      new SimpleDeferredAction(player, () => decreaseColonyTrack),
    );
    return undefined;
  }
}
