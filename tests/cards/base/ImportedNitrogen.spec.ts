import {expect} from 'chai';
import {Ants} from '../../../src/cards/base/Ants';
import {Birds} from '../../../src/cards/base/Birds';
import {ImportedNitrogen} from '../../../src/cards/base/ImportedNitrogen';
import {Pets} from '../../../src/cards/base/Pets';
import {Tardigrades} from '../../../src/cards/base/Tardigrades';
import {ICard} from '../../../src/cards/ICard';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('ImportedNitrogen', function() {
  let card : ImportedNitrogen; let player : Player; let game : Game;

  beforeEach(function() {
    card = new ImportedNitrogen();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Should play without animals and microbes', function() {
    card.play(player);
    expect(player.getTerraformRating()).to.eq(21);
    expect(player.plants).to.eq(4);
  });

  it('Should play with only animals', function() {
    const pets = new Pets();
    const birds = new Birds();
    player.playedCards.push(pets, birds);
    card.play(player);

    const addMicrobes = game.deferredActions.pop()!.execute() as SelectCard<ICard>;
    expect(addMicrobes).is.undefined;

    const addAnimals = game.deferredActions.pop()!.execute() as SelectCard<ICard>;
    addAnimals.cb([pets]);
    expect(pets.resourceCount).to.eq(2);

    expect(player.getTerraformRating()).to.eq(21);
    expect(player.plants).to.eq(4);
  });

  it('Should play with only microbes', function() {
    const tardigrades = new Tardigrades();
    const ants = new Ants();
    player.playedCards.push(tardigrades, ants);
    card.play(player);

    const addMicrobes = game.deferredActions.pop()!.execute() as SelectCard<ICard>;
    addMicrobes.cb([tardigrades]);
    expect(tardigrades.resourceCount).to.eq(3);

    const addAnimals = game.deferredActions.pop()!.execute() as SelectCard<ICard>;
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
    card.play(player);

    const addMicrobes = game.deferredActions.pop()!.execute() as SelectCard<ICard>;
    addMicrobes.cb([tardigrades]);
    expect(tardigrades.resourceCount).to.eq(3);

    const addAnimals = game.deferredActions.pop()!.execute() as SelectCard<ICard>;
    addAnimals.cb([pets]);
    expect(pets.resourceCount).to.eq(2);

    expect(player.getTerraformRating()).to.eq(21);
    expect(player.plants).to.eq(4);
  });
});
