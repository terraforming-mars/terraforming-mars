import * as json_constants from '@/client/components/create/json';
import {Expansion} from '@/common/cards/GameModule';
import {JSONValue} from '../../../common/Types';
import {CreateGameModel} from './CreateGameModel';
import {PLAYER_COLORS} from '@/common/Color';
import {NewPlayerModel} from '@/common/game/NewGameConfig';
import {ColonyName} from '@/common/colonies/ColonyName';
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
  public corporations: Array<CardName> = [];
  public preludes: Array<CardName> = [];
  public colonies: Array<ColonyName> = [];
  public bannedCards: Array<CardName> = [];
  public includedCards: Array<CardName> = [];

  constructor(model: CreateGameModel) {
    this.model = model;
    this.warnings = [];
  }

  public applyJSON(json: { [x: string]: JSONValue; }) {
    const players = cast(json['players'], Array<NewPlayerModel>);
    const validationErrors = this.validatePlayers(players);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join('\n'));
    }

    if (json.corporationsDraft !== undefined) {
      this.warnings.push('Corporations draft is no longer available. Future versions might just raise an error, so edit your JSON file.');
    }

    function set<T>(field: string): Array<T> {
      return cast(json[field] ?? [], Array) as Array<T>;
    }

    this.corporations = set(json_constants.CUSTOM_CORPORATIONS);
    this.colonies = set(json_constants.CUSTOM_COLONIES);
    this.bannedCards = set(json_constants.BANNED_CARDS);
    this.includedCards = set(json_constants.INCLUDED_CARDS);
    this.preludes = set(json_constants.CUSTOM_PRELUDES);

    this.model.playersCount = players.length;
    this.model.showColoniesList = this.colonies.length > 0;
    this.model.showBannedCards = this.bannedCards.length > 0;
    this.model.showIncludedCards = this.includedCards.length > 0;
    this.model.showPreludesList = this.preludes.length > 0;

    const oldFields: Record<Expansion, string> = {
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
    for (const expansion of Object.keys(oldFields)) {
      const x = oldFields[expansion as Expansion];
      const val = json[x];
      if (typeof(val) === 'boolean') {
        this.model.expansions[expansion as Expansion] = val;
      }
    }

    // Capture the solar phase option since several of the other results will change
    // it via the watch mechanism.
    this.solarPhaseOption = safeBoolean(json.solarPhaseOption);

    const specialFields = [
      json_constants.CUSTOM_CORPORATIONS,
      json_constants.CUSTOM_COLONIES,
      json_constants.CUSTOM_PRELUDES,
      json_constants.BANNED_CARDS,
      json_constants.INCLUDED_CARDS,
      ...Object.values(oldFields),
      'players',
      'solarPhaseOption',
      'constants'];
    for (const k in json) {
      if (specialFields.includes(k)) continue;
      if (!Object.prototype.hasOwnProperty.call(this.model, k)) {
        this.warnings.push('Unknown property: ' + k);
      }
      // This is safe because of the hasOwnProperty check, above. hasOwnProperty doesn't help with type declarations.
      (this.model as any)[k] = json[k];
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
