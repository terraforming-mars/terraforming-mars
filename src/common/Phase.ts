export enum Phase {
    ACTION = 'action',
    END = 'end', // specifically, *game* end.
    PRODUCTION = 'production',
    RESEARCH = 'research',
    INITIALDRAFTING = 'initial_drafting',
    CORPORATIONDRAFTING = 'corporation_drafting',
    DRAFTING = 'drafting',
    PRELUDES = 'preludes',
    LEADERS = 'leaders', // This remains while we rename things to CEOs
    CEOS = 'ceos',
    SOLAR = 'solar',
    INTERGENERATION = 'intergeneration',
}
