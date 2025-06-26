import {expect} from 'chai';
import {ApiLogout} from '../../src/server/routes/ApiLogout';
import {MockResponse} from './HttpMocks';
import {RouteTestScaffolding} from './RouteTestScaffolding';
import {statusCode} from '../../src/common/http/statusCode';
import {DiscordUser} from '@/server/server/auth/discord';

describe('ApiLogout', () => {
  let scaffolding: RouteTestScaffolding;
  let res: MockResponse;

  beforeEach(() => {
    scaffolding = new RouteTestScaffolding();
    scaffolding.url = '/api/logout';
    res = new MockResponse();
  });

  it('no session id', async () => {
    await scaffolding.get(ApiLogout.INSTANCE, res);
    expect(res.statusCode).eq(statusCode.unprocessableEntity);
    expect(res.content).eq('Not logged in.');
  });

  it('invalid session id', async () => {
    // Invalid session IDs are ignored so as to not help find session ids.
    scaffolding.ctx.sessionid = 'unknown';
    await scaffolding.get(ApiLogout.INSTANCE, res);
    expect(res.statusCode).eq(statusCode.found);
    expect(res.content).eq('');
    expect(res.headers.get('Set-Cookie'))
      .eq('sessionId=deleted; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
  });

  it('valid session id', async () => {
    const user: DiscordUser = {id: 'hello', username: 'there', discriminator: '333'};
    const sessionManager = scaffolding.ctx.sessionManager;
    const sessionid = await sessionManager.create(user);
    expect(sessionManager.sessionIds()).deep.eq([sessionid]);
    scaffolding.ctx.sessionid = sessionid;

    await scaffolding.get(ApiLogout.INSTANCE, res);

    expect(res.statusCode).eq(statusCode.found);
    expect(res.content).eq('');
    expect(res.headers.get('Set-Cookie'))
      .eq('sessionId=deleted; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
    expect(sessionManager.sessionIds()).is.empty;
  });
});
