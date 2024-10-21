
import connectMongo from '~/lib/mongodb'; 
import { Status } from '~/models/User';


export async function cleanupOldStatuses() {
  try {
    await connectMongo(); 

    const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000); 

    const result = await Status.deleteMany({ createdAt: { $lt: cutoffDate } }); 

    console.log(`Deleted ${result.deletedCount} old statuses.`);
  } catch (error) {
    console.error('Error deleting old statuses:', error);
  }
}


cleanupOldStatuses();
