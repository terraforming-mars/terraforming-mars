import {expect} from 'chai';
import {Birds} from '../../../src/server/cards/base/Birds';
import {AerialMappers} from '../../../src/server/cards/venusNext/AerialMappers';
import {MaxwellBase} from '../../../src/server/cards/venusNext/MaxwellBase';
import {StratosphericBirds} from '../../../src/server/cards/venusNext/StratosphericBirds';
import {Game} from '../../../src/server/Game';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {Resource} from '../../../src/common/Resource';
import {cast, churnAction, runAllActions, setVenusScaleLevel} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {CardName} from '../../../src/common/cards/CardName';
import {Tag} from '../../../src/common/cards/Tag';
import {CardType} from '../../../src/common/cards/CardType';
import {CardResource} from '../../../src/common/CardResource';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';
import {testGame} from '../../TestGame';

describe('MaxwellBase', function() {
  let card: MaxwellBase;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new MaxwellBase();
    [game, player] = testGame(2, {venusNextExtension: true});
  });

  it('Can not play without energy production', function() {
    setVenusScaleLevel(game, 12);
    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Can not play if Venus requirement not met', function() {
    player.production.add(Resource.ENERGY, 1);
    setVenusScaleLevel(game, 10);
    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Should play', function() {
    player.production.add(Resource.ENERGY, 1);
    setVenusScaleLevel(game, 12);
    expect(player.simpleCanPlay(card)).is.true;

    cast(card.play(player), undefined);
    runAllActions(game);
    expect(player.production.energy).to.eq(0);
  });

  it('Should act - single target', function() {
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

  it('Should act - multiple targets', function() {
    const card2 = new StratosphericBirds();
    const card3 = new AerialMappers();
    player.playedCards.push(card, card2, card3);
    expect(card.canAct(player)).is.true;

    const action = cast(churnAction(card, player), SelectCard);
    action.cb([card2]);
    expect(card2.resourceCount).to.eq(1);
  });

  // This may seem like a weird test, but it's just verifying that a change
  // removing legacy code works correctly.
  //
  // TODO(kberg): Replace this hand-made card with Floater Urbanism.
  it('can Play - for a Venus card with an unusual resource', function() {
    expect(card.canAct(player)).is.false;

    const fakeCard: IProjectCard = {
      name: 'HELLO' as CardName,
      cost: 1,
      tags: [Tag.VENUS],
      canPlay: () => true,
      play: () => undefined,
      getVictoryPoints: () => 0,
      type: CardType.ACTIVE,
      metadata: {
        cardNumber: '1',
      },
      resourceType: CardResource.SYNDICATE_FLEET,
      resourceCount: 0,
    };
    player.playedCards.push(fakeCard);

    expect(card.canAct(player)).is.true;
  });
});
