import {expect} from 'chai';
import {SoilExport} from '../../../src/server/cards/underworld/SoilExport';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {assertIsExcavationAction} from '../../underworld/underworldAssertions';
import {JupiterFloatingStation} from '../../../src/server/cards/colonies/JupiterFloatingStation';

describe('SoilExport', () => {
  it('Should play', () => {
    const card = new SoilExport();
    const [game, player] = testGame(2, {underworldExpansion: true});
    const jupiterFloatingStation = new JupiterFloatingStation();
    player.playedCards.push(jupiterFloatingStation);

    cast(card.play(player), undefined);
    runAllActions(game);

    assertIsExcavationAction(player, player.popWaitingFor());

    runAllActions(game);

    expect(jupiterFloatingStation.resourceCount).eq(3);
  });
});
