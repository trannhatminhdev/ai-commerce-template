/* eslint-disable @typescript-eslint/unbound-method, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from '../../src/modules/orders/application/services/orders.service';
import { IOrderRepository } from '../../src/modules/orders/application/interfaces/order-repository.interface';
import { NotFoundException } from '@nestjs/common';

describe('OrdersService', () => {
  let service: OrdersService;
  let repository: jest.Mocked<IOrderRepository>;

  beforeEach(async () => {
    repository = {
      createWithItems: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      updateStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: IOrderRepository, useValue: repository },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create order successfully', async () => {
      const dto = { userId: 1, totalAmount: 100 } as any;
      const created = { id: 1, userId: 1, totalAmount: 100 };
      repository.createWithItems.mockResolvedValue(created as any);

      const result = await service.createOrder(dto);
      expect(result).toEqual(created);
      expect(repository.createWithItems).toHaveBeenCalledWith(dto);
    });
  });

  describe('getAllOrders', () => {
    it('should return all orders', async () => {
      const orders = [{ id: 1, userId: 1 }] as any[];
      repository.findAll.mockResolvedValue(orders);

      const result = await service.getAllOrders();
      expect(result).toEqual(orders);
    });
  });

  describe('getMyOrders', () => {
    it('should return orders for a specific user', async () => {
      const orders = [{ id: 1, userId: 1 }] as any[];
      repository.findAll.mockResolvedValue(orders);

      const result = await service.getMyOrders(1);
      expect(result).toEqual(orders);
      expect(repository.findAll).toHaveBeenCalledWith({ userId: 1 });
    });
  });

  describe('getOrderById', () => {
    it('should throw NotFoundException if not found', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(service.getOrderById(99)).rejects.toThrow(NotFoundException);
    });

    it('should return order if found', async () => {
      const order = { id: 1 } as any;
      repository.findById.mockResolvedValue(order);

      const result = await service.getOrderById(1);
      expect(result).toEqual(order);
    });
  });

  describe('updateOrderStatus', () => {
    it('should update status successfully if order exists', async () => {
      repository.findById.mockResolvedValue({ id: 1 } as any);
      const updated = { id: 1, status: 'SHIPPED' };
      repository.updateStatus.mockResolvedValue(updated as any);

      const result = await service.updateOrderStatus(1, 'SHIPPED');
      expect(result).toEqual(updated);
      expect(repository.updateStatus).toHaveBeenCalledWith(1, 'SHIPPED');
    });

    it('should throw NotFoundException if order does not exist', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(service.updateOrderStatus(99, 'SHIPPED')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
