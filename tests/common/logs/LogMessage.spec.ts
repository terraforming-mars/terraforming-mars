import {expect} from 'chai';
import {LogMessage} from '../../../src/common/logs/LogMessage';
import {LogMessageType} from '../../../src/common/logs/LogMessageType';

describe('LogMessage', () => {
  it('does not store playerId when undefined on object', () => {
    const noPlayerLog = new LogMessage(LogMessageType.DEFAULT, 'foobar', []);
    expect(noPlayerLog.hasOwnProperty('playerId')).to.be.false;
    const playerLog = new LogMessage(LogMessageType.DEFAULT, 'foobar', [], 'playerId');
    expect(playerLog.hasOwnProperty('playerId')).to.be.true;
  });
});
