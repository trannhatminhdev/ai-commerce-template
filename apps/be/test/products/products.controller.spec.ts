/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from '../../src/modules/products/presentation/http/products.controller';
import { ProductsService } from '../../src/modules/products/application/services/products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: Partial<Record<keyof ProductsService, jest.Mock>>;

  beforeEach(async () => {
    service = {
      findAllProducts: jest.fn(),
      findProductById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [{ provide: ProductsService, useValue: service }],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should find all products', async () => {
      const expectedResult = {
        data: [{ id: 1, name: 'Test' } as any],
        total: 1,
      };
      service.findAllProducts!.mockResolvedValue(expectedResult);

      const result = await controller.findAll('0', '10', 'Test', '1');
      expect(result).toEqual(expectedResult);
      expect(service.findAllProducts).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        search: 'Test',
        categoryId: 1,
      });
    });
  });

  describe('findOne', () => {
    it('should find one product', async () => {
      const expectedResult = { id: 1, name: 'Test' } as any;
      service.findProductById!.mockResolvedValue(expectedResult);

      const result = await controller.findOne(1);
      expect(result).toEqual(expectedResult);
      expect(service.findProductById).toHaveBeenCalledWith(1);
    });
  });
});
