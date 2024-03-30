import {expect} from 'chai';
import {HAL9000} from '../../../src/server/cards/ceos/HAL9000';
import {forceGenerationEnd} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('HAL 9000', function() {
  let card: HAL9000;
  let player: TestPlayer;

  beforeEach(() => {
    card = new HAL9000();
    [/* game */, player] = testGame(2);
    player.production.adjust({plants: 0, megacredits: -1, steel: 1, titanium: 1, energy: 1, heat: 1});
  });

  it('Takes OPG action', function() {
    // Sanity check our production is as expected before taking the action
    expect(player.production.asUnits()).deep.eq({plants: 0, megacredits: -1, steel: 1, titanium: 1, energy: 1, heat: 1});
    card.action(player);
    expect(player.production.asUnits()).deep.eq({plants: 0, megacredits: -2, steel: 0, titanium: 0, energy: 0, heat: 0});
    expect(player.stock.plants).eq(0);
    expect(player.stock.megacredits).eq(4);
    expect(player.stock.steel).eq(4);
    expect(player.stock.titanium).eq(4);
    expect(player.stock.energy).eq(4);
    expect(player.stock.heat).eq(4);
  });

  it('Can only act once per game', function() {
    card.action(player);
    forceGenerationEnd(player.game);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });
});
