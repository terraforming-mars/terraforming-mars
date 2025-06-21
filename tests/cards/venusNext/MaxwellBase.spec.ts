import {expect} from 'chai';
import {Birds} from '../../../src/server/cards/base/Birds';
import {AerialMappers} from '../../../src/server/cards/venusNext/AerialMappers';
import {MaxwellBase} from '../../../src/server/cards/venusNext/MaxwellBase';
import {StratosphericBirds} from '../../../src/server/cards/venusNext/StratosphericBirds';
import {IGame} from '../../../src/server/IGame';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {Resource} from '../../../src/common/Resource';
import {cast, churn, runAllActions, setVenusScaleLevel} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {FloaterUrbanism} from '../../../src/server/cards/pathfinders/FloaterUrbanism';

describe('MaxwellBase', () => {
  let card: MaxwellBase;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new MaxwellBase();
    [game, player] = testGame(2, {venusNextExtension: true});
  });

  it('Can not play without energy production', () => {
    setVenusScaleLevel(game, 12);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can not play if Venus requirement not met', () => {
    player.production.add(Resource.ENERGY, 1);
    setVenusScaleLevel(game, 10);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    player.production.add(Resource.ENERGY, 1);
    setVenusScaleLevel(game, 12);
    expect(card.canPlay(player)).is.true;

    cast(card.play(player), undefined);
    runAllActions(game);
    expect(player.production.energy).to.eq(0);
  });

  it('Should act - single target', () => {
    const card2 = new Birds();
    const card3 = new AerialMappers();

    player.playedCards.push(card, card2);
    expect(card.canAct(player)).is.not.true;

    player.playedCards.push(card3);
    expect(card.canAct(player)).is.true;
    card.action(player);
    runAllActions(game);
    expect(card3.resourceCount).to.eq(1);
  });

  it('Should act - multiple targets', () => {
    const card2 = new StratosphericBirds();
    const card3 = new AerialMappers();
    player.playedCards.push(card, card2, card3);
    expect(card.canAct(player)).is.true;

    const action = cast(churn(card.action(player), player), SelectCard);
    action.cb([card2]);
    expect(card2.resourceCount).to.eq(1);
  });

  // This may seem like a weird test, but it's just verifying that a change
  // removing legacy code works correctly.
  it('can Play - for a Venus card with an unusual resource', () => {
    expect(card.canAct(player)).is.false;

    const fake = new FloaterUrbanism();
    player.playedCards.push(fake);

    expect(card.canAct(player)).is.true;
  });
});
