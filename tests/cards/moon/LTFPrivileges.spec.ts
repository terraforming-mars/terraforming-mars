import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {setCustomGameOptions, TestPlayers} from '../../TestingUtils';
import {LTFPrivileges} from '../../../src/cards/moon/LTFPrivileges';
import {expect} from 'chai';
import {CardName} from '../../../src/CardName';
import {MareSerenitatisMine} from '../../../src/cards/moon/MareSerenitatisMine';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('LTFPrivileges', () => {
  let player: Player;
  let card: LTFPrivileges;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('id', [player], player, MOON_OPTIONS);
    card = new LTFPrivileges();
  });


  it('effect', () => {
    // This test and the next show that Mare Sernaitatis needs a steel and 2 titanium.
    player.titanium = 2;
    player.steel = 2;
    player.megaCredits = 1000;

    const msm = new MareSerenitatisMine();
    // TODO(kberg): Find an example that needs 2 steel. For now, hack this card to need 2 steel.
    msm.reserveUnits.steel = 2;
    player.cardsInHand = [msm];
    expect(player.getPlayableCards().map((card) => card.name)).deep.eq([CardName.MARE_SERENITATIS_MINE]);

    player.titanium = 0;
    player.steel = 0;
    expect(player.getPlayableCards().map((card) => card.name)).is.empty;

    // And this one shows that with Improved Moon Concrete, doesn't need steel.
    player.playedCards = [card];
    expect(player.getPlayableCards().map((card) => card.name)).deep.eq([CardName.MARE_SERENITATIS_MINE]);
  });
});

