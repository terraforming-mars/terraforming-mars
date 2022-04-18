import {expect} from 'chai';
import {Birds} from '../../../src/cards/base/Birds';
import {ICard} from '../../../src/cards/ICard';
import {AerialMappers} from '../../../src/cards/venusNext/AerialMappers';
import {MaxwellBase} from '../../../src/cards/venusNext/MaxwellBase';
import {StratosphericBirds} from '../../../src/cards/venusNext/StratosphericBirds';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/common/Resources';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {CardName} from '../../../src/common/cards/CardName';
import {Tags} from '../../../src/common/cards/Tags';
import {CardType} from '../../../src/common/cards/CardType';
import {CardResource} from '../../../src/common/CardResource';
import {IProjectCard} from '../../../src/cards/IProjectCard';

describe('MaxwellBase', function() {
  let card : MaxwellBase; let player : Player; let game : Game;

  beforeEach(function() {
    card = new MaxwellBase();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const gameOptions = TestingUtils.setCustomGameOptions();
    game = Game.newInstance('foobar', [player, redPlayer], player, gameOptions);
  });

  it('Can\'t play without energy production', function() {
    (game as any).venusScaleLevel = 12;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Can\'t play if Venus requirement not met', function() {
    player.addProduction(Resources.ENERGY, 1);
    (game as any).venusScaleLevel = 10;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    player.addProduction(Resources.ENERGY, 1);
    (game as any).venusScaleLevel = 12;
    expect(player.canPlayIgnoringCost(card)).is.true;

    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
  });

  it('Should act - single target', function() {
    const card2 = new Birds();
    const card3 = new AerialMappers();

    player.playedCards.push(card, card2);
    expect(card.canAct(player)).is.not.true;

    player.playedCards.push(card3);
    expect(card.canAct(player)).is.true;
    card.action(player);
    expect(card3.resourceCount).to.eq(1);
  });

  it('Should act - multiple targets', function() {
    const card2 = new StratosphericBirds();
    const card3 = new AerialMappers();
    player.playedCards.push(card, card2, card3);
    expect(card.canAct(player)).is.true;

    const action = card.action(player);
    expect(action).instanceOf(SelectCard);
    (action as SelectCard<ICard>).cb([card2]);
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
      tags: [Tags.VENUS],
      canPlay: () => true,
      play: () => undefined,
      getVictoryPoints: () => 0,
      cardType: CardType.ACTIVE,
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
