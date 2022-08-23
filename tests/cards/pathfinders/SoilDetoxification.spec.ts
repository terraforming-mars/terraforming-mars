import {expect} from 'chai';
import {SoilDetoxification} from '../../../src/server/cards/pathfinders/SoilDetoxification';
import {Game} from '../../../src/server/Game';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {EcoLine} from '../../../src/server/cards/corporation/EcoLine';
import {ConvertPlants} from '../../../src/server/cards/base/standardActions/ConvertPlants';
import {Unity} from '../../../src/server/turmoil/parties/Unity';
import {Greens} from '../../../src/server/turmoil/parties/Greens';
import {Units} from '../../../src/common/Units';

describe('SoilDetoxification', function() {
  let card: SoilDetoxification;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new SoilDetoxification();
    game = newTestGame(1, {turmoilExtension: true});
    player = getTestPlayer(game, 0);
  });

  it('canPlay', function() {
    player.megaCredits = card.cost;
    const turmoil = Turmoil.getTurmoil(player.game);
    turmoil.rulingParty = new Unity();
    expect(player.canPlay(card)).is.false;
    turmoil.rulingParty = new Greens();
    expect(player.canPlay(card)).is.true;
  });

  it('play', function() {
    expect(player.production.asUnits()).deep.eq(Units.of({}));
    card.play(player);
    expect(player.production.asUnits()).deep.eq(Units.of({plants: 1}));
  });

  it('standard project', function() {
    card.play(player);

    expect(player.plantsNeededForGreenery).to.eq(7);

    const convert = new ConvertPlants();
    player.plants = 6;
    expect(convert.canAct(player)).eq(false);
    player.plants = 7;
    expect(convert.canAct(player)).eq(true);
  });

  it('standard project plus ecoline', function() {
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
