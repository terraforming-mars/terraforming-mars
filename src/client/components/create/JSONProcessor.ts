import * as json_constants from '@/client/components/create/json';
import {Expansion} from '@/common/cards/GameModule';
import {JSONObject, JSONValue} from '../../../common/Types';
import {CreateGameModel} from './CreateGameModel';
import {PLAYER_COLORS} from '@/common/Color';
import {NewPlayerModel} from '@/common/game/NewGameConfig';
import {CardName} from '@/common/cards/CardName';
import {cast} from '@/common/utils/utils';

function safeBoolean(val: JSONValue): boolean {
  if (typeof val === 'boolean') {
    return val;
  }
  throw new Error(`${val} is not boolean`);
}

export class JSONProcessor {
  public model: CreateGameModel;
  public warnings: Array<string>;
  public solarPhaseOption: boolean = false;
  public bannedCards: Array<CardName> = [];
  public includedCards: Array<CardName> = [];

  constructor(model: CreateGameModel) {
    this.model = model;
    this.warnings = [];
  }

  public applyJSON(json: JSONObject) {
    json = JSON.parse(JSON.stringify(json)); // Make a copy so as to not change the original data.

    const players = cast(json['players'], Array<NewPlayerModel>);
    const validationErrors = this.validatePlayers(players);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join('\n'));
    }

    if (json.corporationsDraft !== undefined) {
      this.warnings.push('Corporations draft is no longer available. Future versions might just raise an error, so edit your JSON file.');
    }

    // Ensures that outdated array fields are still applied.
    function initializeArrayFieldWithBackup(oldFieldName: string, newFieldName: string) {
      const oldValue = json[oldFieldName];
      const newValue = json[newFieldName];

      if (newValue === undefined || cast(newValue, Array).length === 0) {
        json[newFieldName] = oldValue || [];
      }
    }
    initializeArrayFieldWithBackup(json_constants.OLD_CUSTOM_CORPORATIONS, json_constants.CUSTOM_CORPORATIONS);
    initializeArrayFieldWithBackup(json_constants.OLD_CUSTOM_COLONIES, json_constants.CUSTOM_COLONIES);
    initializeArrayFieldWithBackup(json_constants.OLD_BANNED_CARDS, json_constants.BANNED_CARDS);
    const ev = json.escapeVelocity as JSONObject;
    if (ev !== undefined && typeof ev === 'object') {
      json.escapeVelocityMode = true;
      json.escapeVelocityBonusSeconds = ev['bonusSectionsPerAction'];
      json.escapeVelocityPenalty = ev['penaltyVPPerPeriod'];
      json.escapeVelocityPeriod = ev['penaltyPeriodMinutes'];
      json.escapeVelocityThreshold = Number.parseInt(ev['thresholdMinutes'] as string ?? '');
    }

    function set<T>(field: string): Array<T> {
      return cast(json[field] ?? [], Array) as Array<T>;
    }

    this.bannedCards = set(json_constants.BANNED_CARDS);
    this.includedCards = set(json_constants.INCLUDED_CARDS);

    this.model.playersCount = players.length;
    this.model.showBannedCards = this.bannedCards.length > 0;
    this.model.showIncludedCards = this.includedCards.length > 0;

    const oldExpansionFields: Record<Expansion, string> = {
      corpera: json_constants.CORPORATEERA,
      promo: json_constants.PROMOCARDSOPTION,
      venus: json_constants.VENUSNEXT,
      colonies: json_constants.COLONIES,
      prelude: json_constants.PRELUDE,
      prelude2: json_constants.PRELUDE2EXPANSION,
      turmoil: json_constants.TURMOIL,
      community: json_constants.COMMUNITYCARDSOPTION,
      ares: json_constants.ARESEXTENSION,
      moon: json_constants.MOONEXPANSION,
      pathfinders: json_constants.PATHFINDERSEXPANSION,
      ceo: json_constants.CEOEXTENSION,
      starwars: json_constants.STARWARSEXPANSION,
      underworld: json_constants.UNDERWORLDEXPANSION,
    } as const;
    for (const expansion of Object.keys(oldExpansionFields)) {
      const x = oldExpansionFields[expansion as Expansion];
      const val = json[x];
      if (typeof(val) === 'boolean') {
        this.model.expansions[expansion as Expansion] = val;
      }
    }

    // Capture the solar phase option since several of the other results will change
    // it via the watch mechanism.
    this.solarPhaseOption = safeBoolean(json.solarPhaseOption);

    const ignoredFields = [
      // Instead of ignoring these fields, let them pass through to the model.
      // json_constants.CUSTOM_CORPORATIONS,
      // json_constants.CUSTOM_COLONIES,
      // json_constants.CUSTOM_PRELUDES,
      // json_constants.BANNED_CARDS,
      // json_constants.INCLUDED_CARDS,
      json_constants.OLD_BANNED_CARDS,
      json_constants.OLD_CUSTOM_COLONIES,
      json_constants.OLD_CUSTOM_CORPORATIONS,
      ...Object.values(oldExpansionFields),
      'escapeVelocity',
      'players',
      'solarPhaseOption',
      'constants'];
    for (const k in json) {
      if (ignoredFields.includes(k)) {
        continue;
      }
      if (!Object.prototype.hasOwnProperty.call(this.model, k)) {
        this.warnings.push('Unknown property: ' + k);
      } else {
        // This is safe because of the hasOwnProperty check, above. hasOwnProperty doesn't help with type declarations.
        (this.model as any)[k] = json[k];
      }
    }

    for (let i = 0; i < players.length; i++) {
      this.model.players[i] = players[i];
    }
  }

  private validatePlayers(players: Array<NewPlayerModel>): Array<string> {
    const errors = [];

    // Ensure colors are valid and distinct
    const colors = new Set(players.map((p) => p.color));
    for (const color of colors) {
      // `as any` is OK here since this just validates `color`.
      if (PLAYER_COLORS.indexOf(color as any) === -1) {
        errors.push(color + ' is not a color');
      }
    }
    if (colors.size !== players.length) {
      errors.push('Colors are duplicated');
    }
    return errors;
  }
}
