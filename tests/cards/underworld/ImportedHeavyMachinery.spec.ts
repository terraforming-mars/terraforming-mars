import {expect} from 'chai';

import {ImportedHeavyMachinery} from '../../../src/server/cards/underworld/ImportedHeavyMachinery';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {runAllActions} from '../../TestingUtils';
import {IGame} from '../../../src/server/IGame';
import {UnderworldTestHelper} from '../../underworld/UnderworldTestHelper';

describe('ImportedHeavyMachinery', () => {
  let game: IGame;
  let player: TestPlayer;
  let card: ImportedHeavyMachinery;

  beforeEach(() => {
    [game, player] = testGame(1, {underworldExpansion: true});
    card = new ImportedHeavyMachinery();
  });

  it('can play', () => {
    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    expect(card.play(player)).is.undefined;
    runAllActions(game);
    UnderworldTestHelper.assertIsExcavationAction(player, player.popWaitingFor());
    runAllActions(game);
    UnderworldTestHelper.assertIsExcavationAction(player, player.popWaitingFor());
    runAllActions(game);

    expect(player.popWaitingFor()).is.undefined;
  });
});
