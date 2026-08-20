/* eslint-disable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { AdminOrdersController } from '../../src/modules/orders/presentation/http/admin-orders.controller';
import { OrdersService } from '../../src/modules/orders/application/services/orders.service';

describe('AdminOrdersController', () => {
  let controller: AdminOrdersController;
  let service: jest.Mocked<Partial<OrdersService>>;

  beforeEach(async () => {
    service = {
      getAllOrders: jest.fn(),
      getOrderById: jest.fn(),
      updateOrderStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminOrdersController],
      providers: [{ provide: OrdersService, useValue: service }],
    }).compile();

    controller = module.get<AdminOrdersController>(AdminOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllOrders', () => {
    it('should return all orders', async () => {
      const expectedResult = [{ id: 1 }] as any[];
      service.getAllOrders!.mockResolvedValue(expectedResult);

      const result = await controller.getAllOrders();
      expect(result).toEqual(expectedResult);
      expect(service.getAllOrders).toHaveBeenCalled();
    });
  });

  describe('getOrderById', () => {
    it('should return order by id', async () => {
      const expectedResult = { id: 1 } as any;
      service.getOrderById!.mockResolvedValue(expectedResult);

      const result = await controller.getOrderById(1);
      expect(result).toEqual(expectedResult);
      expect(service.getOrderById).toHaveBeenCalledWith(1);
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status', async () => {
      const dto = { status: 'SHIPPED' } as any;
      const expectedResult = { id: 1, status: 'SHIPPED' } as any;
      service.updateOrderStatus!.mockResolvedValue(expectedResult);

      const result = await controller.updateOrderStatus(1, dto);
      expect(result).toEqual(expectedResult);
      expect(service.updateOrderStatus).toHaveBeenCalledWith(1, dto.status);
    });
  });
});
