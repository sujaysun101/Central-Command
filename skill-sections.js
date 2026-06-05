(function(){
  const BUCKETS = [
    {id:'all-imported-skills', title:'All imported skills', badge:'Skills', color:'b-gray', desc:'Complete imported catalog from skills.json.', tests:[/.*/i]},
    {id:'claude-code-imported', title:'Claude Code imported skills', badge:'Claude Code', color:'b-green', desc:'Claude Code workflows, plugins, slash commands, agents, hooks, and global automation.', tests:[/claude|gstack|slash|command|hook|subagent|plugin|feature|ship|context/i]},
    {id:'cursor-imported', title:'Cursor imported skills', badge:'Cursor', color:'b-pink', desc:'Cursor IDE rules, plugins, settings, and editor-side automation.', tests:[/cursor|\.cursor|mdc|ide|composer|statusline/i]},
    {id:'codex-imported', title:'Codex imported skills', badge:'Codex', color:'b-amber', desc:'Codex review, rescue, context, model comparison, and second-opinion workflows.', tests:[/codex|openai|context-mode|ctx-|gemini/i]},
    {id:'ads-ppc-imported', title:'Ads, PPC, and paid media', badge:'Ads', color:'b-orange', desc:'Google, Meta, TikTok, LinkedIn, YouTube, Apple, Microsoft, Amazon, PPC, ROAS, CPA, and campaign skills.', tests:[/ads|ad-|ppc|paid|campaign|google ads|meta ads|facebook|instagram|tiktok|linkedin|youtube|apple ads|microsoft ads|bing ads|amazon ads|roas|cpa|bidding|creative fatigue/i]},
    {id:'seo-content-imported', title:'SEO, content, and publishing', badge:'SEO', color:'b-blue', desc:'SEO audits, AI SEO, content strategy, schema, publishing, blogs, and organic growth.', tests:[/seo|schema|content|blog|publishing|organic|keyword|programmatic seo|answer engine|llm optimization|ai overview/i]},
    {id:'growth-cro-imported', title:'Growth, CRO, and experiments', badge:'Growth', color:'b-purple', desc:'A/B tests, conversion optimization, funnels, onboarding, pricing, retention, churn, and referrals.', tests:[/a\/b|ab-test|split test|experiment|cro|conversion|funnel|onboarding|pricing|retention|churn|referral|growth|paywall|signup/i]},
    {id:'analytics-data-imported', title:'Analytics, data, and tracking', badge:'Data', color:'b-teal', desc:'Analytics tracking, GA4, GTM, BigQuery, dbt, SQL, dashboards, data cleanup, and pipelines.', tests:[/analytics|tracking|ga4|gtm|data|bigquery|dbt|dataflow|dataform|notebook|pipeline|spark|sql|warehouse|dashboard/i]},
    {id:'development-imported', title:'Development and engineering', badge:'Dev', color:'b-green', desc:'Coding, APIs, backend, frontend, architecture, debugging, repos, dependencies, build, and deploy workflows.', tests:[/develop|code|coding|api|backend|frontend|react|typescript|python|dependency|architecture|debug|implementation|repo|github|build|deploy|serverless|middleware/i]},
    {id:'testing-imported', title:'Testing, QA, and validation', badge:'Testing', color:'b-amber', desc:'Tests, QA, verification, audits, validation, health checks, performance, safety, and reviews.', tests:[/test|qa|verify|verification|validator|validation|audit|health|benchmark|quality|review|security|safety|performance|smoke/i]},
    {id:'design-imported', title:'Design, UI, and UX', badge:'Design', color:'b-pink', desc:'UI/UX systems, design review, frontend design, prototypes, accessibility, visual QA, and web design.', tests:[/design|ui|ux|figma|prototype|visual|typography|tailwind|shadcn|component|accessibility|inclusive visualization|style guide/i]},
    {id:'writing-imported', title:'Writing, outreach, and documents', badge:'Writing', color:'b-blue', desc:'Emails, resumes, cover letters, outreach, editing, briefs, bullets, and document workflows.', tests:[/writing|write|email|resume|cover letter|outreach|linkedin|editing|bullets|document|docs|brief|normalize|format/i]},
    {id:'research-imported', title:'Research and strategy', badge:'Research', color:'b-purple', desc:'Research briefs, market analysis, product specs, competitive research, strategy, and planning.', tests:[/research|strategy|market|competitor|analysis|brief|plan|planning|product spec|prd|customer discovery|investigate|intelligence/i]},
    {id:'sales-imported', title:'Sales, RevOps, and customer work', badge:'Sales', color:'b-coral', desc:'Sales enablement, CRM, lead research, customer interviews, lifecycle messaging, and revenue ops.', tests:[/sales|crm|revops|lead|customer|interview|discovery|demo|pipeline|sequence|enablement|prospect/i]},
    {id:'ai-agents-imported', title:'AI agents and context engineering', badge:'AI Agents', color:'b-teal', desc:'Agent architecture, context engineering, memory, MCP, tool design, multi-agent systems, and LLM workflows.', tests:[/agent|agents|llm|mcp|context|memory|tool design|multi-agent|latent|prompt|orchestration|ai system/i]},
    {id:'cloud-infra-imported', title:'Cloud, infra, and platforms', badge:'Infra', color:'b-gray', desc:'Vercel, Supabase, Firebase, GCP, cloud resources, deployment, auth, database, and platform operations.', tests:[/vercel|supabase|firebase|gcp|cloud|auth|oauth|deployment|infrastructure|server|database|postgres|kv|blob|edge|cron|domain|firewall/i]},
    {id:'media-imported', title:'Media, video, and assets', badge:'Media', color:'b-orange', desc:'Video, Remotion, images, media generation, creative assets, and visual content workflows.', tests:[/video|remotion|media|animation|image|asset|visual|shorts|photo/i]}
  ];

  function normalize(raw){
    const name = String(raw.name || raw.title || raw.slug || 'untitled-skill');
    const desc = String(raw.description || raw.desc || raw.summary || '');
    const stores = Array.isArray(raw.stores) ? raw.stores : [];
    const example = String(raw.example_path || raw.path || raw.source || '');
    const text = [name, desc, stores.join(' '), example].join(' ');
    const rules = [];
    if(raw.copies) rules.push('Copies: ' + raw.copies);
    if(stores.length) rules.push('Stores: ' + stores.join(', '));
    if(example) rules.push('Example: ' + example);
    return {
      name,
      desc: desc || 'No description provided.',
      category: stores[0] || 'imported',
      tags: stores.length ? stores : ['imported'],
      rules,
      _text: text
    };
  }

  function buildSection(bucket, skills){
    return {
      id: bucket.id,
      color: bucket.color,
      badge: bucket.badge,
      title: bucket.title,
      meta: skills.length + ' skills · imported from skills.json',
      desc: bucket.desc,
      type: 'skills',
      skills: skills.sort((a,b)=>a.name.localeCompare(b.name))
    };
  }

  function bucketFor(skill){
    return BUCKETS.slice(1).find(b => b.tests.some(re => re.test(skill._text))) || null;
  }

  async function loadImportedSkills(){
    if(!window.SECTIONS) return;
    const res = await fetch('skills.json?ts=' + Date.now(), {cache:'no-store'});
    if(!res.ok) return;

    const catalog = await res.json();
    const rawSkills = Array.isArray(catalog) ? catalog : catalog.skills;
    if(!Array.isArray(rawSkills)) return;

    const normalized = rawSkills.map(normalize);
    const importedSections = [];

    importedSections.push(buildSection(BUCKETS[0], normalized.slice()));

    for(const bucket of BUCKETS.slice(1)){
      const matches = normalized.filter(skill => bucketFor(skill)?.id === bucket.id);
      if(matches.length) importedSections.push(buildSection(bucket, matches));
    }

    window.SECTIONS.push(...importedSections);

    const oldRenderCards = window.renderCards || renderCards;
    oldRenderCards('');
  }

  loadImportedSkills().catch(console.error);
})();
