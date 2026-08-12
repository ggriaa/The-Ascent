// The Ascent login helper: resolve a user-friendly Access ID to the hidden Supabase auth email.
// The page can call resolveAccessId('Jordan') before supabase.auth.signInWithPassword().
// Keep actual credentials out of source code.

const ACCESS_ID_EMAILS = {
  jordan: 'jordan@the-ascent.local'
};

function resolveAccessId(accessId) {
  const key = String(accessId || '').trim().toLowerCase();
  return ACCESS_ID_EMAILS[key] || null;
}
