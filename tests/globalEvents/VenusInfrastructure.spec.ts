import {expect} from 'chai';
import {CorroderSuits} from '../../src/cards/venusNext/CorroderSuits';
import {Game} from '../../src/Game';
import {Resources} from '../../src/Resources';
import {VenusInfrastructure} from '../../src/turmoil/globalEvents/VenusInfrastructure';
import {Kelvinists} from '../../src/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/turmoil/Turmoil';
import {TestPlayers} from '../TestPlayers';

describe('VenusInfrastructure', function() {
  it('resolve play', function() {
    const card = new VenusInfrastructure();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, player2], player);
    const turmoil = Turmoil.newInstance(game);

    player.playedCards.push(new CorroderSuits());
    player2.playedCards.push(new CorroderSuits(), new CorroderSuits(), new CorroderSuits());

    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.push(player2.id);
    turmoil.dominantParty.delegates.push(player2.id);

    card.resolve(game, turmoil);
    expect(player.getResource(Resources.MEGACREDITS)).to.eq(2);
    expect(player2.getResource(Resources.MEGACREDITS)).to.eq(12);
  });
});
