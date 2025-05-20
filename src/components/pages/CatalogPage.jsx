import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sliders } from 'react-feather';
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { IoFilterSharp } from "react-icons/io5";
import { FiShare2, FiCopy, FiX } from "react-icons/fi";
import axios from 'axios';
import { ENV_VAR } from './../../utils/envVariables';
import { toast } from 'sonner';
import { FaFilePdf } from "react-icons/fa";
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import { catalog } from '../../utils/data';
import PdfPreview from './PreviewPDFPage';

const CatalogPage = () => {
  const location = useLocation();
  const [productData, setProductData] = useState({});
  const [categories, setCategories] = useState([]);
  const [activeMainCategory, setActiveMainCategory] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceFilter, setPriceFilter] = useState('all');
  const [materialFilter, setMaterialFilter] = useState('all');
  const [sortOption, setSortOption] = useState('featured');
  const [showSort, setShowSort] = useState(false);

  // Fetch categories and products data
  const fetchData = async () => {
    try {
      // Fetch categories
      const categoriesResponse = await axios.get(`${ENV_VAR.API_URL}/category`);
      setCategories(categoriesResponse.data);

      // Fetch products
      const productsResponse = await axios.get(`${ENV_VAR.API_URL}/products/list`);
      setProductData(productsResponse.data.catalogData || {});
    } catch (error) {
      console.log(error);
      toast.error("SERVER ERROR");
    }
  };

  useEffect(() => {
    fetchData();
    setActiveCategory("");
    setActiveMainCategory("");
    resetFilters();

    const pathParts = location.pathname.split('/');
    const currentMainCategory = pathParts[2];
    const currentSubCategory = pathParts[3];

    if (currentMainCategory) setActiveMainCategory(currentMainCategory);
    if (currentSubCategory) setActiveCategory(currentSubCategory);
  }, [location]);

  useEffect(() => {
    let items = [];

    if (activeMainCategory) {
      // Find the main category ID from the categories data
      const mainCategory = categories.find(cat =>
        cat.name.toLowerCase() === activeMainCategory.toLowerCase()
      );

      if (mainCategory) {
        const mainCategoryId = mainCategory._id;

        if (activeCategory) {
          // Find the subcategory ID from the categories data
          const subCategory = mainCategory.subcategories.find(sub =>
            sub.name.toLowerCase().replace(/\s+/g, '-') === activeCategory.toLowerCase()
          );

          if (subCategory) {
            const subCategoryId = subCategory._id;
            items = productData[mainCategoryId]?.[subCategoryId] || [];
          }
        } else {
          // Get all products for the main category
          const mainCategoryProducts = productData[mainCategoryId] || {};
          items = Object.values(mainCategoryProducts).flat();
        }
      }
    }

    // Apply filters
    if (searchTerm) {
      items = items.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (priceFilter !== 'all') {
      const [min, max] = priceFilter.split('-').map(Number);
      items = items.filter(item => {
        if (max) {
          return item.price >= min && item.price <= max;
        }
        return item.price >= min;
      });
    }

    if (materialFilter !== 'all') {
      items = items.filter(item =>
        (item.material || item.type) &&
        (item.material?.toLowerCase().includes(materialFilter.toLowerCase()) ||
          item.type?.toLowerCase().includes(materialFilter.toLowerCase()))
      );
    }

    items = sortItems(items, sortOption);
    setFilteredItems(items);
  }, [productData, categories, activeMainCategory, activeCategory, searchTerm, priceFilter, materialFilter, sortOption]);

  const sortItems = (items, option) => {
    const sortedItems = [...items];

    switch (option) {
      case 'price-low':
        return sortedItems.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sortedItems.sort((a, b) => b.price - a.price);
      default:
        return sortedItems;
    }
  };

  const getCategoryTitle = () => {
    if (!activeMainCategory) return 'All Products';

    const mainCategory = categories.find(cat =>
      cat.name.toLowerCase() === activeMainCategory.toLowerCase()
    );

    if (!mainCategory) return activeMainCategory;

    if (!activeCategory) return mainCategory.name;

    const subCategory = mainCategory.subcategories.find(sub =>
      sub.name.toLowerCase().replace(/\s+/g, '-') === activeCategory.toLowerCase()
    );

    return subCategory ? subCategory.name : activeCategory;
  };

  const getAvailableMaterials = () => {
    const materials = new Set();
    let items = [];

    if (activeMainCategory) {
      const mainCategory = categories.find(cat =>
        cat.name.toLowerCase() === activeMainCategory.toLowerCase()
      );

      if (mainCategory) {
        const mainCategoryId = mainCategory._id;

        if (activeCategory) {
          const subCategory = mainCategory.subcategories.find(sub =>
            sub.name.toLowerCase().replace(/\s+/g, '') === activeCategory.toLowerCase()
          );

          if (subCategory) {
            const subCategoryId = subCategory._id;
            items = productData[mainCategoryId]?.[subCategoryId] || [];
          }
        } else {
          const mainCategoryProducts = productData[mainCategoryId] || {};
          items = Object.values(mainCategoryProducts).flat();
        }
      }
    }

    items.forEach(item => {
      if (item.material) {
        materials.add(item.material);
      }
    });

    return Array.from(materials);
  };

  const resetFilters = () => {
    setPriceFilter('all');
    setMaterialFilter('all');
    setSearchTerm('');
    setSortOption('featured');
  };


  const ShareButton = ({ itemId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    // Construct the shareable link
    const API_URL = window.location.origin; // Gets current origin (http://192.168.1.11:5173)
    const shareLink = `${API_URL}/catalog/graphics/${itemId}`;
  }
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const shareOnSocial = (platform) => {
    let url = '';
    const encodedLink = encodeURIComponent(shareLink);

    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodedLink}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedLink}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodedLink}`;
        break;
      default:
        return;
    }

    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    activeMainCategory ? (
      <div className="p-5 max-w-7xl mx-auto">
        <h2 className="mb-5 text-2xl font-semibold text-DarkBlue">
          {getCategoryTitle()}
        </h2>

        <div className="flex flex-col gap-5">
          <div className="flex items-center mb-5">
            <div className="flex gap-3 w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-1/3 p-2 border border-gray-300 rounded"
              />
              <Popover className='shadow-lg rounded-2xl' placement="right" isOpen={showFilters} onOpenChange={(open) => setShowFilters(open)}>
                <PopoverTrigger>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-2 rounded cursor-pointer  ${showFilters ? 'bg-DarkBlue border-DarkBlue text-white' : 'bg-gray-100 text-gray-800'
                      }`}
                  >
                    <Sliders size={16} />
                    Filters
                  </button>
                </PopoverTrigger>
                <PopoverContent className="min-w-[450px] p-5">
                  {showFilters && (
                    <div className="w-full">
                      <div className="flex gap-2">
                        <div className="w-full">
                          <h5 className="mb-2 text-sm font-medium">Price Range</h5>
                          <select
                            value={priceFilter}
                            onChange={(e) => setPriceFilter(e.target.value)}
                            className="p-2 border border-gray-300 rounded w-full"
                          >
                            <option value="all">All Prices</option>
                            <option value="0-500">Under ₹500</option>
                            <option value="500-1000">₹500 - ₹1000</option>
                            <option value="1000-2000">₹1000 - ₹2000</option>
                            <option value="2000-">Above ₹2000</option>
                          </select>
                        </div>

                        {getAvailableMaterials().length > 0 && (
                          <div className="w-full">
                            <h5 className="mb-2 text-sm font-medium">Material</h5>
                            <select
                              value={materialFilter}
                              onChange={(e) => setMaterialFilter(e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded"
                            >
                              <option value="all">All Materials</option>
                              {getAvailableMaterials().map(material => (
                                <option key={material} value={material}>{material}</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
              {
                (priceFilter !== 'all' || materialFilter !== 'all' || searchTerm) && (
                  <p
                    onClick={resetFilters}
                    className="text-red-500 cursor-pointer flex justify-center items-center font-bold"
                  >
                    X
                  </p>
                )
              }
            </div>
            {filteredItems.length > 0 && (
              <Popover placement='bottom' open={showSort} onOpenChange={(isOpen) => setShowSort(isOpen)}>
                <PopoverTrigger>
                  <button className="p-2 rounded hover:bg-gray-100">
                    <IoFilterSharp size={20} />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="min-w-[250px] p-4 shadow-lg rounded-2xl z-50 ">
                  {[
                    { label: "Featured", value: "featured" },
                    { label: "Price: Low to High", value: "price-low" },
                    { label: "Price: High to Low", value: "price-high" },
                  ].map((option, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setShowSort(false);
                        setSortOption(option.value);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-200 rounded text-DarkBlue  ${sortOption === option.value ? "bg-gray-200" : ""}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </PopoverContent>
              </Popover>
            )}
          </div>

          {/* Products Grid */}
          <div>
            {filteredItems.length > 0 ? (
              <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-5 gap-4 space-y-4">
                {filteredItems.map(item => (
                  <div
                    key={item.id}
                    className="group break-inside-avoid border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white cursor-pointer"
                  >
                    <div className="relative">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full object-cover"
                        />
                      ) :
                        // <PdfPreview pdfUrl={item.pdf} />
                        <div className='w-full flex justify-center border-b-1'>
                          {/* <FaFilePdf color='#F18B35' size={150} /> */}
                          <PdfPreview
                            pdfUrl={item.pdf}
                            hoverInterval={1000}
                          />
                        </div>
                      }

                      <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-0.5 rounded text-sm font-bold">
                        ₹{item.price}
                      </div>
                      <div>
                      </div>
                      <button
                        className="shadow-lg absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-400 p-2 bg-gray-100 hover:bg-gray-200 rounded-full" title="Share">
                        <FiShare2 size={16} />
                      </button>
                    </div>

                    <div className="p-3">
                      <h3 className="text-sm font-medium mb-1">{item.title}</h3>
                      {item.size && <p className="text-xs text-gray-600">Size: {item.size}</p>}
                      {item.material && <p className="text-xs text-gray-600">Material: {item.material}</p>}
                      {item.type && <p className="text-xs text-gray-600">Type: {item.type}</p>}
                      {item.moq && <p className="text-xs text-gray-600" title='Minimum Order Quantity'><span className='font-bold'>MOQ:</span> {item.moq}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg">
                <h4 className="mb-2 text-lg font-medium">No products found</h4>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 bg-Darkborder-DarkBlue text-white rounded cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    ) : (
      <div className="py-10 text-gray-800 px-[8%] mt-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {catalog.map((category, index) => (
            <a
              href={`/catalog/${category.route}`}
              key={index}
              className="rounded-3xl overflow-hidden text-center hover:shadow-xl transition duration-300 cursor-pointer"
            >
              <img
                src={`/assets/images/Resourse Photo/r${index + 1}.png`}
                alt={category.name}
                className="w-full h-auto max-h-48 object-cover md:max-h-[300px] sm:max-h-[200px]"
              />
              <h3 className="mt-2 text-lg font-medium">{category.name}</h3>
            </a>
          ))}
        </div>
      </div>
    )
  );
};

export default CatalogPage;