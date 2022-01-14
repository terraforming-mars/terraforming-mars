import {Game} from '../../../src/Game';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {SolarPanelFoundry} from '../../../src/cards/moon/SolarPanelFoundry';
import {expect} from 'chai';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('SolarPanelFoundry', () => {
  let player: TestPlayer;
  let card: SolarPanelFoundry;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('id', [player], player, MOON_OPTIONS);
    card = new SolarPanelFoundry();
  });


  it('can act', () => {
    player.steel = 2;
    expect(card.canAct(player)).is.true;

    player.steel = 1;
    expect(card.canAct(player)).is.false;
  });

  it('act', () => {
    player.steel = 2;
    player.setProductionForTest({energy: 0});

    card.action(player);

    expect(player.getProduction(Resources.ENERGY)).eq(1);
    expect(player.steel).eq(0);
  });
});

