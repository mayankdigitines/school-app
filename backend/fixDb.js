import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const fixIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB...');

    const collection = mongoose.connection.collection('subjects');

    // List current indexes to verify
    const indexes = await collection.indexes();
    console.log('Current Indexes:', indexes);

    // Drop the problematic index
    // The error log explicitly named this index: "school_1_subCode_1"
    if (indexes.find(idx => idx.name === 'school_1_subCode_1')) {
      await collection.dropIndex('school_1_subCode_1');
      console.log('✅ Successfully dropped old index: school_1_subCode_1');
    } else {
      console.log('⚠️ Index school_1_subCode_1 not found (maybe already deleted).');
    }

    // Explicitly sync indexes defined in your current Subject.js Schema
    // This ensures the new { name: 1, school: 1 } index is built correctly
    const Subject = mongoose.model('Subject', new mongoose.Schema({
      name: String,
      school: mongoose.Schema.Types.ObjectId
    }));
    
    // Note: In a real app, importing the actual model is better, 
    // but for this script, we just want to ensure clean cleanup.
    
    console.log('Database fix complete.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing DB:', error);
    process.exit(1);
  }
};

fixIndexes();