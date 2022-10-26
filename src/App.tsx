import { useEffect, useState } from "react";
import produce from "immer";

import Container from "react-bootstrap/Container";
import ProjectCard from "./components/ProjectCard";

import { repositoryInfoRoute } from "./helpers/routes";
import { RepoInfoResponse } from "./helpers/RepoInfoResponse";

import golImg from "./assets/images/Gospers_glider_gun.gif";
import weatherImg from "./assets/images/weather.png";
import "./App.css";

const projects = [
  { title: "Conway's Game of Life", name: "game-of-life", img: golImg },
  {
    title: "Weather App",
    name: "weather-app",
    img: weatherImg,
    primaryLink: "https://vancomm-weather-app.netlify.app/",
  },
  {
    title: "Reckoner App",
    name: "reckoner-app",
    img: "",
  }
];

export default function App() {
  const [projectDescriptions, setProjectDescriptions] = useState<{
    [key: string]: string;
  }>({});

  const fetchRepoData = async (
    name: string
  ): Promise<RepoInfoResponse | null> => {
    const res = await fetch(repositoryInfoRoute(name));
    if (!res.ok) return null;
    return res.json();
  };

  useEffect(() => {
    Promise.all(
      projects.map(({ name }) =>
        fetchRepoData(name).then((data) => {
          if (data)
            setProjectDescriptions(
              produce((draft) => {
                draft[name] = data.description;
              })
            );
        })
      )
    );
  }, []);

  return (
    <div id="app">
      <Container>
        <h1 className="my-5">Hi!</h1>
        <div className="project-cards">
          {projects.map(({ title, name, img, primaryLink }) => (
            <ProjectCard
              key={name}
              title={title}
              text={projectDescriptions[name]}
              primaryLink={primaryLink ?? `https://vancomm.github.io/${name}`}
              secondaryLink={`https://github.com/vancomm/${name}`}
              imgSrc={img}
            />
          ))}
        </div>
      </Container>
      {/* <main>
        <div className="card">
          <div className="card-header">Header</div>
          <div className="card-body">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </div>
        </div>
        <div className="card">
          <div className="card-header">Header</div>
          <div className="card-body">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </div>
        </div>
        <div className="card">
          <div className="card-header">Header</div>
          <div className="card-body">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </div>
        </div>
        <div className="card">
          <div className="card-header">Header</div>
          <div className="card-body">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </div>
        </div>
      </main> */}
    </div>
  );
}
