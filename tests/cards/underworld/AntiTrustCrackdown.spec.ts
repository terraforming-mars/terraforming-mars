import {expect} from 'chai';

import {AntiTrustCrackdown} from '../../../src/server/cards/underworld/AntiTrustCrackdown';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('AntiTrustCrackdown', () => {
  let player1: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;
  let card: AntiTrustCrackdown;

  beforeEach(() => {
    [/* game */, player1, player2, player3] = testGame(3, {underworldExpansion: true});
    card = new AntiTrustCrackdown();
  });

  it('can play', () => {
    player1.underworldData.corruption = 1;
    expect(card.canPlay(player1)).is.false;
    player1.underworldData.corruption = 0;
    expect(card.canPlay(player1)).is.true;
  });

  it('play', () => {
    player1.underworldData.corruption = 0;
    player2.underworldData.corruption = 4;
    player3.underworldData.corruption = 1;

    card.play(player1);

    expect(player1.underworldData.corruption).eq(0);
    expect(player2.underworldData.corruption).eq(2);
    expect(player3.underworldData.corruption).eq(0);
  });
});
