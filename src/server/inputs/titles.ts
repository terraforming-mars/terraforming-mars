import {CardName} from '../../common/cards/CardName';
import {PartyName} from '../../common/turmoil/PartyName';
import {newMessage} from '../logs/MessageBuilder';

export const TITLES = {
  action: 'Select how to pay for action',
  payForCardAction: (cardName: CardName) => newMessage('Select how to pay for ${0} action', (b) => b.cardName(cardName)),
  payForPartyAction: (partyName: PartyName) => newMessage('Select how to pay for Turmoil ${0} action', (b) => b.partyName(partyName)),
} as const;
