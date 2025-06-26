import {expect} from 'chai';

import {ImportedHeavyMachinery} from '../../../src/server/cards/underworld/ImportedHeavyMachinery';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {IGame} from '../../../src/server/IGame';
import {assertIsExcavationAction} from '../../underworld/underworldAssertions';

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
    cast(card.play(player), undefined);
    runAllActions(game);
    assertIsExcavationAction(player, player.popWaitingFor());
    runAllActions(game);
    assertIsExcavationAction(player, player.popWaitingFor());
    runAllActions(game);

    expect(player.popWaitingFor()).is.undefined;
  });
});
