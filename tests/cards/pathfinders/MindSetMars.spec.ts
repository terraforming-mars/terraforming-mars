import {expect} from 'chai';
import {MindSetMars} from '../../../src/cards/pathfinders/MindSetMars';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {CardName} from '../../../src/common/cards/CardName';
import {TestingUtils} from '../../TestingUtils';
import {Tags} from '../../../src/common/cards/Tags';
import {Turmoil} from '../../../src/turmoil/Turmoil';
import {SelectOption} from '../../../src/inputs/SelectOption';
import {assertPlaceCityTile, assertSendDelegateToArea} from './assertions';
import {OrOptions} from '../../../src/inputs/OrOptions';

describe('MindSetMars', function() {
  let card: MindSetMars;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;
  let turmoil: Turmoil;

  beforeEach(function() {
    card = new MindSetMars();
    game = newTestGame(2, {turmoilExtension: true});
    player = getTestPlayer(game, 0);
    player2 = getTestPlayer(game, 1);
    player.corporationCard = card;
    turmoil = game.turmoil!;
  });

  it('play', function() {
    expect(card.resourceCount).eq(0);
    card.play();
    expect(card.resourceCount).eq(1);
  });

  it('when you play a jovian tag', function() {
    const a = TestingUtils.fakeCard({name: 'A' as CardName, tags: [Tags.BUILDING]});
    expect(card.resourceCount).eq(0);
    player.playCard(a);
    expect(card.resourceCount).eq(1);
  });

  it('when opponent plays a building tag', function() {
    const a = TestingUtils.fakeCard({name: 'A' as CardName, tags: [Tags.BUILDING]});
    expect(card.resourceCount).eq(0);
    player2.playCard(a);
    expect(card.resourceCount).eq(0);
  });

  it('available actions', () => {
    card.resourceCount = 1;
    expect(card.canAct(player)).is.false;
    card.resourceCount = 2;
    expect(card.canAct(player)).is.true;
  });


  it('play delegates', () => {
    card.resourceCount = 3;

    turmoil.delegateReserve = [];
    card.action(player);
    expect(game.deferredActions.length).eq(0);

    turmoil.delegateReserve = [player.id, player.id, player.id];
    TestingUtils.cast(card.action(player), SelectOption).cb();
    expect(game.deferredActions.length).eq(1);
    assertSendDelegateToArea(player, game.deferredActions.pop()!);
    expect(card.resourceCount).eq(1);
  });

  it('play city', () => {
    card.resourceCount = 7;

    turmoil.delegateReserve = [];
    TestingUtils.cast(card.action(player), SelectOption).cb();
    expect(game.deferredActions.length).eq(1);
    assertPlaceCityTile(player, game.deferredActions.pop()!);
    expect(card.resourceCount).eq(2);
  });

  it('both are available, place delegates', () => {
    card.resourceCount = 7;

    turmoil.delegateReserve = [player.id, player.id, player.id];
    const options = TestingUtils.cast(card.action(player), OrOptions);
    expect(options.options).has.length(2);

    // First option places delegates
    options.options[0].cb();

    expect(game.deferredActions.length).eq(1);
    assertSendDelegateToArea(player, game.deferredActions.pop()!);
    expect(card.resourceCount).eq(5);
  });

  it('both are available, place a city', () => {
    card.resourceCount = 7;

    turmoil.delegateReserve = [player.id, player.id, player.id];
    const options = TestingUtils.cast(card.action(player), OrOptions);
    expect(options.options).has.length(2);

    // Second option places a city
    options.options[1].cb();

    expect(game.deferredActions.length).eq(1);
    assertPlaceCityTile(player, game.deferredActions.pop()!);
    expect(card.resourceCount).eq(2);
  });
});
