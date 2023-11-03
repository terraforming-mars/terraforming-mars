import {expect} from 'chai';
import {SearchforLifeUnderground} from '../../../src/server/cards/underworld/SearchforLifeUnderground';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions, setOxygenLevel, setTemperature} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';

describe('SearchForLifeUnderground', function() {
  let card: SearchforLifeUnderground;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new SearchforLifeUnderground();
    [game, player] = testGame(2, {underworldExpansion: true});
  });

  it('Can not act if no MC', function() {
    player.megaCredits = 0;
    expect(card.canAct(player)).is.not.true;
    player.megaCredits = 1;
    expect(card.canAct(player)).is.true;
  });

  it('Can not play if temperature too high', function() {
    setTemperature(game, -18);
    expect(card.canPlay(player)).is.true;
    setTemperature(game, -16);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    setOxygenLevel(game, 6);
    expect(card.canPlay(player)).is.true;
    player.playedCards.push(card);
    card.play(player);

    expect(card.getVictoryPoints()).to.eq(0);
    player.addResourceTo(card);
    expect(card.getVictoryPoints()).to.eq(3);
  });


  it('action fails, no microbes', function() {
    player.playedCards.push(card);

    player.megaCredits = 1;

    card.action(player);
    runAllActions(game); // pays for card.
    game.underworldData.tokens.push('corruption1');

    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    const space = selectSpace.spaces[0];
    selectSpace.cb(space);

    expect(player.megaCredits).to.eq(0);
    expect(card.resourceCount).eq(0);
  });

  it('action succeeds', function() {
    player.playedCards.push(card);

    player.megaCredits = 1;

    card.action(player);
    runAllActions(game); // pays for card.
    game.underworldData.tokens.push('microbe1');

    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    const space = selectSpace.spaces[0];
    selectSpace.cb(space);

    expect(player.megaCredits).to.eq(0);
    expect(card.resourceCount).eq(1);
  });
});
