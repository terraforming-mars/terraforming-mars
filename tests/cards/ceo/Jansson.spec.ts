import {expect} from 'chai';
import {Jansson} from '../../../src/server/cards/ceos/Jansson';
import {addGreenery} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';


describe('Jansson', () => {
  let card: Jansson;
  let player: TestPlayer;

  beforeEach(() => {
    card = new Jansson();
    [/* game */, player] = testGame(2);
  });

  it('Can only act once per game', () => {
    card.action(player);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });

  it('Takes action', () => {
    expect(player.plants).eq(0);
    addGreenery(player, '35');
    expect(player.plants).eq(2);
    card.action(player);
    expect(player.plants).eq(4);
  });

  it('Do not get bonuses from tiles on the Moon', () => {
    const [moonGame, player] = testGame(2, {ceoExtension: true, moonExpansion: true});
    const moonData = MoonExpansion.moonData(moonGame);
    const spaces = moonData.moon.getAvailableSpacesOnLand(player);
    expect(player.steel).eq(0);
    expect(player.titanium).eq(0);
    expect(player.cardsInHand).is.empty;
    MoonExpansion.addHabitatTile(player, spaces[0].id);
    MoonExpansion.addMineTile(player, spaces[1].id);
    MoonExpansion.addRoadTile(player, spaces[2].id);
    expect(player.steel).eq(1);
    expect(player.titanium).eq(0);
    expect(player.cardsInHand).has.length(1);
    card.action(player);
    expect(player.steel).eq(1);
    expect(player.titanium).eq(0);
    expect(player.cardsInHand).has.length(1);
  });
});
