import {TestPlayers} from '../TestPlayers';
import {expect} from 'chai';
import {IColony} from '../../src/colonies/IColony';
import {Pluto} from '../../src/colonies/Pluto';
import {DustSeals} from '../../src/cards/base/DustSeals';
import {Player} from '../../src/Player';
import {Game} from '../../src/Game';
import {Resources} from '../../src/common/Resources';
import {OrOptions} from '../../src/inputs/OrOptions';
import {AndOptions} from '../../src/inputs/AndOptions';
import {SelectColony} from '../../src/inputs/SelectColony';
import {SelectCard} from '../../src/inputs/SelectCard';
import {IProjectCard} from '../../src/cards/IProjectCard';
import {MAX_COLONY_TRACK_POSITION} from '../../src/common/constants';
import {TestingUtils} from '../TestingUtils';
import {TestPlayer} from '../TestPlayer';
import {CardName} from '../../src/common/cards/CardName';
import {Pallas} from '../../src/cards/community/Pallas';
import {Io} from '../../src/colonies/Io';
import {Europa} from '../../src/colonies/Europa';
import {ColonyName} from '../../src/common/colonies/ColonyName';
import {ColonyDeserializer} from '../../src/colonies/ColonyDeserializer';

function isBuildColonyStandardProjectAvailable(player: TestPlayer) {
  const options = TestingUtils.cast(player.getStandardProjectOption(), SelectCard);
  const colonyOptionIdx = options.cards.findIndex((card) => card.name === CardName.BUILD_COLONY_STANDARD_PROJECT);
  return options.config.enabled![colonyOptionIdx];
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


describe('Colony', function() {
  let luna: IColony;
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;
  let player4: TestPlayer;
  let game: Game;

  beforeEach(function() {
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    player3 = TestPlayers.YELLOW.newPlayer();
    player4 = TestPlayers.GREEN.newPlayer();
    const gameOptions = TestingUtils.setCustomGameOptions({
      coloniesExtension: true,
      customColoniesList: [
        ColonyName.LUNA,
        ColonyName.PLUTO,
        ColonyName.IAPETUS,
        ColonyName.IO,
        ColonyName.EUROPA,
        ColonyName.CALLISTO,
      ],
    });
    game = Game.newInstance('foobar', [player, player2, player3, player4], player, gameOptions, /* seed */ .1);
    luna = game.colonies.find((c) => c.name === ColonyName.LUNA)!;
  });

  it('Should build and give placement bonus', function() {
    expect(luna.colonies).has.lengthOf(0);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(0);

    luna.addColony(player);
    expect(luna.colonies).has.lengthOf(1);
    expect(luna.colonies[0]).to.eq(player.id);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);

    luna.addColony(player2);
    expect(luna.colonies).has.lengthOf(2);
    expect(luna.colonies[1]).to.eq(player2.id);
    expect(player2.getProduction(Resources.MEGACREDITS)).to.eq(2);

    luna.addColony(player3);
    expect(luna.colonies).has.lengthOf(3);
    expect(luna.colonies[2]).to.eq(player3.id);
    expect(player3.getProduction(Resources.MEGACREDITS)).to.eq(2);
  });

  it('Should start with a trackPosition at 1', function() {
    expect(game.colonies).has.length(6);
    game.colonies.forEach((colony) => {
      expect(colony.trackPosition).to.eq(1);
    });
  });

  it('Should increase by 1 at the end of a generation', function() {
    expect(game.colonies).has.length(6);
    game.colonies.forEach((colony) => {
      colony.endGeneration(game);
      if (colony.isActive) {
        expect(colony.trackPosition).to.eq(2);
      } else {
        expect(colony.trackPosition).to.eq(1);
      }
    });
  });

  it('Should push the trackPosition if a colony is built on it', function() {
    expect(luna.trackPosition).to.eq(1);
    luna.addColony(player);
    expect(luna.trackPosition).to.eq(1);
    luna.addColony(player2);
    expect(luna.trackPosition).to.eq(2);
    luna.addColony(player3);
    expect(luna.trackPosition).to.eq(3);
  });

  it('Should decrease trackPosition after trade', function() {
    luna.trackPosition = MAX_COLONY_TRACK_POSITION;
    luna.trade(player);
    TestingUtils.runAllActions(game);
    expect(luna.trackPosition).to.eq(0);

    luna.addColony(player);
    luna.addColony(player2);
    luna.trackPosition = MAX_COLONY_TRACK_POSITION;
    luna.trade(player);
    TestingUtils.runAllActions(game);
    expect(luna.trackPosition).to.eq(2);
  });

  it('decreaseTrackAfterTrade', function() {
    luna.trackPosition = MAX_COLONY_TRACK_POSITION;
    luna.trade(player);
    TestingUtils.runAllActions(game);
    expect(luna.trackPosition).to.eq(0);

    luna.addColony(player);
    luna.addColony(player2);
    luna.trackPosition = MAX_COLONY_TRACK_POSITION;

    luna.trade(player, {decreaseTrackAfterTrade: false});
    TestingUtils.runAllActions(game);
    expect(luna.trackPosition).to.eq(MAX_COLONY_TRACK_POSITION);

    luna.trade(player, {decreaseTrackAfterTrade: true});
    TestingUtils.runAllActions(game);
    expect(luna.trackPosition).to.eq(2);
  });

  it('Should not increase trackPosition above max', function() {
    luna.increaseTrack(100);
    expect(luna.trackPosition).to.eq(MAX_COLONY_TRACK_POSITION);
  });

  it('Should not decrease trackPosition below 0', function() {
    luna.decreaseTrack(100);
    expect(luna.trackPosition).to.eq(0);
  });

  it('Should trade', function() {
    // TODO (Lynesth): Do this better with next colony refactor PR
    const income = [1, 2, 4, 7, 10, 13, 17];
    for (let i = 0; i <= MAX_COLONY_TRACK_POSITION; i++) {
      player.megaCredits = 0;
      luna.trackPosition = i;
      luna.trade(player);
      TestingUtils.runAllActions(game);
      expect(player.megaCredits).to.eq(income[i]);
    }
  });

  it('Should give trade bonus to players with colonies only', function() {
    // No colonies
    luna.trackPosition = 3; // 7 MC
    luna.trade(player);
    TestingUtils.runAllActions(game);
    expect(player.megaCredits).to.eq(7);
    expect(player2.megaCredits).to.eq(0);
    expect(player3.megaCredits).to.eq(0);
    expect(player4.megaCredits).to.eq(0);

    // 1 colony
    player.megaCredits = 0;
    luna.trackPosition = 3; // 7 MC
    luna.addColony(player);
    luna.trade(player);
    TestingUtils.runAllActions(game);
    expect(player.megaCredits).to.eq(9);
    expect(player2.megaCredits).to.eq(0);
    expect(player3.megaCredits).to.eq(0);
    expect(player4.megaCredits).to.eq(0);

    // 2 colonies
    player.megaCredits = 0;
    luna.trackPosition = 3; // 7 MC
    luna.addColony(player2);
    luna.trade(player2);
    TestingUtils.runAllActions(game);
    expect(player.megaCredits).to.eq(2);
    expect(player2.megaCredits).to.eq(9);
    expect(player3.megaCredits).to.eq(0);
    expect(player4.megaCredits).to.eq(0);

    // 3 colonies
    player.megaCredits = 0;
    player2.megaCredits = 0;
    luna.trackPosition = 3; // 7 MC
    luna.addColony(player3);
    luna.trade(player4);
    TestingUtils.runAllActions(game);
    expect(player.megaCredits).to.eq(2);
    expect(player2.megaCredits).to.eq(2);
    expect(player3.megaCredits).to.eq(2);
    expect(player4.megaCredits).to.eq(7);
  });

  it('Should give trade bonus for each colony a player has', function() {
    luna.trackPosition = 3; // 7 MC
    luna.addColony(player);
    luna.addColony(player);
    luna.addColony(player);

    luna.trade(player2);
    TestingUtils.runAllActions(game);
    expect(player.megaCredits).to.eq(6);
    expect(player2.megaCredits).to.eq(7);
    expect(player3.megaCredits).to.eq(0);
    expect(player4.megaCredits).to.eq(0);
  });

  it('Should let player build a colony only if they can afford it', function() {
    expect(isBuildColonyStandardProjectAvailable(player)).to.be.false;

    player.megaCredits = 17;
    expect(isBuildColonyStandardProjectAvailable(player)).to.be.true;
  });

  it('Should not let players build a colony if they already have one', function() {
    game.colonies = [luna]; // Only a single colony in this test to show that building a second colony on a tile isn't possible.
    player.megaCredits = 17;

    luna.addColony(player2);
    expect(isBuildColonyStandardProjectAvailable(player)).to.be.true;

    luna.addColony(player);
    expect(isBuildColonyStandardProjectAvailable(player)).to.be.false;
  });

  it('Should not let players build a colony if colony tile is full', function() {
    game.colonies = [luna]; // Only a single colony in this test to show that building on a full tile isn't possible.
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
    game.colonies = [luna]; // Only a single colony in this test to show that retrading on a colony isn't possible.

    player.titanium = 3;
    player2.titanium = 3;

    luna.trade(player);
    expect(isTradeWithColonyActionAvailable(player2)).to.be.false;
  });

  it('Testing GiveTradeBonus Deferred Action', function() {
    const card = new DustSeals();
    player.cardsInHand.push(card);
    player2.cardsInHand.push(card);
    player3.cardsInHand.push(card);

    const pluto = new Pluto();
    pluto.addColony(player);
    pluto.addColony(player2);
    pluto.addColony(player3);
    pluto.trade(player4);

    let callbackWasCalled = false;
    game.deferredActions.runAll(() => {
      callbackWasCalled = true;
    });
    expect(callbackWasCalled).to.be.false;

    const input = player.getWaitingFor()! as SelectCard<IProjectCard>;
    expect(input).to.be.an.instanceof(SelectCard);
    player.process([['Dust Seals']]); // Discard a card
    expect(callbackWasCalled).to.be.false;

    const input2 = player2.getWaitingFor()! as SelectCard<IProjectCard>;
    expect(input2).to.be.an.instanceof(SelectCard);
    player2.process([['Dust Seals']]); // Discard a card
    expect(callbackWasCalled).to.be.false;

    const input3 = player3.getWaitingFor()! as SelectCard<IProjectCard>;
    expect(input3).to.be.an.instanceof(SelectCard);
    player3.process([['Dust Seals']]); // Discard a card
    expect(callbackWasCalled).to.be.true;
  });

  it('usesTradeFleet', () => {
    expect(player.tradesThisGeneration).eq(0);
    luna.trade(player);
    expect(player.tradesThisGeneration).eq(1);

    luna.trade(player, {});
    expect(player.tradesThisGeneration).eq(2);

    luna.trade(player, {usesTradeFleet: false});
    expect(player.tradesThisGeneration).eq(2);

    luna.trade(player, {usesTradeFleet: true});
    expect(player.tradesThisGeneration).eq(3);
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
    const colonies = ColonyDeserializer.deserializeAndFilter(json);

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
