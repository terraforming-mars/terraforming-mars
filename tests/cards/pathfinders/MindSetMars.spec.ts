import {expect} from 'chai';
import {MindSetMars} from '../../../src/server/cards/pathfinders/MindSetMars';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {CardName} from '../../../src/common/cards/CardName';
import {cast, fakeCard, runAllActions} from '../../TestingUtils';
import {Tag} from '../../../src/common/cards/Tag';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {SelectOption} from '../../../src/server/inputs/SelectOption';
import {assertPlaceCityTile, assertSendDelegateToArea} from './assertions';
import {OrOptions} from '../../../src/server/inputs/OrOptions';

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
    player.setCorporationForTest(card);
    turmoil = game.turmoil!;
  });

  it('play', function() {
    expect(card.resourceCount).eq(0);
    card.play(player);
    runAllActions(game);
    expect(card.resourceCount).eq(1);
  });

  it('when you play a jovian tag', function() {
    const a = fakeCard({name: 'A' as CardName, tags: [Tag.BUILDING]});
    expect(card.resourceCount).eq(0);
    player.playCard(a);
    expect(card.resourceCount).eq(1);
  });

  it('when opponent plays a building tag', function() {
    const a = fakeCard({name: 'A' as CardName, tags: [Tag.BUILDING]});
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
    cast(card.action(player), SelectOption).cb();
    expect(game.deferredActions.length).eq(1);
    assertSendDelegateToArea(player, game.deferredActions.pop()!);
    expect(card.resourceCount).eq(1);
  });

  it('play city', () => {
    card.resourceCount = 7;

    turmoil.delegateReserve = [];
    cast(card.action(player), SelectOption).cb();
    expect(game.deferredActions.length).eq(1);
    assertPlaceCityTile(player, game.deferredActions.pop()!);
    expect(card.resourceCount).eq(2);
  });

  it('both are available, place delegates', () => {
    card.resourceCount = 7;

    turmoil.delegateReserve = [player.id, player.id, player.id];
    const options = cast(card.action(player), OrOptions);
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
    const options = cast(card.action(player), OrOptions);
    expect(options.options).has.length(2);

    // Second option places a city
    options.options[1].cb();

    expect(game.deferredActions.length).eq(1);
    assertPlaceCityTile(player, game.deferredActions.pop()!);
    expect(card.resourceCount).eq(2);
  });
});
