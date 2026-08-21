/* eslint-disable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */
import { Test, TestingModule } from '@nestjs/testing';
import { AdminProductsController } from '../../src/modules/products/presentation/http/admin-products.controller';
import { ProductsService } from '../../src/modules/products/application/services/products.service';

describe('AdminProductsController', () => {
  let controller: AdminProductsController;
  let service: Partial<Record<keyof ProductsService, jest.Mock>>;

  beforeEach(async () => {
    service = {
      createProduct: jest.fn(),
      updateProduct: jest.fn(),
      deleteProduct: jest.fn(),
      addImage: jest.fn(),
      setThumbnail: jest.fn(),
      deleteImage: jest.fn(),
      addSpecification: jest.fn(),
      deleteSpecification: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminProductsController],
      providers: [{ provide: ProductsService, useValue: service }],
    }).compile();

    controller = module.get<AdminProductsController>(AdminProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const dto = { name: 'Test Product', price: 100 } as any;
      const expectedResult = { id: 1, ...dto };
      service.createProduct!.mockResolvedValue(expectedResult);

      const result = await controller.create(dto);
      expect(result).toEqual(expectedResult);
      expect(service.createProduct).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const dto = { name: 'Updated' } as any;
      const expectedResult = { id: 1, ...dto };
      service.updateProduct!.mockResolvedValue(expectedResult);

      const result = await controller.update(1, dto);
      expect(result).toEqual(expectedResult);
      expect(service.updateProduct).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      service.deleteProduct!.mockResolvedValue(undefined as any);
      await controller.remove(1);
      expect(service.deleteProduct).toHaveBeenCalledWith(1);
    });
  });

  // Images and specifications
  describe('setThumbnail', () => {
    it('should set thumbnail', async () => {
      service.setThumbnail!.mockResolvedValue(undefined as any);
      await controller.setThumbnail(1, 2);
      expect(service.setThumbnail).toHaveBeenCalledWith(1, 2);
    });
  });

  describe('addSpecification', () => {
    it('should add spec', async () => {
      const dto = { specName: 'Color', specValue: 'Red' };
      service.addSpecification!.mockResolvedValue(undefined as any);
      await controller.addSpecification(1, dto);
      expect(service.addSpecification).toHaveBeenCalledWith(1, dto);
    });
  });
});
