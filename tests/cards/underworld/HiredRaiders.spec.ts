import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {HiredRaiders} from '../../../src/server/cards/underworld/HiredRaiders';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('HiredRaiders', () => {
  let card: HiredRaiders;
  let player: TestPlayer;
  let player2: TestPlayer;

  beforeEach(() => {
    card = new HiredRaiders();
    [/* game */, player, player2] = testGame(2);
  });

  it('Play, no corruption', () => {
    player.megaCredits = 10;
    player2.megaCredits = 10;

    const orOptions = cast(card.play(player), OrOptions);
    expect(orOptions.options).has.lengthOf(2);
    orOptions.options[0].cb();
    expect(player2.megaCredits).to.eq(6);
    expect(player.megaCredits).to.eq(14);
  });

  it('Play, corruption', () => {
    player.megaCredits = 10;
    player2.megaCredits = 10;
    player.underworldData.corruption = 2;

    const orOptions = cast(card.play(player), OrOptions);
    expect(orOptions.options).has.lengthOf(2);
    orOptions.options[0].cb();
    expect(player2.megaCredits).to.eq(4);
    expect(player.megaCredits).to.eq(16);
  });

  it('Works in solo', () => {
    [/* game */, player] = testGame(1);

    cast(card.play(player), undefined);

    expect(player.megaCredits).to.eq(4);
  });
});
