import {expect} from 'chai';
import {GeoscanSatellite} from '../../../src/server/cards/underworld/GeoscanSatellite';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {UnderworldExpansion} from '../../../src/server/underworld/UnderworldExpansion';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {CommunicationCenter} from '../../../src/server/cards/pathfinders/CommunicationCenter';
import {EconomicEspionage} from '../../../src/server/cards/pathfinders/EconomicEspionage';
import {SelectCard} from '../../../src/server/inputs/SelectCard';

describe('GeoscanSatellite', () => {
  it('play', () => {
    const card = new GeoscanSatellite();

    const [game, player] = testGame(2, {underworldExpansion: true});

    const communicationCenter = new CommunicationCenter();
    const economicEspionage = new EconomicEspionage();
    const tardigrades = new Tardigrades();

    player.playedCards.push(communicationCenter, economicEspionage, tardigrades);
    cast(card.play(player), undefined);

    runAllActions(game);

    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    expect(UnderworldExpansion.identifiedSpaces(game)).is.empty;
    // Arbitrary space, closer to the middle, so has more selected.
    // I could do better than this. :D
    const space = selectSpace.spaces[10];
    selectSpace.cb(space);

    const expected = [space, ...game.board.getAdjacentSpaces(space)];
    expect(UnderworldExpansion.identifiedSpaces(game)).to.have.members(expected);

    runAllActions(game);

    const selectCard = cast(player.popWaitingFor(), SelectCard);
    expect(selectCard.cards).to.have.members([communicationCenter, economicEspionage]);
    selectCard.cb([economicEspionage]);
    expect(economicEspionage.resourceCount).eq(2);

    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
  });
});
