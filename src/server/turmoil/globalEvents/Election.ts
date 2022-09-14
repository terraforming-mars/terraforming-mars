import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Game} from '../../Game';
import {Tag} from '../../../common/cards/Tag';
import {Turmoil} from '../Turmoil';
import {Player} from '../../Player';
import {Board} from '../../boards/Board';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {played} from '../../cards/Options';
import {Size} from '../../../common/cards/render/Size';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.influence({size: Size.SMALL}).plus().building(1, {played, size: Size.SMALL}).plus().city({size: Size.SMALL}).colon();
  b.text('1st:', Size.SMALL).tr(2, {size: Size.TINY, digit: true}).text('2nd:', Size.SMALL).tr(1, {size: Size.TINY});
});

export class Election extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.ELECTION,
      description: 'Count your influence plus Building tags and City tiles (no limits). The player with most (or 10 in solo) gains 2 TR, the 2nd (or 5 in solo) gains 1 TR (ties are friendly).',
      revealedDelegate: PartyName.GREENS,
      currentDelegate: PartyName.MARS,
      renderData: RENDER_DATA,
    });
  }

  public resolve(game: Game, turmoil: Turmoil) {
    // Solo
    if (game.isSoloMode()) {
      const player = game.getPlayers()[0];
      const score = this.getScore(player, turmoil, game);
      if (score >= 10) {
        player.increaseTerraformRatingSteps(2, {log: true});
      } else if (score >= 5) {
        player.increaseTerraformRatingSteps(1, {log: true});
      }
    } else {
      const players = game.getPlayers().slice().sort(
        (p1, p2) => this.getScore(p2, turmoil, game) - this.getScore(p1, turmoil, game),
      );

      // We have one rank 1 player
      if (this.getScore(players[0], turmoil, game) > this.getScore(players[1], turmoil, game)) {
        players[0].increaseTerraformRatingSteps(2, {log: true});
        players.shift();

        if (players.length === 1) {
          players[0].increaseTerraformRatingSteps(1, {log: true});
        } else if (players.length > 1) {
          // We have one rank 2 player
          if (this.getScore(players[0], turmoil, game) > this.getScore(players[1], turmoil, game)) {
            players[0].increaseTerraformRatingSteps(1, {log: true});
            // We have at least two rank 2 players
          } else {
            const score = this.getScore(players[0], turmoil, game);
            while (players.length > 0 && this.getScore(players[0], turmoil, game) === score) {
              players[0].increaseTerraformRatingSteps(1, {log: true});
              players.shift();
            }
          }
        }
        // We have at least two rank 1 players
      } else {
        const score = this.getScore(players[0], turmoil, game);
        while (players.length > 0 && this.getScore(players[0], turmoil, game) === score) {
          players[0].increaseTerraformRatingSteps(2, {log: true});
          players.shift();
        }
      }
    }
  }

  public getScore(player: Player, turmoil: Turmoil, game: Game) {
    const score = player.tags.count(Tag.BUILDING, 'raw') + turmoil.getPlayerInfluence(player);

    const cities = game.board.spaces.filter(
      (space) => Board.isCitySpace(space) && space.player === player,
    ).length;

    return score + cities;
  }
}
