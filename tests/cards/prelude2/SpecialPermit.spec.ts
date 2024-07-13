import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {SelectPlayer} from '../../../src/server/inputs/SelectPlayer';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {SpecialPermit} from '../../../src/server/cards/prelude2/SpecialPermit';

describe('SpecialPermit', function() {
  let card: SpecialPermit;
  let player: TestPlayer;
  let player2: TestPlayer;

  beforeEach(function() {
    card = new SpecialPermit();
    [/* game */, player, player2] = testGame(2);
  });

  it('Steals resources correctly', () => {
    player.plants = 0;
    player2.plants = 2;
    player.removingPlayers.push(player2.id);
    const play = cast(card.play(player), SelectPlayer);
    play.cb(player2);
    expect(player.plants).eq(2);
    expect(player2.plants).eq(0);
  });
});
