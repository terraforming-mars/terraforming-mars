import {expect} from 'chai';
import {ElectroCatapult} from '../../../src/server/cards/base/ElectroCatapult';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {Resource} from '../../../src/common/Resource';
import {TestPlayer} from '../../TestPlayer';
import {churnAction, cast, setOxygenLevel} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('ElectroCatapult', () => {
  let card: ElectroCatapult;
  let player: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new ElectroCatapult();
    [game, player] = testGame(2);
  });

  it('Cannot play without energy production', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Cannot play if oxygen level too high', () => {
    player.production.add(Resource.ENERGY, 1);
    setOxygenLevel(game, 9);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can play', () => {
    player.production.override({energy: 1});
    setOxygenLevel(game, 8);
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    player.production.add(Resource.ENERGY, 1);
    player.playCard(card);

    expect(player.production.energy).to.eq(0);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });
  it('Should act', () => {
    player.stock.plants = 1;
    player.stock.steel = 1;

    const orOptions = cast(churnAction(card, player), OrOptions);
    expect(orOptions.options).has.lengthOf(2);

    orOptions.options[0].cb();
    expect(player.stock.plants).to.eq(0);
    expect(player.stock.megacredits).to.eq(7);

    orOptions.options[1].cb();
    expect(player.stock.steel).to.eq(0);
    expect(player.stock.megacredits).to.eq(14);
  });
});
