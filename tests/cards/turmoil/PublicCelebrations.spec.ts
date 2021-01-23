import {expect} from 'chai';
import {PublicCelebrations} from '../../../src/cards/turmoil/PublicCelebrations';
import {Game} from '../../../src/Game';
import {setCustomGameOptions, TestPlayers} from '../../TestingUtils';

describe('PublicCelebrations', function() {
  it('Should play', function() {
    const card = new PublicCelebrations();
    const player = TestPlayers.BLUE.newPlayer();

    const gameOptions = setCustomGameOptions();
    const game = Game.newInstance('foobar', [player], player, gameOptions);
    expect(card.canPlay(player)).is.not.true;

        game.turmoil!.chairman = player.id;
        expect(card.canPlay(player)).is.true;
        card.play();
  });
});
