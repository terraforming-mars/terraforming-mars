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


export class CorporateBlackmail extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.CORPORATE_BLACKMAIL,
      type: CardType.EVENT,
      cost: 2,
      victoryPoints: -2,

      requirements: {corruption: 1},

      metadata: {
        cardNumber: 'U39',
        renderData: CardRenderer.builder((b) => {
          b.text('PAYS YOU').megacredits(10).or().corruption(-2).br;
          // TODO(kberg): Small bold caps
          b.text('THIS CANNOT BE BLOCKED BY CORRUPTION').br;
        }),
        description: 'Requires 1 corruption. Target a player that has at least 2 corruption. ' +
          'Unless that player pays you 10 M€, they lose 2 corruption.',
      },
    });
  }


  private targets(player: IPlayer) {
    return player.game.getPlayers().filter((p) => p.underworldData.corruption >= 2 && p !== player);
  }

  public override bespokeCanPlay(player: IPlayer) {
    return player.game.isSoloMode() || this.targets(player).length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    if (player.game.isSoloMode()) {
      player.stock.add(Resource.MEGACREDITS, 10);
      player.game.log('${0} blackmailed the neutral player and was paid 10 M€.', (b) => b.player(player));
      return undefined;
    }
    function corruptionConsequence(blackmailedPlayer: IPlayer) {
      UnderworldExpansion.loseCorruption(blackmailedPlayer, 2);
      player.game.log('${0} blackmailed ${1} who lost 2 corruption.', (b) => b.player(player).player(blackmailedPlayer));
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
                blackmailedPlayer.stock.steal(Resource.MEGACREDITS, 10, player);
                player.game.log('${0} blackmailed ${1} and was paid 10 M€.', (b) => b.player(player).player(blackmailedPlayer));
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
