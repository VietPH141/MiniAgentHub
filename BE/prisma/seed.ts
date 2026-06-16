import { prisma } from '../src/config/prisma';
import bcrypt from 'bcryptjs';
import { PERMISSIONS } from '../src/constants/permissions';


async function main() {
  console.log('--- Đang bắt đầu Seeding ---');

  // 1. Tạo/Cập nhật danh sách mã quyền từ file constants
  const permissionEntries = Object.values(PERMISSIONS);
  console.log(`Đang khởi tạo ${permissionEntries.length} mã quyền...`);

  for (const pKey of permissionEntries) {
    await prisma.permission.upsert({
      where: { permissionKey: pKey },
      update: {},
      create: {
        permissionKey: pKey,
        entity: pKey.split('_')[0], // Tự động lấy prefix làm thực thể (VD: GROUP, USER)
        description: `Quyền thực hiện ${pKey}`
      },
    });
  }

  // 2. Tạo Group "Administrator"
  const adminGroup = await prisma.group.upsert({
    where: { name: 'Super Administrator' },
    update: {},
    create: {
      name: 'Super Administrator',
      description: 'Nhóm quản trị viên có toàn quyền hệ thống',
    },
  });

  // 3. Gán TẤT CẢ quyền hiện có cho Group này
  const allPermissions = await prisma.permission.findMany();
  for (const perm of allPermissions) {
    await prisma.groupPermission.upsert({
      where: {
        groupId_permissionId: {
          groupId: adminGroup.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        groupId: adminGroup.id,
        permissionId: perm.id,
      },
    });
  }

  // 4. Tạo tài khoản Super Admin
  const adminEmail = 'admin@minihub.com';
  const hashedPassword = bcrypt.hashSync('Admin@123', 10); // Thay bằng mật khẩu bảo mật

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: hashedPassword,
      fullName: 'Hệ Thống Admin',
      isActive: true,
    },
  });

  // 5. Gán User Admin vào Group Admin
  await prisma.userGroup.upsert({
    where: {
      userId_groupId: {
        userId: adminUser.id,
        groupId: adminGroup.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      groupId: adminGroup.id,
    },
  });

  console.log('--- Seeding thành công! ---');
  console.log(`Tài khoản: ${adminEmail}`);
  console.log(`Mật khẩu: Admin@123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });