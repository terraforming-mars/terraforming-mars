import {expect} from 'chai';
import {ChemicalFactory} from '../../../src/server/cards/underworld/ChemicalFactory';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {UnderworldTestHelper} from '../../underworld/UnderworldTestHelper';

describe('ChemicalFactory', () => {
  let card: ChemicalFactory;
  let game: IGame;
  let player: TestPlayer;

  beforeEach(() => {
    card = new ChemicalFactory();
    [game, player] = testGame(1, {underworldExpansion: true});
  });

  it('play', () => {
    cast(card.play(player), undefined);
    expect(player.underworldData.corruption).eq(2);
  });

  it('canAct', () => {
    expect(card.canAct(player)).is.false;
    player.plants = 1;
    expect(card.canAct(player)).is.true;
  });

  it('action', () => {
    player.plants = 1;
    cast(card.action(player), undefined);
    runAllActions(game);
    expect(player.plants).eq(0);
    UnderworldTestHelper.assertIsExcavationAction(player, player.popWaitingFor());
  });
});
