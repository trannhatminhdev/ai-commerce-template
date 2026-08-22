/* eslint-disable */
import { Test, TestingModule } from '@nestjs/testing';
import { AdminOrdersController } from './admin-orders.controller';
import { OrdersService } from '../../application/services/orders.service';
import { UpdateOrderStatusDto } from './dtos/update-order-status.dto';

describe('AdminOrdersController', () => {
  let controller: AdminOrdersController;
  let mockService: {
    getAllOrders: jest.Mock;
    getOrderById: jest.Mock;
    updateOrderStatus: jest.Mock;
  };

  beforeEach(async () => {
    mockService = {
      getAllOrders: jest.fn(),
      getOrderById: jest.fn(),
      updateOrderStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminOrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<AdminOrdersController>(AdminOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllOrders', () => {
    it('should call service with parsed queries', async () => {
      const mockResult = { data: [], total: 0 };
      mockService.getAllOrders!.mockResolvedValue(mockResult);

      const result = await controller.getAllOrders('0', '10', 'search');

      expect(result).toEqual(mockResult);
      expect(mockService.getAllOrders).toHaveBeenCalledWith(0, 10, 'search');
    });

    it('should call service with undefined for missing queries', async () => {
      const mockResult = { data: [], total: 0 };
      mockService.getAllOrders!.mockResolvedValue(mockResult);

      const result = await controller.getAllOrders();

      expect(result).toEqual(mockResult);
      expect(mockService.getAllOrders).toHaveBeenCalledWith(
        undefined,
        undefined,
        undefined,
      );
    });
  });

  describe('getOrderById', () => {
    it('should return order', async () => {
      const mockOrder = { id: 1 } as any;
      mockService.getOrderById!.mockResolvedValue(mockOrder);

      const result = await controller.getOrderById(1);

      expect(result).toEqual(mockOrder);
      expect(mockService.getOrderById).toHaveBeenCalledWith(1);
    });
  });

  describe('updateOrderStatus', () => {
    it('should update status', async () => {
      const mockOrder = { id: 1, status: 'SHIPPED' } as any;
      mockService.updateOrderStatus!.mockResolvedValue(mockOrder);

      const dto: UpdateOrderStatusDto = { status: 'SHIPPED' };
      const result = await controller.updateOrderStatus(1, dto);

      expect(result).toEqual(mockOrder);
      expect(mockService.updateOrderStatus).toHaveBeenCalledWith(1, 'SHIPPED');
    });
  });
});
