import {IPlayer} from '../../IPlayer';
import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {SelectPlayer} from '../../inputs/SelectPlayer';
import {Resource} from '../../../common/Resource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {all} from '../Options';

export class LawSuit extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.LAW_SUIT,
      tags: [Tag.EARTH],
      cost: 2,
      victoryPoints: 'special',

      metadata: {
        cardNumber: 'X06',
        renderData: CardRenderer.builder((b) => {
          b.text('steal', Size.SMALL, true).megacredits(3, {all}).asterix();
        }),
        description: 'Steal 3 M€ from a player that REMOVED YOUR RESOURCES OR DECREASED YOUR PRODUCTION this generation. Place this card face down in THAT PLAYER\'S EVENT PILE.',
        victoryPoints: CardRenderDynamicVictoryPoints.any(-1),
      },
    });
  }

  private targets(player: IPlayer) {
    return player.game.getPlayersById(player.removingPlayers);
  }

  public override bespokeCanPlay(player: IPlayer) {
    return this.targets(player).length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    return new SelectPlayer(this.targets(player), 'Select player to sue (steal 3 M€ from)', 'Steal M€')
      .andThen((suedPlayer: IPlayer) => {
        const amount = Math.min(3, suedPlayer.megaCredits);
        if (amount === 0) {
          player.game.log('${0} sued ${1} who had 0 MC.', (b) => b.player(player).player(suedPlayer));
        }
        suedPlayer.playedCards.push(this);
        suedPlayer.maybeBlockAttack(player, 'lose 3 M€', (proceed) => {
          if (proceed) {
            suedPlayer.stock.deduct(Resource.MEGACREDITS, amount, {log: true, from: player, stealing: true});
          }
          player.stock.add(Resource.MEGACREDITS, amount);
          return undefined;
        });
        return undefined;
      });
  }
  public override getVictoryPoints() {
    return -1;
  }

  public static resourceHook(player: IPlayer, _resource: Resource, amount: number, from: IPlayer) {
    if (from === player || amount >= 0) {
      return;
    }
    if (player.removingPlayers.includes(from.id) === false) {
      player.removingPlayers.push(from.id);
    }
  }
}

