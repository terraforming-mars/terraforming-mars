import {expect} from "chai";
import {HAL9000} from "../../../src/server/cards/leaders/HAL9000";
import {Game} from "../../../src/server/Game";
import {forceGenerationEnd} from "../../TestingUtils";
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/common/Resources';

describe('HAL 9000', function() {
  let card: HAL9000;
  let player: TestPlayer;
  let player2: TestPlayer;

  beforeEach(() => {
    card = new HAL9000();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, player2], player);
    player.production.add(Resources.PLANTS, 0);
    player.production.add(Resources.MEGACREDITS, -1);
    player.production.add(Resources.STEEL, 1);
    player.production.add(Resources.TITANIUM, 1);
    player.production.add(Resources.ENERGY, 1);
    player.production.add(Resources.HEAT, 1);
  });

  it('Takes OPG action', function() {
    expect(player.production.plants).eq(0);
    expect(player.production.megacredits).eq(-1);
    expect(player.production.steel).eq(1);
    expect(player.production.titanium).eq(1);
    expect(player.production.energy).eq(1);
    expect(player.production.heat).eq(1);
    
    card.action(player);

    expect(player.production.plants).eq(0);
    expect(player.plants).eq(0);

    expect(player.megaCredits).eq(4);
    expect(player.production.megacredits).eq(-2);
    expect(player.steel).eq(4);
    expect(player.production.steel).eq(0);
    expect(player.titanium).eq(4);
    expect(player.production.titanium).eq(0);
    expect(player.energy).eq(4);
    expect(player.production.energy).eq(0);
    expect(player.heat).eq(4);
    expect(player.production.heat).eq(0);
  });

  it('Can only act once per game', function() {
    card.action(player);
    forceGenerationEnd(player.game);
    expect(card.isDisabled).is.true;
    expect(card.canAct()).is.false;
  });
});
