import {Game} from '../../../src/Game';
import {IMoonData} from '../../../src/moon/IMoonData';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {Player} from '../../../src/Player';
import {setCustomGameOptions, TestPlayers} from '../../TestingUtils';
import {LTFPrivileges} from '../../../src/cards/moon/LTFPrivileges';
import {expect} from 'chai';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('LTFPrivileges', () => {
  let game: Game;
  let player: Player;
  let moonData: IMoonData;
  let card: LTFPrivileges;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('id', [player], player, MOON_OPTIONS);
    moonData = MoonExpansion.moonData(game);
    card = new LTFPrivileges();
  });

  it('play', () => {
    player.cardsInHand.push(card);

    card.play();

    expect(moonData).is.not.undefined;
  });
});

