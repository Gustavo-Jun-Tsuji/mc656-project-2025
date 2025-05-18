interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  variant = "primary",
  size = "md",
  ...props
}) => {
  const baseClasses = "rounded font-medium transition-colors";

  const sizeClasses = {
    sm: "py-1 px-3 text-sm",
    md: "py-2 px-4 text-base",
    lg: "py-3 px-6 text-lg",
  };

  const variantClasses = {
    primary: "bg-primary hover:bg-primary-dark text-white",
    secondary: "bg-secondary hover:bg-secondary-dark text-white",
    danger: "bg-danger hover:bg-danger-dark text-white",
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
export default Button;
