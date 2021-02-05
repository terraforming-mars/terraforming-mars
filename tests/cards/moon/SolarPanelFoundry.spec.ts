import {Game} from '../../../src/Game';
import {setCustomGameOptions, TestPlayers} from '../../TestingUtils';
import {SolarPanelFoundry} from '../../../src/cards/moon/SolarPanelFoundry';
import {expect} from 'chai';
import {Resources} from '../../../src/Resources';
import {TestPlayer} from '../../TestPlayer';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

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

