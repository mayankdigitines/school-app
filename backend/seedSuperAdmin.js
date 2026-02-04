import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Admin from './models/Admin.js';

dotenv.config();

const seedSuperAdmin = async () => {
    try {
        await connectDB();

        const email = process.env.SUPER_ADMIN_EMAIL || 'superadmin@gmail.com';
        const password = process.env.SUPER_ADMIN_PASSWORD || 'admin@123';
        const name = process.env.SUPER_ADMIN_NAME || 'Super Admin';

        const adminExists = await Admin.findOne({ email });

        if (adminExists) {
            console.log('Super Admin already exists');
            process.exit();
        }

        const superAdmin = await Admin.create({
            name,
            email,
            password,
            role: 'SuperAdmin'
        });

        console.log(`Super Admin created successfully:
        Email: ${superAdmin.email}
        Role: ${superAdmin.role}
        `);

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedSuperAdmin();
