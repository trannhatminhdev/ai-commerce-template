/* eslint-disable */
import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { IOrderRepository } from '../interfaces/order-repository.interface';
import { NotFoundException } from '@nestjs/common';

describe('OrdersService', () => {
  let service: OrdersService;
  let mockRepository: jest.Mocked<IOrderRepository>;

  beforeEach(async () => {
    mockRepository = {
      createWithItems: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      updateStatus: jest.fn(),
      hasUserPurchasedProduct: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: IOrderRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllOrders', () => {
    it('should return all orders with pagination and search', async () => {
      const mockResult = { data: [{ id: 1 } as any], total: 1 };
      mockRepository.findAll.mockResolvedValue(mockResult);

      const result = await service.getAllOrders(0, 10, 'search');

      expect(result).toEqual(mockResult);
      expect(mockRepository.findAll).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        search: 'search',
      });
    });
  });

  describe('getMyOrders', () => {
    it('should return user orders with pagination', async () => {
      const mockResult = { data: [{ id: 1 } as any], total: 1 };
      mockRepository.findAll.mockResolvedValue(mockResult);

      const result = await service.getMyOrders(1, 0, 10);

      expect(result).toEqual(mockResult);
      expect(mockRepository.findAll).toHaveBeenCalledWith({
        userId: 1,
        skip: 0,
        take: 10,
      });
    });
  });

  describe('getOrderById', () => {
    it('should return order when it exists', async () => {
      const mockOrder = { id: 1 } as any;
      mockRepository.findById.mockResolvedValue(mockOrder);

      const result = await service.getOrderById(1);

      expect(result).toEqual(mockOrder);
      expect(mockRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when order not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.getOrderById(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status when it exists', async () => {
      const mockOrder = { id: 1, status: 'PENDING' } as any;
      mockRepository.findById.mockResolvedValue(mockOrder);
      mockRepository.updateStatus.mockResolvedValue({
        ...mockOrder,
        status: 'SHIPPED',
      });

      const result = await service.updateOrderStatus(1, 'SHIPPED');

      expect(result.status).toBe('SHIPPED');
      expect(mockRepository.updateStatus).toHaveBeenCalledWith(1, 'SHIPPED');
    });

    it('should throw NotFoundException when order not found during update', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.updateOrderStatus(999, 'SHIPPED')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
