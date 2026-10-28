// October 2026 Node security releases. Review these floors when advisories change.
export const NODE_ENGINE_RANGE = '^22.23.4 || ^24.22.1 || ^26.12.1'

const floors: Record<number, [number, number]> = {
  22: [23, 4],
  24: [22, 1],
  26: [12, 1]
}

export function isSupportedNodeVersion(version: string): boolean {
  const match = /^v?(\d+)\.(\d+)\.(\d+)$/.exec(version)
  if (!match) return false
  const [major, minor, patch] = match.slice(1).map(Number)
  const floor = floors[major]
  return Boolean(floor && (minor > floor[0] || (minor === floor[0] && patch >= floor[1])))
}

export function assertSupportedNodeVersion(version = process.versions.node): void {
  if (!isSupportedNodeVersion(version)) {
    throw new Error(
      `LittleBrand MCP requires a security-patched Node release (${NODE_ENGINE_RANGE}); found ${version}. Upgrade Node and restart the client.`
    )
  }
}
