import {SimpleDeferredAction} from '../../deferredActions/DeferredAction';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {Game} from '../../Game';
import {Card} from '../Card';
import {Size} from '../../../common/cards/render/Size';
import {CardRenderer} from '../render/CardRenderer';
import {SelectColony} from '../..//inputs/SelectColony';
import {IColony} from '../../colonies/IColony';
import {LogHelper} from '../../LogHelper';

export class MarketManipulation extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 1,
      tags: [Tag.EARTH],
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

  public override bespokeCanPlay(player: Player): boolean {
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

  public override bespokePlay(player: Player) {
    let increasableColonies = this.getIncreasableColonies(player.game);
    const decreasableColonies = this.getDecreasableColonies(player.game);
    // if there is only one decreaseable colony and it is an increaseable colony, don't allow increase of that colony.
    if (decreasableColonies.length === 1 && increasableColonies.some((colony) => colony.name === decreasableColonies[0].name)) {
      increasableColonies = increasableColonies.filter((colony) => colony.name !== decreasableColonies[0].name);
    }
    const increaseColonyTrack = new SelectColony(
      'Select which colony tile track to increase',
      'Increase',
      increasableColonies,
      (increasedColony: IColony) => {
        increasedColony.increaseTrack();
        LogHelper.logColonyTrackIncrease(player, increasedColony, 1);
        const decreaseColonyTrack = new SelectColony(
          'Select which colony tile track to decrease',
          'Decrease',
          decreasableColonies.filter((decreaseableColony) => decreaseableColony.name !== increasedColony.name),
          (decreasedColony: IColony) => {
            decreasedColony.decreaseTrack();
            LogHelper.logColonyTrackDecrease(player, decreasedColony);
            return undefined;
          },
        );
        player.game.defer(
          new SimpleDeferredAction(player, () => decreaseColonyTrack),
        );
        return undefined;
      },
    );

    player.game.defer(
      new SimpleDeferredAction(player, () => increaseColonyTrack),
    );
    return undefined;
  }
}
