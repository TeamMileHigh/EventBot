import { createDestination, createNotification } from './QuickAlertsSetup.js';

async function setupQuickAlerts() {
  try {
    const destination = await createDestination();
    await createNotification(destination.id, '2743');
    console.log('QuickAlerts setup completed successfully.');
  } catch (error) {
    console.error('Failed to set up QuickAlerts:', error);
  }
}

setupQuickAlerts();
