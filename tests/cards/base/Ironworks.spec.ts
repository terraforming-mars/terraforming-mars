import {expect} from 'chai';
import {Ironworks} from '../../../src/server/cards/base/Ironworks';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {setRulingParty} from '../../TestingUtils';
import {PartyName} from '../../../src/common/turmoil/PartyName';

describe('Ironworks', () => {
  let card: Ironworks;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Ironworks();
    [game, player] = testGame(2);
  });

  it('Can not act without enough energy', () => {
    player.energy = 3;
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', () => {
    player.energy = 4;
    expect(card.canAct(player)).is.true;

    card.action(player);
    expect(player.energy).to.eq(0);
    expect(player.steel).to.eq(1);
    expect(game.getOxygenLevel()).to.eq(1);
  });

  it('acts approprite when reds are in power and player has no money', () => {
    [game, player] = testGame(1, {turmoilExtension: true});
    setRulingParty(game, PartyName.REDS);
    player.energy = 4;
    player.megaCredits = 3;

    expect(card.canAct(player)).is.true;

    player.megaCredits = 2;

    expect(card.canAct(player)).is.false;
  });
});
