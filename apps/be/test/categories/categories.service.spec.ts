/* eslint-disable @typescript-eslint/unbound-method */

import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from '../../src/modules/categories/application/services/categories.service';
import { ICategoryRepository } from '../../src/modules/categories/application/interfaces/category-repository.interface';
import { NotFoundException } from '@nestjs/common';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let mockRepository: jest.Mocked<ICategoryRepository>;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: ICategoryRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const createData = { name: 'Electronics' };
      const createdCategory = {
        id: 1,
        name: 'Electronics',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockRepository.create.mockResolvedValue(createdCategory);

      const result = await service.create(createData);

      expect(result).toEqual(createdCategory);
      expect(mockRepository.create).toHaveBeenCalledWith(createData);
    });
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const categories = [
        {
          id: 1,
          name: 'Electronics',
          parentId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockRepository.findAll.mockResolvedValue(categories);

      const result = await service.findAll();

      expect(result).toEqual(categories);
      expect(mockRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a category when it exists', async () => {
      const category = {
        id: 1,
        name: 'Electronics',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockRepository.findById.mockResolvedValue(category);

      const result = await service.findById(1);

      expect(result).toEqual(category);
      expect(mockRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when category does not exist', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findById).toHaveBeenCalledWith(999);
    });
  });

  describe('update', () => {
    it('should update and return the category when it exists', async () => {
      const existingCategory = {
        id: 1,
        name: 'Electronics',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const updateData = { name: 'Updated Electronics' };
      const updatedCategory = { ...existingCategory, ...updateData };

      mockRepository.findById.mockResolvedValue(existingCategory);
      mockRepository.update.mockResolvedValue(updatedCategory);

      const result = await service.update(1, updateData);

      expect(result).toEqual(updatedCategory);
      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(mockRepository.update).toHaveBeenCalledWith(1, updateData);
    });

    it('should throw NotFoundException when updating non-existent category', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.update(999, { name: 'test' })).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete the category when it exists', async () => {
      const existingCategory = {
        id: 1,
        name: 'Electronics',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockRepository.findById.mockResolvedValue(existingCategory);
      mockRepository.delete.mockResolvedValue(undefined);

      await service.delete(1);

      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when deleting non-existent category', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.delete(999)).rejects.toThrow(NotFoundException);
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });
  });
});
