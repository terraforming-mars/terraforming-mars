import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {setCustomGameOptions, TestPlayers} from '../../TestingUtils';
import {MoonTether} from '../../../src/cards/moon/MoonTether';
import {expect} from 'chai';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('MoonTether', () => {
  let player: Player;
  let card: MoonTether;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('id', [player], player, MOON_OPTIONS);
    card = new MoonTether();
  });

  it('can play', () => {
    // TODO(kberg): Add a test when m70 is merged.
  });

  it('play', () => {
    card.play();

    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
    expect(card.getCardDiscount()).to.eq(2);
  });
});

