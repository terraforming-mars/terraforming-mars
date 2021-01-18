import {Game} from '../../Game';
import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {SelectPlayer} from '../../inputs/SelectPlayer';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';

export class LawSuit implements IProjectCard {
    public cost = 2;
    public tags = [Tags.EARTH];
    public cardType = CardType.EVENT;
    public name = CardName.LAW_SUIT;

    public canPlay(player: Player) {
      return player.removingPlayers.length > 0;
    }

    public play(player: Player, game: Game) {
      return new SelectPlayer(game.getPlayersById(player.removingPlayers), 'Select player to sue (steal 3 MC from)', 'Steal MC', (suedPlayer: Player) => {
        player.setResource(Resources.MEGACREDITS, Math.min(3, suedPlayer.getResource(Resources.MEGACREDITS)));
        suedPlayer.setResource(Resources.MEGACREDITS, -3, game, player);
        suedPlayer.playedCards.push(this);
        return undefined;
      });
    }

    public getVictoryPoints() {
      return -1;
    }
    public metadata: CardMetadata = {
      cardNumber: 'X06',
      renderData: CardRenderer.builder((b) => {
        b.text('steal', CardRenderItemSize.SMALL, true).megacredits(3).any.asterix();
      }),
      description: 'Steal 3 MC from a player that REMOVED YOUR RESOURCES OR DECREASED YOUR PRODUCTION this generation. Place this card face down in THAT PLAYER\'S EVENT PILE.',
      victoryPoints: CardRenderDynamicVictoryPoints.any(-1),
    }
}

