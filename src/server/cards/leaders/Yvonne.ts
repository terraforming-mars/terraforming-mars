

import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';
import {LeaderCard} from './LeaderCard';

import {ProductiveOutpost} from '../colonies/ProductiveOutpost';
import {SimpleDeferredAction} from '../../deferredActions/DeferredAction';
import {Size} from '../../../common/cards/render/Size';

export class Yvonne extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.YVONNE,
      cardType: CardType.LEADER,
      metadata: {
        cardNumber: 'L25',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('GAIN ALL YOUR COLONY BONUSES TWICE', Size.SMALL);
        }),
        description: 'Once per game, gain all your colony bonuses twice.',
      },
    });
  }

  public isDisabled = false;

  public override play() {
    return undefined;
  }

  public canAct(player: Player): boolean {
    if (player.game.gameOptions.coloniesExtension === false) return false;
    return this.isDisabled === false;
  }

  public action(player: Player): PlayerInput | undefined {
    // TODO: We currently hook into ProductiveOutpost and run its effect twice.
    // It may be cleaner to move it out into Player itself, or Colonies,
    player.game.defer(new SimpleDeferredAction(player, () => {
      ProductiveOutpost.giveAllColonyBonuses(player);
      ProductiveOutpost.giveAllColonyBonuses(player);
      this.isDisabled = true;
      return undefined;
    }));

    return undefined;
  }
}
