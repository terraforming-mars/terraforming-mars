import {expect} from 'chai';
import {MAX_COLONY_TRACK_POSITION} from '../../../src/common/constants';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {forceGenerationEnd} from '../../TestingUtils';
import {testGame} from '../../TestGame';

import {Naomi} from '../../../src/server/cards/ceos/Naomi';
import {Callisto} from '../../../src/server/colonies/Callisto';
import {Ceres} from '../../../src/server/colonies/Ceres';


describe('Naomi', function() {
  let card: Naomi;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Naomi();
    [game, player, player2] = testGame(2, {ceoExtension: true, coloniesExtension: true});
    // Setup some colonies that can be built independently of cards
    game.colonies = [new Callisto(), new Ceres()];
  });

  it('Gains 2 energy and 2 M€ when building a colony', function() {
    player.playedCards.push(card);
    expect(player.energy).to.eq(0);
    expect(player.megaCredits).to.eq(0);
    game.colonies[0].addColony(player);
    expect(player.energy).to.eq(2);
    expect(player.megaCredits).to.eq(3);
    game.colonies[1].addColony(player);
    expect(player.energy).to.eq(4);
    expect(player.megaCredits).to.eq(6);

    // Player2 here is just a sanity check, _and_ is necessary for the colony count
    game.colonies[0].addColony(player2);
    expect(player2.energy).to.eq(0);
    expect(player2.megaCredits).to.eq(0);
    game.colonies[1].addColony(player2);
    expect(player2.energy).to.eq(0);
    expect(player2.megaCredits).to.eq(0);
  });

  it('Takes action', function() {
    card.action(player);
    expect(game.deferredActions).has.length(2);

    const firstColony = game.deferredActions.pop()!.execute() as OrOptions;
    firstColony.options[0].cb();
    const secondColony = game.deferredActions.pop()!.execute() as OrOptions;
    secondColony.options[1].cb();

    expect(game.colonies[0].trackPosition).eq(MAX_COLONY_TRACK_POSITION);
    expect(game.colonies[1].trackPosition).eq(0);

    expect(card.canAct(player)).is.false;
  });

  it('Can only act once per game', function() {
    card.action(player);
    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });
});
