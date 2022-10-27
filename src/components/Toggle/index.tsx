import { Changeable, Classable, HasValue, IDable } from '../../types/utils';
import { cn } from '../../utils';
import './Toggle.css';

interface ToggleProps extends Changeable<HTMLInputElement>, Classable {
  id: string;
  checked: boolean;
  label: string;
}

export default function Toggle({
  checked,
  onChange,
  label,
  className,
  id,
}: ToggleProps) {
  return (
    <div className='toggle'>
      <input
        type="checkbox"
        className="toggle-input"
        id={id}
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={id} className={cn(className)}>
        {label}
      </label>
    </div>
  );
}
