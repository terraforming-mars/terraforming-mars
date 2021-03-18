import {expect} from 'chai';
import {Asteroid} from '../../src/cards/base/Asteroid';
import {DustSeals} from '../../src/cards/base/DustSeals';
import {PowerPlant} from '../../src/cards/base/PowerPlant';
import {Game} from '../../src/Game';
import {SelectCard} from '../../src/inputs/SelectCard';
import {Resources} from '../../src/Resources';
import {ParadigmBreakdown} from '../../src/turmoil/globalEvents/ParadigmBreakdown';
import {Kelvinists} from '../../src/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/turmoil/Turmoil';
import {TestPlayers} from '../TestPlayers';

describe('ParadigmBreakdown', function() {
  it('resolve play', function() {
    const card = new ParadigmBreakdown();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, player2], player);
    const turmoil = Turmoil.newInstance(game);

    turmoil.initGlobalEvent(game);
    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.push(player.id);
    turmoil.dominantParty.delegates.push(player2.id);
    turmoil.dominantParty.delegates.push(player2.id);

    const asteroid = new Asteroid();
    const dustSeals = new DustSeals();
    const powerPlant = new PowerPlant();

    player.megaCredits = 10;
    player.cardsInHand.push(asteroid, dustSeals, powerPlant);
    player2.megaCredits = 10;
    player2.cardsInHand.push(dustSeals);

    card.resolve(game, turmoil);
    while (game.deferredActions.length) {
      const action = game.deferredActions.peek()!;
      const input = action.execute();
      if (input !== undefined && input instanceof SelectCard) {
        // Only |player| should be asked which cards to discard
        expect(action.player.id).to.eq(player.id);
        input.cb([powerPlant, asteroid]);
      }
      game.deferredActions.pop();
    }

    expect(player.cardsInHand).has.lengthOf(1);
    expect(player.cardsInHand[0]).to.eq(dustSeals);
    expect(player.getResource(Resources.MEGACREDITS)).to.eq(12);
    expect(player2.cardsInHand).has.lengthOf(0);
    expect(player2.getResource(Resources.MEGACREDITS)).to.eq(16);
  });
});
