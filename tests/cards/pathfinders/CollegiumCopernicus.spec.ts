import {expect} from 'chai';
import {CollegiumCopernicus} from '../../../src/cards/pathfinders/CollegiumCopernicus';
import {Luna} from '../../../src/colonies/Luna';
import {Triton} from '../../../src/colonies/Triton';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {SelectColony} from '../../../src/inputs/SelectColony';
import {AndOptions} from '../../../src/inputs/AndOptions';
import {cast, fakeCard, runAllActions} from '../../TestingUtils';
import {newTestGame, getTestPlayer} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {Enceladus} from '../../../src/colonies/Enceladus';
import {Europa} from '../../../src/colonies/Europa';
import {Io} from '../../../src/colonies/Io';
import {Pluto} from '../../../src/colonies/Pluto';
import {LunarObservationPost} from '../../../src/cards/moon/LunarObservationPost';
import {Tags} from '../../../src/common/cards/Tags';
import {SelectCard} from '../../../src/inputs/SelectCard';

describe('CollegiumCopernicus', function() {
  let card: CollegiumCopernicus;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new CollegiumCopernicus();
    game = newTestGame(2, {coloniesExtension: true, pathfindersExpansion: true});
    player = getTestPlayer(game, 0);
    player.setCorporationForTest(card);
    // Looks as though when Enceladus is first, the test fails. So removing flakiness by defining colonies.
    game.colonies = [
      new Europa(),
      new Enceladus(),
      new Io(),
      new Luna(),
      new Pluto(),
    ];
  });

  it('canAct', () => {
    card.resourceCount = 2;
    game.colonies.forEach((colony) => colony.visitor = player.id);
    expect(card.canAct(player)).is.false;
    // xcolonies (5) ['Callisto', 'Enceladus', 'Europa', 'Io', 'Titan']

    card.resourceCount = 2;
    game.colonies[0].visitor = undefined;
    expect(card.canAct(player)).is.false;

    card.resourceCount = 3;
    game.colonies[0].visitor = player.id;
    expect(card.canAct(player)).is.false;

    card.resourceCount = 3;
    game.colonies[0].visitor = undefined;
    expect(card.canAct(player)).is.true;
  });

  it('action with multiple coloniess available', function() {
    game.colonies = [new Luna(), new Triton()];
    card.resourceCount = 10;

    card.action(player);
    const selectColony = game.deferredActions.peek()!.execute() as SelectColony;
    selectColony.cb(selectColony.colonies[0]);
    expect(card.resourceCount).to.eq(7);
    expect(player.megaCredits).to.eq(2);
  });


  it('is available through standard trade action', () => {
    const luna = new Luna();
    player.game.colonies = [luna];

    const getTradeAction = () => player.getActions().options.find(
      (option) => option.title === 'Trade with a colony tile');

    expect(getTradeAction()).is.undefined;

    card.resourceCount = 2;

    expect(getTradeAction()).is.undefined;

    card.resourceCount = 3;

    const tradeAction = cast(getTradeAction(), AndOptions);

    const payAction = cast(tradeAction.options[0], OrOptions);
    expect(payAction.title).eq('Pay trade fee');
    expect(payAction.options).has.length(1);

    const dataOption = payAction.options[0];
    expect(dataOption.title).to.match(/Pay 3 Data/);

    expect(player.megaCredits).eq(0);

    dataOption.cb();
    tradeAction.options[1].cb(luna);

    expect(card.resourceCount).eq(0);
    expect(player.megaCredits).eq(2);
  });

  it('play', function() {
    expect(card.resourceCount).eq(0);
    card.play(player);
    runAllActions(game);
    expect(card.resourceCount).eq(1);
  });

  it('onCardPlayed', () => {
    const lunarObservationPost = new LunarObservationPost();
    player.playedCards = [lunarObservationPost];

    card.onCardPlayed(player, fakeCard({tags: [Tags.SCIENCE]}));
    runAllActions(game);
    const selectCard = cast(player.getWaitingFor(), SelectCard);

    expect(selectCard.cards).has.members([card, lunarObservationPost]);
    expect(lunarObservationPost.resourceCount).eq(0);
    expect(card.resourceCount).eq(0);

    selectCard.cb([lunarObservationPost]);

    expect(lunarObservationPost.resourceCount).eq(1);
    expect(card.resourceCount).eq(0);
  });

  it('initialAction', function() {
    expect(player.cardsInHand).is.empty;
    card.initialAction(player);
    expect(player.cardsInHand).has.length(2);
    expect(player.cardsInHand.filter((card) => card.tags.includes(Tags.SCIENCE))).has.length(2);
  });
});
