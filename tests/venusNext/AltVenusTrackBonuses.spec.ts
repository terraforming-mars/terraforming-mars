// An oddly-named source file, this is just for venus board resourcees,
// including the altVenusBoard

import {expect} from 'chai';
import {IGame} from '../../src/server/IGame';
import {cast, setVenusScaleLevel} from '../TestingUtils';
import {TestPlayer} from '../TestPlayer';
import {GrantVenusAltTrackBonusDeferred} from '../../src/server/venusNext/GrantVenusAltTrackBonusDeferred';
import {testGame} from '../TestGame';

describe('AltVenusTrackBonuses', function() {
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    [game, player] = testGame(1, {altVenusBoard: true});
  });

  function getAction(game: IGame) {
    const deferred = cast(game.deferredActions.pop(), GrantVenusAltTrackBonusDeferred);
    return {standardResourceCount: deferred.standardResourceCount, wildResource: deferred.wildResource};
  }

  it('14-16 grants no standard resource.', () => {
    setVenusScaleLevel(game, 14);
    game.increaseVenusScaleLevel(player, 1);
    expect(game.deferredActions.pop()).is.undefined;
  });

  it('16-18 grants standard resource.', () => {
    setVenusScaleLevel(game, 16);
    game.increaseVenusScaleLevel(player, 1);
    expect(getAction(game)).to.deep.eq({standardResourceCount: 1, wildResource: false});
  });

  it('Going from 12-18 grants 1 standard resource.', () => {
    setVenusScaleLevel(game, 12);
    game.increaseVenusScaleLevel(player, 3);
    expect(getAction(game)).to.deep.eq({standardResourceCount: 1, wildResource: false});
  });

  it('Going from 14-20 grants 2 standard resources.', () => {
    setVenusScaleLevel(game, 14);
    game.increaseVenusScaleLevel(player, 3);
    expect(getAction(game)).to.deep.eq({standardResourceCount: 2, wildResource: false});
  });


  it('Going from 16-22 grants 3 standard resources.', () => {
    setVenusScaleLevel(game, 16);
    game.increaseVenusScaleLevel(player, 3);
    expect(getAction(game)).to.deep.eq({standardResourceCount: 3, wildResource: false});
  });


  it('Going from 24-30 grants 3 standard and 1 wild resources.', () => {
    setVenusScaleLevel(game, 24);
    game.increaseVenusScaleLevel(player, 3);
    expect(getAction(game)).to.deep.eq({standardResourceCount: 3, wildResource: true});
  });

  it('Going from 30-28 does not gain any resources', () => {
    setVenusScaleLevel(game, 30);
    game.increaseVenusScaleLevel(player, -1);
    expect(game.deferredActions.pop()).is.undefined;
  });
});
