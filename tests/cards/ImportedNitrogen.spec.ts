import {expect} from 'chai';
import {ImportedNitrogen} from '../../src/cards/ImportedNitrogen';
import {Color} from '../../src/Color';
import {Player} from '../../src/Player';
import {SelectCard} from '../../src/inputs/SelectCard';
import {Tardigrades} from '../../src/cards/Tardigrades';
import {Ants} from '../../src/cards/Ants';
import {Pets} from '../../src/cards/Pets';
import {Birds} from '../../src/cards/Birds';
import {ICard} from '../../src/cards/ICard';
import {Game} from '../../src/Game';

describe('ImportedNitrogen', function() {
  let card : ImportedNitrogen; let player : Player; let game : Game;

  beforeEach(function() {
    card = new ImportedNitrogen();
    player = new Player('test', Color.BLUE, false);
    game = new Game('foobar', [player, player], player);
  });

  it('Should play without animals and microbes', function() {
    card.play(player, game);
    expect(player.getTerraformRating()).to.eq(21);
    expect(player.plants).to.eq(4);
  });

  it('Should play with only animals', function() {
    const pets = new Pets();
    const birds = new Birds();
    player.playedCards.push(pets, birds);
    card.play(player, game);

    const addMicrobes = game.deferredActions.shift()!.execute() as SelectCard<ICard>;
    expect(addMicrobes).is.undefined;

    const addAnimals = game.deferredActions.shift()!.execute() as SelectCard<ICard>;
    addAnimals.cb([pets]);
    expect(player.getResourcesOnCard(pets)).to.eq(2);

    expect(player.getTerraformRating()).to.eq(21);
    expect(player.plants).to.eq(4);
  });

  it('Should play with only microbes', function() {
    const tardigrades = new Tardigrades();
    const ants = new Ants();
    player.playedCards.push(tardigrades, ants);
    card.play(player, game);

    const addMicrobes = game.deferredActions.shift()!.execute() as SelectCard<ICard>;
    addMicrobes.cb([tardigrades]);
    expect(player.getResourcesOnCard(tardigrades)).to.eq(3);

    const addAnimals = game.deferredActions.shift()!.execute() as SelectCard<ICard>;
    expect(addAnimals).is.undefined;

    expect(player.getTerraformRating()).to.eq(21);
    expect(player.plants).to.eq(4);
  });

  it('Should play with animals and microbes', function() {
    const pets = new Pets();
    const birds = new Birds();
    const tardigrades = new Tardigrades();
    const ants = new Ants();
    player.playedCards.push(pets, tardigrades, birds, ants);
    card.play(player, game);

    const addMicrobes = game.deferredActions.shift()!.execute() as SelectCard<ICard>;
    addMicrobes.cb([tardigrades]);
    expect(player.getResourcesOnCard(tardigrades)).to.eq(3);

    const addAnimals = game.deferredActions.shift()!.execute() as SelectCard<ICard>;
    addAnimals.cb([pets]);
    expect(player.getResourcesOnCard(pets)).to.eq(2);

    expect(player.getTerraformRating()).to.eq(21);
    expect(player.plants).to.eq(4);
  });
});
