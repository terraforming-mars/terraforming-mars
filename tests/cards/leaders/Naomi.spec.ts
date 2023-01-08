import {expect} from 'chai';
import {MAX_COLONY_TRACK_POSITION} from '../../../src/common/constants';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {forceGenerationEnd, setCustomGameOptions} from '../../TestingUtils';

import {Naomi} from '../../../src/server/cards/leaders/Naomi';
import {Callisto} from '../../../src/server/colonies/Callisto';
import {Ceres} from '../../../src/server/colonies/Ceres';


describe('Naomi', function() {
  let card: Naomi;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Naomi();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    const gameOptions = setCustomGameOptions({coloniesExtension: true});
    game = Game.newInstance('gameid', [player, player2], player, gameOptions);

    // Setup some colonies that can be built independently of cards
    game.colonies = [new Callisto(), new Ceres()];
  });

  it('Gains 2 energy and 2 M€ when building a colony', function() {
    player.playedCards.push(card);
    game.colonies[0].addColony(player);
    expect(player.energy).to.eq(2);
    expect(player.megaCredits).to.eq(2);
  });

  it('Can act', function() {
    expect(card.canAct(player)).is.true;
  });

  it('Takes action', function() {
    card.action(player);
    expect(game.deferredActions).has.length(3);

    const firstColony = game.deferredActions.pop()!.execute() as OrOptions;
    firstColony.options[0].cb();
    const secondColony = game.deferredActions.pop()!.execute() as OrOptions;
    secondColony.options[1].cb();

    expect(game.colonies[0].trackPosition).eq(MAX_COLONY_TRACK_POSITION);
    expect(game.colonies[game.colonies.length - 1].trackPosition).eq(0);
  });

  it('Can only act once per game', function() {
    card.action(player);

    const firstColony = game.deferredActions.pop()!.execute() as OrOptions;
    firstColony.options[0].cb();
    const secondColony = game.deferredActions.pop()!.execute() as OrOptions;
    secondColony.options[1].cb();

    game.deferredActions.runAll(() => { });
    forceGenerationEnd(game);

    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });
});
