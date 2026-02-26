import { Sodax } from '@sodax/sdk';

let sodaxInstance: Sodax | null = null;

export function getSodaxInstance(): Sodax {
  if (!sodaxInstance) {
    sodaxInstance = new Sodax();
  }
  return sodaxInstance;
}
