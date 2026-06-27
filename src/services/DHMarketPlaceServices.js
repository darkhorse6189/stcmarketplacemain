import axios from "axios";


//const host = "https://dh-marketplace-apis-react-zo-test-git.apps.nprdc-ocp.dhdigital.co.in/";
// const addProductImageContextPath = "https://stc-backend-0-rahul-uideployment.apps.nprdc-ocp.dhdigital.co.in/camel/api/dhmarketplace/stc/v1/";

// Local Context Paths
const contextPath = "http://localhost:8080/api/dhmarketplace/stc/v1/";
const contextPathV2 = "http://localhost:8080/api/dhmarketplace/stc/voucher/v1/";


// Production Context Paths
// const contextPath = "https://backend-rahul-uideployment.apps.nprdc-ocp.dhdigital.co.in/api/dhmarketplace/stc/v1/";
// const contextPathV2 = "https://backend-rahul-uideployment.apps.nprdc-ocp.dhdigital.co.in/api/dhmarketplace/stc/voucher/v1/";

// DH ENV Context Paths
// const contextPath = "http://backend.rahul-uideployment.svc.cluster.local:8080/api/dhmarketplace/stc/v1/";
// const contextPathV2 = "http://backend.rahul-uideployment.svc.cluster.local:8080/api/dhmarketplace/stc/voucher/v1/";

class DHMarketPlaceService {
  getAllProduct(productRequest) {
    return axios.post(contextPath + "GetProduct", productRequest);
  }

  getAllProductV2(productRequest) {
    return axios.post(contextPathV2 + "GetProduct", productRequest);
  }


  uploadMarketplaceDataSync(truncatedPayload) {
    return axios.post(
      `${contextPath}InitiateMarketplaceDataSync`,
      truncatedPayload,
      {
        headers: {
          "Content-Type": "application/json",
          "ServiceHeader": JSON.stringify({"channelId":"5","clientId":"bc3b6849"})
        }
      }
    );
  }

  addProduct(newProductData) {
    const productCreationRequestPayLoad = {
      ProductCreationRequest: {
        ...newProductData,
      },
    };
    return axios.post(
      contextPath + "AddProduct",
      productCreationRequestPayLoad,
    );
  }

  addProductV2(newProductData) {
    const productCreationRequestPayLoad = {
      ProductCreationRequest: {
        ...newProductData,
      },
    };
    return axios.post(
      contextPathV2 + "AddProduct",
      productCreationRequestPayLoad,
    );
  }

  // // Add Product Images
  // addProductImages(newProductData) {
  //   const productCreationRequestPayLoad = {
  //     ProductCreationRequest: {
  //       ...newProductData,
  //     },
  //   };
  //   return axios.post(
  //     addProductImageContextPath + "AddProduct",
  //     productCreationRequestPayLoad,
  //   );
  // }

  updateProduct(updateProductData) {
    const productUpdationRequestPayload = {
      ProductUpdationRequest: {
        ...updateProductData,
      },
    };
    return axios.put(
      contextPath + "UpdateProduct",
      productUpdationRequestPayload,
    );
  }

  updateProductV2(updateProductData) {
    const productUpdationRequestPayload = {
      ProductUpdationRequest: {
        ...updateProductData,
      },
    };
    return axios.put(
      contextPathV2 + "UpdateProduct",
      productUpdationRequestPayload,
    );
  }

  deleteProduct(productId) {
    return axios.delete(contextPath + `DeleteProduct?productId=${productId}`);
  }

  deleteProductV2(productId) {
    return axios.delete(contextPathV2 + `DeleteProduct?productId=${productId}`);
  }

  getAllPackagesDevices() {
    return axios.get(contextPath + "GetPackagesDevices");
  }

  addPackagesDevices(newPackagesDevicesData) {
    const packagesDevicesCreationRequestPayLoad = {
      PackagesDevicesCreationRequest: {
        ...newPackagesDevicesData,
      },
    };
    return axios.post(
      contextPath + "AddPackagesDevices",
      packagesDevicesCreationRequestPayLoad,
    );
  }

  updatePackagesDevices(updatePackagesDevicesData) {
    const packagesDevicesUpdationRequestPayload = {
      PackagesDevicesUpdationRequest: {
        ...updatePackagesDevicesData,
      },
    };
    return axios.put(
      contextPath + "UpdatePackagesDevices",
      packagesDevicesUpdationRequestPayload,
    );
  }

  deletePackagesDevices(packagesDevicesId, packagesDevicesCode) {
    return axios.delete(
      contextPath +
        `DeletePackagesDevices?packagesDevicesId=${packagesDevicesId}&packagesDevicesCode=${packagesDevicesCode}`,
    );
  }

  getAllOperatorsBrands() {
    return axios.get(contextPath + "GetOperatorsBrands");
  }

  addOperatorsBrands(newOperatorBrandData) {
    const operatorsBrandsCreationRequestPayLoad = {
      OperatorsBrandsCreationRequest: {
        ...newOperatorBrandData,
      },
    };
    return axios.post(
      contextPath + "AddOperatorsBrands",
      operatorsBrandsCreationRequestPayLoad,
    );
  }

  updateOperatorsBrands(updateOperatorsBrandsData) {
    const operatorsBrandsUpdationRequestPayload = {
      OperatorsBrandsUpdationRequest: {
        ...updateOperatorsBrandsData,
      },
    };
    return axios.put(
      contextPath + "UpdateOperatorsBrands",
      operatorsBrandsUpdationRequestPayload,
    );
  }

  deleteOperatorsBrands(operatorsBrandsId, operatorsBrandsCode) {
    return axios.delete(
      contextPath +
        `DeleteOperatorsBrands?operatorsBrandsId=${operatorsBrandsId}&operatorsBrandsCode=${operatorsBrandsCode}`,
    );
  }

  getAllCategory() {
    return axios.get(contextPath + "GetCategory");
  }

  addCategory(newAddCategoryData) {
    const categoryCreationRequestPayLoad = {
      CategoryCreationRequest: {
        ...newAddCategoryData,
      },
    };
    return axios.post(
      contextPath + "AddCategory",
      categoryCreationRequestPayLoad,
    );
  }

  updateCategory(updateCategoryData) {
    const categoryUpdationRequestPayload = {
      CategoryUpdationRequest: {
        ...updateCategoryData,
      },
    };
    return axios.put(
      contextPath + "UpdateCategory",
      categoryUpdationRequestPayload,
    );
  }

  deleteCategory(categoryId, categoryCode) {
    return axios.delete(
      contextPath +
        `DeleteCategory?categoryId=${categoryId}&categoryCode=${categoryCode}`,
    );
  }

  getAuthEnviromentVariable() {
    return axios.get(contextPath + "GetReactEnvironmentVariables");
    // return axios.get("https://mock-a5acba6a9cfb4cffb0eb060503495bca.mock.insomnia.rest/GetReactEnvironmentVariables");
  }

  
}

const dhmarketplaceServiceInstance = new DHMarketPlaceService();
export default dhmarketplaceServiceInstance;
