/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */
import { Test, TestingModule } from '@nestjs/testing';
import { UserVouchersController } from '../../src/modules/vouchers/presentation/http/user-vouchers.controller';
import { VouchersService } from '../../src/modules/vouchers/application/services/vouchers.service';

describe('UserVouchersController', () => {
  let controller: UserVouchersController;
  let service: Partial<Record<keyof VouchersService, jest.Mock>>;

  beforeEach(async () => {
    service = {
      applyVoucher: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserVouchersController],
      providers: [{ provide: VouchersService, useValue: service }],
    }).compile();

    controller = module.get<UserVouchersController>(UserVouchersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('applyVoucher', () => {
    it('should apply voucher', async () => {
      const dto = { code: 'VALID' };
      const expectedResult = { id: 1, code: 'VALID' } as any;
      service.applyVoucher!.mockResolvedValue(expectedResult);

      const result = await controller.applyVoucher(dto);
      expect(result).toEqual(expectedResult);
      expect(service.applyVoucher).toHaveBeenCalledWith(dto.code);
    });
  });
});
