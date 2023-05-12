import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {Resource} from '../../../src/common/Resource';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {CommercialDistrictAres} from '../../../src/server/cards/ares/CommercialDistrictAres';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('CommercialDistrictAres', function() {
  let card: CommercialDistrictAres;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new CommercialDistrictAres();
    [game, player] = testGame(2, {aresExtension: true});
  });

  it('Should play', function() {
    expect(card.canPlay(player)).is.false;
    player.production.add(Resource.ENERGY, 1);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);
    action.cb(action.availableSpaces[0]);

    expect(action.availableSpaces[0].adjacency).to.deep.eq({bonus: [SpaceBonus.MEGACREDITS, SpaceBonus.MEGACREDITS]});
  });
});
