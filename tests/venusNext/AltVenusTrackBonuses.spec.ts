// An oddly-named source file, this is just for venus board resourcees,
// including the altVenusBoard

import {expect} from 'chai';
import {Player} from '../../src/Player';
import {Game} from '../../src/Game';
import {TestingUtils} from '../TestingUtils';
import {TestPlayers} from '../TestPlayers';
import {GrantVenusAltTrackBonusDeferred} from '../../src/venusNext/GrantVenusAltTrackBonusDeferred';

describe('AltVenusTrackBonuses', function() {
  let player: Player;
  let game: Game;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('x', [player], player, TestingUtils.setCustomGameOptions({altVenusBoard: true}));
  });

  function getAction(game: Game) {
    const action = game.deferredActions.pop();
    expect(action).is.instanceOf(GrantVenusAltTrackBonusDeferred);
    const deferred = action as GrantVenusAltTrackBonusDeferred;
    return {standardResourceCount: deferred.standardResourceCount, wildResource: deferred.wildResource};
  }

  it('14-16 grants no standard resource.', () => {
    (game as any).venusScaleLevel = 14;
    game.increaseVenusScaleLevel(player, 1);
    expect(game.deferredActions.pop()).is.undefined;
  });

  it('16-18 grants standard resource.', () => {
    (game as any).venusScaleLevel = 16;
    game.increaseVenusScaleLevel(player, 1);
    expect(getAction(game)).to.deep.eq({standardResourceCount: 1, wildResource: false});
  });

  it('Going from 12-18 grants 1 standard resource.', () => {
    (game as any).venusScaleLevel = 12;
    game.increaseVenusScaleLevel(player, 3);
    expect(getAction(game)).to.deep.eq({standardResourceCount: 1, wildResource: false});
  });

  it('Going from 14-20 grants 2 standard resources.', () => {
    (game as any).venusScaleLevel = 14;
    game.increaseVenusScaleLevel(player, 3);
    expect(getAction(game)).to.deep.eq({standardResourceCount: 2, wildResource: false});
  });


  it('Going from 16-22 grants 3 standard resources.', () => {
    (game as any).venusScaleLevel = 16;
    game.increaseVenusScaleLevel(player, 3);
    expect(getAction(game)).to.deep.eq({standardResourceCount: 3, wildResource: false});
  });


  it('Going from 24-30 grants 3 standard and 1 wild resources.', () => {
    (game as any).venusScaleLevel = 24;
    game.increaseVenusScaleLevel(player, 3);
    expect(getAction(game)).to.deep.eq({standardResourceCount: 3, wildResource: true});
  });

  it('Going from 30-28 does not gain any resources', () => {
    (game as any).venusScaleLevel = 30;
    game.increaseVenusScaleLevel(player, -1);
    expect(game.deferredActions.pop()).is.undefined;
  });
});
