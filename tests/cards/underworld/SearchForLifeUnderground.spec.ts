import {expect} from 'chai';
import {SearchforLifeUnderground} from '../../../src/server/cards/underworld/SearchforLifeUnderground';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions, setOxygenLevel, setTemperature} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {UnderworldExpansion} from '../../../src/server/underworld/UnderworldExpansion';

describe('SearchForLifeUnderground', () => {
  let card: SearchforLifeUnderground;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new SearchforLifeUnderground();
    [game, player] = testGame(2, {underworldExpansion: true});
  });

  it('Can not act if no MC', () => {
    player.megaCredits = 0;
    expect(card.canAct(player)).is.not.true;
    player.megaCredits = 1;
    expect(card.canAct(player)).is.true;
  });

  it('Can not play if temperature too high', () => {
    setTemperature(game, -18);
    expect(card.canPlay(player)).is.true;
    setTemperature(game, -16);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    setOxygenLevel(game, 6);
    expect(card.canPlay(player)).is.true;
    player.playedCards.push(card);
    card.play(player);

    expect(card.getVictoryPoints()).to.eq(0);
    player.addResourceTo(card);
    expect(card.getVictoryPoints()).to.eq(3);
  });

  it('action fails, no microbes', () => {
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

  it('action succeeds', () => {
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

  it('No places on the map to identify, draws from pile', () => {
    player.playedCards.push(card);
    player.megaCredits = 1;
    // Spaces can be identified if they don't have a tile or an identification marker.
    // This uses an identification marker.
    for (const space of UnderworldExpansion.identifiableSpaces(player)) {
      space.excavator = player;
    }

    expect(UnderworldExpansion.identifiableSpaces(player)).is.empty;
    expect(card.canAct(player)).is.true;

    game.underworldData.tokens.push('microbe1');
    const size = game.underworldData.tokens.length;
    card.action(player);
    runAllActions(game); // pays for card.
    cast(player.popWaitingFor(), undefined);

    expect(player.megaCredits).to.eq(0);
    expect(card.resourceCount).eq(1);
    // Token goes back into the supply.
    expect(game.underworldData.tokens).to.have.length(size);
  });

  it('Spaces identifiable, but no tokens are available', () => {
    player.playedCards.push(card);
    player.megaCredits = 1;
    game.underworldData.tokens.length = 0;

    expect(card.canAct(player)).is.false;
  });

  it('No places on the map to identify, nothing in the pile', () => {
    player.playedCards.push(card);
    player.megaCredits = 1;
    // Spaces can be identified if they don't have a tile or an identification marker.
    // This uses an identification marker.
    for (const space of UnderworldExpansion.identifiableSpaces(player)) {
      space.excavator = player;
    }
    game.underworldData.tokens.length = 0;

    expect(UnderworldExpansion.identifiableSpaces(player)).is.empty;
    expect(card.canAct(player)).is.false;
  });
});
