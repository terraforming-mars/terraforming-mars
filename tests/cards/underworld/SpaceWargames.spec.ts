import {expect} from 'chai';
import {SpaceWargames} from '../../../src/server/cards/underworld/SpaceWargames';
import {testGame} from '../../TestGame';
import {cast, forceGenerationEnd, runAllActions} from '../../TestingUtils';

describe('SpaceWargames', () => {
  it('play', () => {
    const card = new SpaceWargames();
    const [game, player] = testGame(2);

    cast(card.play(player), undefined);
    runAllActions(game);

    expect(card.resourceCount).to.eq(4);
  });

  for (const run of [
    {titanium: 0, resources: 0, expected: false},
    {titanium: 1, resources: 0, expected: true},
    {titanium: 0, resources: 5, expected: false},
    {titanium: 0, resources: 6, expected: true},
  ] as const) {
    it('canAct ' + JSON.stringify(run), () => {
      const card = new SpaceWargames();
      const [/* game */, player] = testGame(2);

      player.titanium = run.titanium;
      card.resourceCount = run.resources;
      expect(card.canAct(player)).eq(run.expected);
    });
  }

  it('action, titanium', () => {
    const card = new SpaceWargames();
    const [game, player] = testGame(4);
    player.playedCards.push(card);

    player.titanium = 1;

    cast(card.action(player), undefined);
    runAllActions(game);

    expect(card.resourceCount).eq(2);
    expect(player.titanium).eq(0);

    // Does not impact  first player
    expect(game.generation).eq(1);
    expect(game.first).eq(player);

    forceGenerationEnd(game);

    expect(game.generation).eq(2);
    expect(game.first).does.not.eq(player);
    expect(game.first).eq(game.players[1]);
  });

  it('action, first player', () => {
    const card = new SpaceWargames();
    const [game, player] = testGame(2);
    player.playedCards.push(card);

    player.titanium = 0;
    card.resourceCount = 6;

    cast(card.action(player), undefined);
    runAllActions(game);

    expect(card.resourceCount).eq(0);
    expect(player.titanium).eq(0);
    expect(game.generation).eq(1);
    expect(game.first).eq(player);

    forceGenerationEnd(game);

    expect(game.generation).eq(2);
    expect(game.first).eq(player);
  });
});
