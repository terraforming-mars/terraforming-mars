import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {IGame} from '../../IGame';
import {Tag} from '../../../common/cards/Tag';
import {Turmoil} from '../Turmoil';
import {IPlayer} from '../../IPlayer';
import {Board} from '../../boards/Board';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {rankedTiers} from '../../../common/utils/utils';

export class Election extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.ELECTION,
      description: 'Count your influence plus building tags and city tiles (no limits). The player with most (or 10 in solo) gains 2 TR, the 2nd (or 5 in solo) gains 1 TR (ties are friendly).',
      revealedDelegate: PartyName.GREENS,
      currentDelegate: PartyName.MARS,
      renderData: CardRenderer.builder((b) => {
        b.influence().plus().tag(Tag.BUILDING, {size: Size.SMALL}).plus().city({size: Size.MEDIUM}).colon().br;
        b.text('1st:', {size: Size.SMALL}).tr(2, {size: Size.TINY}).nbsp.text('2nd:', {size: Size.SMALL}).tr(1, {size: Size.TINY});
      }),
    });
  }

  public override bespokeResolve(game: IGame) {
    const turmoil = Turmoil.getTurmoil(game);

    // Solo
    if (game.isSoloMode()) {
      const player = game.players[0];
      const score = this.getScore(player, turmoil, game);
      if (score >= 10) {
        player.increaseTerraformRating(2, {log: true});
      } else if (score >= 5) {
        player.increaseTerraformRating(1, {log: true});
      }
    } else {
      const [first, second] = rankedTiers(game.players, (player) => this.getScore(player, turmoil, game));

      if (first.items.length === 1) {
        first.items[0].increaseTerraformRating(2, {log: true});
        if (second !== undefined) {
          for (const player of second.items) {
            player.increaseTerraformRating(1, {log: true});
          }
        }
      } else {
        // A tie for first place is friendly, and takes the second place prize with it.
        for (const player of first.items) {
          player.increaseTerraformRating(2, {log: true});
        }
      }
    }
  }

  public getScore(player: IPlayer, turmoil: Turmoil, game: IGame) {
    const score = player.tags.count(Tag.BUILDING, 'raw') + turmoil.getInfluence(player);

    const cities = game.board.spaces.filter(
      (space) => Board.isCitySpace(space) && space.player === player,
    ).length;

    return score + cities;
  }
}
