// Port (Interface) cho Dependency Injection. 
// Giúp Service không phụ thuộc trực tiếp vào ORM/Database cụ thể.
// Khi scale lên Microservice hoặc đổi DB, chỉ cần viết lại Repository (Adapter) mới implement interface này.

export const IAuthRepository = Symbol('IAuthRepository');

export interface IAuthRepository {
  findByEmail(email: string): Promise<any>;
  save(user: any): Promise<any>;
}
