const cartModel = require('../models/carts.model.js');
const productModel = require('../models/products.model.js');

class CartManagerDb {
  constructor() {}

  async createNewCart(body) {
    try {
      const products = Array.isArray(body.products) ? body.products : [];
      const cart = {
        products,
      };
      const createdCart = await cartModel.create(cart);
      return createdCart;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async getCartById(params) {
    try {
      const cid = params.cid;

      const existCart = await cartModel
        .findById(cid)
        .populate('products.product')
        .lean();

      if (existCart) {
        return existCart;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getCarts(limit) {
    try {
      const estimated = await cartModel.countDocuments();
      if (estimated === 0) {
        return null;
      }

      if (limit) {
        const cartListLimit = await cartModel.find().limit(limit);
        return cartListLimit;
      }
      const cartsList = await cartModel.find().lean();

      return cartsList;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async updateCart(cid, pid) {
    try {
      const cartToUpdate = await cartModel.findById(cid);

      if (!cartToUpdate) {
        return res.status(401).send('no se encontro el carrito');
      }

      const indexProduct = cartToUpdate.products.findIndex((product) => {
        return product.product == pid;
      });
      console.log(indexProduct);
      if (indexProduct >= 0) {
        cartToUpdate.products[indexProduct].quantity++;
      } else {
        cartToUpdate.products.push({ product: pid, quantity: 1 });
      }
      const result = await cartModel.updateOne({ _id: cid }, cartToUpdate);

      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async deleteProductCart(cid, pid) {
    try {
      const cartToUpdate = await cartModel.findById(cid);

      if (!cartToUpdate) {
        return res.status(401).send('no se encontro el carrito');
      }

      const indexProduct = cartToUpdate.products.findIndex((product) => {
        return product.product == pid;
      });
      if (indexProduct >= 0) {
        cartToUpdate.products.splice(indexProduct, 1);
      } else {
        console.log('No se encontro el producto');
        return res.status(500).send(error);
      }
      const result = await cartModel.updateOne({ _id: cid }, cartToUpdate);

      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async addProdcutBodyCart(params, body) {
    try {
      //
      // ACA HAY UN PROBLEMA, SI SE ENVIA CUALQUIER PRODUCT Y EL ID NO ESTA DENTRO DE LA COLLECION
      // DE PRODUCTS SEN ENVIA EL PRODUCTO IGUAL PERO SIN EL NOMBRE. LA IDEA SERIA NO ENVIARLO DIRECTAMENTE
      //
      const cid = params.cid;
      const pid = params.pid || null;
      const productsBody = body.products || null;
      const quantityBody = body.quantity || null;
      const cartToUpdate = await cartModel.findById(cid);

      if (!cartToUpdate) {
        return res.status(401).send('no se encontro el carrito');
      }
      if (productsBody != null) {
        productsBody.forEach((e) => {
          const indexProduct = cartToUpdate.products.findIndex((i) => {
            return i.product == e.product;
          });
          if (indexProduct >= 0) {
            cartToUpdate.products[indexProduct].quantity += e.quantity;
          } else {
            cartToUpdate.products.push(e);
          }
        });
      }
      if (pid != null) {
        const indexProduct = cartToUpdate.products.findIndex((i) => {
          return i.product == pid;
        });
        if (indexProduct >= 0) {
          cartToUpdate.products[indexProduct].quantity += quantityBody;
        }
      }
      const result = await cartModel.updateOne({ _id: cid }, cartToUpdate);

      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async emptyCart(params) {
    try {
      //
      // ACA HAY UN PROBLEMA, SI SE ENVIA CUALQUIER PRODUCT Y EL ID NO ESTA DENTRO DE LA COLLECION
      // DE PRODUCTS SEN ENVIA EL PRODUCTO IGUAL PERO SIN EL NOMBRE. LA IDEA SERIA NO ENVIARLO DIRECTAMENTE
      //
      const cid = params.cid;
      const cartToEmpty = await cartModel.findById(cid);

      if (!cartToEmpty) {
        return res.status(401).send('no se encontro el carrito');
      }
      cartToEmpty.products = [];

      const result = await cartModel.updateOne({ _id: cid }, cartToEmpty);

      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}

module.exports = CartManagerDb;
