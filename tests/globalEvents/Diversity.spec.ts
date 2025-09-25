import {expect} from 'chai';
import {AdvancedEcosystems} from '../../src/server/cards/base/AdvancedEcosystems';
import {SolarWindPower} from '../../src/server/cards/base/SolarWindPower';
import {EarlySettlement} from '../../src/server/cards/prelude/EarlySettlement';
import {Diversity} from '../../src/server/turmoil/globalEvents/Diversity';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {testGame} from '../TestGame';

describe('Diversity', () => {
  it('resolve play', () => {
    const card = new Diversity();

    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = game.turmoil!;

    // player2 has 8 tags.
    player2.playedCards.push(new AdvancedEcosystems()); // Plant, Microbe, Animal
    player2.playedCards.push(new EarlySettlement()); // Building, City
    player2.playedCards.push(new SolarWindPower()); // Science, Space, Power

    turmoil.chairman = player2;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player2);

    card.resolve(game, turmoil);

    expect(player.megaCredits).to.eq(0);
    expect(player2.megaCredits).to.eq(10);
  });
});
