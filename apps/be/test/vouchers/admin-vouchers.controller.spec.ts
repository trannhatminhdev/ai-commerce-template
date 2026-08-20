/* eslint-disable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */
import { Test, TestingModule } from '@nestjs/testing';
import { AdminVouchersController } from '../../src/modules/vouchers/presentation/http/admin-vouchers.controller';
import { VouchersService } from '../../src/modules/vouchers/application/services/vouchers.service';

describe('AdminVouchersController', () => {
  let controller: AdminVouchersController;
  let service: jest.Mocked<Partial<VouchersService>>;

  beforeEach(async () => {
    service = {
      createVoucher: jest.fn(),
      getAllVouchers: jest.fn(),
      getVoucherById: jest.fn(),
      deleteVoucher: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminVouchersController],
      providers: [{ provide: VouchersService, useValue: service }],
    }).compile();

    controller = module.get<AdminVouchersController>(AdminVouchersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createVoucher', () => {
    it('should create voucher', async () => {
      const dto = { code: 'TEST' } as any;
      const expectedResult = { id: 1, ...dto };
      service.createVoucher!.mockResolvedValue(expectedResult);

      const result = await controller.createVoucher(dto);
      expect(result).toEqual(expectedResult);
      expect(service.createVoucher).toHaveBeenCalledWith(dto);
    });
  });

  describe('getAllVouchers', () => {
    it('should return all vouchers', async () => {
      const expectedResult = [{ id: 1, code: 'TEST' }] as any[];
      service.getAllVouchers!.mockResolvedValue(expectedResult);

      const result = await controller.getAllVouchers();
      expect(result).toEqual(expectedResult);
      expect(service.getAllVouchers).toHaveBeenCalled();
    });
  });

  describe('getVoucherById', () => {
    it('should return voucher by id', async () => {
      const expectedResult = { id: 1, code: 'TEST' } as any;
      service.getVoucherById!.mockResolvedValue(expectedResult);

      const result = await controller.getVoucherById(1);
      expect(result).toEqual(expectedResult);
      expect(service.getVoucherById).toHaveBeenCalledWith(1);
    });
  });

  describe('deleteVoucher', () => {
    it('should delete voucher', async () => {
      service.deleteVoucher!.mockResolvedValue(undefined as any);
      await controller.deleteVoucher(1);
      expect(service.deleteVoucher).toHaveBeenCalledWith(1);
    });
  });
});
