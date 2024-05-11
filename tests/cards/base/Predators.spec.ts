import {expect} from 'chai';
import {cast, setOxygenLevel} from '../../TestingUtils';
import {BioengineeringEnclosure} from '../../../src/server/cards/ares/BioengineeringEnclosure';
import {Fish} from '../../../src/server/cards/base/Fish';
import {Pets} from '../../../src/server/cards/base/Pets';
import {Predators} from '../../../src/server/cards/base/Predators';
import {ProtectedHabitats} from '../../../src/server/cards/base/ProtectedHabitats';
import {SmallAnimals} from '../../../src/server/cards/base/SmallAnimals';
import {ICard} from '../../../src/server/cards/ICard';
import {IGame} from '../../../src/server/IGame';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('Predators', function() {
  let card: Predators;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new Predators();
    [game, player, player2] = testGame(2);
  });

  it('Can not play', function() {
    expect(card.canAct(player)).is.not.true;
  });

  it('Should play', function() {
    setOxygenLevel(game, 11);
    expect(card.canPlay(player)).is.true;
    player.playedCards.push(card);
    card.play(player);

    player.addResourceTo(card, 5);
    expect(card.getVictoryPoints(player)).to.eq(5);
  });

  it('Should act', function() {
    const fish = new Fish();
    const smallAnimals = new SmallAnimals();
    player.playedCards.push(card, fish, smallAnimals);
    player.addResourceTo(fish);
    player.addResourceTo(smallAnimals);

    card.action(player);
    const selectCard = cast(game.deferredActions.pop()!.execute(), SelectCard<ICard>);
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
    expect(game.deferredActions.pop()!.execute()).is.undefined; // Only one option: Fish
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
    expect(game.deferredActions.pop()!.execute()).is.undefined; // Only one option: Fish
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
