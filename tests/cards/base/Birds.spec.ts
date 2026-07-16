import {expect} from 'chai';
import {Birds} from '../../../src/server/cards/base/Birds';
import {IGame} from '../../../src/server/IGame';
import {Resource} from '../../../src/common/Resource';
import {SelectPlayer} from '../../../src/server/inputs/SelectPlayer';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions, setOxygenLevel} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('Birds', () => {
  let card: Birds;
  let game: IGame;
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;

  beforeEach(() => {
    card = new Birds();
    [game, player, player2, player3] = testGame(3);
  });

  it('Cannot play without oxygen', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    player2.production.add(Resource.PLANTS, 2);
    player3.production.add(Resource.PLANTS, 7);
    setOxygenLevel(game, 13);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(game.deferredActions).has.lengthOf(1);
    const selectPlayer = cast(game.deferredActions.peek()!.execute(), SelectPlayer);
    selectPlayer.cb(player2);

    expect(player2.production.plants).to.eq(0);
    expect(player3.production.plants).to.eq(7);
  });

  it('Should act', () => {
    card.action(player);
    runAllActions(player.game);
    expect(card.resourceCount).to.eq(1);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
