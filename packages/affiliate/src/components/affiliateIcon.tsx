import { FC } from "react";
import { IconProps } from "../utils/types";

export const AffiliateIcon: FC<IconProps> = (props) => {
  const { size = 16, className, ...rest } = props;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="#fff"
      fillOpacity=".98"
      xmlns="http://www.w3.org/2000/svg"
      className={props.className}
      {...rest}
    >
      <path d="M8 1.302c-3.683 0-6.655 2.985-6.667 6.667-.013 3.676 2.987 6.68 6.666 6.687s6.674-3.037 6.667-6.687c-.007-3.682-2.985-6.667-6.667-6.667m0 1.333a5.333 5.333 0 0 1 5.333 5.334c0 1.5-.625 2.852-1.622 3.821-.49-1.062-1.545-1.821-2.753-1.821H7.04c-1.207 0-2.259.75-2.75 1.812A5.3 5.3 0 0 1 2.666 7.97a5.333 5.333 0 0 1 5.333-5.334M8 3.97a2.667 2.667 0 1 0 0 5.333A2.667 2.667 0 0 0 8 3.97" />
      <path
        d="M16 12.667a3.333 3.333 0 1 1-6.667 0 3.333 3.333 0 0 1 6.667 0"
        fill="#1828C3"
      />
      <path d="M11.917 11.433a.917.917 0 0 0-.917.917c0 .53.302 1.031.802 1.49a4.6 4.6 0 0 0 .713.53l.068.043c.05.027.117.027.167 0l.068-.042q.08-.05.177-.115c.182-.123.366-.26.536-.416.5-.459.802-.96.802-1.49a.917.917 0 0 0-.917-.917.97.97 0 0 0-.744.386.95.95 0 0 0-.756-.386" />
    </svg>
  );
};
