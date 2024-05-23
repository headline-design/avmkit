export const ErrorView = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-semibold text-secondary">404</h1>
        <p className="text-secondary">Page not found</p>
        <a href="/" className="text-blue-500 hover:underline">
          Go back to home
        </a>
      </div>
    </div>
  );
};
