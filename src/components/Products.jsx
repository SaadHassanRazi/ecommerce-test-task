import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { FiTag, FiPackage, FiLayers } from "react-icons/fi";


import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(data);
  const [loading, setLoading] = useState(false);
  let componentMounted = true;

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
  };

  useEffect(() => {

    const getProducts = async () => {
      setLoading(true);
      const response = await fetch("https://fakestoreapi.com/products/");
      let products = await response.json()
     
      products = products.map((product)=>({
        ...product,
        stock:Math.floor(Math.random() * 10),
        variants:['small','medium','large']
      }))
       localStorage.setItem('products',JSON.stringify(products))
      if (componentMounted) {
        setData(products);
        setFilter(products);
        setLoading(false);
      }
console.log('data---',data)
      return () => {
        componentMounted = false;
      };
    };

    const products = localStorage.getItem('products')
    if(products){
        setData(JSON.parse(products));
        setFilter(JSON.parse(products));
        setLoading(false);
    }else{
    getProducts();
    }
  }, []);
  const Loading = () => {
    return (
      <>
        <div className="col-12 py-5 text-center">
          <Skeleton height={40} width={560} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
      </>
    );
  };

  const filterProduct = (cat) => {
    const updatedList = data.filter((item) => item.category === cat);
    setFilter(updatedList);
  };

  const ShowProducts = () => {
    return (
      <>
        <div className="buttons text-center py-5">
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => setFilter(data)}
          >
            All
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("men's clothing")}
          >
            Men's Clothing
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("women's clothing")}
          >
            Women's Clothing
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("jewelery")}
          >
            Jewelery
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("electronics")}
          >
            Electronics
          </button>
        </div>

        {filter.map((product) => {
          return (
            <div
              id={product.id}
              key={product.id}
              className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4"
            >
              <div className="card text-center h-100" key={product.id}>
                <img
                  className="card-img-top p-3"
                  src={product.image}
                  alt="Card"
                  height={300}
                />
                <div className="card-body">
                  <h5 className="card-title">
                    {product.title.substring(0, 12)}...
                  </h5>
                  <p className="card-text">
                    {product.description.substring(0, 90)}...
                  </p>
                </div>
                <div className="d-flex flex-column align-items-start px-3 py-2 text-start">
                  <div className="mb-2 d-flex align-items-center">
                    <FiTag size={18} className="me-2 text-success" />
                    <span className="fw-bold">${product.price}</span>
                  </div>
                  <div className="mb-2 d-flex align-items-center">
                    <FiPackage size={18} className="me-2 text-primary" />
                    <span>{product.stock} in stock</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <FiLayers size={18} className="me-2 text-warning" />
                    <Dropdown
                      options={product.variants}
                      placeholder="Select size"
                      className="flex-grow-1 rounded"
                    />
                  </div>
                </div>

                
                <div className="card-body">
                 {product.stock > 0 && <Link
                    to={"/product/" + product.id}
                    className="btn btn-dark m-1"
                    style={{pointerEvents: product.stock ==0 ?'none':'auto'}}
                  >
                    Buy Now
                  </Link>}
                  {product.stock > 0 ? <button
                    className="btn btn-dark m-1"
                    onClick={() => {
                      toast.success("Added to cart");
                      addProduct(product);
                    }}
                  >
                    Add to Cart
                  </button> : <button
                    className="btn btn-danger m-1"
                    
                  >
                   Out of Stock
                  </button>}
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  };
  return (
    <>
      <div className="container my-3 py-3">
        <div className="row">
          <div className="col-12">
            <h2 className="display-5 text-center">Latest Products</h2>
            <hr />
          </div>
        </div>
        <div className="row justify-content-center">
          {loading ? <Loading /> : <ShowProducts />}
        </div>
      </div>
    </>
  );
};

export default Products;
