// Do not reorder these. Values are persisted in serialized game logs.
export enum LogMessageType {
    DEFAULT = 0,
    NEW_GENERATION = 1,
    // TODO(kberg): remove this by 2026-09-01
    // 2 was ANNOUNCEMENT (the "Mars is terraformed!" log line). It is retired, but old games may
    // still carry messages with type 2. Don't reuse this value: an unknown type renders as a
    // regular message, which is what we want for those.
}
