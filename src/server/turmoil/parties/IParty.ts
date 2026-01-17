import {PartyName} from '@/common/turmoil/PartyName';
import {IGame} from '@/server/IGame';
import {IBonus} from '@/server/turmoil/Bonus';
import {IPolicy} from '@/server/turmoil/Policy';
import {Delegate} from '@/server/turmoil/Turmoil';
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
