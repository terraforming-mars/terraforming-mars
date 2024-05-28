import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {forceGenerationEnd} from '../../TestingUtils';

import {Yvonne} from '../../../src/server/cards/ceos/Yvonne';
import {Callisto} from '../../../src/server/colonies/Callisto';
import {Ceres} from '../../../src/server/colonies/Ceres';
import {Triton} from '../../../src/server/colonies/Triton';


describe('Yvonne', function() {
  let card: Yvonne;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Yvonne();
    [game, player, player2] = testGame(2, {ceoExtension: true, coloniesExtension: true});

    // Setup some colonies that can be built independently of cards
    const callisto = new Callisto(); // 3 Energy
    const ceres = new Ceres(); // 2 Steel
    const triton = new Triton(); // 1 Titanium

    game.colonies = [callisto, ceres, triton];
    callisto.addColony(player);
    ceres.addColony(player);
    triton.addColony(player);
    callisto.addColony(player2);
    ceres.addColony(player2);
    triton.addColony(player2);

    player.energy = 0;
    player.steel = 0;
    player.titanium = 0;
    player2.energy = 0;
    player2.steel = 0;
    player2.titanium = 0;
  });

  it('Can act', function() {
    expect(card.canAct(player)).is.true;
  });

  it('Takes action', function() {
    // Sanity check before OPG
    expect(player2.energy).eq(0);
    expect(player2.steel).eq(0);
    expect(player2.titanium).eq(0);
    card.action(player);
    game.deferredActions.runAll(() => { });
    expect(player.energy).eq(6);
    expect(player.steel).eq(4);
    expect(player.titanium).eq(2);
  });

  it('Opponents dont get the bonuses', function() {
    // Sanity check before OPG
    expect(player2.energy).eq(0);
    expect(player2.steel).eq(0);
    expect(player2.titanium).eq(0);
    card.action(player);
    game.deferredActions.runAll(() => { });
    expect(player2.energy).eq(0);
    expect(player2.steel).eq(0);
    expect(player2.titanium).eq(0);
  });

  it('Can only act once per game', function() {
    card.action(player);
    game.deferredActions.runAll(() => { });
    forceGenerationEnd(game);

    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });
});
