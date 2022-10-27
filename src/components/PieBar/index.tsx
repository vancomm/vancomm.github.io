import { Classable } from '../../types/utils';
import { cn } from '../../utils';
import './PieBar.css';

interface PieceData {
  count: number;
  color: string;
}

interface PieBarProps extends Classable {
  pieces: PieceData[];
}

export default function PieBar({ pieces, className }: PieBarProps) {
  const total = pieces.reduce((acc, { count }) => acc + count, 0);

  // const background = `linear-gradient(${pieces.map(
  //   ({ count, color }) => `${count / total}% ${color}`
  // )})`;

  return (
    <div className={cn('pie-bar', className)}>
      {pieces.map(({ count, color }, index) => (
        <div key={index}
          className="pie-bar-piece"
          style={
            {
              '--piece-width': `${(count / total) * 100}%`,
              '--piece-color': color,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
