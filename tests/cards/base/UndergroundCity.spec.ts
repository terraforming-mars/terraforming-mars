import {expect} from 'chai';
import {UndergroundCity} from '../../../src/server/cards/base/UndergroundCity';
import {IGame} from '../../../src/server/IGame';
import {Resource} from '../../../src/common/Resource';
import {TestPlayer} from '../../TestPlayer';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {cast, runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('UndergroundCity', function() {
  let card: UndergroundCity;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new UndergroundCity();
    [game, player] = testGame(2);
  });

  it('Can not play', function() {
    player.production.add(Resource.ENERGY, 1);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.production.add(Resource.ENERGY, 2);
    expect(card.canPlay(player)).is.true;

    expect(card.play(player)).is.undefined;
    runAllActions(player.game);
    const action = cast(player.popWaitingFor(), SelectSpace);

    action.cb(action.spaces[0]);
    expect(game.board.getCities()).has.length(1);
    expect(player.production.energy).to.eq(0);
    expect(player.production.steel).to.eq(2);
  });
});
