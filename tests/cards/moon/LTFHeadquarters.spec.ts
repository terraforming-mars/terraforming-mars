import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {LTFHeadquarters} from '../../../src/cards/moon/LTFHeadquarters';
import {expect} from 'chai';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {IMoonData} from '../../../src/moon/IMoonData';
import {BuildColony} from '../../../src/deferredActions/BuildColony';
import {TestPlayers} from '../../TestPlayers';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('LTFHeadquarters', () => {
  let player: Player;
  let card: LTFHeadquarters;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('id', [player], player, MOON_OPTIONS);
    card = new LTFHeadquarters();
    moonData = MoonExpansion.moonData(game);
  });

  it('play', () => {
    expect(player.getTerraformRating()).eq(14);
    expect(moonData.colonyRate).eq(0);

    expect(player.getFleetSize()).eq(1);

    card.play(player);

    const action = player.game.deferredActions.pop();
    expect(action).is.instanceof(BuildColony);

    expect(moonData.colonyRate).eq(1);
    expect(player.getTerraformRating()).eq(15);

    expect(player.getFleetSize()).eq(2);
  });
});

