const productModel = require('../models/products.model');
const allowedFields = [
  'title',
  'description',
  'price',
  'thumbnail',
  'code',
  'stock',
  'category',
  'status',
];

class ProductManagerDb {
  constructor() {}

  async getProducts(params, url) {
    try {
      const currentPath = url;
      const index = currentPath.indexOf('?');

      const pathUrl = (() => {
        if (index !== -1) {
          const a = currentPath.substring(0, index);
          return a;
        } else {
          return currentPath;
        }
      })();

      const limit = parseInt(params.limit) || 10;
      const pageQ = params.page || 1;
      const query = params.query || null;
      const sort = params.sort || null;

      const parsedQuery = (() => {
        try {
          return JSON.parse(query);
        } catch (error) {
          return null;
        }
      })();

      const parsedSort = (() => {
        try {
          return JSON.parse(sort);
        } catch (error) {
          return null;
        }
      })();

      const productsListLimit = await productModel.paginate(parsedQuery, {
        limit: limit,
        page: pageQ,
        sort: parsedSort,
        lean: true,
      });
      const urlPrev = `http://localhost:8080${pathUrl}?limit=${
        productsListLimit.limit
      }&page=${productsListLimit.page - 1}&query=${
        query != null ? query : null
      }&sort=${sort != null ? sort : null}`;

      const urlNext = `http://localhost:8080${pathUrl}?limit=${
        productsListLimit.limit
      }&page=${productsListLimit.page + 1}&query=${
        query != null ? query : null
      }&sort=${sort != null ? sort : null}`;
      const result = {
        status: 'success',
        payload: productsListLimit.docs,
        totalPages: productsListLimit.totalPages,
        prevPage: productsListLimit.prevPage,
        nextPage: productsListLimit.nextPage,
        page: productsListLimit.page,
        hasPrevPage: productsListLimit.hasPrevPage,
        hasNextPage: productsListLimit.hasNextPage,
        prevLink: productsListLimit.hasPrevPage == true ? urlPrev : null,
        nextLink: productsListLimit.hasNextPage == true ? urlNext : null,
      };

      return result;
    } catch (error) {
      console.log(error);
      const result = {
        status: 'error',
        payload: productsListLimit.docs,
        totalPages: productsListLimit.totalDocs,
        prevPage: productsListLimit.prevPage,
        nextPage: productsListLimit.nextPage,
        page: productsListLimit.page,
        hasPrevPage: productsListLimit.hasPrevPage,
        hasNextPage: productsListLimit.hasNextPage,
        prevLink: productsListLimit.hasPrevPage == true ? urlPrev : null,
        nextLink: productsListLimit.hasNextPage == true ? urlNext : null,
      };

      return result;
    }
  }

  async getProductById(id) {
    try {
      const existProduct = await productModel.findOne({ _id: id }).lean();
      return existProduct;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async addProduct(body) {
    try {
      const title = body.title;
      const description = body.description;
      const price = body.price;
      const thumbnail = Array.isArray(body.thumbnail) ? body.thumbnail : [];
      const code = body.code;
      const stock = body.stock;
      const category = body.category;
      const status = body.status === false ? false : true;

      if (!title || !description || !price || !category || !code || !stock) {
        console.log(
          `Por favor complete todos los campos solicitados de ${title}`,
        );

        return null;
      } else {
        const product = {
          title,
          description,
          code,
          price,
          status,
          stock,
          category,
          thumbnail,
        };
        let result = await productModel.create(product);
        return result;
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async updateProduct(id, body) {
    try {
      const productToUpdate = await productModel.findById(id);

      if (!productToUpdate) {
        return null;
      }

      const updatedProduct = {};

      allowedFields.forEach((campo) => {
        if (campo !== undefined) {
          updatedProduct[campo] = body[campo];
        } else {
          updatedProduct[campo] = productToUpdate[campo];
        }
      });

      await productModel.findByIdAndUpdate(id, updatedProduct);

      const existProduct = await productModel.findById(id);

      return existProduct;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async deleteProduct(id) {
    try {
      await productModel.findByIdAndDelete(id);
      const productsList = productModel.find().lean();
      return productsList;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = ProductManagerDb;
