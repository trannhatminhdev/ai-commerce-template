/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Test, TestingModule } from '@nestjs/testing';
import { AdminCategoriesController } from '../../src/modules/categories/presentation/http/admin-categories.controller';
import { CategoriesService } from '../../src/modules/categories/application/services/categories.service';

describe('AdminCategoriesController', () => {
  let controller: AdminCategoriesController;
  let mockService: jest.Mocked<Partial<CategoriesService>>;

  beforeEach(async () => {
    mockService = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminCategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<AdminCategoriesController>(AdminCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const createData = { name: 'Clothing' };
      const createdCategory = {
        id: 2,
        name: 'Clothing',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockService.create.mockResolvedValue(createdCategory);

      const result = await controller.create(createData);

      expect(result).toEqual(createdCategory);
      expect(mockService.create).toHaveBeenCalledWith(createData);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const updateData = { name: 'Updated Clothing' };
      const updatedCategory = {
        id: 2,
        name: 'Updated Clothing',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockService.update.mockResolvedValue(updatedCategory);

      const result = await controller.update(2, updateData);

      expect(result).toEqual(updatedCategory);
      expect(mockService.update).toHaveBeenCalledWith(2, updateData);
    });
  });

  describe('remove', () => {
    it('should remove a category', async () => {
      mockService.delete.mockResolvedValue(undefined);

      await controller.remove(2);

      expect(mockService.delete).toHaveBeenCalledWith(2);
    });
  });
});
