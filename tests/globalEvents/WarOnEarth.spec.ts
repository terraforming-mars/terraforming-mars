import {expect} from 'chai';
import {WarOnEarth} from '../../src/server/turmoil/globalEvents/WarOnEarth';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {testGame} from '../TestingUtils';

describe('WarOnEarth', () => {
  it('influence >= 4 prevents all TR loss (should not increase TR)', () => {
    const card = new WarOnEarth();
    const [game, player] = testGame(2, {turmoilExtension: true});
    const turmoil = game.turmoil!;

    // Give player 5 influence: chairman(+1) + partyLeader(+1) + extra delegate(+1) + bonus(+2)
    turmoil.chairman = player;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player;
    turmoil.dominantParty.delegates.add(player);
    turmoil.dominantParty.delegates.add(player);
    turmoil.addInfluenceBonus(player, 2);

    player.setTerraformRating(20);
    card.resolve(game, turmoil);

    // 5 influence covers all 4 TR loss; TR should stay at 20, not increase
    expect(player.terraformRating).to.eq(20);
  });

  it('resolve play', () => {
    const card = new WarOnEarth();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = game.turmoil!;
    turmoil.chairman = player2;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player2);
    turmoil.dominantParty.delegates.add(player2);

    player.setTerraformRating(15);
    player2.setTerraformRating(15);

    card.resolve(game, turmoil);
    expect(player.terraformRating).to.eq(11);
    expect(player2.terraformRating).to.eq(14);
  });
});
