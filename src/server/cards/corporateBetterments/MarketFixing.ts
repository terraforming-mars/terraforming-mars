import {Card} from '../Card';
import {IActionCard} from '../ICard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {SelectColony} from '../../inputs/SelectColony';
import {LogHelper} from '../../LogHelper';

export class MarketFixing extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.MARKET_FIXING,
      tags: [Tag.EARTH],
      cost: 15,

      behavior: {
        production: {megacredits: 2},
      },

      metadata: {
        cardNumber: 'B28',
        description: 'Increase your M€ production 2 steps.',
        renderData: CardRenderer.builder((b) => {
          b.action('Move the colony indicator of one Colony up or down one level.', (ab) => {
            ab.empty().startAction.colonies(1);
          }).br;
          b.production((pb) => pb.megacredits(2));
        }),
      },
    });
  }

  public canAct(player: IPlayer): boolean {
    return player.game.colonies.some((c) => c.isActive);
  }

  public action(player: IPlayer) {
    const game = player.game;
    const activeColonies = game.colonies.filter((c) => c.isActive);
    const increasable = activeColonies.filter((c) => c.trackPosition < 6);
    const decreasable = activeColonies.filter((c) => c.trackPosition > c.colonies.length);

    return new OrOptions(
      new SelectOption('Move a colony track up one step', 'Move up').andThen(() => {
        player.defer(new SelectColony('Select a colony track to increase', 'Increase', increasable)
          .andThen((colony) => {
            colony.increaseTrack();
            LogHelper.logColonyTrackIncrease(player, colony, 1);
            return undefined;
          }));
        return undefined;
      }),
      new SelectOption('Move a colony track down one step', 'Move down').andThen(() => {
        player.defer(new SelectColony('Select a colony track to decrease', 'Decrease', decreasable)
          .andThen((colony) => {
            colony.decreaseTrack();
            LogHelper.logColonyTrackDecrease(player, colony);
            return undefined;
          }));
        return undefined;
      }),
    );
  }
}
