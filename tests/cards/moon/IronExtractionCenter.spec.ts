import {Game} from '../../../src/server/Game';
import {MoonData} from '../../../src/server/moon/MoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {TestPlayer} from '../../TestPlayer';
import {IronExtractionCenter} from '../../../src/server/cards/moon/IronExtractionCenter';
import {expect} from 'chai';

describe('IronExtractionCenter', () => {
  let game: Game;
  let player: TestPlayer;
  let moonData: MoonData;
  let card: IronExtractionCenter;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player, {moonExpansion: true});
    moonData = MoonExpansion.moonData(game);
    card = new IronExtractionCenter();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.titanium = 0;
    player.megaCredits = card.cost;
    expect(player.getPlayableCardsForTest()).does.not.include(card);
    player.titanium = 1;
    expect(player.getPlayableCardsForTest()).does.include(card);
  });

  it('play', () => {
    expect(player.production.steel).eq(0);

    player.titanium = 3;
    moonData.miningRate = 3;

    card.play(player);

    expect(player.titanium).eq(2);
    expect(player.production.steel).eq(1);


    // Play a second time. steel rate will go up by 2.
    moonData.miningRate = 4;
    card.play(player);

    expect(player.titanium).eq(1);
    expect(player.production.steel).eq(3);
  });
});
