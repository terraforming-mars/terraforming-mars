import {expect} from 'chai';
import {deserializeFundedAwards, serializeFundedAwards} from '../../src/server/awards/FundedAward';
import {FundedAward} from '../../src/server/awards/FundedAward';
import {Cultivator} from '../../src/server/awards/Cultivator';
import {Industrialist} from '../../src/server/awards/Industrialist';
import {TestPlayer} from '../TestPlayer';

describe('FundedAwards', function() {
  it('test serialization', () => {
    const bluePlayer = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
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
