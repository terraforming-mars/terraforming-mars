import {expect} from 'chai';
import {deserializeFundedAwards, serializeFundedAwards} from '../../src/awards/FundedAward';
import {FundedAward} from '../../src/awards/FundedAward';
import {Cultivator} from '../../src/awards/Cultivator';
import {Industrialist} from '../../src/awards/Industrialist';
import {TestPlayers} from '../TestPlayers';

describe('FundedAwards', function() {
  it('test serialization', () => {
    const bluePlayer = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const FundedAwards: Array<FundedAward> = [
      {
        award: new Cultivator(),
        player: bluePlayer,
      }, {
        award: new Industrialist(),
        player: redPlayer,
      },
    ];
    const serialized = serializeFundedAwards(FundedAwards);
    expect(serialized).to.deep.eq(
      [
        {'name': 'Cultivator', 'playerId': 'p-blue-id'},
        {'name': 'Industrialist', 'playerId': 'p-red-id'},
      ],
    );

    const cultivator = new Cultivator();
    const industrialist = new Industrialist();
    const deserialized = deserializeFundedAwards(
      serialized,
      [redPlayer, bluePlayer],
      [cultivator, industrialist]);
    expect(deserialized[0].award === cultivator);
    expect(deserialized[0].player === bluePlayer);
    expect(deserialized[1].award === industrialist);
    expect(deserialized[1].player === redPlayer);
  });
});
