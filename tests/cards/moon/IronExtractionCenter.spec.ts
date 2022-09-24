import {Game} from '../../../src/server/Game';
import {IMoonData} from '../../../src/server/moon/IMoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {Player} from '../../../src/server/Player';
import {testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {IronExtractionCenter} from '../../../src/server/cards/moon/IronExtractionCenter';
import {expect} from 'chai';

describe('IronExtractionCenter', () => {
  let game: Game;
  let player: Player;
  let moonData: IMoonData;
  let card: IronExtractionCenter;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true}));
    moonData = MoonExpansion.moonData(game);
    card = new IronExtractionCenter();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.titanium = 0;
    player.megaCredits = card.cost;
    expect(player.getPlayableCards()).does.not.include(card);
    player.titanium = 1;
    expect(player.getPlayableCards()).does.include(card);
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
