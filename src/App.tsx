import Container from 'react-bootstrap/Container';
import ProjectCard from './components/ProjectCard';
import img from './assets/images/Gospers_glider_gun.gif';
import weatherImg from './assets/images/weather.png';
import './App.css';

export default function App() {
  return (
    <Container>
      <h1 className="my-5">Hi!</h1>
      <div className="project-cards">
        <ProjectCard
          title="Conway's Game of Life"
          text="Written in React."
          primaryLink="https://vancomm.github.io/game-of-life/"
          secondaryLink="https://github.com/vancomm/game-of-life"
          imgSrc={img}
        />
        <ProjectCard
          title="Weather App"
          text="A simple React weather application"
          primaryLink="https://vancomm.github.io/weather-app/"
          secondaryLink="https://github.com/vancomm/weather-app"
          imgSrc={weatherImg}
        />
      </div>
    </Container>
  );
}
