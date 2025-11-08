import {expect} from 'chai';
import {ApiIPs} from '../../src/server/routes/ApiIPs';
import {MockResponse} from './HttpMocks';
import {RouteTestScaffolding} from './RouteTestScaffolding';
import {PlayerId, SpectatorId} from '../../src/common/Types';

describe('ApiIPs', () => {
  let res: MockResponse;
  let scaffolding: RouteTestScaffolding;


  beforeEach(() => {
    scaffolding = new RouteTestScaffolding();
    res = new MockResponse();
  });

  it('validates server id', () => {
    scaffolding.url = '/api/ips';
    ApiIPs.INSTANCE.processRequest(scaffolding.req, res, scaffolding.ctx);
    expect(res.content).eq('Not authorized');
  });

  it('simple', async () => {
    scaffolding.url = '/api/ips?serverId=1';
    scaffolding.req.method = 'GET';
    await ApiIPs.INSTANCE.processRequest(scaffolding.req, res, scaffolding.ctx);
    expect(res.content).eq('{}');
  });

  it('a game', async () => {
    const playerId: PlayerId = 'p12345' as const;
    const spectatorId: SpectatorId = 's4356' as const;
    const ipTracker = scaffolding.ctx.ipTracker;
    ipTracker.add('12.15.0.4');
    ipTracker.add('12.15.0.4');
    ipTracker.add('12.15.0.4');
    ipTracker.addParticipant(playerId, '12.15.0.4');
    ipTracker.addParticipant(spectatorId, '12.15.0.5');
    ipTracker.addParticipant(playerId, '12.15.0.5');
    ipTracker.add('12.23.34.45:80');
    await ApiIPs.INSTANCE.get(scaffolding.req, res, scaffolding.ctx);
    const expected = {
      '12.15.0.4': {
        'count': 3,
        'ids': [
          'p12345',
        ],
      },
      '12.15.0.5': {
        'count': 0,
        'ids': [
          's4356',
          'p12345',
        ],
      },
      '12.23.34.45:80': {
        'count': 1,
        'ids': [],
      },
    };
    expect(JSON.parse(res.content)).deep.eq(expected);
  });
});
