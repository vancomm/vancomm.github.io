import React from 'react';
import { Classable, Nestable, Substitutable } from '../../types/utils';
import { cn } from '../../utils';
import './Card.css';

interface CardProps extends Nestable, Substitutable, Classable {}

export default function Card({ as, className, children }: CardProps) {
  return React.createElement(
    as || 'div',
    { className: cn('card', className) },
    children
  );
}

function Header({ children }: Nestable) {
  return <div className="card-header">{children}</div>;
}

Card.Header = Header;

function Body({ children }: Nestable) {
  return <div className="card-body">{children}</div>;
}

Card.Body = Body;

function Footer({ children }: Nestable) {
  return <div className="card-footer">{children}</div>;
}

Card.Footer = Footer;
