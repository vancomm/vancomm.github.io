import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../utils';
import { Classable, ClassArgument, Nestable } from '../../types/utils';
import './Masonry.css';

const defaultColumns = 2;

type BreakoutColsObject = Record<number, number>;

interface MasonryProps extends React.HTMLAttributes<HTMLDivElement> {
  breakoutCols?: BreakoutColsObject | number;
  columnClassName?: ClassArgument;
}

export default function Masonry({
  breakoutCols = defaultColumns,
  className,
  columnClassName,
  children,
}: MasonryProps) {
  const [lastFrame, setLastFrame] = useState<number>();
  const [columnCount, setColumnCount] = useState<number>(
    typeof breakoutCols === 'number'
      ? breakoutCols
      : breakoutCols[0] ?? defaultColumns
  );

  const childrenInColumns: Array<Array<React.ReactNode>> = [];

  // const colHeights: number[] = []

  React.Children.forEach(children, (child, index) => {
    // const col = colHeights.indexOf(Math.min(...colHeights))
    const col = index % columnCount;
    if (!childrenInColumns[col]) {
      childrenInColumns[col] = [];
    }
    childrenInColumns[col].push(child);
  });

  const colWidth = `${100 / childrenInColumns.length}%`;

  const recalculateColumnCount = () => {
    const windowWidth = window.innerWidth;
    const breakpointColsObject =
      typeof breakoutCols !== 'object' ? { 0: breakoutCols } : breakoutCols;
    let matched = Infinity;
    let cols = breakpointColsObject[0] || defaultColumns;
    for (const breakpoint in breakpointColsObject) {
      const width = parseInt(breakpoint) || 0;
      const isCurrentBreakpoint = width > 0 && width >= windowWidth;
      if (isCurrentBreakpoint && width < matched) {
        matched = width;
        cols = breakpointColsObject[breakpoint];
      }
    }
    cols = Math.max(1, cols);
    if (columnCount !== cols) {
      setColumnCount(cols);
    }
  };

  const recalculateColumnCountDebounce = () => {
    if (lastFrame) window.cancelAnimationFrame(lastFrame);
    setLastFrame(window.requestAnimationFrame(recalculateColumnCount));
  };

  useEffect(() => {
    window.addEventListener('resize', recalculateColumnCountDebounce);
    return () => {
      window.removeEventListener('resize', recalculateColumnCountDebounce);
    };
  }, []);

  useEffect(recalculateColumnCount);

  return (
    <div className={cn('masonry', className)}>
      {childrenInColumns.map((items, index) => (
        <div
          key={index}
          className={cn(columnClassName)}
          style={{ width: colWidth }}
        >
          {items}
        </div>
      ))}
    </div>
  );
}
