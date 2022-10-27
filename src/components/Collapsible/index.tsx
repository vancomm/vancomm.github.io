import cn from 'classnames';
import { useRef } from 'react';
import { Classable, IDable, Nestable, Styleable } from '../../types/utils';

import styles from './Collapsible.module.css';

interface CollapsibleProps extends Nestable, Classable, Styleable, IDable {
  expanded: boolean;
}

export default function Collapsible({
  expanded,
  children,
  id,
  className,
  style,
}: CollapsibleProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      id={id}
      ref={ref}
      className={cn(styles.collapsible, className)}
      style={
        expanded
          ? { height: `${ref.current?.scrollHeight}px`, ...style }
          : { height: '0', ...style }
      }
    >
      {children}
    </div>
  );
}
