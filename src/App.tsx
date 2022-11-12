import { HTMLAttributes, useEffect, useState } from 'react';
import { useTheme } from './contexts/ThemeContext';
import Card from './components/Card';
import Toggle from './components/Toggle';
import PieBar from './components/PieBar';
import Masonry from './components/Masonry';
import Collapsible from './components/Collapsible';
import colors from './data/colors.json';
import { get, set } from './helpers/cache';
import { cn, generateRandomColor, renderIf } from './utils';
import {
  handleOption,
  isSuccessful,
  makeFailed,
  makeSuccessful,
  Optional,
} from './utils/Optional';
import { StarredRepoData } from './types/StarredRepoData';
import { Maybe } from './types/utils';
import avatar from './assets/images/avatar.png';
import './App.css';

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

export interface RepoData extends StarredRepoData {
  langs: RepoLangsData;
}

interface RepoCardProps extends HTMLAttributes<HTMLDivElement> {
  repo: RepoData;
}

function RepoCard({ repo }: RepoCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card>
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
          <a className="button secondary" href={repo.html_url}>
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
  const [errorData, setErrorData] = useState<Maybe<string>>(null);

  const fetchReposData = async (): Promise<Optional<RepoData[]>> => {
    const cachedOpt = await get('repoDataArr');

    if (isSuccessful(cachedOpt)) {
      return cachedOpt;
    }

    const res = await fetch(api.starredByUser('vancomm'));

    if (res.status !== 200) {
      const errorData = await res.json();
      return makeFailed(JSON.stringify(errorData, null, '\t'));
    }

    const data = (await res.json()) as StarredRepoData[];

    const repos = await Promise.all(
      data
        .filter((repo) => repo.owner.login === 'vancomm')
        .map((repo) =>
          fetch(api.repoLangs('vancomm', repo.name))
            .then((res) => res.json())
            .then((langs) => ({ ...repo, langs } as RepoData))
        )
    );

    set('repoDataArr', repos);
    return makeSuccessful(repos);
  };

  useEffect(() => {
    fetchReposData()
      .then(handleOption(setRepos, setErrorData))
      .then(() => {
        setLoaded(true);
      });
  }, []);

  useEffect(() => {
    document.documentElement.style.transition = 'background-color 250ms ease';
  }, []);

  return (
    <div className="app">
      <header>
        <div className="header-content">
          <span className="header-logo">Ivan Peshekhonov homepage</span>
          <div className="header-controls">
            <Toggle
              id="theme-toggle"
              className="theme-toggle"
              checked={dark}
              onChange={toggle}
              label={dark ? '🌞' : '🌒'}
            />
          </div>
        </div>
      </header>
      <main>
        <figure className="figure">
          <img id="avatar" src={avatar} alt="avatar" />
        </figure>
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
          {renderIf(
            !!errorData,
            <div className="error">
              <h4 className="error-message">Could not fetch projects</h4>
              {/* <Collapsible > */}
              <p className="error-extra">{errorData}</p>
              {/* </Collapsible> */}
            </div>
          )}
          <Masonry
            breakoutCols={{
              0: 3,
              960: 2,
              560: 1,
            }}
            className={cn('cards-masonry', 'fades-in', { 'fade-in': loaded })}
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
