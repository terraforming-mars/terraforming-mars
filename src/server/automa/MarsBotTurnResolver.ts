import {IProjectCard} from '../cards/IProjectCard';
import {ICard} from '../cards/ICard';
import {CardName} from '../../common/cards/CardName';
import {Tag} from '../../common/cards/Tag';
import {GlobalParameter} from '../../common/GlobalParameter';
import {TrackAction} from '../../common/automa/AutomaTypes';
import {cardTagsIncludingEvent} from './MarsBotTags';
import {MarsBotTilePlacer} from './MarsBotTilePlacer';
import {IMarsBot} from './IMarsBot';

/** Resolves the project cards MarsBot plays: their tags advance its tracks, and the spaces reached resolve their icons. */
export class MarsBotTurnResolver {
  constructor(
    private readonly marsBot: IMarsBot,
    public readonly tilePlacer: MarsBotTilePlacer,
  ) {}

  // ---- Project Card Resolution ----

  /** Resolve a project card: advance tracks based on tags. With `firstTagOnly` the other tags are ignored (Thorgate). */
  public resolveProjectCard(original: IProjectCard, firstTagOnly: boolean = false): void {
    this.marsBot.game.log('MarsBot plays ${0}', (b) => b.card(original));

    const allTags = cardTagsIncludingEvent(original);
    const tags = firstTagOnly ? allTags.slice(0, 1) : allTags;
    // Effects below see only the resolved tags. Object.create keeps the prototype (methods like
    // getVictoryPoints).
    const card = firstTagOnly ? Object.create(original, {tags: {value: tags}}) as IProjectCard : original;

    // A card with no tags is still played: its corp and player effects apply below.
    if (tags.length === 0) {
      this.marsBot.game.log('MarsBot takes a Failed Action (card has no tags)');
      this.failedAction();
    }

    // Resolve each tag left-to-right
    let advancedAny = false;
    for (const tag of tags) {
      this.marsBot.notifyTagResolved(tag);
      if (tag === Tag.WILD) {
        // Prelude rule: advance the least-advanced track, topmost if tied
        const leastIndex = this.marsBot.marsBotBoard.getLeastAdvancedTrackIndex();
        this.marsBot.game.log('MarsBot: wild tag advances least-advanced track ${0}', (b) => b.number(leastIndex + 1));
        this.advanceTrack(leastIndex);
        advancedAny = true;
        continue;
      }

      const trackIndex = this.marsBot.marsBotBoard.tagToTrack[tag];
      if (trackIndex === undefined) {
        this.marsBot.game.log('MarsBot: tag ${0} has no matching track, ignored', (b) => b.rawString(tag));
        continue;
      }

      this.advanceTrack(trackIndex);
      advancedAny = true;
    }
    if (!advancedAny && tags.length > 0) {
      this.marsBot.game.log('MarsBot: no tracks advanced');
    }

    // Notify corp of card resolution
    this.marsBot.notifyProjectCardResolved(card);

    // Notify human player's effect cards (Solar Logistics, Saturn Systems, etc.)
    this.notifyPlayerCards(card);
  }

  /**
   * Runs the player's "when any player plays a card" effects for a card MarsBot resolved.
   *
   * MarsBot keeps no resources on its cards, so the effects see the card without a resource
   * type. Otherwise Splice asks MarsBot to pick between M€ and a microbe on the card, and
   * nobody answers for MarsBot.
   */
  public notifyPlayerCards(card: ICard, onlyCards?: ReadonlyArray<CardName>): void {
    const played: ICard = Object.create(card, {resourceType: {value: undefined}});
    for (const effectCard of this.marsBot.humanPlayer.playedCards) {
      if (onlyCards !== undefined && !onlyCards.includes(effectCard.name)) {
        continue;
      }
      this.marsBot.humanPlayer.defer(effectCard.onCardPlayedByAnyPlayer?.(this.marsBot.humanPlayer, played, this.marsBot.player));
    }
  }

  // ---- Track Advancement ----

  private trackName(trackIndex: number): string {
    return this.marsBot.marsBotBoard.tracks[trackIndex]?.definition.tags[0] ?? `Track ${trackIndex}`;
  }

  /**
   * Advance a track by index. Handles chain actions.
   *
   * Returns false when the track was already at its end, which is a Failed Action instead.
   *
   * Once the game has ended no track advances and nothing fails. A final greenery still moves its
   * tracker, without coming through here.
   */
  public advanceTrack(trackIndex: number): boolean {
    const track = this.marsBot.marsBotBoard.tracks[trackIndex];
    const name = this.trackName(trackIndex);
    if (this.marsBot.game.isDoneWithFinalProduction()) {
      this.marsBot.game.log('MarsBot: the game has ended, ${0} track does not advance', (b) => b.rawString(name));
      return false;
    }
    // Moving back up after a regression retriggers nothing (rulebook B, p.3)
    const reAdvance = track.regressedPositions.has(track.position + 1);

    const result = track.advance();

    if (result.type === 'maxed') {
      this.marsBot.game.log('MarsBot: ${0} track at max, Failed Action', (b) => b.rawString(name));
      this.failedAction();
      return false;
    }

    // A cube's effect can move this track on again, so the log keeps the space reached here.
    const position = track.position;

    // Cube trigger — fires BEFORE track icon resolution (corp cubes, colony cubes, trade fleet cube)
    if (this.marsBot.triggerTrackCube(trackIndex, position)) {
      this.marsBot.game.log('MarsBot: ${0} track to ${1}, icon replaced by a corp cube',
        (b) => b.rawString(name).number(position));
    } else if (result.type === 'action') {
      this.marsBot.game.log('MarsBot: ${0} track to ${1}, action: ${2}',
        (b) => b.rawString(name).number(position).rawString(result.action));
      this.resolveTrackAction(result.action, trackIndex);
    } else {
      this.marsBot.game.log('MarsBot: ${0} track to ${1}',
        (b) => b.rawString(name).number(position));
    }

    if (!reAdvance) {
      this.marsBot.notifyTrackSpaceResolved(trackIndex, position);
    }
    return true;
  }

  /**
   * Advance the track for a tag, for a track or bonus effect that names the tag.
   * Returns false when no track takes that tag.
   */
  public advanceTrackOfTag(tag: Tag): boolean {
    const trackIndex = this.marsBot.marsBotBoard.tagToTrack[tag];
    if (trackIndex === undefined) {
      return false;
    }
    if (this.advanceTrack(trackIndex)) {
      this.notifyTagAdvance(tag);
    }
    return true;
  }

  /**
   * Tells the player's cards about an advance that names `tag`, as if a card with that tag was played.
   *
   * A microbe advance resolves Pharmacy Union or Splice (FAQ, rulebook B p.4), and a Jovian one
   * Saturn Systems (TDaver, BGG 3356105). The other tags on a shared track don't count.
   */
  public notifyTagAdvance(tag: Tag): void {
    const cards = tag === Tag.MICROBE ? [CardName.PHARMACY_UNION, CardName.SPLICE] :
      tag === Tag.JOVIAN ? [CardName.SATURN_SYSTEMS] : [];
    if (cards.length > 0) {
      this.notifyPlayerCards({tags: [tag]} as Partial<ICard> as ICard, cards);
    }
  }

  /** Resolve an action icon on a track position. */
  private resolveTrackAction(action: TrackAction, currentTrackIndex: number): void {
    // Parse TR value
    const trMatch = action.match(/^tr(\d+)$/);
    if (trMatch) {
      const amount = parseInt(trMatch[1], 10);
      this.marsBot.player.increaseTerraformRating(amount);
      this.marsBot.game.log('MarsBot gains ${0} TR', (b) => b.number(amount));
      return;
    }

    // Parse tag_N (advance another track by index or tag name)
    if (action.startsWith('tag_')) {
      const value = action.substring(4);
      const numericIndex = parseInt(value, 10);
      if (!isNaN(numericIndex)) {
        this.advanceTrack(numericIndex);
      } else {
        this.advanceTrackOfTag(value as Tag);
      }
      return;
    }

    switch (action) {
    case 'advance':
      this.advanceTrack(currentTrackIndex);
      return;

    case 'milestone':
      if (!this.marsBot.maybeClaimMilestone()) {
        this.failedAction();
      }
      return;

    case 'award':
      if (!this.marsBot.maybeFundAward()) {
        this.failedAction();
      }
      return;

    case 'temperature':
      this.raiseTemperature(1);
      return;

    case 'temperature2':
      this.raiseTemperature(2);
      return;

    case 'greenery':
      this.placeGreenery();
      return;

    case 'ocean':
      this.placeOcean();
      return;

    case 'city':
      this.placeCity();
      return;
    }
  }

  // ---- Terraforming Actions ----

  /** Raises the temperature, or takes a Failed Action when it is already at its maximum. */
  public raiseTemperature(steps: 1 | 2): void {
    if (this.marsBot.game.getTemperature() >= this.marsBot.game.max.temperature) {
      this.failedAction();
      return;
    }
    this.marsBot.raiseTemperature(steps);
  }

  public placeGreenery(): void {
    const space = this.tilePlacer.findGreenerySpace();
    if (space === undefined) {
      this.failedAction();
      return;
    }

    // Place tile and raise oxygen (unless the corp intercepts the raise)
    const raiseOxygen = this.marsBot.game.getOxygenLevel() >= this.marsBot.game.max.oxygen ||
      !this.marsBot.interceptsParameterRaise(GlobalParameter.OXYGEN);
    this.marsBot.game.addGreenery(this.marsBot.player, space, raiseOxygen);

    // MarsBot placement bonuses: 1 MC per icon, 2 MC per adjacent ocean
    this.marsBot.gainMc(this.tilePlacer.getTotalPlacementMC(space));
    this.marsBot.game.log('MarsBot places greenery');
  }

  public placeOcean(): void {
    if (!this.marsBot.game.canAddOcean()) {
      this.failedAction();
      return;
    }
    const space = this.tilePlacer.findOceanSpace();
    if (space === undefined) {
      this.failedAction();
      return;
    }

    if (this.marsBot.interceptsParameterRaise(GlobalParameter.OCEANS)) {
      return;
    }
    this.marsBot.game.addOcean(this.marsBot.player, space);

    // MarsBot placement bonuses
    this.marsBot.gainMc(this.tilePlacer.getTotalPlacementMC(space));
    this.marsBot.game.log('MarsBot places ocean');
  }

  public placeCity(): void {
    const space = this.tilePlacer.findCitySpace();
    if (space === undefined) {
      this.failedAction();
      return;
    }

    this.marsBot.game.addCity(this.marsBot.player, space);

    // MarsBot placement bonuses
    this.marsBot.gainMc(this.tilePlacer.getTotalPlacementMC(space));
    this.marsBot.game.log('MarsBot places city');
  }

  // ---- Utilities ----

  public failedAction(): void {
    const mc = this.marsBot.failedActionMc;
    this.marsBot.gainMc(mc);
    this.marsBot.game.log('MarsBot takes a Failed Action, gains ${0} M€', (b) => b.number(mc));
    this.marsBot.notifyFailedAction();
  }
}
