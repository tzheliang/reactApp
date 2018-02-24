// Import dependencies for project
import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { createStore } from 'redux';
import './style.css';

// Create actions for redux
const VIEW_PRODUCT = 'VIEW_PRODUCT';
const ADD_PRODUCT = 'ADD_PRODUCT';
const EDIT_PRODUCT = 'EDIT_PRODUCT';
const SET_SORT = 'SET_SORT';
const SET_FILTER = 'SET_FILTER';

// Define a default state for the store
var defaultState = {
  products: [],
  selected: "",
  sort: "created",
  filter: "none"
}

// Define Action Creators
function viewProduct(id) {
  return {
    type: VIEW_PRODUCT,
    id
  }
}

function addProduct() {
  return {
    type: ADD_PRODUCT
  }
}

function editProduct(index, product) {
  return {
    type: EDIT_PRODUCT,
    index,
    product
  }
}

function setSort(sort) {
  return {
    type: SET_SORT,
    sort
  }
}

function setFilter(filter) {
  return {
    type: SET_FILTER,
    filter
  }
}

function app(state, action) {
  var things = ['Rock', 'Paper', 'Scissor', 'Orange', 'Milk', "Wooden Toy"];
  var things2 = ['Food', 'Homemade Item', 'Handcraft Item'];
  var thing = things[Math.floor(Math.random() * things.length)];
  var thing2 = things2[Math.floor(Math.random() * things2.length)];
  var price = [Math.floor(1 + Math.random() * 100)];
  switch (action.type) {
    case VIEW_PRODUCT:
      return Object.assign({}, state, {
        selected: action.id
      });
      break;

    case ADD_PRODUCT:
      var newState = Object.assign({}, state);
      newState.products.push(
        {
          id: new Date().valueOf().toString(),
          name: thing,
          description: "Beverage",
          image: "../images/placeholder.png",
          price: price,
          category: thing2,
          quantity: "2"
        }
      );
      return newState;
      break;

    case EDIT_PRODUCT:
      return Object.assign({}, state, 
        { products: 
          state.products.slice(0, action.index)
          .concat(action.product)
          .concat(state.products.slice(action.index + 1))});
      break;
    case SET_SORT:
      return Object.assign({}, state, {sort: action.sort});
      break;
    case SET_FILTER:
      return Object.assign({}, state, {filter: action.filter});
      break;
      
    default:
      return state;
  }
}

// Create the Store for Redux
var store = createStore(app, defaultState, 
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

// React Component - App
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      selected: "",
      search: "",
      sort: "",
      filter: ""
    };
    this.onProductAddClick = this.onProductAddClick.bind(this);
    this.onProductItemClick = this.onProductItemClick.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);
  }

  componentWillMount() {
    store.subscribe(() => {
      var state = store.getState();
      this.setState({
        products: state.products,
        selected: state.selected,
        sort: state.sort,
        filter: state.filter
      });
    });
  }
  
  onProductItemClick(id) {
    store.dispatch(viewProduct(id));
  }

  onProductAddClick() {
    store.dispatch(addProduct());
  }

  handleSearchChange(event) {
    this.setState({ search: event.target.value });
    store.dispatch(viewProduct(""));
  }

  handleSortChange(event) {
   store.dispatch(setSort(event.target.value));
  }

  handleFilterChange(event) {
    store.dispatch(setFilter(event.target.value));
  }

  render() {
    var products = getProducts(this.state.products, this.state.search);
    products = filterProducts(products, this.state.filter);
    products = sortProducts(products, this.state.sort); 
    
    return (
      <div className="mainBody">
        <div>
          <h2>AGN - Jinjang Utara Community Mart</h2>
          <button onClick={this.onProductAddClick}>Add</button>
          <div>
            <ToolBar
              handleSearchChange={this.handleSearchChange}
              search={this.state.search}
              handleFilterChange={this.handleFilterChange}
              handleSortChange={this.handleSortChange} />
          </div>
        </div>
        <div className='productPane'>
          <ProductsList 
            products={products} 
            onProductItemClick={this.onProductItemClick} />
          <ProductDetail products={products} selected={this.state.selected} />
        </div>
      </div> 
    )
  }
}

// React Component - Products List
class ProductsList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var products = this.props.products;
    var list = [];
    products.forEach((item, index) => {
      list.push(
        <ProductItem 
          key={index} 
          index={index}
          id={item.id}
          name={item.name}
          price={item.price}
          category={item.category}
          onProductItemClick={this.props.onProductItemClick} />
      );
    });
    return (
      <div className="list">
        <ol>
          {list}
        </ol>
      </div>
    )
  }
}

// React Component - Product Item
class ProductItem extends React.Component {
  constructor(props) {
    super(props);
    this.onProductItemClick = this.onProductItemClick.bind(this);
  }

  onProductItemClick(event) {
    this.props.onProductItemClick(event.target.id);
  }

  render() {
    var props = this.props;
    return (
      <li id={props.index} onClick={this.onProductItemClick}>
        {props.name} Price: RM{props.price} Category: {props.category}
      </li>
    )
  }
  
}

// React Component - Product Detail
class ProductDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      name: "",
      description: "",
      price: "",
      category: "",
      quantity: ""
    }
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  } 

  handleInputChange(event) {
    var target = event.target;
    var value = target.type === 'select' ? target.selected : target.value;
    var name = target.name;
    this.setState({
      [name]: value
    });
  }

  handleFormSubmit(event) {
    event.preventDefault();
    var obj = Object.assign({}, {
      id: this.props.products[this.props.selected].id,
      name: this.state.name,
      description: this.state.description,
      image: this.props.products[this.props.selected].image,
      price: this.state.price,
      category: this.state.category,
      quantity: this.state.quantity
    });
    store.dispatch(editProduct(this.props.selected,obj));
    this.closeModal();
  }

  render() {
    var notSelected = this.props.selected == "";
    if (notSelected) {
      return (
        <div></div>
      ) 
    } else {
        var product = this.props.products[this.props.selected];
      return (
        <div className='details'>
          <img src={product.image} /><br />
          Name: {product.id}<br />
          Description: {product.description}<br />
          Price: {product.price}<br />
          Category: {product.category} <br />
          Quantity: {product.quantity} <br />
          <button onClick={this.openModal}>Edit Product</button>
          <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            ariaHideApp={false}
          >
            <h2>Edit Product Details</h2>
            <EditProductForm product={product} handleInputChange={this.handleInputChange} handleFormSubmit={this.handleFormSubmit} />
            <button onClick={this.closeModal}>Cancel</button>
          </Modal>
        </div>
      )
    }
  }
}

// React Component - Edit Product Form
class EditProductForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  render() {
    var handleInputChange = this.props.handleInputChange;
    var handleFormSubmit = this.props.handleFormSubmit;
    var product = this.props.product;
    return (
      <form onSubmit={handleFormSubmit}>
        <table>
          <tbody>
            <tr>
              <td><label>Product Name: </label></td>
              <td><input type="text" name="name" onChange={handleInputChange}/></td>
            </tr>
            <tr>
              <td><label>Product Description: </label></td>
              <td><input type="text" name="description" onChange={handleInputChange}/></td>
            </tr>
            <tr>
              <td><label>Product Price: </label></td>
              <td><input type="text" name="price" onChange={handleInputChange}/></td>
            </tr>
            <tr>
              <td><label>Category: </label></td>
              <td>
                <select name="category" onChange={handleInputChange} defaultValue={"Select A Category"}>
                  <option disabled>Select A Category</option>
                  <option>Food</option>
                  <option>Handcraft Item</option>
                  <option>Homemade Item</option>
                </select>
              </td>
            </tr>
            <tr>
              <td><label>Product Quantity: </label></td>
              <td><input type="text" name="quantity" onChange={handleInputChange}/></td>
            </tr>
          </tbody>
        </table>
        <input type="submit" name="submit" value="Save changes" />
      </form>
    )
  }
}

// React Component - Search Bar
class ToolBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <input 
          type="text" 
          name="search" 
          value={this.props.search} 
          onChange={this.props.handleSearchChange} 
          placeholder="Search Products" />
        <label>Sort: </label>
        <select name='sort' onChange={this.props.handleSortChange}>
          <option value="created">By Created</option>
          <option value="asc">By Price - Ascending</option>
          <option value="desc">By Price - Descending</option>
        </select>
        <label>Filter: </label>
        <select name="filter" onChange={this.props.handleFilterChange}>
          <option value="none">None</option>
          <option value="food">Food</option>
          <option value="handcraft item">Handcraft Item</option>
          <option value="homemade item">Homemade Item</option>
        </select>
      </div>
    )
  }
}

// Functions
function getProducts(products, search) {
  var newProducts = [];
  
  // Search products
  products.forEach((product) => {
    if (!product.name.toLowerCase().startsWith(search.trim().toLowerCase())) {
      return [];
    } else {
      newProducts.push(product);
    }
  })
  return newProducts;
}

// Filter products
function filterProducts(products, filter) {
  if (filter === 'none') {
    return products;
  }
  return products.filter((product) =>{
    return product.category.toLowerCase() === filter;
  })
}

// Sort Products
function sortProducts(products, sort) {
  if (sort === 'created') {
    return products;
  }
  if (sort === 'asc') {
    console.log("hello");
    
    products.sort((a,b) => {
      if (parseFloat(a.price) < parseFloat(b.price)) {
        return -1
      } else if (parseFloat(a.price) > parseFloat(b.price)) {
        return 1
      } else {
        return 0
      }
    });
    return products;
  } else {
    products.sort((a, b) => {
      if (parseFloat(a.price) > parseFloat(b.price)) {
        return -1
      } else if (parseFloat(a.price) < parseFloat(b.price)) {
        return 1
      } else {
        return 0
      }
    });
    return products;
  }
}
// Render App in html file
ReactDOM.render(
  <App />,
  document.getElementById('app')
);