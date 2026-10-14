// Jiritsu uses email-based Supabase authentication; no Ascent account mapping is shared.
function resolveAccessId(accessId) {
  return String(accessId || '').trim().toLowerCase();
}
