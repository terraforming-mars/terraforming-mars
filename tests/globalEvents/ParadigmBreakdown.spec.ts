import {expect} from 'chai';
import {Asteroid} from '../../src/server/cards/base/Asteroid';
import {DustSeals} from '../../src/server/cards/base/DustSeals';
import {PowerPlant} from '../../src/server/cards/base/PowerPlant';
import {Game} from '../../src/server/Game';
import {SelectCard} from '../../src/server/inputs/SelectCard';
import {Resources} from '../../src/common/Resources';
import {ParadigmBreakdown} from '../../src/server/turmoil/globalEvents/ParadigmBreakdown';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../TestPlayer';

describe('ParadigmBreakdown', function() {
  it('resolve play', function() {
    const card = new ParadigmBreakdown();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, player2], player);
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
