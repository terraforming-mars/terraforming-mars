import {expect} from 'chai';
import {TestPlayers} from '../TestPlayers';
import {Luna} from '../../src/colonies/Luna';
import {Game} from '../../src/Game';
import {TestingUtils} from '../TestingUtils';
import {TestPlayer} from '../TestPlayer';
import {ColonyDealer} from '../../src/colonies/ColonyDealer';
import {Random} from '../../src/Random';

const gameOptions = TestingUtils.setCustomGameOptions({coloniesExtension: true});

describe('ColonyDealer', function() {
  let luna: Luna;
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;
  let player4: TestPlayer;
  let game: Game;
  let dealer: ColonyDealer;

  beforeEach(function() {
    luna = new Luna();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    player3 = TestPlayers.YELLOW.newPlayer();
    player4 = TestPlayers.GREEN.newPlayer();
    game = Game.newInstance('foobar', [player, player2, player3, player4], player, gameOptions);
    game.colonies = [luna];
  });

  it('serialize', () => {
    const dealer = new ColonyDealer();
  });
  it('Should not let players build a colony if colony tile is full', function() {
    player.megaCredits = 17;
    expect(luna.isColonyFull()).to.be.false;

    luna.addColony(player2);
    expect(luna.isColonyFull()).to.be.false;
    expect(isBuildColonyStandardProjectAvailable(player)).to.be.true;

    luna.addColony(player3);
    expect(luna.isColonyFull()).to.be.false;
    expect(isBuildColonyStandardProjectAvailable(player)).to.be.true;

    luna.addColony(player4);
    expect(luna.isColonyFull()).to.be.true;
    expect(isBuildColonyStandardProjectAvailable(player)).to.be.false;
  });

  it('Should let players trade only if they can afford it', function() {
    expect(isTradeWithColonyActionAvailable(player)).to.be.false;

    player.megaCredits = 8;
    expect(isTradeWithColonyActionAvailable(player)).to.be.false;

    player.megaCredits = 9;
    expect(isTradeWithColonyActionAvailable(player)).to.be.true;

    player.megaCredits = 0;
    player.energy = 2;
    expect(isTradeWithColonyActionAvailable(player)).to.be.false;

    player.energy = 3;
    expect(isTradeWithColonyActionAvailable(player)).to.be.true;

    player.energy = 0;
    player.titanium = 2;
    expect(isTradeWithColonyActionAvailable(player)).to.be.false;

    player.titanium = 3;
    expect(isTradeWithColonyActionAvailable(player)).to.be.true;
  });

  it('Player with Helion can trade', function() {
    expect(isTradeWithColonyActionAvailable(player)).to.be.false;

    player.megaCredits = 7;
    player.heat = 2;
    expect(isTradeWithColonyActionAvailable(player)).to.be.false;

    player.canUseHeatAsMegaCredits = true;
    expect(isTradeWithColonyActionAvailable(player)).to.be.true;
  });

  it('Should not let players trade if they have no fleet', function() {
    player.titanium = 3;

    luna.trade(player);
    expect(isTradeWithColonyActionAvailable(player)).to.be.false;
  });

  it('Should not let players trade with colonies that have already been traded with', function() {
    player.titanium = 3;
    player2.titanium = 3;

    luna.trade(player);
    expect(isTradeWithColonyActionAvailable(player2)).to.be.false;
  });

  it('colonies dealt by player count', () => {
    const rng = new Random(1);
    expect(new ColonyDealer(rng).drawColonies(1, undefined, false, false, false)).has.length(4);
    expect(new ColonyDealer(rng).drawColonies(2, undefined, false, false, false)).has.length(5);
    expect(new ColonyDealer(rng).drawColonies(3, undefined, false, false, false)).has.length(5);
    expect(new ColonyDealer(rng).drawColonies(4, undefined, false, false, false)).has.length(6);
    expect(new ColonyDealer(rng).drawColonies(5, undefined, false, false, false)).has.length(7);
  });
});
