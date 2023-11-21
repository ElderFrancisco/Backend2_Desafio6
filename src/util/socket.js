const socketIO = require('socket.io');

const ProductManagerDb = require('../dao/managersDb/ProductManagerDb');
const productController = new ProductManagerDb();

const messageManagerDb = require('../dao/managersDb/MessagesManagerDb');
const messageController = new messageManagerDb();

module.exports = (server) => {
  const io = socketIO(server);

  io.on('connection', async (socket) => {
    console.log('Cliente conectado');

    const currentPath = '/websocket/realtimeproducts';
    const params = { limit: 200 };
    socket.emit(
      'productos',
      await productController.getProducts(params, currentPath),
    );

    socket.on('newProduct', async (product) => {
      const newProduct = await productController.addProduct(product);
      if (!newProduct) {
        console.log('completa los datos');
      }
      socket.emit(
        'productos',
        await productController.getProducts(params, currentPath),
      );
    });

    socket.emit('Chat', await messageController.getMessages());

    socket.on('newChat', async (message) => {
      const newMessage = await messageController.addMessage(message);
      if (!newMessage) {
        console.log('completa los datos');
      }
      socket.emit('Chat', await messageController.getMessages());
    });
  });
};
