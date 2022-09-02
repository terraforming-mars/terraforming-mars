import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {Ants} from '../../../src/server/cards/base/Ants';
import {Birds} from '../../../src/server/cards/base/Birds';
import {ImportedNitrogen} from '../../../src/server/cards/base/ImportedNitrogen';
import {Pets} from '../../../src/server/cards/base/Pets';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {ICard} from '../../../src/server/cards/ICard';
import {Game} from '../../../src/server/Game';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('ImportedNitrogen', function() {
  let card: ImportedNitrogen;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new ImportedNitrogen();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
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

    expect(game.deferredActions.pop()!.execute()).is.undefined;

    const addAnimals = cast(game.deferredActions.pop()!.execute(), SelectCard<ICard>);
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

    const addMicrobes = cast(game.deferredActions.pop()!.execute(), SelectCard<ICard>);
    addMicrobes.cb([tardigrades]);
    expect(tardigrades.resourceCount).to.eq(3);

    expect(game.deferredActions.pop()!.execute()).is.undefined;

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

    const addMicrobes = cast(game.deferredActions.pop()!.execute(), SelectCard<ICard>);
    addMicrobes.cb([tardigrades]);
    expect(tardigrades.resourceCount).to.eq(3);

    const addAnimals = cast(game.deferredActions.pop()!.execute(), SelectCard<ICard>);
    addAnimals.cb([pets]);
    expect(pets.resourceCount).to.eq(2);

    expect(player.getTerraformRating()).to.eq(21);
    expect(player.plants).to.eq(4);
  });
});
