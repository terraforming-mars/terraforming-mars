import {CardName} from '../../../common/cards/CardName';
import {MarsBotCorp} from '../MarsBotCorp';

export type AutomaCorpManifest = Partial<Record<CardName, MarsBotCorp>>;

export type AutomaManifest = {
  corps: AutomaCorpManifest;
};
