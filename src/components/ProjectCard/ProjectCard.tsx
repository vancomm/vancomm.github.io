import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  title: string; text: string; imgSrc: string; primaryLink: string; secondaryLink: string;
}

export default function ProjectCard({
  title, text, imgSrc, primaryLink, secondaryLink,
}: ProjectCardProps) {
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img
        className={styles.cardImgTop}
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
