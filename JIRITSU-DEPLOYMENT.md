# 自律 (Jiritsu)

Jiritsu is a separate Kaizen-derived app variant. Its code is on the `jiritsu-app` branch so changes to this branch do not change `main` or The Ascent's current Cloudflare Pages deployment.

## Backend

- Supabase project: `wgqtwbiopcukqfgztepl`
- API URL: `https://wgqtwbiopcukqfgztepl.supabase.co`
- The app uses the project's publishable key in its frontend; no service-role key is included.
- Separate tables: `profiles`, `missions`, `submissions`, `submission_photos`, `workout_sessions`, and `workout_exercises`.
- Photo storage is the private `jiritsu-photos` bucket.
- Row-level security is enabled for all public tables and private photo access is owner/admin scoped.

## First use

1. Deploy this branch as a **new Cloudflare Pages project**. Do not change the production branch or settings of the existing Ascent Pages project.
2. In the new Pages project, choose this repository and set its production branch to `jiritsu-app`; use the repository root as the build output directory (no build command is required for this static app).
3. In Supabase Authentication settings, enable **Anonymous Sign-Ins** for the Jiritsu project. The app creates a guest session automatically; users do not enter email addresses or passwords. Each browser/device gets its own anonymous identity.
4. Add the new Pages URL to Supabase's allowed redirect URLs and set it as the site's URL.
5. Open the deployment. The first guest account created is assigned the admin role; select **Set Up Journey** to configure the mission name and unlock codes. Do this yourself before sharing the URL.

The existing Ascent project, its Supabase database, and the `main` branch are not changed by Jiritsu's app code. The separate Cloudflare Pages project still needs to be created in the Cloudflare dashboard because this session has no Cloudflare Pages management action available.
