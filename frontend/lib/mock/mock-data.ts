import type { RedditComment, Sentiment, Topic, UserProfile } from '@/lib/types'

/**
 * Centralized, deterministic mock dataset.
 *
 * Every metric, chart and table in the app is derived from `MOCK_COMMENTS`,
 * so numbers stay consistent across screens. Replace the service
 * implementation (see `lib/services`) to swap this for real API data.
 */

export const MOCK_NOW = new Date('2026-10-14T16:00:00Z')

export const MOCK_PROFILE: UserProfile = {
  username: 'sample_analyst',
  displayName: 'Demo Account',
  initials: 'DA',
  connection: {
    status: 'demo',
    lastSyncedAt: '2026-10-14T13:42:00Z',
    commentsIndexed: 0,
  },
}

export const MOCK_TOPICS: Topic[] = [
  {
    id: 'ai',
    name: 'Artificial Intelligence',
    description:
      'Large language models, evaluation methodology, local inference and the practical limits of current AI systems.',
    keywords: ['llm', 'ai', 'model', 'inference', 'agents', 'eval'],
    color: 'var(--chart-1)',
  },
  {
    id: 'software-engineering',
    name: 'Software Engineering',
    description:
      'System design, code review culture, testing strategy and the trade-offs of shipping maintainable software.',
    keywords: ['architecture', 'testing', 'code review', 'microservices'],
    color: 'var(--chart-2)',
  },
  {
    id: 'programming-languages',
    name: 'Programming Languages',
    description:
      'Rust, TypeScript, Go and Python — type systems, ergonomics, performance and language design.',
    keywords: ['rust', 'typescript', 'go', 'python', 'types'],
    color: 'var(--chart-3)',
  },
  {
    id: 'startups',
    name: 'Startups & Technology',
    description:
      'Early-stage product strategy, pricing, fundraising and the business side of building technology.',
    keywords: ['startup', 'saas', 'pricing', 'founders', 'mvp'],
    color: 'var(--chart-4)',
  },
  {
    id: 'career',
    name: 'Career Advice',
    description:
      'Interviews, promotions, compensation negotiation and navigating a career in software.',
    keywords: ['interview', 'promotion', 'salary', 'senior', 'job'],
    color: 'var(--chart-5)',
  },
  {
    id: 'science',
    name: 'Science & Mathematics',
    description:
      'Probability, linear algebra, physics explainers and the mathematics behind machine learning.',
    keywords: ['math', 'probability', 'physics', 'statistics'],
    color: 'oklch(0.7 0.12 340)',
  },
  {
    id: 'open-source',
    name: 'Open Source',
    description:
      'Maintainer sustainability, licensing debates and contributing to community-driven projects.',
    keywords: ['oss', 'license', 'maintainer', 'github'],
    color: 'oklch(0.72 0.12 140)',
  },
  {
    id: 'productivity',
    name: 'Developer Tooling',
    description:
      'Editors, terminals, dotfiles and workflows that make day-to-day development faster.',
    keywords: ['neovim', 'terminal', 'workflow', 'tools'],
    color: 'oklch(0.68 0.08 230)',
  },
]

interface CoreTemplate {
  subtopic: string
  text: string
  sentiment: Sentiment
}

interface TopicTemplate {
  subreddits: [string, number][]
  posts: string[]
  cores: CoreTemplate[]
  /** Weight at the start and end of the 24-month window */
  weight: [number, number]
}

const TEMPLATES: Record<string, TopicTemplate> = {
  ai: {
    subreddits: [
      ['MachineLearning', 4],
      ['LocalLLaMA', 5],
      ['singularity', 2],
      ['artificial', 2],
    ],
    posts: [
      'Are LLM benchmarks still meaningful?',
      'Running a 70B model locally on consumer hardware',
      'What are agents actually good at in production?',
      'Is fine-tuning dead now that context windows are huge?',
      'Hallucination rates in RAG pipelines',
    ],
    weight: [0.12, 0.31],
    cores: [
      {
        subtopic: 'LLM evaluation',
        text: 'Most public benchmarks are saturated or contaminated at this point. The only evals I trust are task-specific ones built from your own failure cases, scored blind.',
        sentiment: 'neutral',
      },
      {
        subtopic: 'Local inference',
        text: 'Quantized 4-bit models on a single GPU are genuinely usable for coding assistance now. Latency matters more than the last few points of benchmark accuracy.',
        sentiment: 'positive',
      },
      {
        subtopic: 'AI agents',
        text: "Agents work when the action space is small and every step is verifiable. Once you let them loop freely over a large toolset, error compounding kills reliability.",
        sentiment: 'negative',
      },
      {
        subtopic: 'Retrieval-augmented generation',
        text: 'Retrieval quality dominates everything else in a RAG system. People spend weeks on prompts when their chunking strategy is the real bottleneck.',
        sentiment: 'neutral',
      },
      {
        subtopic: 'AI safety & alignment',
        text: "I don't buy the argument that capability and alignment research are separable. Better interpretability tooling is what makes models both safer and more useful.",
        sentiment: 'neutral',
      },
      {
        subtopic: 'Fine-tuning',
        text: 'Fine-tuning is still worth it for style and format consistency, but it is a poor way to inject new knowledge. Use retrieval for facts, tuning for behavior.',
        sentiment: 'positive',
      },
    ],
  },
  'software-engineering': {
    subreddits: [
      ['ExperiencedDevs', 5],
      ['programming', 4],
      ['softwarearchitecture', 2],
      ['devops', 2],
    ],
    posts: [
      'Microservices were a mistake for our team',
      'How do you keep code reviews from becoming a bottleneck?',
      'Is 100% test coverage a useful goal?',
      'Monorepo vs polyrepo in 2026',
      'What does a good on-call rotation look like?',
    ],
    weight: [0.24, 0.18],
    cores: [
      {
        subtopic: 'Microservices',
        text: "Splitting into services before you understand your domain boundaries just turns function calls into network calls. Start with a modular monolith and extract when it hurts.",
        sentiment: 'negative',
      },
      {
        subtopic: 'Code review',
        text: 'Small PRs reviewed within a few hours beat thorough reviews that take days. Review latency is a team throughput problem, not an individual one.',
        sentiment: 'positive',
      },
      {
        subtopic: 'Testing strategy',
        text: 'Coverage targets incentivize testing implementation details. I would rather have a handful of integration tests that exercise real user flows.',
        sentiment: 'neutral',
      },
      {
        subtopic: 'Technical debt',
        text: 'Calling everything technical debt makes the term useless. Debt is a deliberate trade-off you plan to repay; most legacy code is just accumulated entropy.',
        sentiment: 'neutral',
      },
      {
        subtopic: 'Incident response',
        text: 'Blameless postmortems only work if leadership actually funds the follow-up items. Otherwise the same incident comes back every quarter.',
        sentiment: 'negative',
      },
      {
        subtopic: 'System design',
        text: 'Most systems never need more than a single well-indexed Postgres instance and a queue. Boring infrastructure is a competitive advantage.',
        sentiment: 'positive',
      },
    ],
  },
  'programming-languages': {
    subreddits: [
      ['rust', 5],
      ['typescript', 3],
      ['golang', 3],
      ['Python', 3],
    ],
    posts: [
      'Is the Rust learning curve worth it for web backends?',
      'TypeScript strict mode horror stories',
      "Go's error handling: love it or hate it?",
      'Python packaging finally feels sane',
      'Which language features do you miss most?',
    ],
    weight: [0.18, 0.12],
    cores: [
      {
        subtopic: 'Rust ownership',
        text: 'The borrow checker stops feeling adversarial once you design data flow up front. It mostly rejects code that would have been subtly wrong in other languages anyway.',
        sentiment: 'positive',
      },
      {
        subtopic: 'TypeScript types',
        text: 'Turning on strict mode in an existing codebase is painful for a week and pays for itself within a month. Discriminated unions alone justify the migration.',
        sentiment: 'positive',
      },
      {
        subtopic: 'Go error handling',
        text: "The verbosity of Go's error handling is the point: every failure path is visible in review. I still wish the language had sum types, though.",
        sentiment: 'neutral',
      },
      {
        subtopic: 'Python tooling',
        text: 'Modern Python tooling is unrecognizable compared to five years ago. Fast resolvers and lockfiles fixed most of my complaints about the ecosystem.',
        sentiment: 'positive',
      },
      {
        subtopic: 'Language design',
        text: 'Every language eventually adds the features it originally argued against. Generics in Go, async everywhere, pattern matching in Python.',
        sentiment: 'neutral',
      },
    ],
  },
  startups: {
    subreddits: [
      ['startups', 5],
      ['SaaS', 4],
      ['technology', 2],
      ['Entrepreneur', 1],
    ],
    posts: [
      'How did you price your first B2B product?',
      'Is it still possible to bootstrap a SaaS?',
      'Founders who raised: was it worth it?',
      'Lessons from shutting down a startup',
      'Building in public: helpful or a distraction?',
    ],
    weight: [0.1, 0.13],
    cores: [
      {
        subtopic: 'SaaS pricing',
        text: 'Almost every early-stage founder underprices. If nobody pushes back on your price during sales calls, it is too low.',
        sentiment: 'neutral',
      },
      {
        subtopic: 'Bootstrapping',
        text: 'Bootstrapping forces you to find a customer who pays from day one, which is the most honest form of validation there is.',
        sentiment: 'positive',
      },
      {
        subtopic: 'Fundraising',
        text: 'Raising money is a tool, not a milestone. Too many teams celebrate the round and forget it sets a growth expectation they now have to hit.',
        sentiment: 'negative',
      },
      {
        subtopic: 'Product-market fit',
        text: 'You know you have product-market fit when support requests turn from "how does this work" into "can it also do this".',
        sentiment: 'positive',
      },
      {
        subtopic: 'AI wrappers',
        text: 'Thin wrappers around a model API have no moat, but neither did most early SaaS. Distribution and workflow integration are the defensible parts.',
        sentiment: 'neutral',
      },
    ],
  },
  career: {
    subreddits: [
      ['cscareerquestions', 5],
      ['ExperiencedDevs', 3],
      ['careerguidance', 1],
    ],
    posts: [
      'How do you prepare for system design interviews?',
      'Got promoted to senior — what changes now?',
      'Is it worth negotiating a first offer?',
      'Staff engineer: what does the job actually involve?',
      'Switching from backend to ML engineering',
    ],
    weight: [0.16, 0.08],
    cores: [
      {
        subtopic: 'Interviews',
        text: 'System design interviews reward structured communication more than deep knowledge. Clarify requirements, sketch the simplest thing, then iterate out loud.',
        sentiment: 'neutral',
      },
      {
        subtopic: 'Promotions',
        text: 'The jump to senior is about scope, not skill. You get promoted for the problems you prevent and the people you unblock, not the code you write.',
        sentiment: 'positive',
      },
      {
        subtopic: 'Compensation',
        text: 'Always negotiate, politely and with data. The worst realistic outcome is they say no, and the recruiter expects the conversation anyway.',
        sentiment: 'positive',
      },
      {
        subtopic: 'Burnout',
        text: 'Burnout usually comes from a lack of control rather than raw hours. Being on the hook for outcomes you cannot influence is what wears people down.',
        sentiment: 'negative',
      },
      {
        subtopic: 'Staff+ roles',
        text: 'Staff engineering is mostly writing: design docs, decision records and the occasional uncomfortable email. Code becomes a smaller part of the job.',
        sentiment: 'neutral',
      },
    ],
  },
  science: {
    subreddits: [
      ['math', 4],
      ['Physics', 2],
      ['askscience', 2],
      ['statistics', 3],
    ],
    posts: [
      'Best intuition for eigenvectors?',
      'Bayesian vs frequentist: does it matter in practice?',
      'Why does gradient descent work so well?',
      'Explain entropy like I am a programmer',
      'Most underrated result in probability theory',
    ],
    weight: [0.08, 0.08],
    cores: [
      {
        subtopic: 'Linear algebra',
        text: 'Think of eigenvectors as the directions a transformation only stretches. Once that clicks, PCA and spectral methods stop being magic.',
        sentiment: 'positive',
      },
      {
        subtopic: 'Statistics',
        text: 'Most practical disagreements between Bayesian and frequentist methods disappear with enough data. The priors matter most when samples are small.',
        sentiment: 'neutral',
      },
      {
        subtopic: 'Optimization',
        text: 'High-dimensional loss landscapes have far more saddle points than bad local minima, which is part of why plain gradient descent works better than intuition suggests.',
        sentiment: 'neutral',
      },
      {
        subtopic: 'Information theory',
        text: 'Entropy is just the expected number of yes/no questions you need to identify an outcome. Compression and cross-entropy loss both fall out of that.',
        sentiment: 'positive',
      },
    ],
  },
  'open-source': {
    subreddits: [
      ['opensource', 4],
      ['programming', 2],
      ['github', 1],
    ],
    posts: [
      'Maintainer burnout is getting worse',
      'Are source-available licenses bad for the ecosystem?',
      'How to make your first meaningful contribution',
      'Should companies pay for the dependencies they use?',
    ],
    weight: [0.07, 0.06],
    cores: [
      {
        subtopic: 'Maintainer sustainability',
        text: 'Companies depending on a project maintained by two unpaid volunteers is a supply-chain risk, not a community success story.',
        sentiment: 'negative',
      },
      {
        subtopic: 'Licensing',
        text: 'Relicensing to source-available is understandable but it burns contributor trust in a way that is very hard to rebuild.',
        sentiment: 'negative',
      },
      {
        subtopic: 'Contributing',
        text: 'The best first contribution is improving docs or reproducing a bug report. Maintainers value that far more than an unsolicited refactor.',
        sentiment: 'positive',
      },
    ],
  },
  productivity: {
    subreddits: [
      ['neovim', 3],
      ['commandline', 2],
      ['programming', 1],
      ['vscode', 2],
    ],
    posts: [
      'Show me your terminal setup',
      'Is it worth switching to a modal editor?',
      'What does your AI-assisted coding workflow look like?',
      'Dotfile management strategies',
    ],
    weight: [0.05, 0.04],
    cores: [
      {
        subtopic: 'Editors',
        text: 'Editor choice matters far less than knowing one editor deeply. Fast navigation and search are where the real time savings come from.',
        sentiment: 'neutral',
      },
      {
        subtopic: 'Terminal workflows',
        text: 'A fuzzy finder plus shell history search probably saved me more time than any other tool I adopted in the last decade.',
        sentiment: 'positive',
      },
      {
        subtopic: 'AI coding assistants',
        text: 'Inline completions are great for boilerplate, but I turn them off when working through a tricky design. They nudge you toward the most common solution.',
        sentiment: 'neutral',
      },
    ],
  },
}

const OPENERS = [
  '',
  'Honestly,',
  'Having done this for a few years now:',
  'This matches my experience.',
  'Counterpoint:',
  'Good question.',
  'I used to think the opposite, but',
  'Slightly unpopular opinion:',
  'From what I have seen,',
  'Short answer:',
]

const CLOSERS = [
  '',
  '',
  'Curious whether others have seen the same thing.',
  'YMMV, obviously.',
  'Happy to be proven wrong on this.',
  'That has been the biggest lesson for me.',
  'Context matters a lot here, though.',
  'Edit: thanks for the thoughtful replies.',
]

/** Hand-written, high-engagement comments that anchor the "top comments" views. */
const FEATURED: Array<{
  topicId: string
  subreddit: string
  subtopic: string
  postTitle: string
  body: string
  score: number
  replies: number
  sentiment: Sentiment
  createdAt: string
}> = [
  {
    topicId: 'ai',
    subreddit: 'MachineLearning',
    subtopic: 'LLM evaluation',
    postTitle: 'Are LLM benchmarks still meaningful?',
    body: 'The uncomfortable truth is that a benchmark stops measuring capability the moment it becomes a target. Every lab now trains on data that overlaps with public test sets, intentionally or not. If you are choosing a model for a real product, build a private eval of 200 examples from your own logs, include the cases where your current system fails, and score outputs blind. It takes a day and it will tell you more than any leaderboard.',
    score: 3412,
    replies: 214,
    sentiment: 'neutral',
    createdAt: '2026-08-21T18:12:00Z',
  },
  {
    topicId: 'software-engineering',
    subreddit: 'ExperiencedDevs',
    subtopic: 'Microservices',
    postTitle: 'Microservices were a mistake for our team',
    body: 'We went from 1 service to 23 with a team of 9 engineers. Deploys got slower, local development became impossible without a 40GB docker-compose file, and every incident involved three teams arguing about whose service timed out first. We merged back into a modular monolith with clear module boundaries and enforced dependency rules. Lead time dropped by half. Microservices solve an organizational scaling problem, and we did not have that problem.',
    score: 2876,
    replies: 341,
    sentiment: 'negative',
    createdAt: '2026-03-04T15:40:00Z',
  },
  {
    topicId: 'ai',
    subreddit: 'LocalLLaMA',
    subtopic: 'AI agents',
    postTitle: 'What are agents actually good at in production?',
    body: 'Agents are good at exactly the tasks where you can cheaply verify each step. Code changes with a test suite, data transformations with schema validation, browsing with a clear success condition. The moment verification depends on human judgment, error rates compound and a 95% per-step success rate becomes a coin flip over 15 steps. Design the verification first, then the agent.',
    score: 2241,
    replies: 167,
    sentiment: 'neutral',
    createdAt: '2026-09-29T09:05:00Z',
  },
  {
    topicId: 'career',
    subreddit: 'cscareerquestions',
    subtopic: 'Promotions',
    postTitle: 'Got promoted to senior — what changes now?',
    body: 'The biggest shift is that nobody hands you well-scoped tickets anymore. Your job is to turn vague problems into well-scoped tickets for other people. Write things down, make decisions reversible where you can, and get comfortable saying "I do not know yet, here is how we will find out." Your output is now measured by what the team ships, not your commit count.',
    score: 1984,
    replies: 122,
    sentiment: 'positive',
    createdAt: '2025-06-11T20:22:00Z',
  },
  {
    topicId: 'programming-languages',
    subreddit: 'rust',
    subtopic: 'Rust ownership',
    postTitle: 'Is the Rust learning curve worth it for web backends?',
    body: 'For a CRUD backend with a small team, probably not on day one. Where Rust paid off for us was the second year: refactors that would have been terrifying in a dynamic language became mechanical because the compiler pointed at every call site. Memory safety gets the headlines, but the real win is fearless refactoring.',
    score: 1652,
    replies: 98,
    sentiment: 'positive',
    createdAt: '2025-11-02T12:48:00Z',
  },
  {
    topicId: 'startups',
    subreddit: 'SaaS',
    subtopic: 'SaaS pricing',
    postTitle: 'How did you price your first B2B product?',
    body: 'We launched at $19/month because it felt fair. Churn was high and customers treated it like a toy. We moved to $149/month with an onboarding call included and churn dropped by 60%. Higher prices attract customers who are actually committed to solving the problem. Price is a signal of how seriously you take their problem.',
    score: 1421,
    replies: 87,
    sentiment: 'positive',
    createdAt: '2026-05-19T16:30:00Z',
  },
  {
    topicId: 'science',
    subreddit: 'math',
    subtopic: 'Linear algebra',
    postTitle: 'Best intuition for eigenvectors?',
    body: 'Imagine applying a transformation to every arrow in the plane. Most arrows get rotated and stretched. Eigenvectors are the special arrows that only get stretched, and the eigenvalue is the stretch factor. Repeatedly applying the transformation makes everything drift toward the dominant eigenvector, which is literally how PageRank and power iteration work.',
    score: 1288,
    replies: 54,
    sentiment: 'positive',
    createdAt: '2025-09-14T08:10:00Z',
  },
  {
    topicId: 'ai',
    subreddit: 'singularity',
    subtopic: 'AI safety & alignment',
    postTitle: 'Is alignment research slowing down progress?',
    body: 'I think the framing of safety versus capability is mostly wrong. The interpretability work that tells you why a model refuses a request is the same work that tells you why it fails at a reasoning task. Teams that understand their models ship more reliable products. Treating safety as a tax misses that it is also a debugging tool.',
    score: 1167,
    replies: 203,
    sentiment: 'neutral',
    createdAt: '2026-07-07T22:15:00Z',
  },
  {
    topicId: 'open-source',
    subreddit: 'opensource',
    subtopic: 'Maintainer sustainability',
    postTitle: 'Maintainer burnout is getting worse',
    body: 'Every company I have worked at had a dependency audit that listed thousands of packages and a budget line for open source that was exactly zero. If a library is critical to your revenue, sponsoring its maintainer is cheaper than the incident you will have when they walk away. This is risk management, not charity.',
    score: 1043,
    replies: 76,
    sentiment: 'negative',
    createdAt: '2025-04-23T14:02:00Z',
  },
  {
    topicId: 'software-engineering',
    subreddit: 'programming',
    subtopic: 'System design',
    postTitle: 'What is the most overengineered thing you have seen?',
    body: 'A Kafka cluster, three microservices and a Kubernetes operator to send a weekly email to 400 users. The replacement was a cron job and a SQL query. Boring technology is not a lack of ambition, it is a decision to spend your innovation budget on the product.',
    score: 961,
    replies: 132,
    sentiment: 'negative',
    createdAt: '2026-01-28T11:37:00Z',
  },
  {
    topicId: 'ai',
    subreddit: 'LocalLLaMA',
    subtopic: 'Retrieval-augmented generation',
    postTitle: 'Hallucination rates in RAG pipelines',
    body: 'Before tuning prompts, log what your retriever actually returns for 50 real questions. In our case the right document was missing from the top 5 results 40% of the time. No prompt can fix context that is not there. Hybrid search plus a reranker cut our hallucination rate more than any model upgrade.',
    score: 884,
    replies: 61,
    sentiment: 'neutral',
    createdAt: '2026-10-08T17:50:00Z',
  },
  {
    topicId: 'career',
    subreddit: 'ExperiencedDevs',
    subtopic: 'Burnout',
    postTitle: 'How do you avoid burning out as a tech lead?',
    body: 'What burned me out was not the hours, it was being accountable for outcomes I had no authority over. Things improved once I negotiated explicit decision rights with my manager and started saying no to work that did not come with them.',
    score: 812,
    replies: 49,
    sentiment: 'negative',
    createdAt: '2025-02-17T19:25:00Z',
  },
]

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pickWeighted<T>(rng: () => number, items: [T, number][]): T {
  const total = items.reduce((sum, [, w]) => sum + w, 0)
  let roll = rng() * total
  for (const [item, weight] of items) {
    roll -= weight
    if (roll <= 0) return item
  }
  return items[items.length - 1][0]
}

function pick<T>(rng: () => number, items: T[]): T {
  return items[Math.floor(rng() * items.length)]
}

function makeId(rng: () => number) {
  return Math.floor(rng() * 36 ** 7)
    .toString(36)
    .padStart(7, '0')
}

function permalinkFor(subreddit: string, id: string) {
  return `https://www.reddit.com/r/${subreddit}/comments/${id.slice(0, 5)}/_/${id}/`
}

const SENTIMENT_SCORE: Record<Sentiment, [number, number]> = {
  positive: [0.25, 0.9],
  neutral: [-0.2, 0.2],
  negative: [-0.85, -0.25],
}

function generateComments(): RedditComment[] {
  const rng = mulberry32(20261014)
  const DAYS = 730
  const DAY_MS = 86_400_000
  const start = MOCK_NOW.getTime() - DAYS * DAY_MS
  const topicIds = Object.keys(TEMPLATES)
  const comments: RedditComment[] = []

  for (let day = 0; day < DAYS; day++) {
    const progress = day / DAYS
    const date = new Date(start + day * DAY_MS)
    const weekday = date.getUTCDay()
    const weekendFactor = weekday === 0 || weekday === 6 ? 1.35 : 1
    const seasonal = 1 + 0.25 * Math.sin((day / 365) * Math.PI * 2 + 1.2)
    const growth = 0.8 + progress * 0.55
    const expected = 2.3 * weekendFactor * seasonal * growth
    const count = Math.max(0, Math.round(expected + (rng() - 0.5) * 3))

    const weights: [string, number][] = topicIds.map((id) => {
      const [from, to] = TEMPLATES[id].weight
      return [id, from + (to - from) * progress]
    })

    for (let i = 0; i < count; i++) {
      const topicId = pickWeighted(rng, weights)
      const template = TEMPLATES[topicId]
      const core = pick(rng, template.cores)
      const opener = pick(rng, OPENERS)
      const closer = pick(rng, CLOSERS)
      const body = [opener, core.text, closer].filter(Boolean).join(' ')

      let sentiment = core.sentiment
      const flip = rng()
      if (flip < 0.12) sentiment = 'neutral'
      else if (flip < 0.17) sentiment = sentiment === 'negative' ? 'positive' : 'negative'

      const [lo, hi] = SENTIMENT_SCORE[sentiment]
      const roll = rng()
      const score =
        roll < 0.06
          ? -Math.ceil(rng() * 14)
          : Math.round(1 + Math.pow(rng(), 3.2) * 420 + rng() * 6)

      const subreddit = pickWeighted(rng, template.subreddits)
      const id = makeId(rng)
      const createdAt = new Date(
        date.getTime() + Math.floor(rng() * DAY_MS * 0.98),
      )
      if (createdAt > MOCK_NOW) continue

      const secondary =
        rng() < 0.3
          ? [pick(rng, topicIds.filter((t) => t !== topicId))]
          : []

      comments.push({
        id,
        body,
        subreddit,
        postTitle: pick(rng, template.posts),
        createdAt: createdAt.toISOString(),
        score,
        replies: Math.max(0, Math.round(score / (12 + rng() * 20) + rng() * 3)),
        topicId,
        subtopic: core.subtopic,
        secondaryTopicIds: secondary,
        sentiment,
        sentimentScore: Number((lo + rng() * (hi - lo)).toFixed(2)),
        permalink: permalinkFor(subreddit, id),
      })
    }
  }

  const featuredRng = mulberry32(42)
  for (const featured of FEATURED) {
    const id = makeId(featuredRng)
    const [lo, hi] = SENTIMENT_SCORE[featured.sentiment]
    comments.push({
      id,
      body: featured.body,
      subreddit: featured.subreddit,
      postTitle: featured.postTitle,
      createdAt: featured.createdAt,
      score: featured.score,
      replies: featured.replies,
      topicId: featured.topicId,
      subtopic: featured.subtopic,
      secondaryTopicIds: [],
      sentiment: featured.sentiment,
      sentimentScore: Number((lo + featuredRng() * (hi - lo)).toFixed(2)),
      permalink: permalinkFor(featured.subreddit, id),
    })
  }

  return comments.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export const MOCK_COMMENTS: RedditComment[] = generateComments()
