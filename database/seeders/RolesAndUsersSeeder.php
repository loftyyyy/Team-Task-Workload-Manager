<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndUsersSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $adminRole = Role::create(['name' => 'admin']);
        $employeeRole = Role::create(['name' => 'employee']);

        $createTask = Permission::create(['name' => 'create task']);
        $viewAllTask = Permission::create(['name' => 'view all task']);
        $assignTask = Permission::create(['name' => 'assign task']);

        $viewTasks = Permission::create(['name' => 'view tasks']);
        $updateTaskStatus = Permission::create(['name' => 'update task status']);

        $employeeRole->givePermissionTo([$viewTasks, $updateTaskStatus]);
        $adminRole->givePermissionTo([$createTask, $viewAllTask, $assignTask]);

        $admin = User::create([
            'name' => 'Admin User',
        ]);

        $admin->assignRole($adminRole);

        $employees = collect(['Employee User 1', 'Employee User 2', 'Employee User 3', 'Employee User 4'])
            ->map(fn ($name) => User::create(['name' => $name]));

        $employees->each->assignRole($employeeRole);
    }
}
