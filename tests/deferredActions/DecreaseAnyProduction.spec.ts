import {expect} from 'chai';
import {DecreaseAnyProduction} from '../../src/server/deferredActions/DecreaseAnyProduction';
import {Game} from '../../src/server/Game';
import {TestPlayer} from '../TestPlayer';
import {cast, runAllActions} from '../TestingUtils';
import {testGame} from '../TestGame';
import {SelectPlayer} from '../../src/server/inputs/SelectPlayer';
import {Resource} from '../../src/common/Resource';

describe('DecreaseAnyProduction', function() {
  let game: Game;
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;
  let decreaseAnyProduction: DecreaseAnyProduction;

  beforeEach(function() {
    [game, player, player2, player3] = testGame(3);
    decreaseAnyProduction = new DecreaseAnyProduction(player, Resource.TITANIUM, {count: 2});
  });

  it('Does nothing with zero targets', () => {
    expect(decreaseAnyProduction.execute()).is.undefined;
    runAllActions(game);
    expect(player.popWaitingFor()).is.undefined;
  });

  it('automatically if single target', () => {
    player2.production.add(Resource.TITANIUM, 5);

    expect(decreaseAnyProduction.execute()).is.undefined;
    runAllActions(game);

    expect(player.popWaitingFor()).is.undefined;
    expect(player.production.titanium).to.eq(0);
    expect(player2.production.titanium).to.eq(3);
    expect(player3.production.titanium).to.eq(0);
  });

  it('do not auto select single target is self', () => {
    player.production.add(Resource.TITANIUM, 3);
    const selectPlayer = cast(decreaseAnyProduction.execute(), SelectPlayer);

    expect(selectPlayer.players).deep.eq([player]);

    selectPlayer.cb(selectPlayer.players[0]);

    expect(player.production.titanium).to.eq(1);
    expect(player.popWaitingFor()).is.undefined;
  });

  it('omits players with some production, but not enough', () => {
    player.production.add(Resource.TITANIUM, 3);
    player2.production.add(Resource.TITANIUM, 1);
    player3.production.add(Resource.TITANIUM, 2);

    const selectPlayer = cast(decreaseAnyProduction.execute(), SelectPlayer);
    runAllActions(game);

    expect(selectPlayer.players).deep.eq([player, player3]);
  });

  it('multiple targets', () => {
    player.production.add(Resource.TITANIUM, 3);
    player2.production.add(Resource.TITANIUM, 2);
    player3.production.add(Resource.TITANIUM, 2);

    const selectPlayer = cast(decreaseAnyProduction.execute(), SelectPlayer);
    runAllActions(game);

    expect(selectPlayer.players).deep.eq([player, player2, player3]);

    selectPlayer.cb(player3);

    expect(player3.production.titanium).to.eq(0);
    expect(player.popWaitingFor()).is.undefined;
  });
});
