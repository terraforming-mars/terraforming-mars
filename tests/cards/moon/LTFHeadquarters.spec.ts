import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {LTFHeadquarters} from '../../../src/server/cards/moon/LTFHeadquarters';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {MoonData} from '../../../src/server/moon/MoonData';
import {BuildColony} from '../../../src/server/deferredActions/BuildColony';
import {TestPlayer} from '../../TestPlayer';

describe('LTFHeadquarters', () => {
  let game: IGame;
  let player: TestPlayer;
  let card: LTFHeadquarters;
  let moonData: MoonData;

  beforeEach(() => {
    [game, player] = testGame(1, {moonExpansion: true});
    card = new LTFHeadquarters();
    moonData = MoonExpansion.moonData(game);
  });

  it('play', () => {
    expect(player.getTerraformRating()).eq(14);
    expect(moonData.habitatRate).eq(0);

    expect(player.colonies.getFleetSize()).eq(1);

    card.play(player);

    const action = player.game.deferredActions.pop();
    expect(action).is.instanceof(BuildColony);

    expect(moonData.habitatRate).eq(1);
    expect(player.getTerraformRating()).eq(15);

    expect(player.colonies.getFleetSize()).eq(2);
  });
});

