import { WorkSpaceAdminGuard } from './workspace-admin.guard';

describe('CompanyAdminGuard', () => {
  it('should be defined', () => {
    expect(new WorkSpaceAdminGuard()).toBeDefined();
  });
});
