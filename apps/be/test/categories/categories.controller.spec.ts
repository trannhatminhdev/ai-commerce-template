/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from '../../src/modules/categories/presentation/http/categories.controller';
import { CategoriesService } from '../../src/modules/categories/application/services/categories.service';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let mockService: {
    findAll: jest.Mock;
    findById: jest.Mock;
  };

  beforeEach(async () => {
    mockService = {
      findAll: jest.fn(),
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      const categories = [
        {
          id: 2,
          name: 'Clothing',
          parentId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockService.findAll.mockResolvedValue(categories);

      const result = await controller.findAll();

      expect(result).toEqual(categories);
      expect(mockService.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a category by id', async () => {
      const category = {
        id: 2,
        name: 'Clothing',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockService.findById.mockResolvedValue(category);

      const result = await controller.findById(2);

      expect(result).toEqual(category);
      expect(mockService.findById).toHaveBeenCalledWith(2);
    });
  });
});
