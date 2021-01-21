import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {MAX_VENUS_SCALE, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class WaterToVenus extends Card {
  constructor() {
    super({
      name: CardName.WATER_TO_VENUS,
      cardType: CardType.EVENT,
      tags: [Tags.SPACE],
      cost: 9,

      metadata: {
        cardNumber: '254',
        renderData: CardRenderer.builder((b) => b.venus(1)),
        description: 'Raise Venus 1 step.',
      },
    });
  };

  public canPlay(player: Player, game: Game): boolean {
    const venusMaxed = game.getVenusScaleLevel() === MAX_VENUS_SCALE;
    if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !venusMaxed) {
      return player.canAfford(player.getCardCost(this) + REDS_RULING_POLICY_COST, game, false, true);
    }

    return true;
  }

  public play(player: Player, game: Game) {
    game.increaseVenusScaleLevel(player, 1);
    return undefined;
  }
}
