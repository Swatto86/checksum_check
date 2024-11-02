import { forwardRef, type SVGProps } from 'react';

export interface HashtagIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

export const HashtagIcon = forwardRef<SVGSVGElement, HashtagIconProps>(
  ({ size = 24, className = '', ...props }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className={className}
        ref={ref}
        {...props}
      >
        <rect x="2" y="2" width="20" height="20" rx="4" fill="currentColor" opacity="0.2"/>
        <path
          d="M10 4L8 20M16 4L14 20M4 10H20M4 14H20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
);

HashtagIcon.displayName = 'HashtagIcon';