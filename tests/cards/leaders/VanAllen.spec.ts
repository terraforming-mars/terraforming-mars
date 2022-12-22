import {expect} from "chai";
import {VanAllen} from "../../../src/server/cards/leaders/VanAllen";
import {Game} from "../../../src/server/Game";
import {TestPlayer} from '../../TestPlayer';


describe('Van Allen', function() {
  let card: VanAllen;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new VanAllen();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);

    player.playedCards.push(card);
  });

  it('Can claim milestones for free, and gains 3 M€ upon claim', function() {
    player.megaCredits = 7;
    player.setTerraformRating(35); // Can claim Terraformer milestone

    const claimMilestoneAction = player.getActions().options.find((option) => option.title == "Claim a milestone");
    expect(claimMilestoneAction).is.not.undefined;

    claimMilestoneAction!.options![0].cb();
    game.deferredActions.runAll(() => {});
    const claimedMilestone = player.game.claimedMilestones;
    expect(player.megaCredits).eq(10); // No M€ cost incurred, gains 3 M€ instead
    expect(claimedMilestone.find((cm) => cm.milestone.name === 'Terraformer' && cm.player === player)).is.not.undefined;
  });
});
