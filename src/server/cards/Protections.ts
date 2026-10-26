import {ICard} from './ICard';
import {Resource} from '@/common/Resource';
import {CardResource} from '@/common/CardResource';

/** The protection from opponents granted by a set of cards. */
export class Protections {
  private readonly resources = new Set<Resource>();
  private readonly production = new Set<Resource>();
  private readonly cardResources = new Set<CardResource>();

  /** Protections can't be subtracted, since another card may grant the same one, so rebuild from scratch. */
  public static of(cards: Iterable<ICard>): Protections {
    const protections = new Protections();
    for (const card of cards) {
      protections.add(card);
    }
    return protections;
  }

  public add(card: ICard): void {
    const protection = card.protects;
    if (protection === undefined) {
      return;
    }
    protection.resources?.forEach((resource) => this.resources.add(resource));
    protection.production?.forEach((resource) => this.production.add(resource));
    protection.cardResources?.forEach((cardResource) => this.cardResources.add(cardResource));
  }

  public forResource(resource: Resource): boolean {
    return this.resources.has(resource);
  }

  public forProduction(resource: Resource): boolean {
    return this.production.has(resource);
  }

  public forCardResource(cardResource: CardResource): boolean {
    return this.cardResources.has(cardResource);
  }
}
