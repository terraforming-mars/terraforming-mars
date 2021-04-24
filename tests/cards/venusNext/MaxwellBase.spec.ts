import {expect} from 'chai';
import {Birds} from '../../../src/cards/base/Birds';
import {ICard} from '../../../src/cards/ICard';
import {AerialMappers} from '../../../src/cards/venusNext/AerialMappers';
import {MaxwellBase} from '../../../src/cards/venusNext/MaxwellBase';
import {StratosphericBirds} from '../../../src/cards/venusNext/StratosphericBirds';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

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
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can\'t play if Venus requirement not met', function() {
    player.addProduction(Resources.ENERGY, 1);
    (game as any).venusScaleLevel = 10;
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.addProduction(Resources.ENERGY, 1);
    (game as any).venusScaleLevel = 12;
    expect(card.canPlay(player)).is.true;

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
    expect(player.getResourcesOnCard(card3)).to.eq(1);
  });

  it('Should act - multiple targets', function() {
    const card2 = new StratosphericBirds();
    const card3 = new AerialMappers();
    player.playedCards.push(card, card2, card3);
    expect(card.canAct(player)).is.true;

    const action = card.action(player);
    expect(action instanceof SelectCard).is.true;
    (action as SelectCard<ICard>).cb([card2]);
    expect(player.getResourcesOnCard(card2)).to.eq(1);
  });
});
