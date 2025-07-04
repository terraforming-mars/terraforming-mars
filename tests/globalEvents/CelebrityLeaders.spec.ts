import {expect} from 'chai';
import {Virus} from '../../src/server/cards/base/Virus';
import {CelebrityLeaders} from '../../src/server/turmoil/globalEvents/CelebrityLeaders';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {testGame} from '../TestingUtils';
import {IceAsteroid} from '../../src/server/cards/base/IceAsteroid';
import {ImportedHydrogen} from '../../src/server/cards/base/ImportedHydrogen';

describe('CelebrityLeaders', () => {
  it('resolve play', () => {
    const card = new CelebrityLeaders();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = game.turmoil!;
    player.playedCards.push(new Virus());
    player2.playedCards.push(new IceAsteroid());
    player2.playedCards.push(new ImportedHydrogen());

    turmoil.chairman = player2;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player2);
    turmoil.dominantParty.delegates.add(player2);

    player.megaCredits = 10;
    player2.megaCredits = 10;

    card.resolve(game, turmoil);
    expect(player.megaCredits).to.eq(12);
    expect(player2.megaCredits).to.eq(20);
  });
});
