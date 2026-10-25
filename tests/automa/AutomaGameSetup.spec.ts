import {expect} from 'chai';
import {testGame} from '../TestGame';
import {addCity} from '../TestingUtils';
import {Game} from '../../src/server/Game';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {PartyName} from '../../src/common/turmoil/PartyName';
import {DELEGATES_PER_PLAYER} from '../../src/common/constants';

describe('AutomaGameSetup', () => {
  it('plays a one player automa game against MarsBot instead of the solo rules', () => {
    const [game, human] = testGame(1, {automa: true});

    const marsBot = game.marsBotPlayer!;
    expect(game.players).deep.eq([human]);
    expect(game.allPlayers).deep.eq([human, marsBot]);
    expect(game.isSoloMode()).is.false;
    expect(game.board.spaces.filter((space) => space.tile !== undefined)).is.empty;
  });

  it('keeps what MarsBot owns when the game is loaded', () => {
    const [game] = testGame(1, {automa: true, turmoilExtension: true});
    const marsBot = game.marsBotPlayer!;
    const city = addCity(marsBot);
    Turmoil.getTurmoil(game).sendDelegateToParty(marsBot, PartyName.GREENS, game);
    game.claimedMilestones.push({milestone: game.milestones[0], player: marsBot});
    game.fundedAwards.push({award: game.awards[0], player: marsBot});

    const loaded = Game.deserialize(game.serialize());

    const loadedBot = loaded.marsBotPlayer!;
    expect(loadedBot.id).eq(marsBot.id);
    expect(loaded.board.getSpaceOrThrow(city.id).player).eq(loadedBot);
    const turmoil = Turmoil.getTurmoil(loaded);
    expect(turmoil.getPartyByName(PartyName.GREENS).delegates.get(loadedBot)).eq(1);
    expect(turmoil.delegateReserve.get(loadedBot)).eq(DELEGATES_PER_PLAYER - 1);
    expect(loaded.claimedMilestones[0].player).eq(loadedBot);
    expect(loaded.fundedAwards[0].player).eq(loadedBot);
  });
});
