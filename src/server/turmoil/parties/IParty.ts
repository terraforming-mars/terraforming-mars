import {PartyName} from '../../../common/turmoil/PartyName';
import {Game} from '../../Game';
import {Bonus} from '../Bonus';
import {Policy} from '../Policy';
import {PlayerId} from '../../../common/Types';
import {NeutralPlayer} from '../Turmoil';
import {MultiSet} from 'mnemonist';

export interface IParty {
    name: PartyName;
    description: string; // TODO(kberg): fetch description from agenda.
    delegates: MultiSet<PlayerId | NeutralPlayer>;
    partyLeader: undefined | PlayerId | NeutralPlayer;
    sendDelegate: (playerId: PlayerId | NeutralPlayer, game: Game) => void;
    removeDelegate: (playerId: PlayerId | NeutralPlayer, game: Game) => void;
    bonuses: Array<Bonus>;
    policies: Array<Policy>;
}
