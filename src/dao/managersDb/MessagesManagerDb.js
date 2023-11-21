const messageModel = require('../models/messages.models');

class MessageManagerDb {
  constructor() {}

  async getMessages() {
    const messagesList = await messageModel.find().lean();
    return messagesList;
  }

  async addMessage(body) {
    const user = body.user;
    const message = body.message;

    const newMessage = {
      user,
      message,
    };
    const result = await messageModel.create(newMessage);
    return result;
  }
}

module.exports = MessageManagerDb;
