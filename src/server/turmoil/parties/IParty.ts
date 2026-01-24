import {PartyName} from '../../../common/turmoil/PartyName';
import {IGame} from '../../IGame';
import {IBonus} from '../Bonus';
import {IPolicy} from '../Policy';
import {Delegate} from '../Turmoil';
import {MultiSet} from 'mnemonist';

export interface IParty {
    name: PartyName;
    delegates: MultiSet<Delegate>;
    partyLeader: undefined | Delegate;
    sendDelegate(playerId: Delegate, game: IGame): void;
    removeDelegate(playerId: Delegate, game: IGame): void;
    bonuses: ReadonlyArray<IBonus>;
    policies: ReadonlyArray<IPolicy>;
}
