import {expect} from 'chai';
import {ElectroCatapult} from '../../../src/server/cards/base/ElectroCatapult';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';

describe('ElectroCatapult', () => {
  let card: ElectroCatapult;
  let player: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new ElectroCatapult();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Cannot play without energy production', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Cannot play if oxygen level too high', () => {
    player.production.add(Resources.ENERGY, 1);
    (game as any).oxygenLevel = 9;
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can play', () => {
    player.production.override({energy: 1});
    (game as any).oxygenLevel = 8;
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    player.production.add(Resources.ENERGY, 1);
    player.playCard(card);

    expect(player.production.energy).to.eq(0);
    expect(card.getVictoryPoints()).to.eq(1);
  });
  it('Should act', () => {
    player.plants = 1;
    player.steel = 1;

    const action = cast(card.action(player), OrOptions);
    expect(action.options).has.lengthOf(2);

    action.options[0].cb();
    expect(player.plants).to.eq(0);
    expect(player.megaCredits).to.eq(7);

    action.options[1].cb();
    expect(player.steel).to.eq(0);
    expect(player.megaCredits).to.eq(14);
  });
});
