import Container from 'react-bootstrap/Container';
import ProjectCard from './components/ProjectCard';
import img from './assets/Gospers_glider_gun.gif';
import './assets/app.css';

export default function App() {
  return (
    <Container>
      <h1 className="my-5">Hi!</h1>
      <ProjectCard
        title="Conway's Game of Life"
        text="Written in React."
        imgSrc={img}
        primaryLink="https://vancomm.github.io/game-of-life/"
        secondaryLink="https://github.com/vancomm/game-of-life"
      />
    </Container>
  );
}
