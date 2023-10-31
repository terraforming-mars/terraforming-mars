import {expect} from 'chai';
import {PublicCelebrations} from '../../../src/server/cards/turmoil/PublicCelebrations';
import {testGame} from '../../TestGame';

describe('PublicCelebrations', function() {
  it('Should play', function() {
    const card = new PublicCelebrations();
    const [game, player] = testGame(1, {turmoilExtension: true});

    expect(player.simpleCanPlay(card)).is.not.true;

    game.turmoil!.chairman = player;
    expect(player.simpleCanPlay(card)).is.true;
    card.play(player);
  });
});
