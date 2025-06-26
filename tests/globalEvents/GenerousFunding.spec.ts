import {expect} from 'chai';
import {GenerousFunding} from '../../src/server/turmoil/globalEvents/GenerousFunding';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {testGame} from '../TestingUtils';

describe('GenerousFunding', () => {
  it('resolve play', () => {
    const card = new GenerousFunding();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = game.turmoil!;
    turmoil.chairman = player2;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player2);
    turmoil.dominantParty.delegates.add(player2);

    player.megaCredits = 10;
    player2.megaCredits = 10;
    player.setTerraformRating(25);
    player2.setTerraformRating(50);

    card.resolve(game, turmoil);
    expect(player.megaCredits).to.eq(14);
    expect(player2.megaCredits).to.eq(26);
  });

  it('no negative mc give out if TR lower than 15', () => {
    const card = new GenerousFunding();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = game.turmoil!;
    turmoil.chairman = player2;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player2);
    turmoil.dominantParty.delegates.add(player2);

    player.megaCredits = 10;
    player2.megaCredits = 10;
    player.setTerraformRating(12);
    player2.setTerraformRating(50);

    card.resolve(game, turmoil);
    expect(player.megaCredits).to.eq(10);
    expect(player2.megaCredits).to.eq(26);
  });
});
