import {Game} from '../../../src/Game';
import {IMoonData} from '../../../src/moon/IMoonData';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {Player} from '../../../src/Player';
import {setCustomGameOptions, TestPlayers} from '../../TestingUtils';
import {ImprovedMoonConcrete} from '../../../src/cards/moon/ImprovedMoonConcrete';
import {expect} from 'chai';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('ImprovedMoonConcrete', () => {
  let game: Game;
  let player: Player;
  let moonData: IMoonData;
  let card: ImprovedMoonConcrete;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('id', [player], player, MOON_OPTIONS);
    moonData = MoonExpansion.moonData(game);
    card = new ImprovedMoonConcrete();
  });

  it('play', () => {
    player.cardsInHand.push(card);

    card.play();

    expect(moonData).is.not.undefined;
  });
});

