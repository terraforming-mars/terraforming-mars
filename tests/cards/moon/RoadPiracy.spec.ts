import {expect} from 'chai';
import {cast, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {RoadPiracy} from '../../../src/server/cards/moon/RoadPiracy';
import {testGame} from '../../TestGame';
import {IGame} from '../../../src/server/IGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {AndOptions} from '../../../src/server/inputs/AndOptions';
import {SelectAmount} from '../../../src/server/inputs/SelectAmount';

describe('RoadPiracy', () => {
  let game: IGame;
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;
  let card: RoadPiracy;

  beforeEach(() => {
    [game, player, player2, player3] = testGame(3);
    card = new RoadPiracy();
  });

  it('No players have resources', () => {
    cast(card.play(player), undefined);
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
  });

  it('Players only have steel', () => {
    player2.steel = 2;
    player3.steel = 5;
    cast(card.play(player), undefined);
    runAllActions(game);
    const orOptions = cast(player.popWaitingFor(), OrOptions);

    expect(orOptions.options).has.length(2);

    const steel = cast(orOptions.options[0], AndOptions);
    steel.process({
      type: 'and',
      responses: [
        {type: 'amount', amount: 2},
        {type: 'amount', amount: 4},
      ],
    }, player);

    expect(player.steel).eq(6);
    expect(player2.steel).eq(0);
    expect(player3.steel).eq(1);
  });

  it('Players only have titanium', () => {
    player2.titanium = 2;
    player3.titanium = 5;
    cast(card.play(player), undefined);
    runAllActions(game);
    const orOptions = cast(player.popWaitingFor(), OrOptions);

    expect(orOptions.options).has.length(2);

    const titanium = cast(orOptions.options[0], AndOptions);
    titanium.process({
      type: 'and',
      responses: [
        {type: 'amount', amount: 2},
        {type: 'amount', amount: 1},
      ],
    }, player);

    expect(player.titanium).eq(3);
    expect(player2.titanium).eq(0);
    expect(player3.titanium).eq(4);
  });

  it('Select too many from one player', () => {
    player2.titanium = 2;
    player3.titanium = 5;
    cast(card.play(player), undefined);
    runAllActions(game);
    const orOptions = cast(player.popWaitingFor(), OrOptions);

    expect(orOptions.options).has.length(2);

    const titanium = cast(orOptions.options[0], AndOptions);

    expect(() => titanium.process({
      type: 'and',
      responses: [
        {type: 'amount', amount: 3},
        {type: 'amount', amount: 3},
      ],
    }, player)).to.throw(/Amount provided too high/);

    // This verifies that even if the option has an error state, it can be re-run.
    titanium.process({
      type: 'and',
      responses: [
        {type: 'amount', amount: 2},
        {type: 'amount', amount: 2},
      ],
    }, player);

    expect(player.titanium).eq(4);
    expect(player2.titanium).eq(0);
    expect(player3.titanium).eq(3);
  });

  it('Select too many overall', () => {
    player2.titanium = 2;
    player3.titanium = 5;
    cast(card.play(player), undefined);
    runAllActions(game);
    const orOptions = cast(player.popWaitingFor(), OrOptions);

    expect(orOptions.options).has.length(2);
    const titanium = cast(orOptions.options[0], AndOptions);
    expect(() => titanium.process({
      type: 'and',
      responses: [
        {type: 'amount', amount: 2},
        {type: 'amount', amount: 3},
      ],
    }, player)).to.throw(/You may only steal up to 4 titanium/);

    // This verifies that even if the option has an error state, it can be re-run.
    titanium.process({
      type: 'and',
      responses: [
        {type: 'amount', amount: 2},
        {type: 'amount', amount: 2},
      ],
    }, player);

    expect(player.titanium).eq(4);
    expect(player2.titanium).eq(0);
    expect(player3.titanium).eq(3);
  });

  it('Do not select', () => {
    player2.titanium = 2;
    player3.titanium = 5;
    cast(card.play(player), undefined);
    runAllActions(game);
    const orOptions = cast(player.popWaitingFor(), OrOptions);

    expect(orOptions.options).has.length(2);
    orOptions.options[1].cb();
    expect(player.titanium).eq(0);
    expect(player2.titanium).eq(2);
    expect(player3.titanium).eq(5);
  });

  it('Road piracy works with Pathfinders bonuses', () => {
    [game, player, player2, player3] = testGame(3, {pathfindersExpansion: true});

    player2.steel = 0;
    player3.steel = 3;

    // Road Piracy has a Moon tag. Next step grants steel.
    game.pathfindersData!.moon = 1;
    player.playCard(card);
    runAllActions(game);

    expect(player.steel).eq(2);
    expect(player2.steel).eq(1);
    expect(player3.steel).eq(4);

    const orOptions = cast(player.popWaitingFor(), OrOptions);
    const steel = cast(orOptions.options[0], AndOptions);

    expect(steel.options).has.length(2);
    expect(cast(steel.options[0], SelectAmount).max).eq(1);
    expect(cast(steel.options[1], SelectAmount).max).eq(4);
  });
});

