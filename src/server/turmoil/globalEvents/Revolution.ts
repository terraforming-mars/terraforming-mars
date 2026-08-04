import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {IGame} from '../../IGame';
import {Turmoil} from '../Turmoil';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {rankedTiers} from '../../../common/utils/utils';

export class Revolution extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.REVOLUTION,
      description: 'Count Earth tags and ADD(!) influence. The player(s) with most (at least 1) loses 2 TR, and 2nd most (at least 1) loses 1 TR. SOLO: Lose 2 TR if the sum is 4 or more.',
      revealedDelegate: PartyName.UNITY,
      currentDelegate: PartyName.MARS,
      renderData: CardRenderer.builder((b) => {
        b.tag(Tag.EARTH, {size: Size.SMALL}).plus().influence().colon().br;
        b.text('1st:', {size: Size.SMALL}).minus().tr(2, {size: Size.TINY}).nbsp;
        b.text('2nd:', {size: Size.SMALL}).minus().tr(1, {size: Size.TINY});
      }),
    });
  }
  public override bespokeResolve(game: IGame) {
    const turmoil = Turmoil.getTurmoil(game);
    if (game.isSoloMode()) {
      if (this.getScore(game.playersInGenerationOrder[0], turmoil) >= 4 ) {
        game.playersInGenerationOrder[0].decreaseTerraformRating(2, {log: true});
      }
    } else {
      const [first, second] = rankedTiers(game.playersInGenerationOrder, (player) => this.getScore(player, turmoil));

      if (first.items.length === 1) {
        first.items[0].decreaseTerraformRating(2, {log: true});
        if (second !== undefined && second.score > 0) {
          for (const player of second.items) {
            player.decreaseTerraformRating(1, {log: true});
          }
        }
      } else if (first.score > 0) {
        // A tie for first place is friendly, and takes the second place penalty with it.
        for (const player of first.items) {
          player.decreaseTerraformRating(2, {log: true});
        }
      }
    }
  }
  public getScore(player: IPlayer, turmoil: Turmoil) {
    return player.tags.count(Tag.EARTH, 'raw') + turmoil.getInfluence(player);
  }
}
