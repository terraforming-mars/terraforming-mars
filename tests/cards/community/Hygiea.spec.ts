import {expect} from 'chai';
import {Hygiea} from '../../../src/server/cards/community/Hygiea';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {MicroMills} from '../../../src/server/cards/base/MicroMills';
import {EarthCatapult} from '../../../src/server/cards/base/EarthCatapult';
import {SelectPlayer} from '../../../src/server/inputs/SelectPlayer';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {LawSuit} from '../../../src/server/cards/promo/LawSuit';

describe('Hygiea', () => {
  let hygiea: Hygiea;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    hygiea = new Hygiea();
    [game, player, player2] = testGame(2, {coloniesExtension: true});
    game.colonies.push(hygiea);
  });

  it('Build, no opponent has cards in hand', () => {
    hygiea.addColony(player);
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
  });

  it('Build, opponents have cards in hand', () => {
    const microMills = new MicroMills();
    const earthCatapult = new EarthCatapult();
    player2.cardsInHand.push(microMills, earthCatapult);
    hygiea.addColony(player);
    runAllActions(game);

    const selectPlayer = cast(player.popWaitingFor(), SelectPlayer);
    cast(player2.getWaitingFor(), undefined);

    selectPlayer.cb(player2);
    runAllActions(game);

    cast(player.popWaitingFor(), undefined);
    const selectCard = cast(player2.popWaitingFor(), SelectCard);
    expect(selectCard.cards).to.have.members([microMills, earthCatapult]);
    selectCard.cb([microMills]);

    expect(player2.cardsInHand).deep.eq([earthCatapult]);
    const discardPile = game.projectDeck.discardPile;
    expect(discardPile[discardPile.length - 1]).deep.eq(microMills);
  });

  it('Should trade - megacredits', () => {
    player.megaCredits = 10;
    player2.megaCredits = 10;

    hygiea.trade(player);
    runAllActions(game);
    const orOptions = cast(player.popWaitingFor(), OrOptions);
    expect(orOptions.options).has.length(2);
    orOptions.options[0].cb();

    expect(player.megaCredits).to.eq(13);
    expect(player2.megaCredits).to.eq(7);
  });

  it('Should trade - do not steal', () => {
    player.megaCredits = 10;
    player2.megaCredits = 10;

    hygiea.trade(player);
    runAllActions(game);
    const orOptions = cast(player.popWaitingFor(), OrOptions);
    expect(orOptions.options).has.length(2);
    orOptions.options[1].cb();

    expect(player.megaCredits).to.eq(10);
    expect(player2.megaCredits).to.eq(10);
  });

  it('Should give trade bonus', () => {
    hygiea.addColony(player);

    hygiea.trade(player2);
    runAllActions(game);

    expect(player.megaCredits).to.eq(3);
    expect(player2.megaCredits).to.eq(0);
  });

  it('Stealing compatible with Law Suit', () => {
    const lawSuit = new LawSuit();
    player2.cardsInHand.push(lawSuit);

    player.megaCredits = 10;
    player2.megaCredits = 10;

    expect(lawSuit.canPlay(player2)).is.false;

    hygiea.trade(player);
    runAllActions(game);
    const orOptions = cast(player.popWaitingFor(), OrOptions);
    expect(orOptions.options).has.length(2);
    orOptions.options[0].cb();

    expect(player.megaCredits).to.eq(13);
    expect(player2.megaCredits).to.eq(7);

    expect(lawSuit.canPlay(player2)).is.true;
    const selectPlayer = cast(lawSuit.play(player2), SelectPlayer);
    selectPlayer.cb(player);

    expect(player.megaCredits).to.eq(10);
    expect(player2.megaCredits).to.eq(10);
    expect(player.playedCards).to.have.members([lawSuit]);
  });
});
