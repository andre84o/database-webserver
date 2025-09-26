const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <div className="error-message">
      <p>{message}</p>
    </div>
  );
};
export default ErrorMessage;