import {IGlobalEvent} from '../../turmoil/globalEvents/IGlobalEvent';
import {GlobalEvent} from '../../turmoil/globalEvents/GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {IGame} from '../../IGame';
import {Resource} from '../../../common/Resource';
import {Turmoil} from '../../turmoil/Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';
import {Size} from '../../../common/cards/render/Size';
import {cancelled} from '../../cards/Options';
import {Tag} from '../../../common/cards/Tag';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.text('ALL').undergroundResources(1, {cancelled}).nbsp.megacredits(-2).slash().tag(Tag.BUILDING).minus().undergroundResources().influence({size: Size.SMALL});
});

export class SeismicPredictions extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.SEISMIC_PREDICTIONS,
      description: 'Discard all unclaimed underground resources. ' +
      'Lose 2 M€ for each building tag (max 7) minus influence and claimed underground resource tokens.',
      revealedDelegate: PartyName.SCIENTISTS,
      currentDelegate: PartyName.MARS,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: IGame, turmoil: Turmoil) {
    UnderworldExpansion.removeAllUnclaimedTokens(game);

    for (const player of game.playersInGenerationOrder) {
      const penalty = Math.min(7, player.tags.count(Tag.BUILDING, 'raw'));
      const rebate = turmoil.getInfluence(player) + player.underworldData.tokens.length;
      const cost = (penalty - rebate) * 2;
      if (cost > 0) {
        player.stock.deduct(Resource.MEGACREDITS, cost, {log: true, from: {globalEvent: this}});
      }
    }
  }
}
