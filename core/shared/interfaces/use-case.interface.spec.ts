import { UseCase } from './use-case.interface';

// Sample DTO for testing
interface TestInput {
  value: string;
}

interface TestOutput {
  result: string;
}

const ERROR_MESSAGE = 'Test error';

// Sample use case implementation for testing
class TestUseCase implements UseCase<TestInput, TestOutput> {
  async execute(input: TestInput): Promise<TestOutput> {
    return await Promise.resolve({ result: `Processed: ${input.value}` });
  }
}

// Sample error use case implementation
class ErrorTestUseCase implements UseCase<TestInput, TestOutput> {
  async execute(input: TestInput): Promise<TestOutput> {
    throw new Error(ERROR_MESSAGE);
    return await Promise.resolve({ result: input.value });
  }
}

describe('UseCase Interface', () => {
  describe('TestUseCase', () => {
    let useCase: TestUseCase;

    beforeEach(() => {
      useCase = new TestUseCase();
    });

    it('should implement UseCase interface correctly', () => {
      expect(useCase.execute).toBeDefined();
      expect(typeof useCase.execute).toBe('function');
    });

    it('should process input and return output successfully', async () => {
      const input: TestInput = { value: 'test' };
      const result = await useCase.execute(input);

      expect(result).toBeDefined();
      expect(result.result).toBe('Processed: test');
    });

    it('should maintain the contract between input and output types', async () => {
      const input: TestInput = { value: 'contract test' };
      const output = await useCase.execute(input);

      expect(output).toHaveProperty('result');
      expect(typeof output.result).toBe('string');
    });
  });

  describe('ErrorTestUseCase', () => {
    let errorUseCase: ErrorTestUseCase;

    beforeEach(() => {
      errorUseCase = new ErrorTestUseCase();
    });

    it('should handle errors properly', async () => {
      const input: TestInput = { value: 'error test' };

      await expect(errorUseCase.execute(input)).rejects.toThrow(ERROR_MESSAGE);
    });
  });
});
