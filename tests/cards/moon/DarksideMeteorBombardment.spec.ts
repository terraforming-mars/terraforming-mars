import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {DarksideMeteorBombardment} from '../../../src/server/cards/moon/DarksideMeteorBombardment';
import {expect} from 'chai';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {IMoonData} from '../../../src/server/moon/IMoonData';

describe('DarksideMeteorBombardment', () => {
  let player: TestPlayer;
  let card: DarksideMeteorBombardment;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('gameid', [player], player, {moonExpansion: true});
    card = new DarksideMeteorBombardment();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;
    expect(player.getPlayableCards()).does.include(card);
  });

  it('play', () => {
    player.titanium = 0;
    player.steel = 0;
    moonData.miningRate = 0;
    expect(player.getTerraformRating()).eq(14);

    card.play(player);

    expect(player.titanium).eq(2);
    expect(player.titanium).eq(2);
    expect(moonData.miningRate).eq(2);
    expect(player.getTerraformRating()).eq(16);
  });
});

