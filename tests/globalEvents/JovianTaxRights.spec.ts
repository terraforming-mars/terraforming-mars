import {expect} from 'chai';
import {Luna} from '../../src/server/colonies/Luna';
import {Triton} from '../../src/server/colonies/Triton';
import {JovianTaxRights} from '../../src/server/turmoil/globalEvents/JovianTaxRights';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {testGame} from '../TestingUtils';

describe('JovianTaxRights', () => {
  it('resolve play', () => {
    const card = new JovianTaxRights();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = game.turmoil!;
    const colony1 = new Luna();
    const colony2 = new Triton();
    colony1.colonies.push(player2.id);
    colony2.colonies.push(player2.id);
    game.colonies.push(colony1);
    game.colonies.push(colony2);

    turmoil.chairman = player2;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player2);
    turmoil.dominantParty.delegates.add(player2);

    card.resolve(game);
    expect(player.titanium).to.eq(0);
    expect(player2.titanium).to.eq(3);
    expect(player.production.megacredits).to.eq(0);
    expect(player2.production.megacredits).to.eq(2);
  });

  it('counts two colonies on the same tile', () => {
    const card = new JovianTaxRights();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const colony = new Luna();
    colony.colonies.push(player.id, player.id);
    game.colonies.push(colony);

    card.resolve(game);

    // Each cube counts, not each tile.
    expect(player.production.megacredits).to.eq(2);
    expect(player2.production.megacredits).to.eq(0);
  });
});
