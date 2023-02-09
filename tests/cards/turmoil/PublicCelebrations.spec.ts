import {expect} from 'chai';
import {PublicCelebrations} from '../../../src/server/cards/turmoil/PublicCelebrations';
import {testGameOptions} from '../../TestingUtils';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('PublicCelebrations', function() {
  it('Should play', function() {
    const card = new PublicCelebrations();
    const game = newTestGame(1, testGameOptions({turmoilExtension: true}));
    const player = getTestPlayer(game, 0);

    expect(player.canPlayIgnoringCost(card)).is.not.true;

    game.turmoil!.chairman = player.id;
    expect(player.canPlayIgnoringCost(card)).is.true;
    card.play(player);
  });
});
