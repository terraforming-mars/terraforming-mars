import {TestPlayers} from '../TestPlayers';
import {expect} from 'chai';
import {Luna} from '../../src/colonies/Luna';
import {Player} from '../../src/Player';
import {Game} from '../../src/Game';
import {OrOptions} from '../../src/inputs/OrOptions';
import {AndOptions} from '../../src/inputs/AndOptions';
import {SelectColony} from '../../src/inputs/SelectColony';
import {SelectCard} from '../../src/inputs/SelectCard';
import {TestingUtils} from '../TestingUtils';
import {TestPlayer} from '../TestPlayer';
import {CardName} from '../../src/common/cards/CardName';
import {Pallas} from '../../src/cards/community/Pallas';
import {Io} from '../../src/colonies/Io';
import {Europa} from '../../src/colonies/Europa';
import {ColonyName} from '../../src/common/colonies/ColonyName';
import {Colony} from '../../src/colonies/Colony';
import {ColonyDealer} from '@/colonies/ColonyDealer';

const gameOptions = TestingUtils.setCustomGameOptions({coloniesExtension: true});

function isBuildColonyStandardProjectAvailable(player: TestPlayer) {
  const options = TestingUtils.cast(player.getStandardProjectOption(), SelectCard);
  const colonyOptionIdx = options.cards.findIndex((card) => card.name === CardName.BUILD_COLONY_STANDARD_PROJECT);
  return options.enabled![colonyOptionIdx];
}

function isTradeWithColonyActionAvailable(player: Player) {
  let tradeWithColonyIsAvailable = false;
  player.takeAction();
  const actions = TestingUtils.cast(player.getWaitingFor(), OrOptions);
  actions.options.forEach((option) => {
    if (option instanceof AndOptions && option.options.slice(-1)[0] instanceof SelectColony) {
      tradeWithColonyIsAvailable = true;
    }
  });
  return tradeWithColonyIsAvailable;
}

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

  it('serializing and deserializing', () => {
    const io = new Io();
    io.isActive = true;
    io.colonies = ['p1', 'p2', 'p3'];
    io.trackPosition = 3;
    io.visitor = 'p4';

    const pallas = new Pallas();
    pallas.isActive = true;

    const europa = new Europa();
    europa.isActive = false;

    const json = [io, pallas, europa].map((c) => c.serialize());
    const colonies = Colony.deserializeColonies(json);

    expect(colonies[0].name).eq(ColonyName.IO);
    expect(colonies[0].isActive).is.true;
    expect(colonies[0].colonies).deep.eq(['p1', 'p2', 'p3']);
    expect(colonies[0].trackPosition).eq(3);
    expect(colonies[0].visitor).eq('p4');

    expect(colonies[1].name).eq(ColonyName.PALLAS);
    expect(colonies[1].isActive).is.true;
    expect(colonies[1].colonies).is.empty;
    expect(colonies[1].trackPosition).eq(1);
    expect(colonies[1].visitor).is.undefined;

    expect(colonies[2].name).eq(ColonyName.EUROPA);
    expect(colonies[2].isActive).is.false;
    expect(colonies[2].colonies).is.empty;
    expect(colonies[2].trackPosition).eq(1);
    expect(colonies[2].visitor).is.undefined;
  });
});
