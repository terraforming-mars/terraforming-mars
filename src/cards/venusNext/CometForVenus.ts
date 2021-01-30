import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {SelectPlayer} from '../../inputs/SelectPlayer';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {MAX_VENUS_SCALE, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class CometForVenus extends Card {
  constructor() {
    super({
      name: CardName.COMET_FOR_VENUS,
      cardType: CardType.EVENT,
      tags: [Tags.SPACE],
      cost: 11,

      metadata: {
        description: 'Raise Venus 1 step. Remove up to 4MC from any player WITH A VENUS TAG IN PLAY.',
        cardNumber: '218',
        renderData: CardRenderer.builder((b) => {
          b.venus(1).nbsp.nbsp.minus().megacredits(4).secondaryTag(Tags.VENUS).any;
        }),
      },
    });
  };

  public canPlay(player: Player): boolean {
    const venusMaxed = player.game.getVenusScaleLevel() === MAX_VENUS_SCALE;
    if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS) && !venusMaxed) {
      return player.canAfford(player.getCardCost(this) + REDS_RULING_POLICY_COST, false, true);
    }

    return true;
  }

  public play(player: Player) {
    const venusTagPlayers = player.game.getPlayers().filter((otherPlayer) => otherPlayer.id !== player.id && otherPlayer.getTagCount(Tags.VENUS, false, false) > 0);

    if (player.game.isSoloMode()|| venusTagPlayers.length === 0) {
      player.game.increaseVenusScaleLevel(player, 1);
      return undefined;
    }

    if (venusTagPlayers.length === 1) {
      venusTagPlayers[0].setResource(Resources.MEGACREDITS, -4, player.game, player);
      player.game.increaseVenusScaleLevel(player, 1);
      return undefined;
    }

    return new SelectPlayer(
      venusTagPlayers,
      'Select player to remove up to 4 mega credits from',
      'Remove MC',
      (selectedPlayer: Player) => {
        selectedPlayer.setResource(Resources.MEGACREDITS, -4, player.game, player);
        player.game.increaseVenusScaleLevel(player, 1);
        return undefined;
      },
    );
  }
}
