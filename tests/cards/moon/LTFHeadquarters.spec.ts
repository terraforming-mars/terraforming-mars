import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {testGameOptions} from '../../TestingUtils';
import {LTFHeadquarters} from '../../../src/server/cards/moon/LTFHeadquarters';
import {expect} from 'chai';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {IMoonData} from '../../../src/server/moon/IMoonData';
import {BuildColony} from '../../../src/server/deferredActions/BuildColony';
import {TestPlayer} from '../../TestPlayer';

describe('LTFHeadquarters', () => {
  let player: Player;
  let card: LTFHeadquarters;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true}));
    card = new LTFHeadquarters();
    moonData = MoonExpansion.moonData(game);
  });

  it('play', () => {
    expect(player.getTerraformRating()).eq(14);
    expect(moonData.colonyRate).eq(0);

    expect(player.colonies.getFleetSize()).eq(1);

    card.play(player);

    const action = player.game.deferredActions.pop();
    expect(action).is.instanceof(BuildColony);

    expect(moonData.colonyRate).eq(1);
    expect(player.getTerraformRating()).eq(15);

    expect(player.colonies.getFleetSize()).eq(2);
  });
});

