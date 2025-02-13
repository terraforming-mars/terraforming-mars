import {expect} from 'chai';
import {Asteroid} from '../../src/server/cards/base/Asteroid';
import {DustSeals} from '../../src/server/cards/base/DustSeals';
import {PowerPlant} from '../../src/server/cards/base/PowerPlant';
import {SelectCard} from '../../src/server/inputs/SelectCard';
import {ParadigmBreakdown} from '../../src/server/turmoil/globalEvents/ParadigmBreakdown';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {cast, runAllActions} from '../TestingUtils';
import {testGame} from '../TestGame';

describe('ParadigmBreakdown', () => {
  it('resolve play', () => {
    const card = new ParadigmBreakdown();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = Turmoil.newInstance(game);

    turmoil.initGlobalEvent(game);
    turmoil.chairman = player2;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player);
    turmoil.dominantParty.delegates.add(player2);
    turmoil.dominantParty.delegates.add(player2);

    const asteroid = new Asteroid();
    const dustSeals = new DustSeals();
    const powerPlant = new PowerPlant();

    player.megaCredits = 10;
    player.cardsInHand.push(asteroid, dustSeals, powerPlant);
    player2.megaCredits = 10;
    player2.cardsInHand.push(dustSeals);

    card.resolve(game, turmoil);
    // Only |player| should be asked which cards to discard
    runAllActions(game);
    const selectCard = cast(player.popWaitingFor(), SelectCard);
    selectCard.cb([powerPlant, asteroid]);
    runAllActions(game);
    cast(player2.getWaitingFor(), undefined);

    expect(player.cardsInHand).has.lengthOf(1);
    expect(player.cardsInHand[0]).to.eq(dustSeals);
    expect(player.megaCredits).to.eq(12);
    expect(player2.cardsInHand).has.lengthOf(0);
    expect(player2.megaCredits).to.eq(16);
  });
});
