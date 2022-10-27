import { useEffect, useState } from 'react';
import { useTheme } from './contexts/ThemeContext';
import Card from './components/Card';
import Toggle from './components/Toggle';
import Masonry from './components/Masonry';
import colors from './data/colors.json';
import { cn, generateRandomColor } from './utils';
import { StarredRepoData } from './types/StarredRepoData';
import './App.css';
import PieBar from './components/PieBar';
import Collapsible from './components/Collapsible';

const hostname = 'api.github.com';

const url = (path: string, https = true) =>
  `http${https ? 's' : ''}://${hostname}/${path}`;

const api = {
  userRepos: (owner: string) => url(`users/${owner}/repos`),
  starredByUser: (owner: string) => url(`users/${owner}/starred`),
  repoLangs: (owner: string, repo: string) =>
    url(`repos/${owner}/${repo}/languages`),
};

type RepoLangsData = Record<string, number>;

interface RepoData extends StarredRepoData {
  langs: RepoLangsData;
}

interface RepoCardProps {
  repo: RepoData;
}

function RepoCard({ repo }: RepoCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className={cn('bordered')}>
      <Card.Header>
        <h3 className="card-title">{repo.name}</h3>
        <h4 className="card-subtitle">
          <Toggle
            checked={expanded}
            onChange={() => setExpanded(!expanded)}
            className="card-expand-toggle"
            id={`${repo.id}`}
            label={expanded ? `${repo.language} —` : `${repo.language} ⋯`}
          />
        </h4>
        <Collapsible expanded={expanded} className="card-extra">
          <PieBar
            className="card-pie-bar"
            pieces={Object.entries(repo.langs).map(([lang, count]) => ({
              count,
              color:
                lang in colors
                  ? colors[lang as keyof typeof colors].color ||
                    generateRandomColor()
                  : generateRandomColor(),
            }))}
          />
          <ul className="repo-langs">
            {Object.entries(repo.langs)
              .sort(([, a], [, b]) => b - a)
              .map(([lang], i) => (
                <li
                  key={`${repo.id}-lang-${i}`}
                  className="repo-lang"
                  style={
                    {
                      '--lang-color':
                        lang in colors
                          ? colors[lang as keyof typeof colors].color
                          : generateRandomColor(),
                    } as React.CSSProperties
                  }
                >
                  {lang}
                </li>
              ))}
          </ul>
        </Collapsible>
      </Card.Header>
      <Card.Body>
        <p>{repo.description}</p>
      </Card.Body>
      <Card.Footer>
        <div className="card-links">
          <a className="button primary" href={repo.homepage}>
            Homepage
          </a>
          <a className="button" href={repo.html_url}>
            Source
          </a>
        </div>
      </Card.Footer>
    </Card>
  );
}

export default function App() {
  const { dark, toggle } = useTheme();

  const [loaded, setLoaded] = useState(false);
  const [repos, setRepos] = useState<RepoData[]>([]);

  const fetchReposData = async () => {
    const res = await fetch(api.starredByUser('vancomm'));
    const data = (await res.json()) as StarredRepoData[];
    Promise.all(
      data
        .filter((repo) => repo.owner.login === 'vancomm')
        .map((repo) =>
          fetch(api.repoLangs('vancomm', repo.name))
            .then((res) => res.json())
            .then((langs) => {
              console.log(langs);
              return { ...repo, langs } as RepoData;
            })
        )
    ).then((repos) => setRepos(repos));
  };

  useEffect(() => {
    fetchReposData().then(() => setLoaded(true));
  }, []);

  useEffect(() => {
    document.documentElement.style.transition = 'background-color 250ms ease';
  }, []);

  return (
    <div className="app">
      <header>
        <div className="header-content">
          <span className="header-logo">Ivan Peshekhonov homepage</span>
          <Toggle
            id="theme-toggle"
            className="theme-toggle"
            checked={dark}
            onChange={toggle}
            label={dark ? '🌞' : '🌒'}
          />
        </div>
      </header>
      <main>
        <section>
          <h2>About me</h2>
          <p>I am a fourth year IT student.</p>
          <p>I am an aspiring Web Developer and a React enthusiast.</p>
          <p>
            You can find me on{' '}
            <a className="link" href="https://github.com/vancomm">
              GitHub
            </a>
            .
          </p>
        </section>
        <section>
          <h2>My projects</h2>
          <Masonry
            breakoutCols={{
              0: 3,
              960: 2,
              560: 1,
            }}
            className={cn('cards-masonry', { 'fade-in': loaded })}
            columnClassName={'cards-column'}
          >
            {repos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </Masonry>
        </section>
      </main>
      <footer>
        <span>2022</span>
      </footer>
    </div>
  );
}
