import {CardName} from '../../../common/cards/CardName';
import {IMarsBotCorp} from '../MarsBotCorpTypes';

export type AutomaCorpManifest = Partial<Record<CardName, IMarsBotCorp>>;

export type AutomaManifest = {
  corps: AutomaCorpManifest;
};
