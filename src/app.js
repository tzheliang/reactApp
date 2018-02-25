// Import dependencies for project
import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import ImageUploader from 'react-image-uploader';
import { createStore } from 'redux';
import './style.css';

// Custom styles for React Modal
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

// Create actions for redux
const VIEW_PRODUCT = 'VIEW_PRODUCT';
const ADD_PRODUCT = 'ADD_PRODUCT';
const DELETE_PRODUCT = 'DELETE_PRODUCT';
const CLEAR_PRODUCT = 'CLEAR_PRODUCT';
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

function addProduct(name, description, price, category, quantity, image) {
  return {
    type: ADD_PRODUCT,
    name: name,
    description: description,
    price: price,
    category: category,
    quantity: quantity,
    image: image
  }
}

function deleteProduct(index) {
  return {
    type: DELETE_PRODUCT,
    index: index
  };
}

function clearProduct() {
  return {
    type: CLEAR_PRODUCT
  };
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
          name: action.name,
          description: action.description,
          image: action.image,
          price: action.price,
          category: action.category,
          quantity: action.quantity
        }
      );
      return newState;
      break;

    case DELETE_PRODUCT:
      return Object.assign({}, state,
        {
          products:
            state.products.slice(0, action.index).concat(state.products.slice(action.index+1))
        });
      break;

    case CLEAR_PRODUCT:
      var products = [];
      return Object.assign({}, state, {
        products: products
      });
      break;

    case EDIT_PRODUCT:
      return Object.assign({}, state,
        {
          products:
            state.products.slice(0, action.index)
              .concat(action.product)
              .concat(state.products.slice(action.index + 1))
        });
      break;
    case SET_SORT:
      return Object.assign({}, state, { sort: action.sort });
      break;
    case SET_FILTER:
      return Object.assign({}, state, { filter: action.filter });
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
    store.dispatch(viewProduct(""));
  }

  handleFilterChange(event) {
    store.dispatch(setFilter(event.target.value));
    store.dispatch(viewProduct(""));
  }

  render() {
    var products = getProducts(this.state.products, this.state.search);
    products = filterProducts(products, this.state.filter);
    products = sortProducts(products, this.state.sort);

    return (
      <div className="appBox">
        <div className="appWrapper">
          <div className="banner">
            <span>Jinjang Utara Community Mart</span>
          </div>
          <div className="toolbar">
            <ToolBar
              handleSearchChange={this.handleSearchChange}
              search={this.state.search}
              handleFilterChange={this.handleFilterChange}
              handleSortChange={this.handleSortChange} />
          </div>
          <div className='productPane'>
            <ProductsList
              products={products}
              onProductItemClick={this.onProductItemClick} />
            <ProductDetail products={products} selected={this.state.selected} />
          </div>
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
          image={item.image}
          name={item.name}
          category={item.category}
          price={item.price}
          quantity={item.quantity}
          onProductItemClick={this.props.onProductItemClick} />
      );
    });
    return (
      <div className="list">
        <ul className="productList">
          {list}
        </ul>
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
      <li>
        <div className="product" onClick={this.onProductItemClick} id={props.index}>
          <div className="productImage">
            <img src={this.props.image.replace("C:\\fakepath\\", "")} alt="image" />
          </div>
          <div className="productListDetail">
            <div className="productName">
              Name: <span>{props.name}</span>
            </div>
            <div className="productCategory">
              Category: <span>{props.category}</span>
            </div>
            <div className="productPrice">
              Price: <span>RM{props.price}</span>
            </div>
            <div className="productQuantity">
              Quantity: <span>{props.quantity}</span>
            </div>
          </div>
        </div>
        <hr className="seperator" />
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
      quantity: "",
      image: ""
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
    store.dispatch(editProduct(this.props.selected, obj));
    this.closeModal();
  }

  onDeleteClick() {
    store.dispatch(deleteProduct(this.props.selected));
    store.dispatch(viewProduct(""));
  }

  render() {
    var notSelected = this.props.selected == "";
    if (notSelected) {
      return (
        <div className='details'></div>
      )
    } else {
      var product = this.props.products[this.props.selected];
      return (
        <div className='details'>
          <div className='detail'>
            <div className='detailImageBox'>
              <img src={product.image.replace("C:\\fakepath\\", "")} alt="image" />
            </div>
            <div className="detailDescription">
              <div className="detailName">
                Name: {product.name}
              </div>
              <div className="detailDesc">
                <span className="desc">Description: {product.description}</span>
              </div>
              <div className="detailPrice">
                Price: RM{product.price}
              </div>
              <div className="detailCategory">
                Category: {product.category}
              </div>
              <div className="detailQuantity">
                Quantity: {product.quantity}
              </div>
              <div className="editButton">
                <button onClick={this.openModal}>Edit Product</button>
                <button onClick={this.onDeleteClick.bind(this)}>Delete Product</button>
              </div>
              <div className="editButton">
                
              </div>
            </div>
          </div>
          <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            ariaHideApp={false}
            style={customStyles}
          >
            <h2>Edit Product Details</h2>
            <EditProductForm
              product={product}
              handleInputChange={this.handleInputChange}
              handleFormSubmit={this.handleFormSubmit}
              closeModal={this.closeModal} />
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
            <tr className="editFormRow">
              <td><label>Product Name: </label></td>
              <td><input type="text" name="name" onChange={handleInputChange} /></td>
            </tr>
            <tr className="editFormRow">
              <td><label>Product Description: </label></td>
              <td><input type="text" name="description" onChange={handleInputChange} /></td>
            </tr>
            <tr className="editFormRow">
              <td><label>Product Price: </label></td>
              <td><input type="text" name="price" onChange={handleInputChange} /></td>
            </tr>
            <tr className="editFormRow">
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
            <tr className="editFormRow">
              <td><label>Product Quantity: </label></td>
              <td><input type="text" name="quantity" onChange={handleInputChange} /></td>
            </tr>
          </tbody>
        </table>
        <div className="formButtonGroup">
          <input type="submit" name="submit" value="Save changes" />
          <input type="button" value="Cancel" onClick={this.props.closeModal} />
        </div>
      </form>
    )
  }
}

// React Component - Search Bar
class ToolBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false
    };
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  render() {
    return (
      <div className="toolbarContent">
        <div className="searchBar">
          <input
            type="text"
            name="search"
            value={this.props.search}
            onChange={this.props.handleSearchChange}
            placeholder="Search Products" />
        </div>
        <div className="sortBox">
          <label>Sort: </label>
          <select name='sort' onChange={this.props.handleSortChange}>
            <option value="created">By Created</option>
            <option value="asc">By Price - Ascending</option>
            <option value="desc">By Price - Descending</option>
          </select>
        </div>
        <div className="filterBox">
          <label>Filter: </label>
          <select name="filter" onChange={this.props.handleFilterChange}>
            <option value="none">None</option>
            <option value="food">Food</option>
            <option value="handcraft item">Handcraft Item</option>
            <option value="homemade item">Homemade Item</option>
          </select>
        </div>
        <div className="addButton">
          <button onClick={this.openModal}>Add Product</button>
        </div>
        <div className="addButton">
          <ClearProduct />
        </div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          ariaHideApp={false}
          style={customStyles}
        >
          <AddProduct
            closeModal={this.closeModal} />
        </Modal>
      </div>
    )
  }
}

//Add Product Component
class AddProduct extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
      price: '',
      category: '',
      quantity: '',
      image: '',
      modalIsOpen: false
    };
    this.onNameChanged = this.onNameChanged.bind(this);
    this.onDescriptionChanged = this.onDescriptionChanged.bind(this);
    this.onPriceChanged = this.onPriceChanged.bind(this);
    this.onCategoryChanged = this.onCategoryChanged.bind(this);
    this.onQuantityChanged = this.onQuantityChanged.bind(this);
    this.onImageChanged = this.onImageChanged.bind(this);
    this.onProductAddClick = this.onProductAddClick.bind(this);
  }

  onProductAddClick(a) {
    a.preventDefault();
    store.dispatch(addProduct(this.state.name, this.state.description, this.state.price, this.state.category, this.state.quantity, this.state.image));
    this.setState({ name: '', description: '', price: '', category: '', quantity: '', image: '' });
    this.props.closeModal();
  }

  onNameChanged(a) {
    var name = a.target.value;
    this.setState({ name: name });
  }

  onDescriptionChanged(a) {
    var description = a.target.value;
    this.setState({ description: description });
  }

  onPriceChanged(a) {
    var price = a.target.value;
    this.setState({ price: price });
  }

  onCategoryChanged(a) {
    var category = a.target.value;
    this.setState({ category: category });
  }

  onQuantityChanged(a) {
    var quantity = a.target.value;
    this.setState({ quantity: quantity });
  }

  onImageChanged(a) {
    var image = a.target.value;
    console.log(image);
    this.setState({ image: image });
  }

  render() {
    return (
      <div>
        <h2>Add Product Details</h2>
        <form onSubmit={this.onProductAddClick}>
          <table>
            <tbody>
              <tr>
                <td><label> Product Name: </label></td>
                <td><input type="text" placeholder="Name" onChange={this.onNameChanged} value={this.state.name} /></td>
              </tr>
              <tr>
                <td><label> Product Description: </label></td>
                <td><input type="text" placeholder="Description" onChange={this.onDescriptionChanged} value={this.state.description} /></td>
              </tr>
              <tr>
                <td><label> Product Price: </label></td>
                <td><input type="number" placeholder="Price" onChange={this.onPriceChanged} value={this.state.price} /></td>
              </tr>
              <tr>
                <td><label> Product Category: </label></td>
                <td>
                  <select onChange={this.onCategoryChanged} defaultValue={"Select A Category"}>
                    <option>Select A Category</option>
                    <option>Food</option>
                    <option>Handcraft Item</option>
                    <option>Homemade Item</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td><label> Product Quantity: </label></td>
                <td><input type="number" placeholder="Quantity" onChange={this.onQuantityChanged} value={this.state.quantity} /></td>
              </tr>
            </tbody>
          </table>
          <div className="addFormBtn">
            <input type="file" name="image" value={this.state.image} onChange={this.onImageChanged} />
            <input type="submit" value="Add Product" />
            <button onClick={this.props.closeModal}>Cancel</button>
          </div>
        </form>
      </div>
    )
  }
}

//Clear Button component
class ClearProduct extends React.Component {
  onClearClick() {
    store.dispatch(clearProduct());
    store.dispatch(viewProduct(""));
  }

  render() {
    return (
      <button onClick={this.onClearClick.bind(this)}>Clear Products</button>
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
  return products.filter((product) => {
    return product.category.toLowerCase() === filter;
  })
}

// Sort Products
function sortProducts(products, sort) {
  if (sort === 'created') {
    return products;
  }
  if (sort === 'asc') {

    products.sort((a, b) => {
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
