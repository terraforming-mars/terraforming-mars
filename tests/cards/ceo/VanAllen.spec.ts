import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions} from '../../TestingUtils';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {VanAllen} from '../../../src/server/cards/ceos/VanAllen';

describe('Van Allen', () => {
  let card: VanAllen;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;


  beforeEach(() => {
    card = new VanAllen();
    [game, player, player2] = testGame(2, {ceoExtension: true});
  });

  it('Cannot claim for free if VanAllen is not in play', () => {
    player.megaCredits = 0;
    player.setTerraformRating(35); // Can claim Terraformer milestone
    const actions = cast(player.getActions(), OrOptions);
    const claimMilestoneAction = actions.options.find((option) => option.title === 'Claim a milestone');
    expect(claimMilestoneAction).is.undefined;
  });

  it('Can claim milestones for free, and gains 3 M€ upon claim', () => {
    player.playedCards.push(card);

    player.megaCredits = 0;

    player.setTerraformRating(35); // Can claim Terraformer milestone

    const actions = cast(player.getActions(), OrOptions);
    const claimMilestoneAction = cast(actions.options.find((option) => option.title === 'Claim a milestone'), OrOptions);
    claimMilestoneAction!.options[0].cb();
    runAllActions(game);
    expect(player.megaCredits).eq(3); // No M€ cost incurred, gains 3 M€ instead
    const claimedMilestones = player.game.claimedMilestones;
    expect(claimedMilestones.find((cm) => cm.milestone.name === 'Terraformer' && cm.player === player)).is.not.undefined;
  });

  it('Gains 3 M€ when an opponent claims', () => {
    player.playedCards.push(card);

    player.megaCredits = 0;
    player2.megaCredits = 8;
    player2.setTerraformRating(35); // Can claim Terraformer milestone

    const actions = cast(player2.getActions(), OrOptions);
    const claimMilestoneAction = cast(actions.options.find((option) => option.title === 'Claim a milestone'), OrOptions);
    claimMilestoneAction!.options[0].cb();
    runAllActions(game);
    expect(player.megaCredits).eq(3); // player2 claimed milestone, grants Van Allen 3 M€
    const claimedMilestones = player.game.claimedMilestones;
    expect(claimedMilestones.find((cm) => cm.milestone.name === 'Terraformer' && cm.player === player2)).is.not.undefined;
  });
});
