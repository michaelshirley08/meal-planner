/**
 * Test user fixtures for consistent test data
 */

export interface TestUser {
  username: string;
  email: string;
  password: string;
}

/**
 * Primary test user for most tests
 */
export const testUser1: TestUser = {
  username: 'qa_test_user_1',
  email: 'qa_test_1@example.com',
  password: 'QATest123!',
};

/**
 * Secondary test user for multi-user scenarios
 */
export const testUser2: TestUser = {
  username: 'qa_test_user_2',
  email: 'qa_test_2@example.com',
  password: 'QATest456!',
};

/**
 * Test user for registration tests
 */
export const newTestUser: TestUser = {
  username: 'qa_new_user',
  email: 'qa_new@example.com',
  password: 'QANewUser123!',
};

/**
 * Test user for login bug verification
 */
export const verifyTestUser: TestUser = {
  username: 'qa_test_verify',
  email: 'qa_verify@example.com',
  password: 'QAVerify123!',
};

/**
 * Generate a unique test user (for tests that need unique users)
 */
export function generateUniqueTestUser(): TestUser {
  const timestamp = Date.now();
  return {
    username: `qa_test_${timestamp}`,
    email: `qa_test_${timestamp}@example.com`,
    password: 'QATest123!',
  };
}
