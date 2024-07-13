import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {SelectPlayer} from '../../../src/server/inputs/SelectPlayer';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';
import {SpecialPermit} from '../../../src/server/cards/prelude2/SpecialPermit';

describe('SpecialPermit', function() {
  let card: SpecialPermit;
  let player: TestPlayer;
  let player2: TestPlayer;

  beforeEach(function() {
    card = new SpecialPermit();
    [/* game */, player, player2] = testGame(4); // Ensure testGame returns TestPlayer instances
  });

  it('Steals resources correctly', () => {
    // This part sets up player2 as a target
    player.removingPlayers.push(player2.id);
    // Targertnow has has 4 plants
    player2.plants = 4;
    player.plants = 0;
    const play = cast(card.play(player), SelectPlayer);
    play.cb(player2);
    expect(player.plants).eq(4);
    expect(player2.plants).eq(0);
  });
});
