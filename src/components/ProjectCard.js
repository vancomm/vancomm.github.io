import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import '../assets/project-card.css';

export default function ProjectCard({
  title, text, imgSrc, primaryLink, secondaryLink,
}) {
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img
        variant="top"
        src={imgSrc}
        onClick={() => {
          window.open(primaryLink);
        }}
      />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{text}</Card.Text>
        <Button
          variant="primary"
          onClick={() => {
            window.open(primaryLink);
          }}
        >
          Check it out
        </Button>
        {' '}
        <Button
          variant="link"
          onClick={() => {
            window.open(secondaryLink);
          }}
        >
          Repository
        </Button>
      </Card.Body>
    </Card>
  );
}
