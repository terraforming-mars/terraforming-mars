import {expect} from 'chai';
import {Yvonne} from '../../../src/server/cards/leaders/Yvonne';
import {Callisto} from '../../../src/server/colonies/Callisto';
import {Ceres} from '../../../src/server/colonies/Ceres';
import {Triton} from '../../../src/server/colonies/Triton';
import {Game} from '../../../src/server/Game';
import {forceGenerationEnd, setCustomGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';


describe('Yvonne', function() {
  let card: Yvonne;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Yvonne();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    const gameOptions = setCustomGameOptions({coloniesExtension: true});
    game = Game.newInstance('gameid', [player, player2], player, gameOptions);

    // Setup some colonies that can be built independently of cards
    const callisto = new Callisto();
    const ceres = new Ceres();
    const triton = new Triton();

    game.colonies = [callisto, ceres, triton];
    callisto.addColony(player);
    ceres.addColony(player);
    triton.addColony(player);
  });

  it('Can act', function() {
    expect(card.canAct(player)).is.true;
  });

  it('Takes action', function() {
    card.action(player);
    expect(game.deferredActions).has.length(1);

    game.deferredActions.runAll(() => { });
    expect(player.steel).eq(4);
    expect(player.energy).eq(6);
    expect(player.titanium).eq(5); // 3 from placement + 2 from OPG action
  });

  it('Can only act once per game', function() {
    card.action(player);
    game.deferredActions.runAll(() => { });
    forceGenerationEnd(game);

    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });
});
