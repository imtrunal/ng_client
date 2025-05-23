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
import { Skeleton } from "@heroui/react";
import { Slider } from "@heroui/react";
import HoverSwiper from './../common/Slider2';
import HoverVideo from '../common/HoverVideo';
import { MdOutlineOndemandVideo, MdSupportAgent } from "react-icons/md";
import { FiDownload } from "react-icons/fi";

const sha = [
  "Rectangle",
  "Square",
  "Circle",
  "Oval",
  "Triangle",
  "Custom Shape"
];

const COLOR_OPTIONS = [
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Black",
  "White",
  "Silver",
  "Gold",
  "Custom Color"
];

const CatalogPage = () => {
  const location = useLocation();
  const [productData, setProductData] = useState({});
  const [categories, setCategories] = useState([]);
  const [activeMainCategory, setActiveMainCategory] = useState("");
  const [activeSubCategory, setActiveCategory] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceFilter, setPriceFilter] = useState({ min: 0, max: 10000 });
  const [materialFilter, setMaterialFilter] = useState('all');
  const [sortOption, setSortOption] = useState('featured');
  const [showSort, setShowSort] = useState(false);
  const [shapeFilter, setShapeFilter] = useState('all');
  const [colorFilter, setColorFilter] = useState('all');
  const [moqFilter, setMoqFilter] = useState('all');
  const [formatFilter, setFormatFilter] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [initialMaxPrice, setInitialMaxPrice] = useState(10000);
  const [searchParam, setSearchParam] = useState('');
  const [colorOptions, setColorOptions] = useState([]);
  const [shapeOptions, setShapeOptions] = useState([]);

  // Fetch categories and products data
  const fetchData = async () => {
    try {
      // Fetch categories
      const categoriesResponse = await axios.get(`${ENV_VAR.API_URL}/category`);
      setCategories(categoriesResponse.data);

      // Fetch products
      const productsResponse = await axios.get(`${ENV_VAR.API_URL}/products/list`);
      setProductData(productsResponse.data.catalogData || {});

      //fecth color options
      const colorOptionsResponse = await axios.get(`${ENV_VAR.API_URL}/colors/`);
      setColorOptions(colorOptionsResponse.data);

      //fecth shape options
      const shapeOptionsResponse = await axios.get(`${ENV_VAR.API_URL}/shapes/`);
      setShapeOptions(shapeOptionsResponse.data);

      // Calculate max price from products
      const allProducts = Object.values(productsResponse.data.catalogData || {})
        .flatMap(mainCat => Object.values(mainCat).flat());
      const maxPrice = allProducts.reduce((max, item) => Math.max(max, item.price || 0), 0);
      setPriceRange([0, Math.ceil(maxPrice / 1000) * 1000 || 10000]);
      setInitialMaxPrice(Math.ceil(maxPrice / 1000) * 1000 || 10000);
      setPriceFilter({ min: 0, max: Math.ceil(maxPrice / 1000) * 1000 || 10000 });
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
    const queryParams = new URLSearchParams(location.search);
    const searchId = queryParams.get('id');
    console.log(searchId);
    setSearchParam(searchId);

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

        if (activeSubCategory) {
          // Find the subcategory ID from the categories data
          const subCategory = mainCategory.subcategories.find(sub =>
            sub.name.toLowerCase().replace(/\s+/g, '-') === activeSubCategory.toLowerCase()
          );

          if (subCategory) {
            const subCategoryId = subCategory._id;
            items = productData[mainCategoryId]?.[subCategoryId] || [];
            if (searchParam) {
              console.log("Search Param:", searchParam);

              items = items.filter(item =>
                item.title.toLowerCase().includes(searchParam.toLowerCase())
              );
            }
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

    items = items.filter(item => {
      return item.price >= priceFilter.min && item.price <= priceFilter.max;
    });

    // Apply material filter for specific categories
    if (materialFilter !== 'all' &&
      ((activeMainCategory === 'graphics' &&
        (activeSubCategory === 'wedding-cards' || activeSubCategory === 'invitation-card')) ||
        (activeMainCategory === 'gifting'))) {
      items = items.filter(item =>
        (item.material || item.type) &&
        (item.material?.toLowerCase().includes(materialFilter.toLowerCase()) ||
          item.type?.toLowerCase().includes(materialFilter.toLowerCase()))
      );
    }

    // Apply shape filter for Graphics > Wedding/Invitation cards and Gifting
    if (shapeFilter !== 'all' &&
      ((activeMainCategory === 'graphics' &&
        (activeSubCategory === 'wedding-cards' || activeSubCategory === 'invitation-card')) ||
        (activeMainCategory === 'gifting'))) {
      items = items.filter(item =>
        item.shape?.toLowerCase() === shapeFilter.toLowerCase()
      );
    }

    // Apply color filter for Graphics > Wedding/Invitation cards
    if (colorFilter !== 'all' &&
      activeMainCategory === 'graphics' &&
      (activeSubCategory === 'wedding-cards' || activeSubCategory === 'invitation-card')) {
      items = items.filter(item =>
        item.color?.toLowerCase() === colorFilter.toLowerCase()
      );
    }

    // Apply MOQ filter for Graphics and Gifting categories
    if ((activeMainCategory === 'graphics' || activeMainCategory === 'gifting') && moqFilter !== 'all') {
      const [min, max] = moqFilter.includes('+')
        ? [parseInt(moqFilter), Infinity]
        : moqFilter.split('-').map(Number);

      items = items.filter(item => {
        if (max === Infinity) {
          return item.moq >= min;
        }
        return item.moq >= min && item.moq <= max;
      });
    }

    // Apply format filter for Digital category
    if (activeMainCategory === 'digital' && formatFilter !== 'all') {
      items = items.filter(item => {
        if (formatFilter === 'pdf') {
          return item.pdf;
        } else if (formatFilter === 'video') {
          return item.video;
        }
        return true;
      });
    }

    items = sortItems(items, sortOption);
    setFilteredItems(items);
  }, [productData, categories, activeMainCategory, activeSubCategory, searchTerm, priceFilter, materialFilter, sortOption, shapeFilter, colorFilter, moqFilter, formatFilter]);

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

    if (!activeSubCategory) return mainCategory.name;

    const subCategory = mainCategory.subcategories.find(sub =>
      sub.name.toLowerCase().replace(/\s+/g, '-') === activeSubCategory.toLowerCase()
    );

    return subCategory ? subCategory.name : activeSubCategory;
  };

  const getAvailableMaterials = () => {
    const materials = new Set();
    let items = [];
    console.log(productData);

    if (activeMainCategory) {
      const mainCategory = categories.find(cat =>
        cat.name.toLowerCase() === activeMainCategory.toLowerCase()
      );
      console.log(mainCategory);
      if (mainCategory) {

        const categoryProducts = productData[mainCategory._id] || {};

        if (activeSubCategory) {
          const subCategory = mainCategory.subcategories.find(sub =>
            // Remove the replace() for more accurate matching
            sub.name.toLowerCase().replace(/\s+/g, '-') === activeSubCategory.toLowerCase()
          );

          if (subCategory) {
            const subCategoryId = subCategory._id;
            items = categoryProducts[subCategoryId] || [];
          }
        } else {
          // Get all items from all subcategories in this main category
          items = Object.values(categoryProducts).flat();
        }
      }
    }
    console.log(items);

    items.forEach(item => {
      // Only add non-empty materials
      if (item.material && item.material.trim() !== "") {
        materials.add(item.material);
      }
      // Only add non-empty types
      if (item.type && item.type.trim() !== "") {
        materials.add(item.type);
      }
    });
    console.log("Available Materials:", materials);

    return Array.from(materials);
  };

  const resetFilters = () => {
    setPriceFilter({ min: 0, max: initialMaxPrice });
    setPriceRange([0, initialMaxPrice]);
    setMaterialFilter('all');
    setSearchTerm('');
    setSortOption('featured');
    setShapeFilter('all');
    setColorFilter('all');
    setMoqFilter('all');
    setFormatFilter('all');
  };

  const handlePriceApply = () => {
    setPriceFilter({
      min: priceRange[0],
      max: priceRange[1]
    });
    setShowFilters(false);
  }

  const handleNavigate = (shortId) => {
    if (shortId) {
      window.open(`/view?pdf=${shortId}`, "_blank");
    }
  };

  const handleShare = (product, isInquiry) => {
    const phoneNumber = ENV_VAR.whatsappNumber;
    const subCategory = product.subCategory.name.toLowerCase().replace(/\s+/g, '-');
    const productUrl = `http://192.168.1.7:5173/catalog/${activeMainCategory}/${subCategory}?id=${product.title}`;

    const message = isInquiry ?
      `Hello 👋,

I am interested in this product and would like to inquire further. 🔍

📂 *Category:* ${product.category.name}  
📂 *Sub-Category:* ${product.subCategory.name}
🔖 *Product ID:* ${product.title}

🔗 *Product Link:* ${productUrl}


Thank you for your time. I look forward to your response. 🙏`
      :
      `Hello 👋,

I'm excited to share a product from *Nirmanam Graphics* that you might like! 🎨✨

*${product.category.name} ${product.subCategory.name}* 📌

🔗 *Product Link:* 
${productUrl} 

Check out our catalog for more amazing products! 🛍️

http://192.168.1.7:5173/catalog/${activeMainCategory}/${subCategory}/`;


    const isMobile = /iPhone|Android/i.test(navigator.userAgent);
    if (isInquiry) {
      const url = isMobile
        ? `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`
        : `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    }
    else {
      const url = isMobile
        ? `whatsapp://send?text=${encodeURIComponent(message)}`
        : `https://web.whatsapp.com/send?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    }
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
                <PopoverContent className="min-w-[450px]">
                  {showFilters && (
                    <div className="w-full px-4">
                      <div className="w-full rounded-xl  bg-white p-2 flex flex-col gap-4">
                        {/* Price Filter - full width */}
                        <div className='flex gap-2'>
                          <Slider
                            className="w-full"
                            defaultValue={[100, 500]}
                            formatOptions={{ style: "currency", currency: "inr" }}
                            label="Price Range"
                            maxValue={1000}
                            minValue={1}
                            step={1}
                            onChange={(value) => setPriceRange(value)}
                          />
                          <button
                            onClick={handlePriceApply}
                            className="mt-3 w-fit bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
                          >
                            Apply
                          </button>
                        </div>

                        {/* Filters Grid (2 columns) */}
                        <div className="grid grid-cols-2 gap-4 w-full">
                          {/* MOQ Filter */}
                          {(activeMainCategory === 'graphics' || activeMainCategory === 'gifting') && (
                            <div>
                              <h5 className="mb-2 text-sm font-medium">MOQ</h5>
                              <select
                                value={moqFilter}
                                onChange={(e) => setMoqFilter(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                              >
                                <option value="all">Any MOQ</option>
                                <option value="1-10">1-10</option>
                                <option value="10-50">10-50</option>
                                <option value="50-100">50-100</option>
                                <option value="100+">100+</option>
                              </select>
                            </div>
                          )}

                          {/* Material Filter */}
                          {((activeMainCategory === 'graphics' && ['wedding-cards', 'invitation-card'].includes(activeSubCategory)) || activeMainCategory === 'gifting') && (
                            <div>
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

                          {/* Shape Filter */}
                          {((activeMainCategory === 'graphics' && ['wedding-cards', 'invitation-card'].includes(activeSubCategory)) || activeMainCategory === 'gifting') && (
                            <div>
                              <h5 className="mb-2 text-sm font-medium">Shape</h5>
                              <select
                                value={shapeFilter}
                                onChange={(e) => setShapeFilter(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                              >
                                <option value="all">All Shapes</option>
                                {shapeOptions.map(shape => (
                                  <option key={shape._id} value={shape.name.toLowerCase()}>{shape.name}</option>
                                ))}
                              </select>
                            </div>
                          )}

                          {/* Color Filter */}
                          {(activeMainCategory === 'graphics' && ['wedding-cards', 'invitation-card'].includes(activeSubCategory)) && (
                            <div>
                              <h5 className="mb-2 text-sm font-medium">Color</h5>
                              <select
                                value={colorFilter}
                                onChange={(e) => setColorFilter(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                              >
                                <option value="all">All Colors</option>
                                {colorOptions.map(color => (
                                  <option key={color._id} value={color.name.toLowerCase()}>{color.name}</option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>

                        {/* Digital Format Filter */}
                        {activeMainCategory === 'digital' && (
                          <div>
                            <h5 className="mb-2 text-sm font-medium">Type</h5>
                            <select
                              value={formatFilter}
                              onChange={(e) => {
                                setFormatFilter(e.target.value)
                                // setShowFilters(false) // Uncomment if you want to close the filter popover after selecting format
                              }}
                              className="w-full p-2 border border-gray-300 rounded"
                            >
                              <option value="all">All Type</option>
                              <option value="pdf">PDF</option>
                              <option value="video">Video</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </div>

                  )}
                </PopoverContent>
              </Popover>
              {
                (priceFilter.min !== 0 || priceFilter.max !== initialMaxPrice || materialFilter !== 'all' || searchTerm ||
                  shapeFilter !== 'all' || colorFilter !== 'all' || moqFilter !== 'all' || formatFilter !== 'all') && (
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
              <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-5  space-y-4">
                {filteredItems.map(item => (
                  <div
                    key={item._id}
                    className="group break-inside-avoid border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white cursor-pointer"
                  >
                    <div className="relative" onContextMenu={(e) => e.preventDefault()}>
                      {item.image?.length > 0 ? (
                        <div className="w-full relative">
                          <HoverSwiper slides={item.image.map(img => img.url)} />
                        </div>
                      ) : item.pdf ? (
                        <div className="w-full flex justify-center border-b-1" onClick={() => handleNavigate(item.pdf.short)}>
                          <PdfPreview
                            pdfUrl={item.pdf.url}
                            hoverInterval={1000}
                          />
                        </div>
                      ) : item.video ? (
                        <div className="w-full relative group"
                          onClick={() => window.open(item.video.url, "_blank")}
                        >

                          {/* Video Component */}
                          <HoverVideo
                            videoUrl={item.video.url}
                            posterUrl={'https://invitoai.com/zcollection/1064.png'}
                          />
                        </div>

                      ) : (
                        <div className="text-center text-gray-500 p-4">
                          No media available
                        </div>
                      )}

                      <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-0.5 rounded text-sm font-bold z-10">
                        ₹{item.price}
                      </div>

                      <div className="absolute top-2 right-2 flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(item, false);
                          }}
                          className="shadow-lg p-2 bg-black/70 text-white hover:bg-black/80 rounded-full z-10"
                          title="Share"
                        >
                          <FiShare2 size={16} />
                        </button>
                        {(item.pdf || item.video) && (
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (item.pdf) {
                                try {
                                  // Add quality parameter for PDF (if supported by your backend)
                                  const response = await fetch(`${item.pdf.url}?fl_attachment&quality=auto`);
                                  const blob = await response.blob();
                                  const url = window.URL.createObjectURL(blob);
                                  const link = document.createElement('a');
                                  link.href = url;
                                  link.download = `${item.title.replace(/[^a-z0-9]/gi, '_')}.pdf`;
                                  link.style.display = 'none';
                                  document.body.appendChild(link);
                                  link.click();
                                  window.URL.revokeObjectURL(url);
                                  document.body.removeChild(link);
                                  toast.success(`PDF download started`);
                                } catch (error) {
                                  toast.error('Failed to download PDF');
                                  console.error('Download error:', error);
                                }
                              }
                              else if (item.video) {
                                try {
                                  const response = await fetch(`${item.video.url}?fl_attachment`);
                                  const blob = await response.blob();
                                  const url = window.URL.createObjectURL(blob);
                                  const link = document.createElement('a');
                                  link.href = url;
                                  link.download = `${item.title.replace(/[^a-z0-9]/gi, '_')}.mp4` || 'download.mp4';
                                  link.style.display = 'none';
                                  document.body.appendChild(link);
                                  link.click();
                                  window.URL.revokeObjectURL(url);
                                  document.body.removeChild(link);
                                  toast.success(`Video download started`);
                                } catch (error) {
                                  toast.error('Failed to download video');
                                  console.error('Download error:', error);
                                }
                              }
                            }}
                            className="shadow-lg p-2 bg-black/70 text-white hover:bg-black/80 rounded-full z-10"
                            title="Download"
                          >
                            <FiDownload size={16} />
                          </button>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(item, true);
                          }}
                          className="shadow-lg p-2 bg-black/70 text-white hover:bg-black/80 rounded-full z-10"
                          title="Inquiry"
                        >
                          <MdSupportAgent size={16} />
                        </button>


                      </div>

                    </div>

                    <div className="p-3">
                      <h3 className="text-sm font-medium mb-1 truncate w-48" title={item.title}>{item.title}</h3>
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
                  className="mt-4 px-4 py-2 bg-Darkborder-DarkBlue text-gray-400 rounded cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div >
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