/// <reference path="../.astro/types.d.ts" />
/// <reference path="../worker-configuration.d.ts" />

type Runtime = import('@astrojs/cloudflare').Runtime<{
    PORTFOLIO_DATA: KVNamespace;
    ADMIN_PASSWORD: string;
}>;

declare namespace App {
    interface Locals extends Runtime {}
}
