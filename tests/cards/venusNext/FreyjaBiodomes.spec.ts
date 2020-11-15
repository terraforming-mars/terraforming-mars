import {ICard} from '../../../src/cards/ICard';
import {expect} from 'chai';
import {FreyjaBiodomes} from '../../../src/cards/venusNext/FreyjaBiodomes';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Extremophiles} from '../../../src/cards/venusNext/Extremophiles';
import {VenusianAnimals} from '../../../src/cards/venusNext/VenusianAnimals';

describe('FreyjaBiodomes', function() {
  let card : FreyjaBiodomes; let player : Player; let game : Game;

  beforeEach(function() {
    card = new FreyjaBiodomes();
    player = new Player('test', Color.BLUE, false);
    game = new Game('foobar', [player, player], player);
  });

  it('Can\'t play without energy production', function() {
    (game as any).venusScaleLevel = 10;
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Can\'t play if Venus requirement not met', function() {
    player.addProduction(Resources.ENERGY);
    (game as any).venusScaleLevel = 8;
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Should play - single target', function() {
    const card2 = new Extremophiles();
    player.playedCards.push(card2);

    player.addProduction(Resources.ENERGY);
    (game as any).venusScaleLevel = 10;
    expect(card.canPlay(player, game)).is.true;

    card.play(player, game);
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
    expect(player.getResourcesOnCard(card2)).to.eq(2);
  });

  it('Should play - multiple targets', function() {
    const card2 = new Extremophiles();
    const card3 = new VenusianAnimals();
    player.addProduction(Resources.ENERGY);
    player.playedCards.push(card2, card3);

    const action = card.play(player, game) as SelectCard<ICard>;
    expect(action instanceof SelectCard).is.true;

    action.cb([card2]);
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
    expect(player.getResourcesOnCard(card2)).to.eq(2);
  });
});
