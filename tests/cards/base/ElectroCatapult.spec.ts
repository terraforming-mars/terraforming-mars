import {expect} from 'chai';
import {ElectroCatapult} from '../../../src/server/cards/base/ElectroCatapult';
import {IGame} from '../../../src/server/IGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {Resource} from '../../../src/common/Resource';
import {TestPlayer} from '../../TestPlayer';
import {churn, cast, setOxygenLevel} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('ElectroCatapult', () => {
  let card: ElectroCatapult;
  let player: TestPlayer;
  let game: IGame;

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
    player.plants = 1;
    player.steel = 1;

    const orOptions = cast(churn(card.action(player), player), OrOptions);
    expect(orOptions.options).has.lengthOf(2);

    orOptions.options[0].cb();
    expect(player.plants).to.eq(0);
    expect(player.megaCredits).to.eq(7);

    orOptions.options[1].cb();
    expect(player.steel).to.eq(0);
    expect(player.megaCredits).to.eq(14);
  });
});
