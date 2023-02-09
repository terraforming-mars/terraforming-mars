import {expect} from 'chai';
import {DecreaseAnyProduction} from '../../src/server/deferredActions/DecreaseAnyProduction';
import {Game} from '../../src/server/Game';
import {TestPlayer} from '../TestPlayer';
import {cast, runAllActions} from '../TestingUtils';
import {getTestPlayers, newTestGame} from '../TestGame';
import {SelectPlayer} from '../../src/server/inputs/SelectPlayer';
import {Resources} from '../../src/common/Resources';

describe('DecreaseAnyProduction', function() {
  let game: Game;
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;
  let decreaseAnyProduction: DecreaseAnyProduction;

  beforeEach(function() {
    game = newTestGame(3);
    [player, player2, player3] = getTestPlayers(game);
    decreaseAnyProduction = new DecreaseAnyProduction(player, Resources.TITANIUM, {count: 2});
    player.popSelectInitialCards();
  });

  it('Does nothing with zero targets', () => {
    expect(decreaseAnyProduction.execute()).is.undefined;
    runAllActions(game);
    expect(player.popWaitingFor()).is.undefined;
  });

  it('automatically if single target', () => {
    player2.production.add(Resources.TITANIUM, 5);

    expect(decreaseAnyProduction.execute()).is.undefined;
    runAllActions(game);

    expect(player.popWaitingFor()).is.undefined;
    expect(player.production.titanium).to.eq(0);
    expect(player2.production.titanium).to.eq(3);
    expect(player3.production.titanium).to.eq(0);
  });

  it('do not auto select single target is self', () => {
    player.production.add(Resources.TITANIUM, 3);
    const selectPlayer = cast(decreaseAnyProduction.execute(), SelectPlayer);

    expect(selectPlayer.players).deep.eq([player]);

    selectPlayer.cb(selectPlayer.players[0]);

    expect(player.production.titanium).to.eq(1);
    expect(player.popWaitingFor()).is.undefined;
  });

  it('omits players with some production, but not enough', () => {
    player.production.add(Resources.TITANIUM, 3);
    player2.production.add(Resources.TITANIUM, 1);
    player3.production.add(Resources.TITANIUM, 2);

    const selectPlayer = cast(decreaseAnyProduction.execute(), SelectPlayer);
    runAllActions(game);

    expect(selectPlayer.players).deep.eq([player, player3]);
  });

  it('multiple targets', () => {
    player.production.add(Resources.TITANIUM, 3);
    player2.production.add(Resources.TITANIUM, 2);
    player3.production.add(Resources.TITANIUM, 2);

    const selectPlayer = cast(decreaseAnyProduction.execute(), SelectPlayer);
    runAllActions(game);

    expect(selectPlayer.players).deep.eq([player, player2, player3]);

    selectPlayer.cb(player3);

    expect(player3.production.titanium).to.eq(0);
    expect(player.popWaitingFor()).is.undefined;
  });
});
