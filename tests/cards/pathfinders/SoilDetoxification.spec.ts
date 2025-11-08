import {expect} from 'chai';
import {SoilDetoxification} from '../../../src/server/cards/pathfinders/SoilDetoxification';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {EcoLine} from '../../../src/server/cards/corporation/EcoLine';
import {ConvertPlants} from '../../../src/server/cards/base/standardActions/ConvertPlants';
import {Unity} from '../../../src/server/turmoil/parties/Unity';
import {Greens} from '../../../src/server/turmoil/parties/Greens';
import {Units} from '../../../src/common/Units';

describe('SoilDetoxification', () => {
  let card: SoilDetoxification;
  let player: TestPlayer;

  beforeEach(() => {
    card = new SoilDetoxification();
    [/* game */, player] = testGame(1, {turmoilExtension: true});
  });

  it('canPlay', () => {
    player.megaCredits = card.cost;
    const turmoil = Turmoil.getTurmoil(player.game);
    turmoil.rulingParty = new Unity();
    expect(player.canPlay(card)).is.false;
    turmoil.rulingParty = new Greens();
    expect(player.canPlay(card)).is.true;
  });

  it('play', () => {
    expect(player.production.asUnits()).deep.eq(Units.of({}));
    card.play(player);
    expect(player.production.asUnits()).deep.eq(Units.of({plants: 1}));
  });

  it('standard project', () => {
    card.play(player);

    expect(player.plantsNeededForGreenery).to.eq(7);

    const convert = new ConvertPlants();
    player.plants = 6;
    expect(convert.canAct(player)).eq(false);
    player.plants = 7;
    expect(convert.canAct(player)).eq(true);
  });

  it('standard project plus ecoline', () => {
    const ecoline = new EcoLine();
    ecoline.play(player);
    card.play(player);

    expect(player.plantsNeededForGreenery).to.eq(6);

    const convert = new ConvertPlants();
    player.plants = 5;
    expect(convert.canAct(player)).eq(false);
    player.plants = 6;
    expect(convert.canAct(player)).eq(true);
  });
});
