import {expect} from 'chai';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {SpecialPermit} from '../../../src/server/cards/prelude2/SpecialPermit';

describe('SpecialPermit', function() {
  let card: SpecialPermit;
  let player: TestPlayer;
  let player2: TestPlayer;

  beforeEach(function() {
    card = new SpecialPermit();
    [, player, player2] = testGame(3); // Ensure testGame returns TestPlayer instances
  });

  it('Steals resources correctly', () => {
    player.plants = 0;
    player2.plants = 4; // Set player2's initial plants to 4 for the test
    player.removingPlayers.push(player2.id);
    // Call bespokePlay directly to initiate the action
    card.bespokePlay(player);
    stealAction.execute(player2);
    // Assert that the resources have been transferred correctly
    expect(player.plants).to.equal(4); // Player should have stolen 4 plants
    expect(player2.plants).to.equal(0); // Player2 should have lost 4 plants
  });
});
