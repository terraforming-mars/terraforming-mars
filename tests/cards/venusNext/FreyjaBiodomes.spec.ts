import {expect} from 'chai';
import {ICard} from '../../../src/cards/ICard';
import {Extremophiles} from '../../../src/cards/venusNext/Extremophiles';
import {FreyjaBiodomes} from '../../../src/cards/venusNext/FreyjaBiodomes';
import {VenusianAnimals} from '../../../src/cards/venusNext/VenusianAnimals';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('FreyjaBiodomes', function() {
  let card : FreyjaBiodomes; let player : Player; let game : Game;

  beforeEach(function() {
    card = new FreyjaBiodomes();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play without energy production', function() {
    (game as any).venusScaleLevel = 10;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Can\'t play if Venus requirement not met', function() {
    player.addProduction(Resources.ENERGY, 1);
    (game as any).venusScaleLevel = 8;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play - single target', function() {
    const card2 = new Extremophiles();
    player.playedCards.push(card2);

    player.addProduction(Resources.ENERGY, 1);
    (game as any).venusScaleLevel = 10;
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
    expect(player.getResourcesOnCard(card2)).to.eq(2);
  });

  it('Should play - multiple targets', function() {
    const card2 = new Extremophiles();
    const card3 = new VenusianAnimals();
    player.addProduction(Resources.ENERGY, 1);
    player.playedCards.push(card2, card3);

    const action = card.play(player) as SelectCard<ICard>;
    expect(action).instanceOf(SelectCard);

    action.cb([card2]);
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
    expect(player.getResourcesOnCard(card2)).to.eq(2);
  });
});
