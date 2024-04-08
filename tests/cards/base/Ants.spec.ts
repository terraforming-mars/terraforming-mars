import {expect} from 'chai';
import {Ants} from '../../../src/server/cards/base/Ants';
import {Fish} from '../../../src/server/cards/base/Fish';
import {NitriteReducingBacteria} from '../../../src/server/cards/base/NitriteReducingBacteria';
import {ProtectedHabitats} from '../../../src/server/cards/base/ProtectedHabitats';
import {SecurityFleet} from '../../../src/server/cards/base/SecurityFleet';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {Game} from '../../../src/server/Game';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';
import {runAllActions, cast, churnAction, setOxygenLevel} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('Ants', function() {
  let card: Ants;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new Ants();
    [game, player, player2] = testGame(2);
  });

  it('Can not play without oxygen', function() {
    setOxygenLevel(game, 3);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    setOxygenLevel(game, 4);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    card.resourceCount += 5;
    expect(card.getVictoryPoints(player)).to.eq(2);
  });

  it('Should action with multiple valid targets', function() {
    const tardigrades = new Tardigrades();
    const nitriteReducingBacteria = new NitriteReducingBacteria();

    player.playedCards.push(card);
    expect(card.canAct(player)).is.not.true;

    player2.playedCards.push(tardigrades, nitriteReducingBacteria);
    tardigrades.resourceCount++;
    nitriteReducingBacteria.resourceCount++;

    expect(card.canAct(player)).is.true;

    const selectCard = cast(churnAction(card, player), SelectCard);
    expect(selectCard.cards).has.lengthOf(2);
    selectCard.cb([selectCard.cards[0]]);
    runAllActions(game);

    expect(card.resourceCount).to.eq(1);
    expect(tardigrades.resourceCount).to.eq(0);
  });

  it('Respects protected habitats', function() {
    const protectedHabitats = new ProtectedHabitats();
    const tardigrades = new Tardigrades();

    player.playedCards.push(card);
    player2.playedCards.push(tardigrades);
    tardigrades.resourceCount += 2;
    expect(card.canAct(player)).is.true;

    player2.playedCards.push(protectedHabitats);
    expect(card.canAct(player)).is.not.true;
  });

  it('Only microbes are available to steal', function() {
    const tardigrades = new Tardigrades(); // card with microbes
    const fish = new Fish(); // card with animals
    const securityFleet = new SecurityFleet(); // card with fighters

    player.playedCards.push(card);
    player2.playedCards.push(tardigrades, fish, securityFleet);
    player2.addResourceTo(tardigrades);
    player2.addResourceTo(fish);
    player2.addResourceTo(securityFleet);

    expect(churnAction(card, player)).is.undefined;

    expect(card.resourceCount).to.eq(1);
    expect(tardigrades.resourceCount).to.eq(0);
  });
});
