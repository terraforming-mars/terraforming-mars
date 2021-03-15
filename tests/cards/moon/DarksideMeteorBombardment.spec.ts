import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {DarksideMeteorBombardment} from '../../../src/cards/moon/DarksideMeteorBombardment';
import {expect} from 'chai';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {IMoonData} from '../../../src/moon/IMoonData';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('DarksideMeteorBombardment', () => {
  let player: Player;
  let card: DarksideMeteorBombardment;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('id', [player], player, MOON_OPTIONS);
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

