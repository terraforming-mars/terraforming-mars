import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IPlayer} from '../../IPlayer';
import {SelectPlayer} from '../../inputs/SelectPlayer';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {Resource} from '../../../common/Resource';
import {message} from '../../../server/logs/MessageBuilder';
import {Size} from '../../../common/cards/render/Size';
import {all} from '../Options';
import {Tag} from '../../../common/cards/Tag';

// TODO(kberg): Remove Corporate Blackmail from solo plays.
export class CorporateBlackmail extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.CORPORATE_BLACKMAIL,
      type: CardType.EVENT,
      cost: 5,
      tags: [Tag.CRIME],
      victoryPoints: -1,

      requirements: {corruption: 1},

      metadata: {
        cardNumber: 'U039',
        renderData: CardRenderer.builder((b) => {
          b.text('PAYS YOU', Size.SMALL).megacredits(10, {all}).or().corruption(2, {all}).br;
          b.text('THIS CANNOT BE BLOCKED BY CORRUPTION', Size.SMALL).br;
        }),
        description: 'Requires 1 corruption. Target a player that has at least 3 corruption. ' +
          'That player pays you 10 M€ or 2 corruption - their choice.',
      },
    });
  }


  private targets(player: IPlayer) {
    return player.opponents.filter((p) => p.underworldData.corruption >= 3);
  }

  public override bespokeCanPlay(player: IPlayer) {
    return !player.game.isSoloMode() && this.targets(player).length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    function megacreditConsequence(blackmailedPlayer: IPlayer) {
      blackmailedPlayer.stock.steal(Resource.MEGACREDITS, 10, player);
      player.game.log('${0} blackmailed ${1} and was paid 10 M€.', (b) => b.player(player).player(blackmailedPlayer));
    }

    function corruptionConsequence(blackmailedPlayer: IPlayer) {
      UnderworldExpansion.loseCorruption(blackmailedPlayer, 2);
      UnderworldExpansion.gainCorruption(player, 2);
      player.game.log('${0} blackmailed ${1} and took 2 corruption.', (b) => b.player(player).player(blackmailedPlayer));
    }

    return new SelectPlayer(this.targets(player), 'Select player to blackmail', 'blackmail')
      .andThen((blackmailedPlayer: IPlayer) => {
        if (blackmailedPlayer.megaCredits < 10) {
          corruptionConsequence(blackmailedPlayer);
          return undefined;
        } else {
          const orOptions = new OrOptions(
            new SelectOption(message('Pay ${0} 10 M€', (b) => b.player(player)), 'Pay 10 M€')
              .andThen(() => {
                megacreditConsequence(blackmailedPlayer);
                return undefined;
              }),
            new SelectOption('Lose 2 corruption', 'Lose 2 corruption')
              .andThen(() => {
                corruptionConsequence(blackmailedPlayer);
                return undefined;
              }));
          blackmailedPlayer.defer(orOptions);
        }
        return undefined;
      });
  }
}
