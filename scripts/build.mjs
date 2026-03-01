import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";

const rootDir = process.cwd();
const contentDir = path.join(rootDir, "content");
const experimentsSourceDir = path.join(contentDir, "experiments");
const articlesSourceDir = path.join(contentDir, "articles");
const experimentsOutputDir = path.join(rootDir, "experiments");
const articlesOutputDir = path.join(rootDir, "articles");
const notebooksDir = path.join(rootDir, "notebooks");
const aboutSourcePath = path.join(contentDir, "about.md");
const repositorySlug = "prachalabsai/appliedmodels.github.io";
const repositoryBranch = "main";
const huggingFaceOrgUrl = "https://huggingface.co/appliedomodels";

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function renderInline(markdown) {
  let html = escapeHtml(markdown);
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_, label, href) => `<a href="${href}">${label}</a>`,
  );
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return html;
}

function flushParagraph(parts, html) {
  if (parts.length === 0) {
    return;
  }

  html.push(`<p>${renderInline(parts.join(" "))}</p>`);
  parts.length = 0;
}

function flushList(listType, items, html) {
  if (!listType || items.length === 0) {
    return;
  }

  const itemHtml = items.map((item) => `<li>${renderInline(item)}</li>`).join("");
  html.push(`<${listType}>${itemHtml}</${listType}>`);
  items.length = 0;
}

function renderMarkdown(markdown) {
  const lines = markdown.replaceAll("\r\n", "\n").split("\n");
  const html = [];
  const paragraph = [];
  const listItems = [];
  let listType = "";
  let inCodeBlock = false;
  let codeLanguage = "";
  let codeLines = [];

  const flushAll = () => {
    flushParagraph(paragraph, html);
    flushList(listType, listItems, html);
    listType = "";
  };

  for (const line of lines) {
    if (inCodeBlock) {
      if (line.startsWith("```")) {
        const languageClass = codeLanguage ? ` class="language-${codeLanguage}"` : "";
        html.push(
          `<pre><code${languageClass}>${escapeHtml(codeLines.join("\n"))}</code></pre>`,
        );
        inCodeBlock = false;
        codeLanguage = "";
        codeLines = [];
      } else {
        codeLines.push(line);
      }
      continue;
    }

    if (line.startsWith("```")) {
      flushAll();
      inCodeBlock = true;
      codeLanguage = line.slice(3).trim();
      continue;
    }

    if (line.trim() === "") {
      flushAll();
      continue;
    }

    if (line === "---") {
      flushAll();
      html.push("<hr />");
      continue;
    }

    const headingMatch = line.match(/^(#{1,4})\s+(.*)$/);
    if (headingMatch) {
      flushAll();
      const level = headingMatch[1].length;
      html.push(`<h${level}>${renderInline(headingMatch[2])}</h${level}>`);
      continue;
    }

    if (line.startsWith("> ")) {
      flushAll();
      html.push(`<blockquote><p>${renderInline(line.slice(2))}</p></blockquote>`);
      continue;
    }

    const unorderedMatch = line.match(/^- (.*)$/);
    if (unorderedMatch) {
      flushParagraph(paragraph, html);
      if (listType && listType !== "ul") {
        flushList(listType, listItems, html);
      }
      listType = "ul";
      listItems.push(unorderedMatch[1]);
      continue;
    }

    const orderedMatch = line.match(/^\d+\. (.*)$/);
    if (orderedMatch) {
      flushParagraph(paragraph, html);
      if (listType && listType !== "ol") {
        flushList(listType, listItems, html);
      }
      listType = "ol";
      listItems.push(orderedMatch[1]);
      continue;
    }

    if (listType) {
      flushList(listType, listItems, html);
      listType = "";
    }

    paragraph.push(line.trim());
  }

  flushAll();

  if (inCodeBlock) {
    const languageClass = codeLanguage ? ` class="language-${codeLanguage}"` : "";
    html.push(`<pre><code${languageClass}>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
  }

  return html.join("\n");
}

function parseFrontMatter(source) {
  if (!source.startsWith("---\n")) {
    return { metadata: {}, body: source.trim() };
  }

  const end = source.indexOf("\n---\n", 4);
  if (end === -1) {
    return { metadata: {}, body: source.trim() };
  }

  const header = source.slice(4, end);
  const body = source.slice(end + 5).trim();
  const metadata = {};

  for (const line of header.split("\n")) {
    const separator = line.indexOf(":");
    if (separator === -1) {
      continue;
    }
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    metadata[key] = value;
  }

  return { metadata, body };
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

function compareByDateDesc(left, right) {
  const leftDate = left.date || "";
  const rightDate = right.date || "";
  return rightDate.localeCompare(leftDate) || left.title.localeCompare(right.title);
}

function cardMeta(entry) {
  const items = [];
  if (entry.date) {
    items.push(entry.date);
  }
  if (entry.status) {
    items.push(entry.status);
  }
  if (entry.kind) {
    items.push(entry.kind);
  }
  return items.join(" · ");
}

function rootPrefix(depth) {
  if (depth <= 0) {
    return "";
  }
  return "../".repeat(depth);
}

function colabNotebookUrl(notebookPath) {
  return `https://colab.research.google.com/github/${repositorySlug}/blob/${repositoryBranch}/${notebookPath}`;
}

function pageLayout({ title, description, body, depth, active }) {
  const prefix = rootPrefix(depth);
  const pageTitle = title ? `${title} | Applied Models` : "Applied Models";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${pageTitle}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="icon" href="${prefix}assets/favicon.svg" type="image/svg+xml" />
  <link rel="stylesheet" href="${prefix}assets/style.css" />
</head>
<body>
  <div class="page-shell">
    <header class="site-nav">
      <a class="brand" href="${prefix}index.html">Applied Models</a>
      <nav>
        <a ${active === "home" ? 'class="active"' : ""} href="${prefix}index.html">Home</a>
        <a ${active === "experiments" ? 'class="active"' : ""} href="${prefix}experiments/index.html">Experiments</a>
        <a ${active === "articles" ? 'class="active"' : ""} href="${prefix}articles/index.html">Articles</a>
        <a ${active === "notebooks" ? 'class="active"' : ""} href="${prefix}notebooks/index.html">Notebooks</a>
        <a ${active === "about" ? 'class="active"' : ""} href="${prefix}about.html">About</a>
      </nav>
    </header>
    ${body}
  </div>
</body>
</html>
`;
}

function renderEntryCard(entry, depth) {
  const prefix = rootPrefix(depth);
  const href = `${prefix}${entry.url}`;
  const meta = cardMeta(entry);
  return `<article class="card">
  <p class="eyebrow">${entry.collection}</p>
  <h3><a href="${href}">${escapeHtml(entry.title)}</a></h3>
  <p>${escapeHtml(entry.summary)}</p>
  ${meta ? `<p class="meta-line">${escapeHtml(meta)}</p>` : ""}
</article>`;
}

function homeActionLabel(entry) {
  if (entry.collection === "Experiments") {
    return "Open experiment";
  }

  if (entry.collection === "Articles") {
    return "Read article";
  }

  if (entry.collection === "Notebooks") {
    return "Open notebook";
  }

  return "Open";
}

function renderHomeArtifactTable(entries) {
  if (entries.length === 0) {
    return '<p class="empty-state">Nothing is published yet.</p>';
  }

  const rows = entries
    .map((entry) => {
      const meta = cardMeta(entry) || "Published";
      const typeLabel = entry.kind || entry.collection;
      const colabLink = entry.colabUrl
        ? `<a class="table-inline-link" href="${entry.colabUrl}" target="_blank" rel="noreferrer">Colab</a>`
        : "";

      return `<tr>
        <td><span class="artifact-type-badge">${escapeHtml(entry.collection)}</span></td>
        <td>
          <a class="artifact-title-link" href="${entry.url}">${escapeHtml(entry.title)}</a>
          <p class="artifact-subline">${escapeHtml(typeLabel)}</p>
        </td>
        <td class="artifact-summary-cell">${escapeHtml(entry.summary)}</td>
        <td class="artifact-meta-cell">${escapeHtml(meta)}</td>
        <td>
          <div class="artifact-actions">
            <a class="action-link action-link-compact" href="${entry.url}">${homeActionLabel(entry)}</a>
            ${colabLink}
          </div>
        </td>
      </tr>`;
    })
    .join("\n");

  return `<section class="artifact-index">
    <div class="artifact-index-links">
      <a href="experiments/index.html">All experiments</a>
      <a href="articles/index.html">All articles</a>
      <a href="notebooks/index.html">All notebooks</a>
      <a href="${huggingFaceOrgUrl}" target="_blank" rel="noreferrer">Hugging Face org</a>
    </div>
    <div class="artifact-table-wrap">
      <table class="artifact-table">
        <thead>
          <tr>
            <th scope="col">Type</th>
            <th scope="col">Title</th>
            <th scope="col">Reference</th>
            <th scope="col">Meta</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  </section>`;
}

function renderCollectionPage({ title, intro, entries, depth, active }) {
  const cards =
    entries.length > 0
      ? entries.map((entry) => renderEntryCard(entry, depth)).join("\n")
      : '<p class="empty-state">Nothing is published here yet.</p>';

  return pageLayout({
    title,
    description: intro,
    depth,
    active,
    body: `<main>
      <section class="section-head">
        <p class="eyebrow">Published Work</p>
        <h1>${escapeHtml(title)}</h1>
        <p class="lede">${escapeHtml(intro)}</p>
      </section>
      <section class="card-grid">
        ${cards}
      </section>
    </main>`,
  });
}

function renderDetailPage(entry, bodyHtml, depth) {
  const meta = cardMeta(entry);

  return pageLayout({
    title: entry.title,
    description: entry.summary,
    depth,
    active: entry.collection.toLowerCase(),
    body: `<main class="document-page">
      <section class="section-head">
        <p class="eyebrow">${entry.collection}</p>
        <h1>${escapeHtml(entry.title)}</h1>
        <p class="lede">${escapeHtml(entry.summary)}</p>
        ${meta ? `<p class="meta-line">${escapeHtml(meta)}</p>` : ""}
      </section>
      <article class="prose">
        ${bodyHtml}
      </article>
    </main>`,
  });
}

function renderNotebookDetail(entry) {
  const cells = entry.cells
    .map((cell) => {
      if (cell.cell_type === "markdown") {
        return `<section class="notebook-cell">${renderMarkdown(cell.source.join(""))}</section>`;
      }

      const source = escapeHtml(cell.source.join(""));
      const output = renderNotebookOutputs(cell.outputs || []);
      return `<section class="notebook-cell">
        <div class="cell-label">Python</div>
        <pre><code>${source}</code></pre>
        ${output}
      </section>`;
    })
    .join("\n");

  const meta = cardMeta(entry);

  return pageLayout({
    title: entry.title,
    description: entry.summary,
    depth: 1,
    active: "notebooks",
    body: `<main class="document-page">
      <section class="section-head">
        <p class="eyebrow">Notebook</p>
        <h1>${escapeHtml(entry.title)}</h1>
        <p class="lede">${escapeHtml(entry.summary)}</p>
        ${meta ? `<p class="meta-line">${escapeHtml(meta)}</p>` : ""}
        <div class="actions actions-inline">
          <a class="action-link" href="./${entry.fileName}" download>Download .ipynb</a>
          <a
            class="action-link"
            href="${entry.colabUrl}"
            target="_blank"
            rel="noreferrer"
          >Open in Colab</a>
        </div>
      </section>
      <article class="prose">
        ${cells}
      </article>
    </main>`,
  });
}

function renderNotebookOutputs(outputs) {
  if (outputs.length === 0) {
    return "";
  }

  const rendered = outputs
    .map((output) => {
      if (output.output_type === "stream" && Array.isArray(output.text)) {
        return `<div class="cell-output"><pre><code>${escapeHtml(output.text.join(""))}</code></pre></div>`;
      }

      if (
        output.output_type === "execute_result" &&
        output.data &&
        Array.isArray(output.data["text/plain"])
      ) {
        return `<div class="cell-output"><pre><code>${escapeHtml(
          output.data["text/plain"].join(""),
        )}</code></pre></div>`;
      }

      return "";
    })
    .join("");

  return rendered;
}

async function readMarkdownCollection(collection) {
  const sourceDir = path.join(contentDir, collection);
  const files = (await fs.readdir(sourceDir))
    .filter((fileName) => fileName.endsWith(".md"))
    .sort();
  const entries = [];

  for (const fileName of files) {
    const source = await fs.readFile(path.join(sourceDir, fileName), "utf8");
    const { metadata, body } = parseFrontMatter(source);
    const slug = metadata.slug || fileName.replace(/\.md$/, "");
    const title = metadata.title || slug;
    const summary = metadata.summary || "No summary yet.";
    const date = metadata.date || "";
    const status = metadata.status || "";
    const collectionLabel = collection.charAt(0).toUpperCase() + collection.slice(1);

    entries.push({
      slug,
      title,
      summary,
      date,
      status,
      kind: metadata.kind || "",
      collection: collectionLabel,
      url: `${collection}/${slug}.html`,
      bodyHtml: renderMarkdown(body),
    });
  }

  entries.sort(compareByDateDesc);
  return entries;
}

async function readNotebookCollection() {
  const files = (await fs.readdir(notebooksDir))
    .filter((fileName) => fileName.endsWith(".ipynb"))
    .sort();
  const entries = [];

  for (const fileName of files) {
    const source = await fs.readFile(path.join(notebooksDir, fileName), "utf8");
    const notebook = JSON.parse(source);
    const metadata = notebook.metadata?.appliedModels || {};
    const slug = fileName.replace(/\.ipynb$/, "");

    entries.push({
      slug,
      fileName,
      title: metadata.title || slug,
      summary: metadata.summary || "Python notebook for an experiment or implementation.",
      date: metadata.date || "",
      kind: "Python notebook",
      collection: "Notebooks",
      url: `notebooks/${slug}.html`,
      colabUrl: colabNotebookUrl(path.posix.join("notebooks", fileName)),
      cells: Array.isArray(notebook.cells) ? notebook.cells : [],
    });
  }

  entries.sort(compareByDateDesc);
  return entries;
}

async function writeMarkdownPages(collection, entries) {
  const outputDir = collection === "experiments" ? experimentsOutputDir : articlesOutputDir;
  await ensureDir(outputDir);

  for (const entry of entries) {
    const outputPath = path.join(outputDir, `${entry.slug}.html`);
    await fs.writeFile(outputPath, renderDetailPage(entry, entry.bodyHtml, 1), "utf8");
  }
}

async function writeNotebookPages(entries) {
  await ensureDir(notebooksDir);

  for (const entry of entries) {
    const outputPath = path.join(notebooksDir, `${entry.slug}.html`);
    await fs.writeFile(outputPath, renderNotebookDetail(entry), "utf8");
  }
}

async function buildHomePage(experiments, articles, notebooks) {
  const recentArtifacts = [...experiments, ...articles, ...notebooks]
    .sort(compareByDateDesc)
    .slice(0, 8);
  const artifactTable = renderHomeArtifactTable(recentArtifacts);

  const body = `<main>
    <section class="hero">
      <div class="hero-layout">
        <div class="hero-copy">
          <p class="eyebrow">Empirical Science and Applied Research on Generative Models</p>
          <h1>Hypothesis-driven experiments on generative models.</h1>
          <p class="lede">
            Applied Models is a public home for hands-on experiments on generative models — across fundamentals,
            interpretability, alignment science, post-training, RL, evals, and industry applications.
            Each release starts with one hypothesis, one focused experiment, and one honest record.
          </p>
          <div class="hero-actions">
            <a class="button-primary" href="experiments/index.html">See experiments</a>
            <a class="button-secondary" href="about.html">About</a>
          </div>
          <div class="signal-bar">
            <span>Falsifiable hypothesis</span>
            <span>Reproducible experiment</span>
            <span>Honest record</span>
          </div>
          <p class="hero-statement">
            The goal is a running record of real experiments — not curated highlights, not tutorials, not opinion.
            What the model does under specific conditions, measured and documented as precisely as possible.
            Work compounds. The record stays public. Seven directions, one experiment at a time.
          </p>
        </div>
        <aside class="hero-rail" aria-label="Applied Models at a glance">
          <section class="hero-note">
            <p class="eyebrow">Research Directions</p>
            <ul class="stack-list">
              <li><strong>Fundamentals</strong><span>Architecture, training dynamics, and scaling from first principles.</span></li>
              <li><strong>Interpretability</strong><span>Circuits, probing, and what the model has actually learned.</span></li>
              <li><strong>Alignment Science</strong><span>Behavioral alignment, safety tradeoffs, and value consistency.</span></li>
              <li><strong>Post Training</strong><span>Fine-tuning, DPO, distillation, and instruction tuning.</span></li>
              <li><strong>RL</strong><span>RLHF, GRPO, process reward models, and reasoning via RL.</span></li>
              <li><strong>Evals</strong><span>Capability and failure mode probing. Starting with Gemma.</span></li>
              <li><strong>Industry &amp; Enterprise</strong><span>Retrieval, structured generation, and deployment patterns.</span></li>
            </ul>
            <p class="hero-note-link">
              External assets:
              <a href="${huggingFaceOrgUrl}" target="_blank" rel="noreferrer">Hugging Face organization</a>
            </p>
          </section>
          <section class="hero-note hero-note-strong">
            <p class="eyebrow">Release Pattern</p>
            <div class="hero-flow">
              <span>Hypothesis</span>
              <span>Experiment</span>
              <span>Record</span>
            </div>
            <div class="hero-mini-grid">
              <div class="mini-metric"><span>Mode</span><strong>Empirical</strong></div>
              <div class="mini-metric"><span>Bias</span><strong>Clarity</strong></div>
              <div class="mini-metric"><span>Cadence</span><strong>Continuous</strong></div>
              <div class="mini-metric"><span>Standard</span><strong>Reproducible</strong></div>
            </div>
          </section>
        </aside>
      </div>
    </section>

    <section class="split-panel">
      <div class="panel">
        <p class="eyebrow">How Work Gets Done</p>
        <ul class="stack-list">
          <li><strong>Choose</strong><span>Select one model or configuration to study.</span></li>
          <li><strong>Define</strong><span>Frame a single falsifiable hypothesis with concrete evaluation criteria.</span></li>
          <li><strong>Run</strong><span>Execute the smallest experiment that yields real evidence.</span></li>
          <li><strong>Publish</strong><span>Record what happened — method, result, and failure modes.</span></li>
        </ul>
      </div>
      <div class="panel">
        <p class="eyebrow">Publication Boundary</p>
        <ul class="stack-list">
          <li><strong>No survey pieces</strong><span>Published work comes from direct implementation, not literature review.</span></li>
          <li><strong>No second-hand summaries</strong><span>Don&apos;t repackage others&apos; results as findings.</span></li>
          <li><strong>Original only</strong><span>Every claim traces to an experiment run here.</span></li>
          <li><strong>Keep compounding</strong><span>Forward progress beats chasing benchmark headlines.</span></li>
        </ul>
      </div>
    </section>

    <section class="section-head">
      <p class="eyebrow">Artifact Index</p>
      <h2>All published work, in one place.</h2>
      <p class="lede">Every experiment, article, and notebook — indexed by type. Click any row to open the full record.</p>
    </section>
    ${artifactTable}
  </main>`;

  await fs.writeFile(
    path.join(rootDir, "index.html"),
    pageLayout({
      title: "",
      description: "An independent lab running hypothesis-driven, reproducible experiments on generative models.",
      body,
      depth: 0,
      active: "home",
    }),
    "utf8",
  );
}

async function buildCollectionIndexes(experiments, articles, notebooks) {
  await fs.writeFile(
    path.join(experimentsOutputDir, "index.html"),
    renderCollectionPage({
      title: "Experiments",
      intro: "Focused experiments driven by one hypothesis and a small set of key questions.",
      entries: experiments,
      depth: 1,
      active: "experiments",
    }),
    "utf8",
  );

  await fs.writeFile(
    path.join(articlesOutputDir, "index.html"),
    renderCollectionPage({
      title: "Articles",
      intro: "Original writeups derived from hands-on experiments, implementation, and measurement.",
      entries: articles,
      depth: 1,
      active: "articles",
    }),
    "utf8",
  );

  await fs.writeFile(
    path.join(notebooksDir, "index.html"),
    renderCollectionPage({
      title: "Python Notebooks",
      intro: "Jupyter notebooks tied to experiments and implementation work.",
      entries: notebooks,
      depth: 1,
      active: "notebooks",
    }),
    "utf8",
  );
}

async function buildAboutPage() {
  const source = await fs.readFile(aboutSourcePath, "utf8");
  const aboutHtml = renderMarkdown(source);

  await fs.writeFile(
    path.join(rootDir, "about.html"),
    pageLayout({
      title: "About",
      description: "About Applied Models and what it publishes.",
      depth: 0,
      active: "about",
      body: `<main class="document-page">
        <section class="section-head">
          <p class="eyebrow">About</p>
          <h1>Empirical science and applied research on generative models.</h1>
          <p class="lede">
            Applied Models is a public home for hands-on experiments on how generative models actually behave — across alignment, interpretability, model anatomy, and applied AI. Results are published as they happen, including failures.
          </p>
        </section>
        <article class="prose">
          ${aboutHtml}
        </article>
      </main>`,
    }),
    "utf8",
  );
}

async function main() {
  await ensureDir(experimentsOutputDir);
  await ensureDir(articlesOutputDir);
  await ensureDir(notebooksDir);

  const experiments = await readMarkdownCollection("experiments");
  const articles = await readMarkdownCollection("articles");
  const notebooks = await readNotebookCollection();

  await writeMarkdownPages("experiments", experiments);
  await writeMarkdownPages("articles", articles);
  await writeNotebookPages(notebooks);
  await buildCollectionIndexes(experiments, articles, notebooks);
  await buildHomePage(experiments, articles, notebooks);
  await buildAboutPage();

  console.log(
    `Built ${experiments.length} experiments, ${articles.length} articles, and ${notebooks.length} notebook pages.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
