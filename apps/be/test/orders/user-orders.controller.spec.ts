/* eslint-disable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */
import { Test, TestingModule } from '@nestjs/testing';
import { UserOrdersController } from '../../src/modules/orders/presentation/http/user-orders.controller';
import { OrdersService } from '../../src/modules/orders/application/services/orders.service';

describe('UserOrdersController', () => {
  let controller: UserOrdersController;
  let service: Partial<Record<keyof OrdersService, jest.Mock>>;

  beforeEach(async () => {
    service = {
      createOrder: jest.fn(),
      getMyOrders: jest.fn(),
      getOrderById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserOrdersController],
      providers: [{ provide: OrdersService, useValue: service }],
    }).compile();

    controller = module.get<UserOrdersController>(UserOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create an order', async () => {
      const dto = { userId: 1 } as any;
      const expectedResult = { id: 1, userId: 1 } as any;
      service.createOrder!.mockResolvedValue(expectedResult);

      const result = await controller.createOrder(dto);
      expect(result).toEqual(expectedResult);
      expect(service.createOrder).toHaveBeenCalledWith(dto);
    });
  });

  describe('getMyOrders', () => {
    it('should return user orders', async () => {
      const expectedResult = [{ id: 1, userId: 1 }] as any[];
      service.getMyOrders!.mockResolvedValue(expectedResult);

      const result = await controller.getMyOrders(1);
      expect(result).toEqual(expectedResult);
      expect(service.getMyOrders).toHaveBeenCalledWith(1);
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
});
