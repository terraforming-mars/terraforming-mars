// Types of the JSON files generated into src/genfiles. Declaring them here keeps type
// checking working on a clean checkout, before make:static / make:cards have run.

declare module '@/genfiles/cards.json' {
  const cards: Array<import('@/common/cards/ClientCard').ClientCard>;
  export default cards;
}

declare module '@/genfiles/milestones.json' {
  const milestones: Array<import('@/common/ma/ClientMilestoneAward').ClientMilestone>;
  export default milestones;
}

declare module '@/genfiles/awards.json' {
  const awards: Array<import('@/common/ma/ClientMilestoneAward').ClientAward>;
  export default awards;
}

declare module '@/genfiles/colonies.json' {
  const colonies: Array<import('@/common/colonies/ColonyMetadata').ColonyMetadata>;
  export default colonies;
}

declare module '@/genfiles/events.json' {
  const events: Array<import('@/common/turmoil/ClientGlobalEvent').ClientGlobalEvent>;
  export default events;
}

declare module '@/genfiles/agendas.json' {
  const agendas: Partial<Record<
    import('@/common/turmoil/Types').BonusId | import('@/common/turmoil/Types').PolicyId,
    import('@/common/turmoil/ClientAgenda').ClientAgenda
  >>;
  export default agendas;
}

declare module '@/genfiles/settings.json' {
  const settings: {
    head: string;
    builtAt: string;
    waitingForTimeout: number;
    logLength: number;
    discordClientId: string;
  };
  export default settings;
}
