import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {MoonData} from '../../../src/server/moon/MoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {TestPlayer} from '../../TestPlayer';
import {IronExtractionCenter} from '../../../src/server/cards/moon/IronExtractionCenter';

describe('IronExtractionCenter', () => {
  let game: IGame;
  let player: TestPlayer;
  let moonData: MoonData;
  let card: IronExtractionCenter;

  beforeEach(() => {
    [game, player] = testGame(1, {moonExpansion: true});
    moonData = MoonExpansion.moonData(game);
    card = new IronExtractionCenter();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.stock.titanium = 0;
    player.stock.megacredits = card.cost;
    expect(player.getPlayableCardsForTest()).does.not.include(card);
    player.stock.titanium = 1;
    expect(player.getPlayableCardsForTest()).does.include(card);
  });

  it('play', () => {
    expect(player.production.steel).eq(0);

    player.stock.titanium = 3;
    moonData.miningRate = 3;

    card.play(player);

    expect(player.stock.titanium).eq(2);
    expect(player.production.steel).eq(1);


    // Play a second time. steel rate will go up by 2.
    moonData.miningRate = 4;
    card.play(player);

    expect(player.stock.titanium).eq(1);
    expect(player.production.steel).eq(3);
  });
});
