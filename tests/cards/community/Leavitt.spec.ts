import {expect} from 'chai';
import {Leavitt} from '../../../src/server/cards/community/Leavitt';
import {Vitor} from '../../../src/server/cards/prelude/Vitor';
import {SelfReplicatingRobots} from '../../../src/server/cards/promo/SelfReplicatingRobots';
import {Game} from '../../../src/server/Game';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {Tag} from '../../../src/common/cards/Tag';
import {cast, runAllActions} from '../../TestingUtils';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {testGame} from '../../TestGame';
import {VenusianAnimals} from '../../../src/server/cards/venusNext/VenusianAnimals';

describe('Leavitt', () => {
  let leavitt: Leavitt;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    leavitt = new Leavitt();
    [game, player, player2] = testGame(2, {coloniesExtension: true});
    game.colonies.push(leavitt);
  });

  it('Should build', () => {
    expect(player.tags.count(Tag.SCIENCE)).to.eq(0);
    leavitt.addColony(player);
    expect(player.tags.count(Tag.SCIENCE)).to.eq(1);
    leavitt.addColony(player);
    expect(player.tags.count(Tag.SCIENCE)).to.eq(2);
  });

  it('Science tag bonus should survive deserialization', () => {
    expect(player.tags.count(Tag.SCIENCE)).to.eq(0);
    leavitt.addColony(player);
    expect(player.tags.count(Tag.SCIENCE)).to.eq(1);
    leavitt.addColony(player);
    expect(player.tags.count(Tag.SCIENCE)).to.eq(2);

    const serialized = game.serialize();
    const newGame = Game.deserialize(serialized);
    const newPlayer = newGame.getPlayerById(player.id);
    expect(newPlayer.tags.count(Tag.SCIENCE)).to.eq(2);
  });

  it('Should trade + bonus', () => {
    leavitt.addColony(player2);
    leavitt.trackPosition = 4;
    leavitt.trade(player);
    player.megaCredits = 5;
    player2.megaCredits = 5;
    runAllActions(game);
    const selectCard = cast(player.popWaitingFor(), SelectCard);

    expect(selectCard.cards).has.length(5);

    selectCard.cb([selectCard.cards[0]]);

    expect(player.cardsInHand).deep.eq([selectCard.cards[0]]);

    runAllActions(game);

    const selectCard2 = cast(player2.popWaitingFor(), SelectCard);

    expect(selectCard2.cards).has.length(1);
    expect(selectCard2.config.max).eq(1);

    selectCard2.cb([selectCard2.cards[0]]);

    runAllActions(game);

    expect(player2.megaCredits).eq(2);
    expect(player.megaCredits).eq(5);
    expect(player2.cardsInHand).deep.eq([selectCard2.cards[0]]);
  });

  it('Should trade + bonus, player cannot afford bonus', () => {
    leavitt.addColony(player2);
    leavitt.trackPosition = 4;
    leavitt.trade(player);
    player.megaCredits = 5;
    player2.megaCredits = 1;
    runAllActions(game);
    const selectCard = cast(player.popWaitingFor(), SelectCard);

    expect(selectCard.cards).has.length(5);

    selectCard.cb([selectCard.cards[0]]);

    expect(player.cardsInHand).deep.eq([selectCard.cards[0]]);

    runAllActions(game);

    const selectCard2 = cast(player2.popWaitingFor(), SelectCard);

    expect(selectCard2.cards).has.length(1);
    expect(selectCard2.config.max).eq(0);

    expect(() => selectCard2.cb([selectCard2.cards[0]])).to.throw(/Selected too many cards/);

    selectCard2.cb([]);

    runAllActions(game);

    expect(player2.megaCredits).eq(1);
    expect(player.megaCredits).eq(5);
    expect(player2.cardsInHand).is.empty;
  });

  it('Leavitt is compatible with Vitor', () => {
    // This test verifies that a regression doesn't reoccur.
    // Merely completing these is sufficient because
    // it doesn't throw an Error.
    player.corporations.push(new Vitor());
    expect(player.tags.count(Tag.SCIENCE)).to.eq(0);
    leavitt.addColony(player);
    expect(player.tags.count(Tag.SCIENCE)).to.eq(1);
  });

  it('Leavitt is compatible with Self-Replicating Robots #6664', () => {
    // This test verifies that a regression doesn't reoccur.
    // it doesn't throw an Error.
    player.playedCards.push(new SelfReplicatingRobots());
    expect(player.tags.count(Tag.SCIENCE)).to.eq(0);
    leavitt.addColony(player);
    expect(player.tags.count(Tag.SCIENCE)).to.eq(1);
  });

  // #6349
  it('Leavitt is compatible with Venusian Animals', () => {
    const venusianAnimals = new VenusianAnimals();
    player.playedCards.push(venusianAnimals);

    expect(venusianAnimals.resourceCount).eq(0);

    leavitt.addColony(player);

    expect(venusianAnimals.resourceCount).eq(1);
  });
});
