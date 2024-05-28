import {expect} from 'chai';
import {cast, setVenusScaleLevel} from '../../TestingUtils';
import {Thermophiles} from '../../../src/server/cards/venusNext/Thermophiles';
import {VenusianAnimals} from '../../../src/server/cards/venusNext/VenusianAnimals';
import {VenusianPlants} from '../../../src/server/cards/venusNext/VenusianPlants';
import {IGame} from '../../../src/server/IGame';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('VenusianPlants', function() {
  let card: VenusianPlants;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new VenusianPlants();
    [game, player] = testGame(2);
  });

  it('Can not play', function() {
    setVenusScaleLevel(game, 14);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play - multiple targets', function() {
    setVenusScaleLevel(game, 16);
    expect(card.canPlay(player)).is.true;

    const card2 = new Thermophiles();
    const card3 = new VenusianAnimals();
    player.playedCards.push(card2, card3);

    const action = cast(card.play(player), SelectCard);
    action.cb([card2]);

    expect(card2.resourceCount).to.eq(1);
    expect(game.getVenusScaleLevel()).to.eq(18);
  });

  it('Should play - single target', function() {
    const card2 = new Thermophiles();
    player.playedCards.push(card2);
    setVenusScaleLevel(game, 16);

    card.play(player);
    expect(card2.resourceCount).to.eq(1);
    expect(game.getVenusScaleLevel()).to.eq(18);
  });
});
