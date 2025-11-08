import {expect} from 'chai';
import {PublicCelebrations} from '../../../src/server/cards/turmoil/PublicCelebrations';
import {testGame} from '../../TestGame';

describe('PublicCelebrations', () => {
  it('Should play', () => {
    const card = new PublicCelebrations();
    const [game, player] = testGame(1, {turmoilExtension: true});

    expect(card.canPlay(player)).is.not.true;

    game.turmoil!.chairman = player;
    expect(card.canPlay(player)).is.true;
    card.play(player);
  });
});
