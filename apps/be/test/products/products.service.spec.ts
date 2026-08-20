/* eslint-disable @typescript-eslint/unbound-method, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../../src/modules/products/application/services/products.service';
import { IProductRepository } from '../../src/modules/products/application/interfaces/product-repository.interface';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: jest.Mocked<IProductRepository>;

  beforeEach(async () => {
    repository = {
      createProduct: jest.fn(),
      findAllProducts: jest.fn(),
      findProductById: jest.fn(),
      updateProduct: jest.fn(),
      deleteProduct: jest.fn(),
      findImagesByProductId: jest.fn(),
      addImage: jest.fn(),
      deleteImage: jest.fn(),
      setThumbnail: jest.fn(),
      addSpecification: jest.fn(),
      deleteSpecification: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: IProductRepository, useValue: repository },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProduct', () => {
    it('should create a product successfully', async () => {
      const dto = { name: 'Test Product', price: 100 } as any;
      const created = { id: 1, ...dto };
      repository.createProduct.mockResolvedValue(created);

      const result = await service.createProduct(dto);
      expect(result).toEqual(created);
      expect(repository.createProduct).toHaveBeenCalledWith(dto);
    });
  });

  describe('findProductById', () => {
    it('should return product if found', async () => {
      const product = { id: 1, name: 'Test Product' } as any;
      repository.findProductById.mockResolvedValue(product);

      const result = await service.findProductById(1);
      expect(result).toEqual(product);
      expect(repository.findProductById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if not found', async () => {
      repository.findProductById.mockResolvedValue(null);
      await expect(service.findProductById(99)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateProduct', () => {
    it('should throw NotFoundException if product not found', async () => {
      repository.findProductById.mockResolvedValue(null);
      await expect(
        service.updateProduct(99, { name: 'New' } as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update product if exists', async () => {
      repository.findProductById.mockResolvedValue({ id: 1 } as any);
      const updated = { id: 1, name: 'New' } as any;
      repository.updateProduct.mockResolvedValue(updated);

      const result = await service.updateProduct(1, { name: 'New' });
      expect(result).toEqual(updated);
      expect(repository.updateProduct).toHaveBeenCalledWith(1, { name: 'New' });
    });
  });

  describe('deleteProduct', () => {
    it('should throw NotFoundException if product not found', async () => {
      repository.findProductById.mockResolvedValue(null);
      await expect(service.deleteProduct(99)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should delete product if exists', async () => {
      repository.findProductById.mockResolvedValue({ id: 1 } as any);
      repository.deleteProduct.mockResolvedValue(undefined);

      await service.deleteProduct(1);
      expect(repository.deleteProduct).toHaveBeenCalledWith(1);
    });
  });
});
