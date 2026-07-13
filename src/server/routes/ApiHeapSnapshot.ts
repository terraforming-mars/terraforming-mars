import * as v8 from 'node:v8';
import {Readable, Writable} from 'node:stream';
import {pipeline} from 'node:stream/promises';
import * as responses from '../server/responses';
import {Handler} from './Handler';
import {Context} from './IHandler';
import {Request} from '../Request';
import {Response} from '../Response';

type SnapshotSource = () => Readable;

/**
 * Streams a V8 heap snapshot of the running server, gated behind serverId.
 *
 * Intended for diagnosing memory growth on hosts with an ephemeral filesystem
 * (containers, most PaaS providers), where there's no easy way to copy a
 * snapshot file off the running instance. Streaming over HTTP(S) sidesteps that.
 *
 * Caveats when running this against a live server:
 * - Generating a snapshot roughly doubles heap usage while it runs, which can
 *   itself trigger an OOM kill on an instance already near its memory ceiling.
 *   Prefer to capture early in the process's life (or on a larger instance).
 * - Snapshots can be hundreds of MB. Always save to a file (curl -o ...).
 */
export class ApiHeapSnapshot extends Handler {
  public static readonly INSTANCE = new ApiHeapSnapshot();

  private readonly snapshotSource: SnapshotSource;
  private constructor(snapshotSource: SnapshotSource = () => v8.getHeapSnapshot()) {
    super({validateServerId: true});
    this.snapshotSource = snapshotSource;
  }

  public static forTesting(snapshotSource: SnapshotSource): ApiHeapSnapshot {
    return new ApiHeapSnapshot(snapshotSource);
  }

  public override async get(req: Request, res: Response, _ctx: Context): Promise<void> {
    try {
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', 'attachment; filename="server.heapsnapshot"');
      // getHeapSnapshot() returns a Readable. Pipe it out with backpressure so
      // we never hold the whole (potentially huge) snapshot in memory at once.
      // The narrowed Response type omits stream methods, but the runtime object
      // is a full http.ServerResponse (a Writable), so this cast is safe.
      await pipeline(this.snapshotSource(), res as unknown as Writable);
    } catch (err) {
      console.error('ApiHeapSnapshot', err);
      // If piping already started, headers/data may be sent; this is best-effort.
      responses.badRequest(req, res, 'could not create heap snapshot');
    } finally {
      console.log('Heap snapshot done');
    }
  }
}
