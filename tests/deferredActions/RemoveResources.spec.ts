import {expect} from 'chai';
import {TestPlayer} from '../TestPlayer';
import {testGame} from '../TestGame';
import {RemoveResources} from '../../src/server/deferredActions/RemoveResources';
import {Resource} from '../../src/common/Resource';
import {ProtectedHabitats} from '../../src/server/cards/base/ProtectedHabitats';
import {BotanicalExperience} from '../../src/server/cards/pathfinders/BotanicalExperience';
import {LunarSecurityStations} from '../../src/server/cards/moon/LunarSecurityStations';

describe('RemoveResources', function() {
  let player: TestPlayer;
  let target: TestPlayer;

  let removed: number;
  const andThen = (c: number) => {
    removed = c;
  };

  beforeEach(function() {
    [/* game */, player, target] = testGame(3);
    removed = 0;
  });

  it('simple', function() {
    target.stock.plants = 15;
    new RemoveResources(target, player, Resource.PLANTS, 2).andThen(andThen).execute();
    expect(removed).eq(2);
    expect(target.stock.plants).eq(13);
  });

  it('not enough', function() {
    target.stock.plants = 1;
    new RemoveResources(target, player, Resource.PLANTS, 2).andThen(andThen).execute();
    expect(removed).eq(1);
    expect(target.stock.plants).eq(0);
  });

  it('Protected Habitats', function() {
    target.stock.plants = 5;
    target.playedCards.push(new ProtectedHabitats());
    new RemoveResources(target, player, Resource.PLANTS, 2).andThen(andThen).execute();
    expect(removed).eq(0);
    expect(target.stock.plants).eq(5);
  });

  it('Protected Habitats works only for plants', function() {
    target.stock.steel = 5;
    target.playedCards.push(new ProtectedHabitats());
    new RemoveResources(target, player, Resource.STEEL, 2).andThen(andThen).execute();
    expect(removed).eq(2);
    expect(target.stock.steel).eq(3);
  });

  it('Botanical Experience', function() {
    target.stock.plants = 5;
    target.playedCards.push(new BotanicalExperience());
    new RemoveResources(target, player, Resource.PLANTS, 4).andThen(andThen).execute();
    expect(removed).eq(2);
    expect(target.stock.plants).eq(3);
  });

  it('Lunar Security Stations', function() {
    target.stock.steel = 5;
    target.playedCards.push(new LunarSecurityStations());
    new RemoveResources(target, player, Resource.STEEL, 2).andThen(andThen).execute();
    expect(removed).eq(0);
    expect(target.stock.steel).eq(5);
  });

  it('Lunar Security Stations works only for alloys', function() {
    target.stock.plants = 5;
    target.playedCards.push(new LunarSecurityStations());
    new RemoveResources(target, player, Resource.PLANTS, 2).andThen(andThen).execute();
    expect(removed).eq(2);
    expect(target.stock.plants).eq(3);
  });

  // TODO(kberg): Underworld blocking.
});
