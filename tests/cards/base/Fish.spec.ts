import {expect} from 'chai';
import {Fish} from '../../../src/server/cards/base/Fish';
import {IGame} from '../../../src/server/IGame';
import {SelectPlayer} from '../../../src/server/inputs/SelectPlayer';
import {Resource} from '../../../src/common/Resource';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions, setTemperature} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('Fish', function() {
  let card: Fish;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new Fish();
    [game, player, player2] = testGame(2);
  });

  it('Can not play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should act', function() {
    card.action(player);
    runAllActions(game);
    expect(card.resourceCount).to.eq(1);
  });

  it('Should play - auto select if single target', function() {
    setTemperature(game, 2);
    player2.production.add(Resource.PLANTS, 1);

    expect(card.canPlay(player)).is.true;
    card.play(player);

    const input = game.deferredActions.peek()!.execute();
    expect(input).is.undefined;
    expect(player2.production.plants).to.eq(0);
  });

  it('Should play - multiple targets', function() {
    setTemperature(game, 2);
    player.production.add(Resource.PLANTS, 1);
    player2.production.add(Resource.PLANTS, 1);

    expect(card.canPlay(player)).is.true;
    card.play(player);

    expect(game.deferredActions).has.lengthOf(1);
    const selectPlayer = cast(game.deferredActions.peek()!.execute(), SelectPlayer);
    selectPlayer.cb(player2);
    expect(player2.production.plants).to.eq(0);
  });

  it('Should give victory points', function() {
    player.addResourceTo(card, 5);
    expect(card.getVictoryPoints(player)).to.eq(card.resourceCount);
  });
});
