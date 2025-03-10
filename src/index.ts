import { setupApp } from './app';

const PORT = process.env.PORT || 3000;

// Initialize the app and start the server
setupApp()
  .then((app) => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err: Error) => {
    console.error('Failed to initialize application:', err);
    process.exit(1);
  });