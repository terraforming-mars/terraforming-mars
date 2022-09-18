import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {SelectPlayer} from '../../inputs/SelectPlayer';
import {Resources} from '../../../common/Resources';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {all} from '../Options';
import {IProjectCard} from '../IProjectCard';

export class CometForVenus extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.COMET_FOR_VENUS,
      cardType: CardType.EVENT,
      tags: [Tag.SPACE],
      cost: 11,

      behavior: {
        global: {venus: 1},
      },

      metadata: {
        description: 'Raise Venus 1 step. Remove up to 4M€ from any player WITH A VENUS TAG IN PLAY.',
        cardNumber: '218',
        renderData: CardRenderer.builder((b) => {
          b.venus(1).nbsp.nbsp.minus().megacredits(4, {all, secondaryTag: Tag.VENUS});
        }),
      },
    });
  }

  public override bespokePlay(player: Player) {
    const venusTagPlayers = player.game.getPlayers().filter((otherPlayer) => otherPlayer.id !== player.id && otherPlayer.tags.count(Tag.VENUS, 'raw') > 0);

    if (player.game.isSoloMode()|| venusTagPlayers.length === 0) {
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
            return undefined;
          },
        ),
        new SelectOption(
          'Do not remove M€',
          'Confirm',
          () => undefined,
        ),
      );
    }

    return undefined;
  }
}
