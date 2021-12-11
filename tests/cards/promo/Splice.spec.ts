import {expect} from 'chai';
import {Tardigrades} from '../../../src/cards/base/Tardigrades';
import {PharmacyUnion} from '../../../src/cards/promo/PharmacyUnion';
import {Recyclon} from '../../../src/cards/promo/Recyclon';
import {Splice} from '../../../src/cards/promo/Splice';
import {Game} from '../../../src/Game';
import {AndOptions} from '../../../src/inputs/AndOptions';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('Splice', function() {
  let card : Splice; let player : Player; let player2 : Player;

  beforeEach(function() {
    card = new Splice();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, player2], player);
  });

  it('Should play', function() {
    const card2 = new Tardigrades();
    const play = card.play();
    expect(play).is.undefined;

    player.corporationCard = card;

    player2.playedCards.push(card2);
    const action = card.onCardPlayed(player2, card2);
    expect(action).instanceOf(OrOptions);
    if ( ! (action instanceof OrOptions)) return;

    expect(action.options).has.lengthOf(2);
    const orOptions = action.options[0] as OrOptions;

    orOptions.cb();
    expect(player2.getResourcesOnCard(card2)).to.eq(1);
    expect(player.megaCredits).to.eq(2);
  });

  it('Should play with multiple microbe tags', function() {
    const card2 = new PharmacyUnion();
    const play = card.play();
    player.corporationCard = card;
    const play2 = card2.play(player);
    player2.corporationCard = card2;
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
    const pi = player.getWaitingFor() as AndOptions;
    pi.options[0].cb([card]);
    pi.options[1].cb([]);
    pi.cb();
    // Player 2 picks Recyclon
    const pi2 = player2.getWaitingFor() as AndOptions;
    pi2.options[0].cb([card2]);
    pi2.options[1].cb([]);
    pi2.cb();

    // Default resource on Recyclon and player2's MC
    expect(card2.resourceCount).to.eq(1);
    expect(player2.megaCredits).to.eq(38);

    // Player 2 should have the option to pick a microbe or 2 MC
    const pi3 = player2.getWaitingFor() as OrOptions;
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
