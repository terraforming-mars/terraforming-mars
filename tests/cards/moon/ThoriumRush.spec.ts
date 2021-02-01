import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {setCustomGameOptions, TestPlayers} from '../../TestingUtils';
import {ThoriumRush} from '../../../src/cards/moon/ThoriumRush';
import {expect} from 'chai';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {IMoonData} from '../../../src/moon/IMoonData';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('ThoriumRush', () => {
  let player: Player;
  let game: Game;
  let card: ThoriumRush;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('id', [player], player, MOON_OPTIONS);
    card = new ThoriumRush();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    expect(player.getPlayableCards()).does.include(card);
  });

  it('play', () => {
    moonData.colonyRate = 0;
    moonData.logisticRate = 0;
    moonData.miningRate = 0;
    expect(player.getTerraformRating()).eq(14);

    card.play(player);

    game.deferredActions.pop()?.execute()?.cb(moonData.moon.getSpace('m02')),
    game.deferredActions.pop()?.execute()?.cb(moonData.moon.getSpace('m03')),
    game.deferredActions.pop()?.execute()?.cb(moonData.moon.getSpace('m04')),

    expect(moonData.colonyRate).eq(1);
    expect(moonData.colonyRate).eq(1);
    expect(moonData.colonyRate).eq(1);
    expect(player.getTerraformRating()).eq(17);
  });
});

