import fs from 'fs';
import path from 'path';

async function updateStats() {
  const username = process.env.GITHUB_REPOSITORY_OWNER || 'gustavo-lg';
  const token = process.env.GITHUB_TOKEN;

  let totalCommits = '2,500+';
  let totalRepos = '50+';

  if (token) {
    try {
      const query = `
        query($login: String!) {
          user(login: $login) {
            contributionsCollection {
              totalCommitContributions
              restrictedContributionsCount
            }
            repositories(first: 100, ownerAffiliations: OWNER) {
              totalCount
            }
          }
        }
      `;
      const res = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Node-Stats-Updater',
        },
        body: JSON.stringify({ query, variables: { login: username } }),
      });

      const data = await res.json();
      if (data?.data?.user) {
        const c = data.data.user.contributionsCollection;
        const commits = (c.totalCommitContributions || 0) + (c.restrictedContributionsCount || 0);
        if (commits > 0) totalCommits = commits.toLocaleString('en-US');
        const repos = data.data.user.repositories?.totalCount;
        if (repos > 0) totalRepos = repos + '+';
      }
    } catch (err) {
      console.warn('Could not fetch live GitHub data, using fallback values:', err.message);
    }
  }

  // Ensure output directory exists
  const distDir = path.resolve('dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Read template from .github/assets/stats-card.svg
  const templatePath = path.resolve('.github/assets/stats-card.svg');
  if (fs.existsSync(templatePath)) {
    let svg = fs.readFileSync(templatePath, 'utf8');
    // Copy into dist for github-pages deployment
    fs.writeFileSync(path.join(distDir, 'stats-card.svg'), svg, 'utf8');
    console.log('Successfully prepared stats-card.svg in dist/ for output branch.');
  }
}

updateStats();
