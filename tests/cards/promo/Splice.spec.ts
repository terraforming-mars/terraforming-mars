import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {PharmacyUnion} from '../../../src/server/cards/promo/PharmacyUnion';
import {Recyclon} from '../../../src/server/cards/promo/Recyclon';
import {Splice} from '../../../src/server/cards/promo/Splice';
import {Game} from '../../../src/server/Game';
import {AndOptions} from '../../../src/server/inputs/AndOptions';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {SelectOption} from '../../../src/server/inputs/SelectOption';

describe('Splice', function() {
  let card: Splice;
  let player: TestPlayer;
  let player2: TestPlayer;

  beforeEach(function() {
    card = new Splice();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, player2], player);
  });

  it('Should play', function() {
    const card2 = new Tardigrades();
    const play = card.play(player);
    expect(play).is.undefined;

    player.setCorporationForTest(card);

    player2.playedCards.push(card2);
    const action = cast(card.onCardPlayed(player2, card2), OrOptions);

    expect(action.options).has.lengthOf(2);
    const orOptions = cast(action.options[0], SelectOption);

    orOptions.cb();
    expect(card2.resourceCount).to.eq(1);
    expect(player.megaCredits).to.eq(2);
  });

  it('Should play with multiple microbe tags', function() {
    const card2 = new PharmacyUnion();
    const play = card.play(player);
    player.setCorporationForTest(card);
    const play2 = card2.play(player);
    player2.setCorporationForTest(card2);
    expect(play).is.undefined;
    expect(play2).is.undefined;

    const action = card.onCardPlayed(player2, card2);
    expect(action).is.undefined;
    expect(player.megaCredits).to.eq(4);
    expect(player2.megaCredits).to.eq(4);
  });

  it('Should grant Recyclon a Microbe or 2MC', function() {
    const card2 = new Recyclon();
    // Player 1 picks Splice
    const pi = cast(player.getWaitingFor(), AndOptions);
    pi.options[0].cb([card]);
    pi.options[1].cb([]);
    pi.cb();
    // Player 2 picks Recyclon
    const pi2 = cast(player2.getWaitingFor(), AndOptions);
    pi2.options[0].cb([card2]);
    pi2.options[1].cb([]);
    pi2.cb();

    // Default resource on Recyclon and player2's MC
    expect(card2.resourceCount).to.eq(1);
    expect(player2.megaCredits).to.eq(38);

    // Player 2 should have the option to pick a microbe or 2 MC
    const pi3 = cast(player2.getWaitingFor(), OrOptions);
    expect(pi3.options).has.lengthOf(2);
    expect(pi3.options[0].title).to.eq('Add a microbe resource to this card');
    expect(pi3.options[1].title).to.eq('Gain 2 MC');

    // Pick the microbe
    pi3.options[0].cb();
    expect(card2.resourceCount).to.eq(2);

    // Pick 2 MC
    pi3.options[1].cb();
    expect(player2.megaCredits).to.eq(40);
  });
});
