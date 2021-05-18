import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {SelectPlayer} from '../../inputs/SelectPlayer';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';

export class LawSuit extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.LAW_SUIT,
      tags: [Tags.EARTH],
      cost: 2,

      metadata: {
        cardNumber: 'X06',
        renderData: CardRenderer.builder((b) => {
          b.text('steal', Size.SMALL, true).megacredits(3).any.asterix();
        }),
        description: 'Steal 3 M€ from a player that REMOVED YOUR RESOURCES OR DECREASED YOUR PRODUCTION this generation. Place this card face down in THAT PLAYER\'S EVENT PILE.',
        victoryPoints: CardRenderDynamicVictoryPoints.any(-1),
      },
    });
  }

  public canPlay(player: Player) {
    return player.removingPlayers.length > 0;
  }

  public play(player: Player) {
    return new SelectPlayer(player.game.getPlayersById(player.removingPlayers), 'Select player to sue (steal 3 M€ from)', 'Steal M€', (suedPlayer: Player) => {
      const amount = Math.min(3, suedPlayer.megaCredits);
      player.addResource(Resources.MEGACREDITS, amount);
      suedPlayer.deductResource(Resources.MEGACREDITS, amount, {log: true, from: player});
      suedPlayer.playedCards.push(this);
      return undefined;
    });
  }

  public getVictoryPoints() {
    return -1;
  }

  public static resourceHook(player: Player, _resource: Resources, amount: number, from: Player) {
    if (from === player || amount >= 0) {
      return;
    }
    if (player.removingPlayers.includes(from.id) === false) {
      player.removingPlayers.push(from.id);
    }
  }
}

