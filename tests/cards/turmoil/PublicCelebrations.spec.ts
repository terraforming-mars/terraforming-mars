import {expect} from 'chai';
import {PublicCelebrations} from '../../../src/cards/turmoil/PublicCelebrations';
import {Game} from '../../../src/Game';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('PublicCelebrations', function() {
  it('Should play', function() {
    const card = new PublicCelebrations();
    const player = TestPlayers.BLUE.newPlayer();

    const gameOptions = TestingUtils.setCustomGameOptions();
    const game = Game.newInstance('foobar', [player], player, gameOptions);
    expect(player.canPlayForFree(card)).is.not.true;

        game.turmoil!.chairman = player.id;
        expect(player.canPlayForFree(card)).is.true;
        card.play();
  });
});
