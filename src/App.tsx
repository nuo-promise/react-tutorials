import logo from './logo.svg';
import './App.css';
import React from 'react';

/*
 定义 组件 props state 接口
interface ProductCategoryRowProps {
  category: string
} */

class ProductCategoryRow extends React.Component<{ readonly category: string }, {}> {
  render() {
    const category = this.props.category;
    const colspan = 2;
    return (
      <tr>
        <th colSpan={colspan}>
          {category}
        </th>
      </tr>
    );
  }
}
// base type
interface product {
  category: string;
  price: string;
  stocked: boolean;
  name: string;
}

interface ProductProps {
  product: product
}

class ProductRow extends React.Component<ProductProps, {}> {
  render() {
    const product = this.props.product;
    const name = product.stocked ?
      product.name :
      <span style={{ color: 'red' }}> {product.name} </span>;

    return (
      <tr>
        <td>{name}</td>
        <td>{product.price}</td>
      </tr>
    );
  }
}

interface ProductTableProps {
  products: Array<product>;
  filterText: string;
  inStockOnly: boolean;
}

class ProductTable extends React.Component<ProductTableProps, {}> {
  render() {
    const filterText = this.props.filterText;
    const inStockOnly = this.props.inStockOnly;

    const rows: Array<object> = [];
    let lastCategory: string = '';

    this.props.products.forEach((product) => {
      if (product.name.indexOf(filterText) === -1) {
        return;
      }
      if (inStockOnly && !product.stocked) {
        return;
      }
      if (product.category !== lastCategory) {
        rows.push(
          <ProductCategoryRow
            category={product.category}
            key={product.category} />
        );
      }
      rows.push(
        <ProductRow
          product={product}
          key={product.name}
        />
      );
      lastCategory = product.category;
    });
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    )
  }
}

interface SearchBarProps {
  onFilterTextChange(filterText: string): void,
  onInStockOnlyChange(inStockOnly: boolean): void,
  filterText: string,
  inStockOnly: boolean,
}
/* search  component */
class SearchBar extends React.Component<SearchBarProps, {}> {
  constructor(props) {
    super(props);
    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    this.handleInStockOnlyChange = this.handleInStockOnlyChange.bind(this);
  }

  handleFilterTextChange(e) {
    this.props.onFilterTextChange(e.target.value);
  }

  handleInStockOnlyChange(e) {
    this.props.onInStockOnlyChange(e.target.checked);
  }

  render() {
    return (
      <form>
        <input
          type="text"
          placeholder="Search..."
          value={this.props.filterText}
          onChange={this.handleFilterTextChange}
        />
        <p>
          <input
            type="checkbox"
            checked={this.props.inStockOnly}
            onChange={this.handleInStockOnlyChange}
          />
          {' '}
          Only show products in stock
        </p>
      </form>
    );
  }
}
interface FilterableProductTableProps {
  products: Array<product>;
}
interface FilterableProductTableStates {
  filterText: string,
  inStockOnly: boolean,
  handleFilterTextChange(filterText: string): void,
  handleInStockOnlyChange(inStockOnly: boolean): void
}
class FilterableProductTable extends React.Component<FilterableProductTableProps, FilterableProductTableStates> {
  constructor(props) {
    super(props)
    this.state = {
      filterText: '',
      inStockOnly: false,
      handleFilterTextChange: (filterText: string) => { },
      handleInStockOnlyChange: (inStockOnly: boolean) => { }
    };
    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    this.handleInStockOnlyChange = this.handleInStockOnlyChange.bind(this);
  }

  handleFilterTextChange(filterText) {
    this.setState({
      filterText: filterText
    });
  }
  handleInStockOnlyChange(inStockOnly) {
    this.setState({
      inStockOnly: inStockOnly
    });
  }

  render() {
    return (
      <div>
        <SearchBar
          filterText={this.state.filterText}
          inStockOnly={this.state.inStockOnly}
          onFilterTextChange={this.handleFilterTextChange}
          onInStockOnlyChange={this.handleInStockOnlyChange}
        />
        <ProductTable
          products={this.props.products}
          filterText={this.state.filterText}
          inStockOnly={this.state.inStockOnly}
        />
      </div>
    );
  }
}

export default FilterableProductTable;
