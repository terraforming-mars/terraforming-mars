import {Game} from '../../../src/server/Game';
import {testGameOptions} from '../../TestingUtils';
import {SolarPanelFoundry} from '../../../src/server/cards/moon/SolarPanelFoundry';
import {expect} from 'chai';
import {TestPlayer} from '../../TestPlayer';

describe('SolarPanelFoundry', () => {
  let player: TestPlayer;
  let card: SolarPanelFoundry;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true}));
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
    player.production.override({energy: 0});

    card.action(player);

    expect(player.production.energy).eq(1);
    expect(player.steel).eq(0);
  });
});

