import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

import {Zan} from '../../../src/server/cards/ceos/Zan';
import {ReleaseOfInertGases} from '../../../src/server/cards/base/ReleaseOfInertGases';
import {forceGenerationEnd, setRulingParty, runAllActions} from '../../TestingUtils';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {Politician} from '../../../src/server/awards/terraCimmeria/Politician';

describe('Zan', function() {
  let card: Zan;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Zan();
    [game, player] = testGame(2, {ceoExtension: true, turmoilExtension: true});

    player.playedCards.push(card);
  });

  it('Not affected by Reds policy when raising TR', function() {
    setRulingParty(game, PartyName.REDS);

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
    player.megaCredits = 0;
    const expectedMegagredits = turmoil.getAvailableDelegateCount(player);
    card.action(player);
    while (game.deferredActions.length) {
      game.deferredActions.pop()!.execute();
    }

    expect(turmoil.getAvailableDelegateCount(player)).eq(0);
    expect(player.megaCredits).eq(expectedMegagredits);

    expect(turmoil.dominantParty.name).eq(PartyName.REDS);
    expect(turmoil.dominantParty.partyLeader).eq(player);
    expect(card.isDisabled).is.true;
  });

  it('OPG Counts for POLITICAN Award', function() {
    const politician = new Politician();
    game.awards = [];
    game.awards.push(politician);
    const preOPGScore = game.awards[0].getScore(player);
    card.action(player);
    runAllActions(game);
    expect(game.awards[0].getScore(player)).eq(preOPGScore+7);
  });

  it('Can only act once per game', function() {
    card.action(player);
    forceGenerationEnd(game);

    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });
});
