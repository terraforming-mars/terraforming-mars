import {expect} from 'chai';
import {PublicCelebrations} from '../../../src/server/cards/turmoil/PublicCelebrations';
import {Game} from '../../../src/server/Game';
import {setCustomGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('PublicCelebrations', function() {
  it('Should play', function() {
    const card = new PublicCelebrations();
    const player = TestPlayer.BLUE.newPlayer();

    const gameOptions = setCustomGameOptions();
    const game = Game.newInstance('gameid', [player], player, gameOptions);
    expect(player.canPlayIgnoringCost(card)).is.not.true;

        game.turmoil!.chairman = player.id;
        expect(player.canPlayIgnoringCost(card)).is.true;
        card.play();
  });
});
