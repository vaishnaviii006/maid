const Notification = require('../models/Notification');

const createNotification = async ({ recipient, type, title, message, data = {} }) => {
  try {
    await Notification.create({ recipient, type, title, message, data });
  } catch (err) {
    console.error('Notification error:', err.message);
  }
};

module.exports = { createNotification };
