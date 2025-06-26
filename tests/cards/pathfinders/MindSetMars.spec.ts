import {expect} from 'chai';
import {MindSetMars} from '../../../src/server/cards/pathfinders/MindSetMars';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {CardName} from '../../../src/common/cards/CardName';
import {cast, fakeCard, runAllActions} from '../../TestingUtils';
import {Tag} from '../../../src/common/cards/Tag';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {SelectOption} from '../../../src/server/inputs/SelectOption';
import {assertPlaceCity} from '../../assertions';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {PlaceCityTile} from '../../../src/server/deferredActions/PlaceCityTile';
import {SendDelegateToArea} from '../../../src/server/deferredActions/SendDelegateToArea';
import {assertAddDelegateAction} from '../../turmoil/turmoilAssertions';

describe('MindSetMars', () => {
  let card: MindSetMars;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;
  let turmoil: Turmoil;

  beforeEach(() => {
    card = new MindSetMars();
    [game, player, player2] = testGame(3, {turmoilExtension: true});
    player.corporations.push(card);
    turmoil = game.turmoil!;
  });

  it('play', () => {
    expect(card.resourceCount).eq(0);
    card.play(player);
    runAllActions(game);
    expect(card.resourceCount).eq(1);
  });

  it('when you play a jovian tag', () => {
    const a = fakeCard({name: 'A' as CardName, tags: [Tag.JOVIAN]});
    expect(card.resourceCount).eq(0);
    player.playCard(a);
    expect(card.resourceCount).eq(0);
  });

  it('when opponent plays a building tag', () => {
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

    turmoil.delegateReserve.clear();
    card.action(player);
    expect(game.deferredActions).has.length(0);

    turmoil.delegateReserve.clear();
    turmoil.delegateReserve.add(player, 3);
    cast(card.action(player), SelectOption).cb(undefined);
    expect(game.deferredActions).has.length(1);
    const sendDelegate = cast(game.deferredActions.pop(), SendDelegateToArea);
    assertAddDelegateAction(player, sendDelegate.execute());
    expect(card.resourceCount).eq(1);
  });

  it('play city', () => {
    card.resourceCount = 7;

    turmoil.delegateReserve.clear();
    cast(card.action(player), SelectOption).cb(undefined);
    expect(game.deferredActions).has.length(1);
    const placeCityTile = cast(game.deferredActions.pop(), PlaceCityTile);
    assertPlaceCity(player, placeCityTile.execute());

    expect(card.resourceCount).eq(2);
  });

  it('both are available, place delegates', () => {
    card.resourceCount = 7;

    turmoil.delegateReserve.add(player, 3);
    const options = cast(card.action(player), OrOptions);
    expect(options.options).has.length(2);

    // First option places delegates
    options.options[0].cb();

    expect(game.deferredActions).has.length(1);
    const sendDelegate = cast(game.deferredActions.pop(), SendDelegateToArea);
    assertAddDelegateAction(player, sendDelegate.execute());
    expect(card.resourceCount).eq(5);
  });

  it('both are available, place a city', () => {
    card.resourceCount = 7;

    turmoil.delegateReserve.add(player, 3);
    const options = cast(card.action(player), OrOptions);
    expect(options.options).has.length(2);

    // Second option places a city
    options.options[1].cb();

    expect(game.deferredActions).has.length(1);
    const placeCityTile = cast(game.deferredActions.pop(), PlaceCityTile);
    assertPlaceCity(player, placeCityTile.execute());
    expect(card.resourceCount).eq(2);
  });
});
