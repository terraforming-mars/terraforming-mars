import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {setCustomGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {DarksideMiningSyndicate} from '../../../src/cards/moon/DarksideMiningSyndicate';
import {expect} from 'chai';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {IMoonData} from '../../../src/moon/IMoonData';
import {Resources} from '../../../src/common/Resources';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('DarksideMiningSyndicate', () => {
  let player: Player;
  let card: DarksideMiningSyndicate;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('gameid', [player], player, MOON_OPTIONS);
    card = new DarksideMiningSyndicate();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    expect(player.getPlayableCards()).does.include(card);
  });

  it('play', () => {
    expect(player.getProduction(Resources.TITANIUM)).eq(0);
    expect(moonData.miningRate).eq(0);
    expect(player.getTerraformRating()).eq(14);

    card.play(player);
    expect(moonData.miningRate).eq(1);

    expect(player.getProduction(Resources.TITANIUM)).eq(2);
    expect(player.getTerraformRating()).eq(15);

    card.play(player);
    expect(moonData.miningRate).eq(2);

    expect(player.getProduction(Resources.TITANIUM)).eq(4);
    expect(player.getTerraformRating()).eq(16);

    card.play(player);
    expect(moonData.miningRate).eq(3);

    expect(player.getProduction(Resources.TITANIUM)).eq(5);
    expect(player.getTerraformRating()).eq(17);
  });
});

