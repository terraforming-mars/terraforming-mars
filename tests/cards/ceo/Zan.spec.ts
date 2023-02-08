import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';

import {Zan} from '../../../src/server/cards/ceos/Zan';
import {ReleaseOfInertGases} from '../../../src/server/cards/base/ReleaseOfInertGases';
import {forceGenerationEnd, setRulingPartyAndRulingPolicy} from '../../TestingUtils';
import {PartyName} from '../../../src/common/turmoil/PartyName';

describe('Zan', function() {
  let card: Zan;
  let player: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Zan();
    game = newTestGame(2, {ceoExtension: true, turmoilExtension: true});
    player = getTestPlayer(game, 0);

    player.playedCards.push(card);
  });

  it('Not affected by Reds policy when raising TR', function() {
    const turmoil = game.turmoil!;
    const reds = turmoil.getPartyByName(PartyName.REDS)!;
    setRulingPartyAndRulingPolicy(game, turmoil, reds, reds.policies[0].id);

    player.megaCredits = 3;
    player.increaseTerraformRating();
    game.deferredActions.runNext();
    expect(player.megaCredits).eq(3);
  });

  it('Not affected by Reds policy when checking canPlay for cards that give TR', function() {
    player.megaCredits = 14;
    const releaseOfInertGases = new ReleaseOfInertGases();
    expect(releaseOfInertGases.canPlay(player)).is.true;
  });

  it('Takes OPG action', function() {
    const turmoil = game.turmoil!;
    card.action(player);

    while (game.deferredActions.length) {
      game.deferredActions.pop()!.execute();
    }

    expect(turmoil.getAvailableDelegateCount(player.id)).eq(0);
    expect(turmoil.dominantParty.name).eq(PartyName.REDS);
    expect(turmoil.dominantParty.partyLeader).eq(player.id);
    expect(card.isDisabled).is.true;
  });

  it('Can only act once per game', function() {
    card.action(player);
    forceGenerationEnd(game);

    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });
});
