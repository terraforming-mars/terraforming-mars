import {expect} from 'chai';
import {Luna} from '../../src/colonies/Luna';
import {Triton} from '../../src/colonies/Triton';
import {Game} from '../../src/Game';
import {Resources} from '../../src/Resources';
import {JovianTaxRights} from '../../src/turmoil/globalEvents/JovianTaxRights';
import {Kelvinists} from '../../src/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/turmoil/Turmoil';
import {TestPlayers} from '../TestPlayers';

describe('JovianTaxRights', function() {
  it('resolve play', function() {
    const card = new JovianTaxRights();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, player2], player);
    const turmoil = Turmoil.newInstance(game);

    const colony1 = new Luna();
    const colony2 = new Triton();
    colony1.colonies.push(player2.id);
    colony2.colonies.push(player2.id);
    game.colonies.push(colony1);
    game.colonies.push(colony2);

    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.push(player2.id);
    turmoil.dominantParty.delegates.push(player2.id);

    card.resolve(game, turmoil);
    expect(player.getResource(Resources.TITANIUM)).to.eq(0);
    expect(player2.getResource(Resources.TITANIUM)).to.eq(3);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(0);
    expect(player2.getProduction(Resources.MEGACREDITS)).to.eq(2);
  });
});
