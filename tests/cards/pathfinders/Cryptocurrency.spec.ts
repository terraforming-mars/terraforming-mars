import {expect} from 'chai';
import {Cryptocurrency} from '../../../src/server/cards/pathfinders/Cryptocurrency';
import {TestPlayer} from '../../TestPlayer';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {cast, testGame} from '../../TestingUtils';

describe('Cryptocurrency', () => {
  let card: Cryptocurrency;
  let player: TestPlayer;

  beforeEach(() => {
    card = new Cryptocurrency();
    [/* game */, player] = testGame(1);
  });

  it('canAct with energy', () => {
    expect(card.canAct(player)).is.false;
    player.energy = 1;
    expect(card.canAct(player)).is.true;
  });

  it('canAct with resources', () => {
    expect(card.canAct(player)).is.false;
    card.resourceCount = 1;
    expect(card.canAct(player)).is.true;
  });

  it('action - energy to data', () => {
    player.energy = 3;
    card.resourceCount = 0;
    card.action(player);
    expect(player.energy).eq(2);
    expect(card.resourceCount).eq(1);
  });

  it('action - data to money', () => {
    player.energy = 0;
    player.megaCredits = 0;
    card.resourceCount = 6;
    card.action(player);
    expect(card.resourceCount).eq(0);
    expect(player.megaCredits).eq(18);
  });

  it('action - both', () => {
    player.energy = 4;
    player.megaCredits = 0;
    card.resourceCount = 6;
    const options = card.action(player);

    const orOptions = cast(options, OrOptions);

    orOptions.options[0].cb();

    expect(player.energy).eq(3);
    expect(card.resourceCount).eq(7);

    orOptions.options[1].cb();

    expect(card.resourceCount).eq(0);
    expect(player.megaCredits).eq(21);
  });
});
