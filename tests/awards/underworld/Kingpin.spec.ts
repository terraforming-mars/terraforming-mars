import {expect} from 'chai';
import {Kingpin} from '../../../src/server/awards/underworld/Kingpin';
import {fakeCard} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('Kingpin', function() {
  it('Correctly counts ocean tiles', function() {
    const award = new Kingpin();
    const [/* game */, player/* , player2 */] = testGame(2, {underworldExpansion: true});


    expect(award.getScore(player)).to.eq(0);

    player.playedCards.push(fakeCard());

    expect(award.getScore(player)).to.eq(0);

    player.playedCards.push(fakeCard({requirements: [{corruption: 0}]}));

    expect(award.getScore(player)).to.eq(0);

    player.playedCards.push(fakeCard({requirements: [{corruption: 2}]}));

    expect(award.getScore(player)).to.eq(1);

    player.playedCards.push(fakeCard({requirements: [{corruption: 1}]}));

    expect(award.getScore(player)).to.eq(2);

    player.playedCards.push(fakeCard({requirements: [{oceans: 1}]}));

    expect(award.getScore(player)).to.eq(2);
  });
});
