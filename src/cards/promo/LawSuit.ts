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
import {all} from '../Options';

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
          b.text('steal', Size.SMALL, true).megacredits(3, {all}).asterix();
        }),
        description: 'Steal 3 M€ from a player that REMOVED YOUR RESOURCES OR DECREASED YOUR PRODUCTION this generation. Place this card face down in THAT PLAYER\'S EVENT PILE.',
        victoryPoints: CardRenderDynamicVictoryPoints.any(-1),
      },
    });
  }

  private targets(player: Player) {
    // The 0 parameter basically means that all players are eligible if they're not
    // protected. Normally, calls to player.canRemoveResource() are to determine whom
    // to attack. But you might want to play LawSuit even if your attacker has no MC
    // (eg, to get the side effects of playing a card of this type.)
    return player.game.getPlayersById(player.removingPlayers)
      .filter((player) => player.canRemoveResource(Resources.MEGACREDITS, 0));
  }

  public canPlay(player: Player) {
    return this.targets(player).length > 0;
  }

  public play(player: Player) {
    return new SelectPlayer(this.targets(player), 'Select player to sue (steal 3 M€ from)', 'Steal M€', (suedPlayer: Player) => {
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

