// Jest setup file for teardown
import { closePool } from './lib/database';

afterAll(async () => {
  // Close database connections after all tests
  try {
    await closePool();
  } catch (error) {
    // Ignore errors during cleanup
  }
});
