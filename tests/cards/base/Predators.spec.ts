import {expect} from 'chai';
import {BioengineeringEnclosure} from '../../../src/cards/ares/BioengineeringEnclosure';
import {Fish} from '../../../src/cards/base/Fish';
import {Pets} from '../../../src/cards/base/Pets';
import {Predators} from '../../../src/cards/base/Predators';
import {ProtectedHabitats} from '../../../src/cards/base/ProtectedHabitats';
import {SmallAnimals} from '../../../src/cards/base/SmallAnimals';
import {ICard} from '../../../src/cards/ICard';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('Predators', function() {
  let card : Predators; let player : Player; let player2 : Player; let game : Game;

  beforeEach(function() {
    card = new Predators();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
  });

  it('Can\'t play', function() {
    expect(card.canAct(player)).is.not.true;
  });

  it('Should play', function() {
    (game as any).oxygenLevel = 11;
    expect(card.canPlay(player)).is.true;
    player.playedCards.push(card);
    card.play();

    player.addResourceTo(card, 5);
    expect(card.getVictoryPoints()).to.eq(5);
  });

  it('Should act', function() {
    const fish = new Fish();
    const smallAnimals = new SmallAnimals();
    player.playedCards.push(card, fish, smallAnimals);
    player.addResourceTo(fish);
    player.addResourceTo(smallAnimals);

    card.action(player);
    const selectCard = game.deferredActions.pop()!.execute() as SelectCard<ICard>;
    expect(selectCard.cards).has.lengthOf(2);
    selectCard.cb([selectCard.cards[0]]);
        game.deferredActions.pop()!.execute(); // Add animal to predators

        expect(card.resourceCount).to.eq(1);
        expect(fish.resourceCount).to.eq(0);
  });

  it('Respects pets', function() {
    player.playedCards.push(card);
    const fish = new Fish();
    const pets = new Pets();

    player2.playedCards.push(pets, fish);
    player2.addResourceTo(pets);
    player2.addResourceTo(fish);

    expect(card.canAct(player)).is.true;

    card.action(player);
    const selectCard = game.deferredActions.pop()!.execute() as SelectCard<ICard>;
    expect(selectCard).is.undefined; // Only one option: Fish
        game.deferredActions.pop()!.execute(); // Add animal to predators

        expect(card.resourceCount).to.eq(1);
        expect(fish.resourceCount).to.eq(0);
        expect(pets.resourceCount).to.eq(1);
  });

  it('Respects Bioengineering Enclosure', function() {
    player.playedCards.push(card);
    const fish = new Fish();
    const bioengineeringEnclosure = new BioengineeringEnclosure();

    player2.playedCards.push(bioengineeringEnclosure, fish);
    player2.addResourceTo(bioengineeringEnclosure);
    player2.addResourceTo(fish);

    expect(card.canAct(player)).is.true;

    card.action(player);
    const selectCard = game.deferredActions.pop()!.execute() as SelectCard<ICard>;
    expect(selectCard).is.undefined; // Only one option: Fish
        game.deferredActions.pop()!.execute(); // Add animal to predators

        expect(card.resourceCount).to.eq(1);
        expect(fish.resourceCount).to.eq(0);
        expect(bioengineeringEnclosure.resourceCount).to.eq(1);
  });

  it('Respects protected habitats', function() {
    player.playedCards.push(card);
    const fish = new Fish();
    const animals = new SmallAnimals();

    player2.playedCards.push(animals, fish, new ProtectedHabitats());
    player2.addResourceTo(animals);
    player2.addResourceTo(fish);

    expect(card.canAct(player)).is.not.true;
  });
});
