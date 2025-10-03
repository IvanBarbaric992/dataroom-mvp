export function withSuffix(name: string, n: number): string {
  const m = /^(.*?)(\.[^.]*)?$/.exec(name);
  if (!m) {
    return `${name} (${n.toString()})`;
  }
  const base = m[1];
  const ext = m[2] || '';
  return `${base} (${n.toString()})${ext}`;
}

export function ensureUniqueName(desired: string, existingLower: Set<string>): string {
  const target = desired.toLowerCase();
  if (!existingLower.has(target)) {
    return desired;
  }
  let i = 1;
  while (existingLower.has(withSuffix(desired, i).toLowerCase())) {
    i++;
  }
  return withSuffix(desired, i);
}
