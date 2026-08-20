/* eslint-disable @typescript-eslint/unbound-method, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { VouchersService } from '../../src/modules/vouchers/application/services/vouchers.service';
import { IVoucherRepository } from '../../src/modules/vouchers/application/interfaces/voucher-repository.interface';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('VouchersService', () => {
  let service: VouchersService;
  let repository: jest.Mocked<IVoucherRepository>;

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByCode: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VouchersService,
        { provide: IVoucherRepository, useValue: repository },
      ],
    }).compile();

    service = module.get<VouchersService>(VouchersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createVoucher', () => {
    it('should throw BadRequestException if code exists', async () => {
      repository.findByCode.mockResolvedValue({ id: 1, code: 'TEST' } as any);
      await expect(
        service.createVoucher({ code: 'TEST' } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create voucher successfully', async () => {
      repository.findByCode.mockResolvedValue(null);
      const dto = { code: 'TEST' } as any;
      const created = { id: 1, ...dto };
      repository.create.mockResolvedValue(created);

      const result = await service.createVoucher(dto);
      expect(result).toEqual(created);
      expect(repository.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('getAllVouchers', () => {
    it('should return all vouchers', async () => {
      const vouchers = [{ id: 1, code: 'TEST' }] as any[];
      repository.findAll.mockResolvedValue(vouchers);

      const result = await service.getAllVouchers();
      expect(result).toEqual(vouchers);
    });
  });

  describe('getVoucherById', () => {
    it('should throw NotFoundException if voucher not found', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(service.getVoucherById(99)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return voucher if found', async () => {
      const voucher = { id: 1, code: 'TEST' } as any;
      repository.findById.mockResolvedValue(voucher);

      const result = await service.getVoucherById(1);
      expect(result).toEqual(voucher);
    });
  });

  describe('deleteVoucher', () => {
    it('should throw NotFoundException if voucher not found', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(service.deleteVoucher(99)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should delete voucher if exists', async () => {
      repository.findById.mockResolvedValue({ id: 1 } as any);
      repository.delete.mockResolvedValue(undefined);

      await service.deleteVoucher(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('applyVoucher', () => {
    it('should throw NotFoundException if voucher not found or invalid', async () => {
      repository.findByCode.mockResolvedValue(null);
      await expect(service.applyVoucher('INVALID')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return voucher if valid', async () => {
      const voucher = { id: 1, code: 'VALID' } as any;
      repository.findByCode.mockResolvedValue(voucher);

      const result = await service.applyVoucher('VALID');
      expect(result).toEqual(voucher);
    });
  });
});
