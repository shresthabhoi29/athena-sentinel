type FieldErrorProps = {
  message?: string;
};

export function FieldError({ message }: FieldErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <p className="text-xs leading-5 text-red-300" role="alert">
      {message}
    </p>
  );
}
