import React from "react";
import classNames from "classnames";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

export default function Button({
  variant = "primary",
  className,
  ...rest
}: Props) {
  const base =
    "rounded-xl px-4 py-2 text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed";

  const styles = {
    primary: "bg-black text-white hover:bg-gray-800",
    secondary: "bg-white text-black border border-gray-300 hover:bg-gray-100",
    danger: "bg-white text-red-600 border border-red-200 hover:bg-red-50",
  };

  return (
    <button
      {...rest}
      className={classNames(base, styles[variant], className)}
    />
  );
}
