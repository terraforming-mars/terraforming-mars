import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {SpecialPermit} from '../../../src/server/cards/prelude2/SpecialPermit';
import {StealResources} from '../../../src/server/deferredActions/StealResources';

describe('SpecialPermit', function() {
  let card: SpecialPermit;
  let player: TestPlayer;
  let player2: TestPlayer;

  beforeEach(function() {
    card = new SpecialPermit();
    [, player, player2] = testGame(2); // Ensure testGame returns TestPlayer instances
  });

  it('Steals resources correctly', () => {
    player.plants = 0;
    player2.plants = 4; // Set player2's initial plants to 4 for the test

    player.removingPlayers.push(player2.id);

    // Call bespokePlay directly to initiate the action
    card.bespokePlay(player);

    // Verify the deferred action (StealResources) created
    const deferredActions = player.game.deferredActions;
    expect(deferredActions.length).to.equal(1);
    const stealAction = deferredActions[0];
    expect(stealAction).to.be.instanceOf(StealResources);
    expect(stealAction.amount).to.equal(4); // Ensure it's stealing 4 plants

    // Execute the deferred action (simulating SelectPlayer callback)
    stealAction.execute(player2);

    // Assert that the resources have been transferred correctly
    expect(player.plants).to.equal(4); // Player should have stolen 4 plants
    expect(player2.plants).to.equal(0); // Player2 should have lost 4 plants
  });
});
