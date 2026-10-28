#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
interface Prop {
    name: string;
    type: string;
    required: boolean;
    default?: string;
}
interface Component {
    id: string;
    name: string;
    purpose: string;
    intents: string[];
    use: string;
    avoid: string;
    accessibility: string;
    states: string[];
    related: string[];
    dependencies: string[];
    compoundOnly?: boolean;
    props: Prop[];
    slots: string[];
    emits: string[];
    usage: string;
}
interface Token {
    id: string;
    name: string;
    purpose: string;
    related: string[];
}
interface CatalogComponent {
    name: string;
    purpose: string;
    intents: string[];
    source: string;
    parent?: string;
}
interface Catalog {
    schemaVersion: number;
    packageVersion: string;
    components: CatalogComponent[];
}
interface Reference {
    schemaVersion: number;
    packageVersion: string;
    status: string;
    distribution: string;
    components: Component[];
    tokens: Token[];
}
export declare function createServer(reference?: Reference, catalog?: Catalog): McpServer;
export {};
//# sourceMappingURL=index.d.ts.map