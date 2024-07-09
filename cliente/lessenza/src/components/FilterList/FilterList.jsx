import React, { useState, useEffect } from 'react';
import "./filterList.css";


const FilterList = ({ products, setFilteredProducts }) => {
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        const uniqueBrands = [...new Set(products.map(product => product.brands))];
        const uniqueCategories = [...new Set(products.map(product => product.category))];
        setBrands(uniqueBrands);
        setCategories(uniqueCategories);
    }, [products]);

    useEffect(() => {
        const filteredProducts = products.filter(product => {
            return (
                (selectedBrands.length ? selectedBrands.includes(product.brands) : true) &&
                (selectedCategories.length ? selectedCategories.includes(product.category) : true)
            );
        });
        setFilteredProducts(filteredProducts);
    }, [selectedBrands, selectedCategories, products, setFilteredProducts]);

    const handleBrandChange = (brand) => {
        setSelectedBrands((prevSelectedBrands) =>
            prevSelectedBrands.includes(brand)
                ? prevSelectedBrands.filter(b => b !== brand)
                : [...prevSelectedBrands, brand]
        );
    };

    const handleCategoryChange = (category) => {
        setSelectedCategories((prevSelectedCategories) =>
            prevSelectedCategories.includes(category)
                ? prevSelectedCategories.filter(c => c !== category)
                : [...prevSelectedCategories, category]
        );
    };

    return (
        <aside>
            <div>
                <h5>MARCA</h5>
                {brands.map((brand, index) => (
                    <div key={index}>
                        <input
                            type="checkbox"
                            id={`brand-${index}`}
                            value={brand}
                            checked={selectedBrands.includes(brand)}
                            onChange={() => handleBrandChange(brand)}
                        />
                        <label className='fontLabel' htmlFor={`brand-${index}`}>{brand}</label>
                    </div>
                ))}
            </div>
            <div>
                <h5>GÉNERO</h5>
                {categories.map((category, index) => (
                    <div key={index}>
                        <input
                            type="checkbox"
                            id={`category-${index}`}
                            value={category}
                            checked={selectedCategories.includes(category)}
                            onChange={() => handleCategoryChange(category)}
                        />
                        <label className='fontLabel' htmlFor={`category-${index}`}>{category}</label>
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default FilterList;
