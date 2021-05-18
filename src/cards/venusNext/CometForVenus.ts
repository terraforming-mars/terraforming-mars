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
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';

export class CometForVenus extends Card {
  constructor() {
    super({
      name: CardName.COMET_FOR_VENUS,
      cardType: CardType.EVENT,
      tags: [Tags.SPACE],
      cost: 11,

      metadata: {
        description: 'Raise Venus 1 step. Remove up to 4M€ from any player WITH A VENUS TAG IN PLAY.',
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
      return player.canAfford(player.getCardCost(this) + REDS_RULING_POLICY_COST, {titanium: true});
    }

    return true;
  }

  public play(player: Player) {
    const venusTagPlayers = player.game.getPlayers().filter((otherPlayer) => otherPlayer.id !== player.id && otherPlayer.getTagCount(Tags.VENUS, false, false) > 0);

    if (player.game.isSoloMode()|| venusTagPlayers.length === 0) {
      player.game.increaseVenusScaleLevel(player, 1);
      return undefined;
    }

    if (venusTagPlayers.length > 0) {
      return new OrOptions(
        new SelectPlayer(
          Array.from(venusTagPlayers),
          'Select player to remove up to 4 M€ from',
          'Remove M€',
          (selectedPlayer: Player) => {
            selectedPlayer.deductResource(Resources.MEGACREDITS, 4, {log: true, from: player});
            player.game.increaseVenusScaleLevel(player, 1);
            return undefined;
          },
        ),
        new SelectOption(
          'Do not remove M€',
          'Confirm',
          () => {
            player.game.increaseVenusScaleLevel(player, 1);
            return undefined;
          },
        ),
      );
    }

    return undefined;
  }
}
